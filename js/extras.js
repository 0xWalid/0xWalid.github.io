/* command palette (Ctrl+K), sudo hire-me egg, safe-mode + sfx toggles */

(() => {
  "use strict";
  const { $, $$ } = window.APP;
  if (!$("#paletteHost")) return;
  const ROOTP = location.pathname.indexOf("/writeups") === 0 ? "../" : "";

  /* ---------- sfx ---------- */
  let audioCtx = null;
  const sfx = {
    on: localStorage.getItem("sfx") === "1",
    click(freq) {
      if (!this.on) return;
      try {
        audioCtx = audioCtx || new AudioContext();
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "square"; o.frequency.value = freq || 620;
        g.gain.setValueAtTime(.035, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .06);
        o.connect(g).connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + .07);
      } catch (_) {}
    },
    toggle() {
      this.on = !this.on;
      localStorage.setItem("sfx", this.on ? "1" : "0");
      APP.toast(this.on ? "[ sfx enabled ]" : "[ sfx muted ]");
      if (this.on) this.click(880);
    }
  };
  window.SFX = sfx;

  /* ---------- palette ---------- */
  const items = [
    ...[["About Me", "#recon"], ["Skills", "#enum"], ["Projects", "#exploits"],
        ["Writeups & Labs", "#labs"], ["Certifications", "#privesc"], ["Contact", "#pivot"]]
      .map(([label, href]) => ({ label, hint: "section", run: () => {
        closePalette();
        location.hash = href;
      }})),
    ...(typeof WRITEUPS !== "undefined" ? WRITEUPS.filter(w => w.visible !== false)
      .map(w => ({ label: w.title, hint: w.platform + " · writeup", run: () => {
        location.href = ROOTP + "writeups/index.html?p=" + encodeURIComponent(w.slug);
      }})) : []),
    { label: "Copy email address", hint: "action", run: () => $("#copyEmail").click() },
    { label: "Download CV", hint: "action", run: () => window.open(CONFIG.resumeUrl || "_blank") },
    { label: "Open GitHub", hint: "link", run: () => window.open(CONFIG.githubUrl) },
    { label: "RSS feed", hint: "link", run: () => location.href = ROOTP + "feed.xml" },
    { label: "Toggle phosphor ghost mode", hint: "egg", run: () => {
      document.body.classList.toggle("phosphor");
      localStorage.setItem("phosphor", document.body.classList.contains("phosphor") ? "1" : "0");
    }}
  ];

  const host = $("#paletteHost");
  host.innerHTML =
    '<div class="palette-backdrop" id="palBack"></div>' +
    '<div class="palette" role="dialog" aria-label="Command palette">' +
    '<input id="palInput" class="mono" placeholder="type a command or search…" autocomplete="off" spellcheck="false">' +
    '<div class="pal-list" id="palList" role="listbox"></div>' +
    '<div class="pal-foot mono"><span>&uarr;&darr; navigate</span><span>enter select</span><span>esc close</span></div></div>';

  const input = $("#palInput"), list = $("#palList");
  let sel = 0, filtered = items;

  function paint() {
    list.innerHTML = filtered.map((it, i) =>
      '<button class="pal-item mono' + (i === sel ? " sel" : "") + '" data-i="' + i + '">' +
      "<span>" + APP.esc(it.label) + '</span><span class="pal-hint">' + APP.esc(it.hint) + "</span></button>").join("")
      || '<p class="pal-empty mono">// no results</p>';
  }
  function filter(q) {
    q = q.trim().toLowerCase();
    filtered = !q ? items
      : items.filter(it => (it.label + " " + it.hint).toLowerCase().includes(q));
    sel = 0; paint();
  }
  function openPalette() {
    host.classList.add("open");
    input.value = ""; filter("");
    input.focus();
  }
  function closePalette() { host.classList.remove("open"); }

  addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      host.classList.contains("open") ? closePalette() : openPalette();
    } else if (host.classList.contains("open")) {
      if (e.key === "Escape") closePalette();
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
      else if (e.key === "Enter" && filtered[sel]) { e.preventDefault(); filtered[sel].run(); }
    }
  });
  input.addEventListener("input", () => filter(input.value));
  list.addEventListener("click", e => {
    const b = e.target.closest(".pal-item");
    if (b && filtered[+b.dataset.i]) filtered[+b.dataset.i].run();
  });
  $("#palBack").addEventListener("click", closePalette);

  /* nav trigger chip */
  const logo = $(".logo");
  if (logo && matchMedia("(min-width:861px)").matches) {
    const k = document.createElement("button");
    k.className = "kbd-hint mono";
    k.type = "button";
    k.textContent = "ctrl k";
    k.title = "Open command palette";
    k.addEventListener("click", openPalette);
    logo.after(k);
  }

  /* ---------- sudo hire-me egg ---------- */
  const BUF_MAX = 24;
  let buf = "";
  addEventListener("keydown", e => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-BUF_MAX);
    if (buf.endsWith("sudo hire-me") || buf.endsWith("hire-me")) {
      buf = "";
      const ov = document.createElement("div");
      ov.className = "privesc-overlay mono";
      ov.innerHTML =
        '<p>$ sudo hire-me</p><p class="ok">[sudo] password for recruiter: ********</p>' +
        '<p class="ok">privilege escalation successful…</p><p class="big">ROOT ACCESS GRANTED</p>';
      document.body.appendChild(ov);
      sfx.click(1200);
      setTimeout(() => ov.classList.add("show"), 30);
      setTimeout(() => {
        ov.classList.remove("show");
        setTimeout(() => ov.remove(), 450);
        location.hash = "#pivot";
        const cb = $("#copyEmail");
        if (cb) { cb.classList.add("pulse"); setTimeout(() => cb.classList.remove("pulse"), 3200); }
      }, 2100);
    }
  });

  /* ---------- footer toggles ---------- */
  const foot = $(".footer .footer-inner");
  if (foot) {
    const wrap = document.createElement("div");
    wrap.className = "foot-toggles mono";
    const mk = (label, fn, state) => {
      const b = document.createElement("button");
      b.className = "foot-toggle mono";
      b.type = "button";
      b.textContent = label;
      if (state) b.classList.add("on");
      b.addEventListener("click", () => { fn(); b.classList.toggle("on"); });
      return b;
    };
    wrap.append(
      mk("motion: " + (localStorage.getItem("no-motion") === "1" ? "off" : "on"), () => {
        const off = document.body.classList.toggle("no-motion");
        localStorage.setItem("no-motion", off ? "1" : "0");
        APP.toast(off ? "[ safe mode — motion disabled ]" : "[ motion restored ]");
      }),
      mk("sfx: " + (localStorage.getItem("sfx") === "1" ? "on" : "off"), () => sfx.toggle())
    );
    foot.appendChild(wrap);
  }
})();
