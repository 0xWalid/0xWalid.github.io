/* ============================================================
   0xWALID PORTFOLIO — YOUR CONTENT LIVES HERE
   Edit anything below. Writeups live in js/writeups.js
   ============================================================ */

const CONFIG = {
  name: "Waleed",
  alias: "0xWalid",
  role: "Aspiring Penetration Tester",
  base: "Earth · remote-friendly",
  host: "0xwalid.dev",
  email: "waleed@0xwalid.dev",
  resumeUrl: "#",
  githubUrl: "https://github.com/0xWalid",

  roles: [
    "penetration tester (in training)",
    "ex-SOC analyst",
    "software engineer",
    "AI security researcher"
  ],

  stats: [
    { n: 15, suffix: "+", label: "machines rooted" },
    { n: 500, suffix: "+", label: "hours in soc" },
    { n: "auto", label: "lab notes published" },
    { n: 2, label: "certs in pipeline" }
  ],

  skills: [
    { group: "OFFENSIVE OPS", items: [
      ["Penetration Testing", 70],
      ["Web Exploitation (OWASP)", 75],
      ["Privilege Escalation", 68],
      ["Burp Suite / Nmap / Metasploit", 78]
    ]},
    { group: "DEFENSIVE / SOC", items: [
      ["SIEM & Log Analysis", 80],
      ["Incident Triage & Response", 74],
      ["Threat Hunting", 62],
      ["Network Traffic Analysis", 70]
    ]},
    { group: "ENGINEERING", items: [
      ["Python & Automation", 85],
      ["JavaScript / Web", 72],
      ["Linux & Bash", 82],
      ["Git & CI basics", 76]
    ]},
    { group: "AI SECURITY", items: [
      ["LLM Prompt Injection", 68],
      ["AI Red Teaming", 60]
    ]}
  ],

  projects: [
    {
      id: "EXP-000", featured: true,
      title: "SENTINEL",
      desc: "An AI-powered anomaly detector that watches system logs like a paranoid analyst — machine-learning baselines meet classic detection rules. My love letter to both sides of the fence.",
      tags: ["Python", "ML", "ELK", "Detection Engineering"],
      stamp: "active", stampLabel: "ACTIVE OP",
      links: [{ label: "source", url: "#" }, { label: "demo", url: "#" }]
    },
    {
      id: "EXP-001",
      title: "PromptGuard",
      desc: "Test harness for LLM applications — fires prompt-injection payloads at your chatbot before someone meaner does. Built from my own AI security research.",
      tags: ["Python", "LLM", "Security Research"],
      stamp: "poc", stampLabel: "P.O.C",
      links: [{ label: "source", url: "#" }]
    },
    {
      id: "EXP-002",
      title: "PhishNet",
      desc: "Browser extension that sniffs phishing indicators in realtime — suspicious domains, lookalike links, sketchy forms. A paranoid friend living in your address bar.",
      tags: ["JavaScript", "Browser Ext"],
      stamp: "wip", stampLabel: "W.I.P",
      links: [{ label: "source", url: "#" }]
    },
    {
      id: "EXP-003",
      title: "AutoRecon Toolkit",
      desc: "Bash + Python scripts automating the boring half of recon — subdomain enumeration, port sweeps, screenshotting. Copy-pasting commands manually is itself a vulnerability.",
      tags: ["Python", "Bash", "OSINT"],
      stamp: "dep", stampLabel: "DEPLOYED",
      links: [{ label: "source", url: "#" }]
    },
    {
      id: "EXP-004",
      title: "Homelab SOC",
      desc: "My personal detection range — Proxmox box running Wazuh, Suricata and deliberately vulnerable VMs. Where blue team meets get-pwned-on-purpose.",
      tags: ["Proxmox", "Wazuh", "Suricata"],
      stamp: "active", stampLabel: "ACTIVE OP",
      links: [{ label: "writeup soon", url: "#" }]
    },
    {
      id: "EXP-005",
      title: "this.website",
      desc: "The site you're reading. Hand-built with zero frameworks — proof that I care about building things properly as much as breaking them.",
      tags: ["HTML", "CSS", "Vanilla JS"],
      stamp: "dep", stampLabel: "LIVE",
      links: [{ label: "source", url: "#" }]
    }
  ],

  roadmap: [
    { state: "done", title: "B.Sc. Software Engineering", pct: 100,
      desc: "Where I learned how software is built — step one of learning how it breaks." },
    { state: "done", title: "SOC Analyst — Field Experience", pct: 100,
      desc: "Real alerts, real incidents. Triage, SIEM workflows, and how attackers actually behave — from the other side of the glass." },
    { state: "now", title: "HackTheBox CPTS", pct: 65,
      desc: "Hands-on penetration testing methodology. My current main quest and the best OSCP warm-up in the game." },
    { state: "next", title: "OSCP", pct: 20,
      desc: "The industry benchmark for offensive security. 24 hours, 5 machines, zero excuses." },
    { state: "next", title: "AI Security Track", pct: 40,
      desc: "Ongoing side quest: prompt injection, LLM abuse cases, adversarial inputs — securing the newest attack surface there is." }
  ],

  /* machines you have rooted — shown in the lab tracker table */
  labs: [
    { name: "HEXDUMP",      platform: "HackTheBox", difficulty: "Easy",   owned: "2026-08-10", tech: ["SQLi", "LFI", "sudo less"] },
    { name: "Steel Mountain", platform: "TryHackMe",  difficulty: "Easy",   owned: "2026-06-30", tech: ["Recon", "HFS RCE", "Unquoted Path"] },
    { name: "LeakyGPT Lab",  platform: "Personal",    difficulty: "Medium", owned: "2026-07-22", tech: ["Prompt Injection", "Exfiltration"] }
  ],

  /* people who solved the site-wide CTF (add names here) */
  ctfSolvers: [],

  /* paste your real public key block later */
  pgpFingerprint: "REPLACE-WITH-YOUR-PGP-FINGERPRINT",

  /* set visible:false to hide any link from the site */
  links: [
    { key: "email",    label: "Email",      url: "",                              visible: true },
    { key: "github",   label: "GitHub",     url: "https://github.com/0xWalid",    visible: true },
    { key: "linkedin", label: "LinkedIn",   url: "#",                             visible: true },
    { key: "youtube",  label: "YouTube",    url: "#",                             visible: true },
    { key: "htb",      label: "HackTheBox", url: "#",                             visible: true },
    { key: "thm",      label: "TryHackMe",  url: "#",                             visible: false },
    { key: "x",        label: "X / Twitter", url: "#",                            visible: false }
  ]
};
