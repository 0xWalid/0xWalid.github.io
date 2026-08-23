/* core UX engine — content lives in js/config.js */

(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GLYPHS = "!<>-_/[]{}=+*^?#";

  const esc = s => String(s).replace(/[&<>"']/g,
    c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  let toastT;
  const toast = msg => {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2600);
  };

  function scramble(el, finalText, dur) {
    dur = dur || 700;
    if (!el) return;
    if (reduced) { el.textContent = finalText; return; }
    const start = performance.now();
    (function frame(now) {
      const p = Math.min(1, (now - start) / dur);
      const cut = Math.floor(p * finalText.length);
      let out = finalText.slice(0, cut);
      for (let i = cut; i < finalText.length; i++)
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    })(start);
  }

  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-scramble]").forEach(h =>
      scramble(h, h.textContent, 650));
    revObs.unobserve(e.target);
  }), { threshold: 0.12 });

  window.APP = { $, $$, esc, reduced, toast, scramble, revObs };

  /* boot sequence */
  const boot = $("#boot");
  if (boot) {
    if (sessionStorage.getItem("booted") || reduced) {
      boot.classList.add("instant");
    } else {
      sessionStorage.setItem("booted", "1");
      boot.querySelectorAll(".boot-lines p").forEach(l =>
        setTimeout(() => l.classList.add("on"), 180 + (+l.dataset.delay) * 240));
      setTimeout(() => boot.classList.add("done"), 1500);
      setTimeout(() => boot.remove(), 2300);
    }
  }

  /* nav state + scroll progress */
  const nav = $("#siteNav");
  const bar = $("#progressBar");
  addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", scrollY > 24);
    if (bar) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight || 1;
      bar.style.transform = "scaleX(" + (h.scrollTop / max) + ")";
    }
  }, { passive: true });

  const menuBtn = $("#menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    $$("#navLinks a").forEach(a =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open")));
    addEventListener("keydown", e => {
      if (e.key === "Escape") document.body.classList.remove("menu-open");
    });
  }

  /* active section highlight */
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$("#navLinks a").forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  $$("main section[id]").forEach(s => secObs.observe(s));

  /* static reveals */
  $$(".reveal").forEach(el => revObs.observe(el));

  /* typed roles */
  const typedEl = $("#typedText");
  if (typedEl && !reduced && window.CONFIG) {
    let ri = 0, ci = 0, del = false;
    (function type() {
      const word = CONFIG.roles[ri];
      typedEl.textContent = word.slice(0, ci);
      if (!del && ci < word.length) { ci++; setTimeout(type, 52); }
      else if (!del) { del = true; setTimeout(type, 1700); }
      else if (ci > 0) { ci--; setTimeout(type, 26); }
      else { del = false; ri = (ri + 1) % CONFIG.roles.length; setTimeout(type, 350); }
    })();
  } else if (typedEl && window.CONFIG) {
    typedEl.textContent = CONFIG.roles[0];
  }

  /* year stamp */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* konami egg */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", e => {
    kIdx = (e.key === KONAMI[kIdx]) ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      const on = document.body.classList.toggle("phosphor");
      localStorage.setItem("phosphor", on ? "1" : "0");
      toast(on ? "[ GHOST MODE // PHOSPHOR ENABLED ]" : "[ ghost mode disengaged ]");
    }
  });
  if (localStorage.getItem("phosphor") === "1")
    document.body.classList.add("phosphor");

  /* console egg */
  try {
    console.log("%c sudo hire-me %c\n\n curious mind detected. recruiters who read consoles are exactly who this site is for \u2192 check the footer hint.",
      "background:#ff2d55;color:#fff;font-family:monospace;padding:4px 8px;font-weight:bold",
      "color:#8f8f9a;font-family:monospace");
  } catch (_) {}
})();
