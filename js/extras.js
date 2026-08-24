/* command palette (Ctrl+K), sudo hire-me egg, safe-mode + sfx toggles */

(() => {
  "use strict";
  const { $, $$ } = window.APP;
  if (!$("#paletteHost")) return;
  const ROOTP = location.pathname.indexOf("/writeups") === 0 ? "../" : "";

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
    const cur = list.querySelector(".pal-item.sel");
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
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
    requestAnimationFrame(() => {
      input.focus();
      requestAnimationFrame(() => input.focus());
    });
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

  /* ---------- sudo hire-me ---------- */
  let hireBusy = false;
  function runHireMe() {
    if (hireBusy) return;
    hireBusy = true;
    sfx.click(1200);
    const ov = document.createElement("div");
    ov.className = "privesc-overlay mono";
    ov.innerHTML =
      '<p>$ sudo hire-me</p><p class="ok">[sudo] password for recruiter: ********</p>' +
      '<p class="ok">privilege escalation successful…</p><p class="big">ROOT ACCESS GRANTED</p>';
    document.body.appendChild(ov);
    setTimeout(() => ov.classList.add("show"), 30);
    setTimeout(() => {
      ov.classList.remove("show");
      setTimeout(() => ov.remove(), 450);
      location.hash = "#pivot";
      const cb = $("#copyEmail");
      if (cb) { cb.classList.add("pulse"); setTimeout(() => cb.classList.remove("pulse"), 3200); }
      hireBusy = false;
    }, 2100);
  }

  const BUF_MAX = 24;
  let buf = "";
  addEventListener("keydown", e => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-BUF_MAX);
    if (buf.endsWith("sudo hire-me") || buf.endsWith("hire-me")) {
      buf = "";
      runHireMe();
    }
  });

  /* random lab button */
  const rndBtn = $("#rndBtn");
  if (rndBtn) rndBtn.addEventListener("click", () => {
    if (typeof WRITEUPS === "undefined") return;
    const pool = WRITEUPS.filter(w => w.visible !== false && w.slug);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    location.href = ROOTP + "writeups/index.html?p=" + encodeURIComponent(pick.slug);
  });

  /* console egg */
  try {
    console.log("%c sudo hire-me %c\n\n curious mind detected. recruiters who read consoles are exactly who this site is for \u2192 check the footer hint. try: ctrl+k",
      "background:#ff2d55;color:#fff;font-family:monospace;padding:4px 8px;font-weight:bold",
      "color:#8f8f9a;font-family:monospace");
  } catch (_) {}

})();
