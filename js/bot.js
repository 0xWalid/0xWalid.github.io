/* walid-bot — tiny rule-based assistant, runs 100% locally, zero APIs */

(() => {
  "use strict";

  function boot() {
  try {
    const { $, esc } = window.APP;
    let host = $("#botHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "botHost";
      document.body.appendChild(host);
    }
    if (typeof CONFIG === "undefined") {
      console.error("[walid-bot] CONFIG unavailable — is js/config.js loaded?");
      return;
    }

  host.innerHTML =
    '<button class="bot-fab mono" id="botFab" type="button" aria-label="Chat with walid-bot">?_</button>' +
    '<div class="bot-panel" id="botPanel" role="dialog" aria-label="walid-bot">' +
    '<div class="bot-head mono"><span>walid-bot v0.1</span><span class="bot-local">offline // no APIs</span>' +
    '<button class="bot-x" id="botX" type="button" aria-label="Close">&times;</button></div>' +
    '<div class="bot-msgs" id="botMsgs"></div>' +
    '<div class="bot-chips mono" id="botChips"></div>' +
    '<form class="bot-form" id="botForm"><input id="botInput" class="mono" placeholder="ask about skills, projects, certs…" autocomplete="off">' +
    '<button class="bot-send mono" type="submit">send</button></form></div>';

  const panel = $("#botPanel"), msgs = $("#botMsgs");

  function bubble(text, who) {
    const p = document.createElement("p");
    p.className = "bot-msg " + (who === "me" ? "me" : "bot");
    p.innerHTML = text;
    msgs.appendChild(p);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function botSay(text, delay) {
    const t = document.createElement("p");
    t.className = "bot-msg bot typing";
    t.textContent = "…";
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { t.remove(); bubble(text, "bot"); }, delay || 500);
  }

  const latest = (typeof WRITEUPS !== "undefined")
    ? WRITEUPS.filter(w => w.visible !== false).sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];

  const RULES = [
    [/hello|^hi\b|hey|salam|سلام/, () =>
      "Hey! I'm a tiny rule-based bot living in this site's JavaScript. Ask me about <b>skills</b>, <b>projects</b>, <b>writeups</b>, <b>certs</b> or <b>contact</b>."],
    [/who (are|r) you|about|bio/, () =>
      "<b>Waleed (0xWalid)</b> — security engineer focused on <b>AI &amp; agent security</b> and security automation. SOC-trained, CPTS-track, builder of Artifactory — an autonomous pentesting framework."],
    [/skill|stack|tech|know/, () =>
      "Strongest muscles: " + CONFIG.skills.flatMap(g => g.items.slice(0, 2).map(i => i[0])).slice(0, 8).join(", ") + ". Full breakdown lives in the <a href='#enum'>skills section</a>."],
    [/project|built|build|portfolio work/, () => {
      const f = (CONFIG.projects || []).find(p => p.featured);
      return "Flagship: <b>" + f.title + "</b> — " + f.desc.split(".")[0] + ". Others include " +
        CONFIG.projects.filter(p => !p.featured).map(p => p.title).slice(0, 4).join(", ") + ". Scroll the <a href='#exploits'>exploits section</a>.";
    }],
    [/writeup|lab|htb|hackthebox|thm|tryhackme|blog/, () =>
      latest.length ? "Latest lab notes: " + latest.slice(0, 3).map(w => "«" + w.title + "»").join(", ") +
      ". Reports open with a recruiter-friendly TL;DR — <a href='#labs'>see them</a>, and the full archive lives at <b>github.com/0xWalid/Learnings</b>."
      : "Full labs archive: <b>github.com/0xWalid/Learnings</b>"],
    [/cert|oscp|cpts|roadmap|study|learn/, () =>
      "Roadmap: B.Sc. Software Engineering ✓ · Cybersecurity Intern @ XO CyberUS ✓ · EC-Council & Mastercard programs ✓ · <b>HackTheBox CPTS in progress (~60%)</b> → OSCP next. See the <a href='#privesc'>privesc section</a>."],
    [/hire|contact|email|reach|touch|recruit/, () =>
      "Fastest path: <b>" + CONFIG.email + "</b> (copy button in the <a href='#pivot'>pivot section</a>). LinkedIn + GitHub links live there too. Response time &lt; 24h."],
    [/cv|resume/, () => "Hit any <b>download cv</b> button — or just press Ctrl+P on this site; it prints a clean one-pager by design."],
    [/flag|secret|ctf|hidden|easter/, () =>
      "There IS a flag hidden on this site… three pieces, actually. Crawlers read comments. No further comment 🙃".replace(" 🙃", "")],
    [/thank|thanks|cool|nice|awesome/, () => "Happy to help. Now go break something (legally)."]
  ];

  function respond(raw) {
    const q = raw.toLowerCase().trim();
    if (!q) return;
    bubble(esc(raw), "me");
    const hit = RULES.find(([re]) => re.test(q));
    botSay(hit ? hit[1]() :
      "I'm a small rule-based bot, not an LLM (ironic for an AI-security guy, I know). Try: <b>skills</b>, <b>projects</b>, <b>writeups</b>, <b>certs</b>, <b>contact</b>.", 550);
  }

  const CHIPS = ["skills", "projects", "writeups", "certs", "contact"];
  $("#botChips").innerHTML = CHIPS.map(c => '<button type="button" data-q="' + c + '">' + c + "</button>").join("");
  $("#botChips").addEventListener("click", e => {
    if (e.target.dataset.q) respond(e.target.dataset.q);
  });
  $("#botForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#botInput").value;
    $("#botInput").value = "";
    respond(v);
  });
  $("#botFab").addEventListener("click", () => {
    panel.classList.add("open");
    if (!msgs.children.length)
      botSay("Boot complete. Ask me anything about Waleed — or type <b>hire</b> if you're here on business.", 400);
  });
  $("#botX").addEventListener("click", () => panel.classList.remove("open"));
  } catch (err) {
    console.error("[walid-bot] failed:", err);
  }
  }

  function hasConfig() {
    try { return typeof CONFIG !== "undefined"; } catch (_) { return false; }
  }
  function whenConfigReady(fn) {
    if (hasConfig()) return fn();
    const iv = setInterval(() => {
      if (hasConfig()) { clearInterval(iv); fn(); }
    }, 60);
    setTimeout(() => clearInterval(iv), 8000);
  }
  whenConfigReady(boot);
})();
