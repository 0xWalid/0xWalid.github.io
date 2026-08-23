(() => {
  "use strict";
  if (typeof CONFIG === "undefined") return;
  const { $, $$, esc, reduced, toast, scramble, revObs } = window.APP;

  /* hero terminal */
  const heroTerm = $("#heroTerm");
  if (heroTerm) {
    const seq = [
      { cmd: "whoami" },
      { out: "waleed \u2014 aka 0xWalid", cls: "out-ok" },
      { cmd: "cat mission.txt" },
      { out: "offensive security \u00b7 AI security \u00b7 build & break" },
      { cmd: 'sudo ./launch_career.sh --target="your team"' },
      { out: "[ACCESS GRANTED] let's talk \u2192", cls: "out-red" }
    ];
    const render = () => {
      heroTerm.innerHTML = "";
      let li = 0;
      const nextLine = () => {
        if (li >= seq.length) { heroTerm.classList.add("cursor-block"); return; }
        const line = seq[li++];
        const span = document.createElement("span");
        if (line.cmd !== undefined) {
          span.className = "cmd";
          heroTerm.appendChild(span);
          if (reduced) { span.textContent = line.cmd; nextLine(); return; }
          let c = 0;
          (function tick() {
            span.textContent = line.cmd.slice(0, ++c);
            if (c < line.cmd.length) setTimeout(tick, 34);
            else setTimeout(nextLine, 260);
          })();
        } else {
          span.className = line.cls || "";
          span.textContent = line.out;
          heroTerm.appendChild(span);
          setTimeout(nextLine, 200);
        }
        heroTerm.appendChild(document.createTextNode("\n"));
      };
      nextLine();
    };
    reduced ? render() : setTimeout(render, 1700);
  }

  /* ticker */
  const track = $("#tickerTrack");
  if (track) {
    const words = ["PENETRATION TESTING","RED TEAM MINDSET","SOC OPERATIONS",
      "AI SECURITY","WEB EXPLOITATION","PYTHON TOOLING","INCIDENT RESPONSE","OSCP LOADING"];
    track.innerHTML = [...words, ...words].map(w => "<span>" + esc(w) + "</span>").join("");
  }

  /* dossier */
  const setTxt = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  setTxt("#dAlias", CONFIG.alias);
  setTxt("#dRole", CONFIG.role);
  setTxt("#dBase", CONFIG.base);
  setTxt("#pivotHost", CONFIG.host);

  /* stats */
  const statRow = $("#statRow");
  if (statRow) {
    const visWriteups = (typeof WRITEUPS !== "undefined")
      ? WRITEUPS.filter(w => w.visible !== false).length : 0;
    statRow.innerHTML = CONFIG.stats.map(s => {
      const n = s.n === "auto" ? visWriteups : s.n;
      return '<div class="stat"><b data-n="' + n + '" data-suffix="' + (s.suffix || "") + '">0</b><span>' + esc(s.label) + "</span></div>";
    }).join("");
    const statObs = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      statObs.unobserve(e.target);
      e.target.querySelectorAll("b").forEach(b => {
        const target = +b.dataset.n, suf = b.dataset.suffix;
        if (reduced) { b.textContent = target + suf; return; }
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min(1, (now - t0) / 1100);
          b.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }), { threshold: 0.4 });
    statObs.observe(statRow);
  }

  /* skills */
  const skillWrap = $("#skillGroups");
  if (skillWrap) {
    skillWrap.innerHTML = CONFIG.skills.map(g =>
      '<div class="skill-group"><h3>// ' + esc(g.group) + "</h3>" +
      g.items.map(it =>
        '<div class="skill"><div class="skill-row"><span>' + esc(it[0]) +
        '</span><span class="pct">' + it[1] + '%</span></div>' +
        '<div class="bar"><i style="--w:' + it[1] + '%"></i></div></div>'
      ).join("") + "</div>"
    ).join("");
    const skObs = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(".skill").forEach((s, i) =>
        setTimeout(() => s.classList.add("vis"), i * 90));
      skObs.unobserve(e.target);
    }), { threshold: 0.2 });
    skillWrap.querySelectorAll(".skill-group").forEach(g => skObs.observe(g));
  }

  /* nmap scan terminal */
  const nmap = $("#nmapTerm");
  if (nmap) {
    const lines = [
      ["cmd", "$ nmap -sV --top-skills waleed.local"],
      ["out-dim", ""],
      ["out-dim", "PORT      STATE  SERVICE         PROOF"],
      ["out",    "22/tcp    open   linux/bash      daily driver \u00b7 hardening"],
      ["out",    "80/tcp    open   web             OWASP Top 10 \u00b7 burp"],
      ["out",    "443/tcp   open   soc/blue        splunk \u00b7 IR triage"],
      ["out",    "1337/tcp  open   exploit-dev     python \u00b7 custom tooling"],
      ["out",    "5000/tcp  open   ai-security     prompt injection research"],
      ["out-dim", ""],
      ["out-ok", "6 services detected \u00b7 attack surface: expanding"]
    ];
    const runScan = () => {
      let li = 0;
      (function next() {
        if (li >= lines.length) { nmap.classList.add("cursor-block"); return; }
        const l = lines[li++];
        const span = document.createElement("span");
        span.className = l[0];
        span.textContent = l[1];
        nmap.appendChild(span);
        nmap.appendChild(document.createTextNode("\n"));
        setTimeout(next, reduced ? 10 : 170);
      })();
    };
    if (reduced) runScan();
    else {
      const obs = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        runScan();
      }), { threshold: 0.3 });
      obs.observe(nmap);
    }
  }

  /* projects */
  const stampCls = { poc: "s-poc", active: "s-active", wip: "s-wip", dep: "s-dep" };
  const featured = (CONFIG.projects || []).find(p => p.featured);
  const featSlot = $("#featuredSlot");
  if (featSlot && featured) {
    featSlot.innerHTML =
      '<article class="featured reveal" id="featuredCard">' +
      '<div class="radar"></div><div class="reticle"><i></i><i></i><i></i><i></i></div>' +
      '<div class="featured-inner"><div>' +
      '<span class="flag-tag mono">PINNED TARGET // FAVOURITE BUILD</span>' +
      '<h3 id="featTitle">' + esc(featured.title) + "</h3>" +
      "<p>" + esc(featured.desc) + "</p>" +
      '<div class="feat-meta">' + (featured.tags || []).map(t => "<span class=\"tag\">" + esc(t) + "</span>").join("") + "</div>" +
      '<div class="proj-links" style="margin-top:1.4rem">' + (featured.links || []).map(l =>
        '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " &#8599;</a>").join("") +
      "</div></div>" +
      '<button class="flag-chip mono" id="flagChip" type="button" aria-label="Capture the flag">' +
      "<small>RESTRICTED // CAPTURE TO DECRYPT</small><code>\u2588\u2588\u2588\u2588-\u2588\u2588\u2588\u2588\u2588\u2588\u2588</code>" +
      "</button></div></article>";
    revObs.observe(featSlot.firstElementChild);

    const FLAG = "FLAG{n3m3s1s_pwn3d}";
    const chip = $("#flagChip");
    const capture = () => {
      if (!chip || chip.classList.contains("captured")) return;
      chip.classList.add("captured");
      chip.querySelector("small").textContent = "TARGET COMPROMISED";
      scramble(chip.querySelector("code"), FLAG, 900);
      setTimeout(() => toast("[+] flag captured \u2014 you'd fit right in"), 950);
    };
    $("#featuredCard").addEventListener("mouseenter", () => setTimeout(capture, 420));
    if (chip) chip.addEventListener("click", capture);
    $("#featuredCard").addEventListener("mouseenter",
      () => scramble($("#featTitle"), featured.title, 500), { once: true });
  }

  const grid = $("#projectGrid");
  if (grid) {
    grid.innerHTML = (CONFIG.projects || []).filter(p => !p.featured).map(p =>
      '<article class="proj-card reveal">' +
      '<div class="proj-id"><span>' + esc(p.id) + "</span><span>PROOF OF WORK</span></div>" +
      "<h3>" + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p>" +
      '<div class="proj-foot"><div class="proj-tags">' +
      (p.tags || []).map(t => '<span class="tag">' + esc(t) + "</span>").join("") +
      '</div><span class="stamp ' + (stampCls[p.stamp] || "s-poc") + '">' +
      esc(p.stampLabel || p.stamp) + '</span></div>' +
      '<div class="proj-links">' + (p.links || []).map(l =>
        '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">[' + esc(l.label) + "]</a>").join("") +
      "</div></article>").join("");
    grid.querySelectorAll(".reveal").forEach(el => revObs.observe(el));
  }

  const ghMore = $("#ghMoreLink");
  if (ghMore && CONFIG.githubUrl) ghMore.href = CONFIG.githubUrl;

  /* lab notes preview */
  const labPrev = $("#labPreview");
  if (labPrev && typeof WRITEUPS !== "undefined") {
    const difCls = { Easy: "dif-easy", Medium: "dif-medium", Hard: "dif-hard", Insane: "dif-insane" };
    const items = WRITEUPS.filter(w => w.visible !== false)
      .sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4);
    labPrev.innerHTML = items.map(w =>
      '<a class="lab-card reveal" href="writeups/index.html?p=' + encodeURIComponent(w.slug) + '">' +
      '<div class="lab-badges"><span class="pill plat">' + esc(w.platform) +
      '</span><span class="pill ' + (difCls[w.difficulty] || "plat") + '">' + esc(w.difficulty) + "</span></div>" +
      '<div class="lab-mid"><h3>' + esc(w.title) + "</h3>" +
      '<p class="lab-tldr"><strong>TL;DR </strong>' + esc(w.tldr) + "</p>" +
      '<div class="lab-meta"><span>' + esc(w.date) + "</span><span>" + w.minutes +
      ' min read</span><span>' + (w.category || []).map(esc).join(" \u00b7 ") + "</span></div></div>" +
      '<span class="lab-arrow">&#8594;</span></a>').join("");
    labPrev.querySelectorAll(".reveal").forEach(el => revObs.observe(el));
  }

  /* lab tracker table */
  const tracker = $("#labTracker");
  if (tracker && CONFIG.labs) {
    const difCls = { Easy: "dif-easy", Medium: "dif-medium", Hard: "dif-hard", Insane: "dif-insane" };
    const plats = ["ALL", ...new Set(CONFIG.labs.map(l => l.platform))];
    let active = "ALL";
    const paint = () => {
      const rows = CONFIG.labs.filter(l => active === "ALL" || l.platform === active);
      tracker.innerHTML =
        '<p class="mono tracker-title">// machine tracker</p>' +
        '<div class="filter-row mono">' + plats.map(p =>
          '<button class="fchip' + (p === active ? " on" : "") + '" data-p="' + esc(p) + '">' + esc(p) + "</button>").join("") +
        "</div>" +
        '<div class="table-scroll"><table class="lab-table mono"><thead><tr><th>machine</th><th>platform</th><th>difficulty</th><th>techniques</th><th>owned</th></tr></thead><tbody>' +
        (rows.map(l =>
          "<tr><td>" + esc(l.name) + '</td><td class="dim">' + esc(l.platform) +
          '</td><td><span class="pill ' + (difCls[l.difficulty] || "plat") + '">' + esc(l.difficulty) + "</span></td>" +
          '<td class="dim techs">' + (l.tech || []).map(esc).join(" · ") + "</td><td>" + esc(l.owned) + "</td></tr>").join("") ||
          '<tr><td colspan="5" class="dim">// nothing here yet</td></tr>') +
        "</tbody></table></div>";
    };
    paint();
    tracker.addEventListener("click", e => {
      const b = e.target.closest(".fchip");
      if (!b) return;
      active = b.dataset.p;
      paint();
    });
  }

  /* hall of fame */
  const hof = $("#hofList");
  if (hof) {
    hof.innerHTML = (CONFIG.ctfSolvers || []).length
      ? CONFIG.ctfSolvers.map((s, i) => "<li>" + String(i + 1).padStart(2, "0") + " :: " + esc(s) + "</li>").join("")
      : '<li class="dim">// no solvers yet — the flag is live, be the first.</li>';
  }
  /* roadmap */
  const road = $("#roadmap");
  if (road) {
    const stMap = { done: ["st-done", "COMPLETED"], now: ["st-now", "IN PROGRESS"], next: ["st-next", "ON THE RADAR"] };
    const donePct = Math.round(
      CONFIG.roadmap.filter(m => m.state === "done").length / CONFIG.roadmap.length * 100);
    road.style.setProperty("--done-h", donePct + "%");
    road.innerHTML = CONFIG.roadmap.map(m => {
      const st = stMap[m.state] || stMap.next;
      return '<div class="ms ' + m.state + ' reveal">' +
        '<div class="ms-head"><h3>' + esc(m.title) + '</h3><span class="ms-state ' + st[0] + '">' + st[1] + "</span></div>" +
        "<p>" + esc(m.desc) + "</p>" +
        '<div class="privesc-bar"><div class="row"><span>escalation progress</span><span>' + m.pct + "%</span></div>" +
        '<div class="bar"><i style="--w:' + m.pct + '%"></i></div></div></div>';
    }).join("");
    road.querySelectorAll(".reveal").forEach(el => revObs.observe(el));
  }

  /* contact links */
  const linkGrid = $("#linkGrid");
  if (linkGrid) {
    const ICONS = {
      email: '<svg viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm2 2v.5l8 5.3 8-5.3V6H4zm16 12V9l-8 5.3L4 9v9h16z"/></svg>',
      github: '<svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.31h4.52V23H.24V8.31zM8.34 8.31h4.33v2h.06c.6-1.14 2.08-2.35 4.28-2.35 4.57 0 5.42 3.01 5.42 6.92V23h-4.52v-7.13c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.76V23H8.34V8.31z"/></svg>',
      youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>',
      htb: '<svg viewBox="0 0 24 24"><path d="M12 1l9 5.2v11.6L12 23l-9-5.2V6.2L12 1zm0 2.3L5 7.4v9.2l7 4.1 7-4.1V7.4l-7-4.1zm0 4.2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>',
      thm: '<svg viewBox="0 0 24 24"><path d="M5 2h2v20H5V2zm4 1h10l-3 4 3 4H9V3z"/></svg>',
      x: '<svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.35l7.24-8.28L2.4 2h6.39l4.41 5.83L18.9 2zm-1.1 18.1h1.73L7.62 3.8H5.76l12.04 16.3z"/></svg>'
    };
    linkGrid.innerHTML = CONFIG.links.filter(l => l.visible).map(l => {
      const url = l.key === "email"
        ? "mailto:" + CONFIG.email
        : l.url || "#";
      return '<a class="link-card" href="' + esc(url) + '"' +
        (url.startsWith("http") ? ' target="_blank" rel="noopener"' : "") + ">" +
        (ICONS[l.key] || "") + esc(l.label) + "</a>";
    }).join("");
  }

  /* cv buttons + copy email */
  ["#cvBtnTop", "#cvBtnBottom"].forEach(sel => {
    const el = $(sel);
    if (el && CONFIG.resumeUrl) el.href = CONFIG.resumeUrl;
  });

  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.email);
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = CONFIG.email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("[+] copied :: " + CONFIG.email);
    });
  }

  /* packet canvas */
  const canvas = $("#packetCanvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W, H, pts = [], raf, visible = true;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);

    function size() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor(W / 18));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: .18 + Math.random() * .45, vy: (Math.random() - .5) * .12,
        r: .8 + Math.random() * 1.6, hot: Math.random() < .12
      }));
    }

    function draw() {
      if (document.body.classList.contains("no-motion")) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10 || p.y > H + 10) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = p.hot ? "rgba(255,45,85,.75)" : "rgba(140,140,155,.35)";
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < 8100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = (a.hot || b.hot)
              ? "rgba(255,45,85," + (.14 * (1 - d / 8100)) + ")"
              : "rgba(120,120,140," + (.09 * (1 - d / 8100)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    }

    size();
    addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible) raf = requestAnimationFrame(draw);
    });
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    })).observe(canvas);
    new MutationObserver(() => {
      if (!document.body.classList.contains("no-motion") && visible && !document.hidden)
        raf = requestAnimationFrame(draw);
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    raf = requestAnimationFrame(draw);
  }
})();
