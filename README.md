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

## 5 · Extras built in

- **Ctrl+K command palette** — jump to sections, writeups and actions (also the `ctrl k` chip next to the logo).
- **Print = instant CV** — `Ctrl+P` on any page produces a clean one-pager (print stylesheet, zero maintenance).
- **`sudo hire-me`** — a hidden egg: type it anywhere on the homepage… see what happens.
- **Lab tracker table** — `CONFIG.labs`: every machine you own, filterable by platform.
- **Hall of Fame** — `CONFIG.ctfSolvers`: a flag is hidden in three places across the site; solvers email you, you add their name here.
- **walid-bot** — bottom-right chat bubble answering questions from your config data. Rule-based, offline, no APIs — edit answers in `js/bot.js`.
- **Per-article OG images** — each writeup has its own social-share card in `assets/og/`. After adding writeups, regenerate:

  ```bash
  bun install && bun run og    # regenerates all cards from js/writeups.js
  ```

## 6 · Feed & sitemap

After adding writeups, regenerate the RSS feed and sitemap:

```bash
bun gen.js     # or node gen.js
```

Commit both files together with your new writeup.

## 6b · Custom domain (optional but recommended)

1. Buy `0xwalid.dev` (~$12/yr, any registrar).
2. Repo **Settings → Pages → Custom domain** → enter it → add the DNS records GitHub shows
   (`A` → 185.199.108.153 etc., or `CNAME` → `0xWalid.github.io`).
3. Add a file named `CNAME` containing just the domain to this repo root.
4. Enforce HTTPS once the check passes. Done — `.dev` TLD is HTTPS-enforced by browsers.

## 7 · Performance & accessibility notes

- No frameworks, no trackers. Canvas pauses when hidden/offscreen; honors `prefers-reduced-motion`.
- Semantic HTML, skip-link, keyboard menu, focus-visible styles, spoiler-safe flags by default.

## 8 · Structure

```
website/
├── index.html            main one-page site
├── writeups/index.html   listing + article viewer (?p=slug)
├── 404.html              themed error page
├── robots.txt            crawler rules (+ a hint for humans)
├── sitemap.xml / feed.xml  generated by gen.js
├── .well-known/security.txt  RFC 9116 security contact
├── assets/               favicon.svg · og.png (social share banner)
├── css/
│   ├── style.css         design system (+ print CV styles)
│   └── writeups.css      article pages only
└── js/
    ├── config.js         ← ALL your content (edit me)
    ├── writeups.js       ← ALL your writeups + labs data (edit me)
    ├── main.js           core UX engine
    ├── render.js         renders config into sections
    ├── extras.js         palette, eggs, toggles
    └── bot.js            walid-bot brain
```
