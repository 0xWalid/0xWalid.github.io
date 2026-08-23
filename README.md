# 0xWalid — Offensive Security Portfolio

A hand-built, zero-framework portfolio styled as a **penetration test report on yourself**.
Dual-layer design: every section shows a small red codename tag (`01 // RECON`) above a big
plain-English heading (`About Me`) — hackers get the flavor, HR reads instantly.

```
01 // RECON ............ About Me
02 // ENUMERATION ...... Skills
03 // EXPLOITS ......... Projects (+ pinned favourite with flag-capture animation)
04 // LAB NOTES ........ Writeups & labs (your blog, powered by one JS file)
05 // PRIVILEGE ESC .... Certifications roadmap (CPTS → OSCP)
06 // PIVOT ............ Contact
```

---

## 1 · Preview locally

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works for a quick look.)

## 2 · Deploy to GitHub Pages (replace old site)

The old repo is **`0xWalid.github.io`** — we push this site into it, so the new
portfolio goes live at **https://0xwalid.github.io** within ~1 minute.

```bash
cd ~/projects/website
git init
git add .
git commit -m "replace old site with new portfolio"
git remote add origin https://github.com/0xWalid/0xWalid.github.io.git
git push -u origin main --force
```

- `--force` overwrites the old site's history. If you'd rather keep the old
  commits, skip `--force` and resolve conflicts instead — or delete/recreate
  the repo and push fresh.
- Pages setting should stay: **Settings → Pages → Deploy from a branch →
  main / (root)**. If it was already enabled, nothing else to do.
- First visit after pushing may need a hard refresh (`Ctrl+Shift+R`) due to
  browser caching.

## 3 · Fill in YOUR content

Everything editable lives in **one file: [`js/config.js`](js/config.js)**.

| What | Where |
|---|---|
| Email, resume link, location | `CONFIG.email`, `CONFIG.resumeUrl`, `CONFIG.base` |
| Role rotator under hero name | `CONFIG.roles` |
| Stats counters | `CONFIG.stats` (`n:"auto"` counts your published writeups) |
| Skill groups + levels | `CONFIG.skills` |
| Projects + pinned favourite | `CONFIG.projects` (`featured:true` gets the FLAG-CAPTURED card) |
| Cert roadmap | `CONFIG.roadmap` |
| Social links (**set `visible:false`** to hide any) | `CONFIG.links` |

The CV button points at `CONFIG.resumeUrl` — drop a PDF anywhere (e.g. `assets/cv.pdf`)
and set that path.

Prose paragraphs (About Me text) live directly in `index.html` inside `<section id="recon">`.

## 4 · Publish a writeup (the fun part)

Open **[`js/writeups.js`](js/writeups.js)**, copy any existing entry, edit:

```js
{
  slug: "my-new-writeup",              // becomes writeups/index.html?p=my-new-writeup
  title: "Machine Name — How I Owned It",
  platform: "HackTheBox",              // shown as badge + filter chip
  difficulty: "Medium",                // Easy | Medium | Hard | Insane (colours the pill)
  category: ["Web", "SQLi"],
  date: "2026-08-30",
  minutes: 10,
  tldr: "One sentence recruiters understand about what this proves.",
  visible: true,                       // false = unpublish without deleting
  content: `
    <p>HTML goes here...</p>
    <h2>Step 1</h2>
    <pre class="code" data-lang="bash"><code>nmap -sV target</code></pre>
    <details class="flag-box">
      <summary><span class="flag-label">FLAG</span><span class="flag-hint"></span></summary>
      <code>HTB{...}</code>   <!-- hidden until the reader clicks "reveal" -->
    </details>`
}
```

That's it — it appears in the homepage preview (latest 4), the Lab Notes listing,
and gets its own page with prev/next navigation automatically.
No build step, no new files needed.

**Spoiler etiquette is built in:** wrap any flag in a `flag-box` and readers
following along must deliberately click to reveal it — the answer never shows
by accident.

## 5 · Structure

```
website/
├── index.html            main one-page site
├── 404.html              themed error page (bonus)
├── css/
│   ├── style.css         full design system
│   └── writeups.css      lab-notes pages only
├── js/
│   ├── config.js         ← ALL your content (edit me)
│   ├── writeups.js       ← ALL your writeups (edit me)
│   ├── main.js           core UX engine (don't touch)
│   └── render.js         renders config into sections (don't touch)
├── assets/favicon.svg
└── README.md
```

## 6 · Secrets (shhh)

- **Konami code** (`↑↑↓↓←→←→BA`) anywhere on the site → phosphor green ghost mode (persisted).
- **DevTools console** → a message for curious minds.
- The featured project card hides a capturable flag. Hover it.

## 7 · Performance & accessibility notes

- No frameworks, no trackers, ~3 small files of JS total.
- Canvas animation pauses when the tab is hidden or hero is offscreen; disabled entirely
  for `prefers-reduced-motion` users (boot screen too).
- Semantic HTML, skip-link, keyboard-navigable menu, focus-visible styles.
