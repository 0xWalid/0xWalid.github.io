/* ============================================================
   0xWALID PORTFOLIO — YOUR CONTENT LIVES HERE
   Edit anything below. Writeups live in js/writeups.js
   ============================================================ */

const CONFIG = {
  name: "Waleed",
  alias: "0xWalid",
  role: "Penetration Tester · Cybersecurity Engineer",
  base: "Gujrat, Pakistan · remote-friendly",
  host: "0xwalid.dev",
  email: "bu8.official@gmail.com",
  resumeUrl: "Waleed_CV.pdf",
  githubUrl: "https://github.com/0xWalid",

  roles: [
    "penetration tester",
    "cybersecurity engineer",
    "AI security builder",
    "SOC-trained defender turned attacker"
  ],

  stats: [
    { n: 5, suffix: "+", label: "security projects" },
    { n: 3, suffix: "", label: "certs in pipeline" },
    { n: "auto", label: "lab notes published" },
    { n: 4, suffix: "+", label: "years of engineering study" }
  ],

  skills: [
    { group: "OFFENSIVE OPS", items: [
      ["Web & API Pentesting", 75],
      ["Vulnerability Assessment", 75],
      ["Network Scanning & Enumeration", 78],
      ["Burp Suite / Nmap / SQLmap / ffuf", 72],
      ["Metasploit", 65]
    ]},
    { group: "DEFENSIVE / SOC", items: [
      ["SIEM Monitoring (Defender · Coro · Wazuh)", 74],
      ["Threat Investigation & Log Analysis", 76],
      ["Email Header & Phishing Analysis", 80],
      ["Alerting & Detection Rules", 68]
    ]},
    { group: "ENGINEERING", items: [
      ["Python & Automation", 80],
      ["JavaScript / Web", 70],
      ["Linux & Bash", 78],
      ["Git & CI basics", 74]
    ]},
    { group: "AI SECURITY", items: [
      ["LLM-Driven Pentest Tooling", 75],
      ["CVE Intelligence Automation", 70],
      ["Prompt Injection Research", 62]
    ]}
  ],

  projects: [
    {
      id: "EXP-000", featured: true,
      title: "ARTIFACTORY",
      desc: "A practitioner-first autonomous pentesting framework built on Sovereign Blackboard Architecture (SBA) — scope-enforced, token-efficient assessments driven by a parameterized tradecraft playbook. Maps attack surfaces, fires OWASP/PortSwigger vectors, and falls back to dynamic research for missing exploits. Best part: it plugs into opencode, so even free AI models can run structured pentests.",
      tags: ["AI Pentesting", "SBA", "opencode", "OWASP Top 10", "Automation"],
      stamp: "active", stampLabel: "ACTIVE OP",
      links: [{ label: "source", url: "#" }, { label: "docs soon", url: "#" }]
    },
    {
      id: "EXP-001",
      title: "CVEs Foresight",
      desc: "An AI-assisted threat intelligence dashboard that aggregates, parses and analyzes global CVE feeds with LLMs — turning raw vulnerability noise into operational summaries analysts can actually act on.",
      tags: ["Python", "LLM", "Threat Intel"],
      stamp: "active", stampLabel: "ACTIVE OP",
      links: [{ label: "source", url: "#" }]
    },
    {
      id: "EXP-002",
      title: "Wazuh SIEM Lab",
      desc: "Deployed and tuned a Wazuh SIEM homelab: aggregated endpoint telemetry, wrote alerting rules, and simulated attack techniques to sharpen real-time intrusion detection.",
      tags: ["Wazuh", "SIEM", "Detection"],
      stamp: "active", stampLabel: "RUNNING",
      links: [{ label: "writeup soon", url: "#" }]
    },
    {
      id: "EXP-003",
      title: "Sslmate_CTsearcher",
      desc: "Recon automation built on the SSLMate API — extracts subdomains and parses certificate-transparency logs to map external network surfaces in seconds instead of hours.",
      tags: ["Python", "OSINT", "Cert Transparency"],
      stamp: "dep", stampLabel: "DEPLOYED",
      links: [{ label: "script", url: "#" }]
    },
    {
      id: "EXP-004",
      title: "PicoCTF Campaign",
      desc: "Active CTF grind focused on web exploitation and API logic flaws — every solve documented as a step-by-step PoC report with impact assessment and remediation, just like a real engagement.",
      tags: ["PicoCTF", "CTF", "Reporting"],
      stamp: "wip", stampLabel: "ONGOING",
      links: [{ label: "notes below", url: "#labs" }]
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
    { state: "done", title: "B.Sc. Software Engineering — University of Gujrat", pct: 100,
      desc: "2020 – 2024. Where I learned how software is built — step one of learning how it breaks." },
    { state: "done", title: "Cybersecurity Intern — XO CyberUS (Remote)", pct: 100,
      desc: "Real SOC work: Microsoft Defender + Coro monitoring, deep threat investigations, log analysis, and email-header/phishing forensics on enterprise events." },
    { state: "done", title: "Foundations — EC-Council & Mastercard Programs", pct: 100,
      desc: "Ethical Hacking Essentials (EC-Council) and Cybersecurity Virtual Experience (Mastercard)." },
    { state: "now", title: "HackTheBox CPTS", pct: 60,
      desc: "Hands-on penetration testing methodology. My current main quest and the best OSCP warm-up in the game." },
    { state: "next", title: "OSCP", pct: 20,
      desc: "The industry benchmark for offensive security. 24 hours, 5 machines, zero excuses." }
  ],

  /* machines you have rooted — shown in the lab tracker table */
  labs: [
    { name: "PicoCTF — Web & API Set",       platform: "PicoCTF", difficulty: "Easy",   owned: "2026", tech: ["Web Exploitation", "API Logic Flaws", "PoC Reports"] },
    { name: "LeakyGPT — Prompt Injection Lab", platform: "Personal", difficulty: "Medium", owned: "2026", tech: ["LLM Abuse", "Indirect Injection", "Exfiltration"] },
    { name: "Wazuh Detection Lab",            platform: "Personal",  difficulty: "Medium", owned: "2026", tech: ["SIEM", "Alerting Rules", "Log Analysis"] }
  ],

  /* people who solved the site-wide CTF (add names here) */
  ctfSolvers: [],

  /* set visible:false to hide any link from the site */
  links: [
    { key: "email",    label: "Email",      url: "",                                          visible: true },
    { key: "github",   label: "GitHub",     url: "https://github.com/0xWalid",                visible: true },
    { key: "linkedin", label: "LinkedIn",   url: "https://linkedin.com/in/thewaleedahmed",    visible: true },
    { key: "youtube",  label: "YouTube",    url: "https://youtube.com/@00xWalid",             visible: true },
    { key: "htb",      label: "HackTheBox", url: "#",                                         visible: true },
    { key: "thm",      label: "TryHackMe",  url: "#",                                         visible: false },
    { key: "x",        label: "X / Twitter", url: "#",                                        visible: false }
  ]
};
