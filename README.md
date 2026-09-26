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

Writeups are **markdown files with frontmatter** in [`content/writeups/`](content/writeups/).
`js/writeups.js` is generated from them — never edit it by hand.

Create `content/writeups/NNN-my-slug.md` (the `NNN-` prefix just controls order):

```markdown
---
slug: "my-new-writeup"                 # becomes writeups/index.html?p=my-new-writeup
title: "Machine Name — How I Owned It"
platform: "HackTheBox"                 # shown as badge + filter chip
difficulty: "Medium"                   # Easy | Medium | Hard | Insane (colours the pill)
category: ["Web","SQLi"]
date: "2026-08-30"
minutes: 10
visible: true                          # false = unpublish without deleting
tldr: "One sentence recruiters understand about what this proves."
---

Write the body in **plain markdown**. Headings, lists, **bold**, `code` all work.

```bash
nmap -sV target
```

<details class="flag-box">
  <summary><span class="flag-label">FLAG</span><span class="flag-hint"></span></summary>
  <code>HTB{...}</code>
</details>
```

Then regenerate everything (writeups data + OG cards + feed/sitemap):

```bash
node tools/sync.mjs      # or: npm run sync   (also rebuilds OG + feed/sitemap)
```

Frontmatter values are JSON (quoted strings, `[..]` arrays, bare numbers/booleans).
Fenced code blocks become the site's `<pre class="code" data-lang="…">` markup with
copy buttons automatically; raw HTML (like the `flag-box` above) passes through untouched.

**Write freely in a separate repo:** add `source_url: "https://raw.githubusercontent.com/0xWalid/Learnings/main/…​.md"`
to the frontmatter and `sync` fetches that markdown at build time — so a writeup can live
in your [Learnings](https://github.com/0xWalid/Learnings) repo and still render here. The
body below the frontmatter is used as a fallback if the fetch fails.

The 28 migrated legacy entries carry `format: "html"` (their bodies are hand-written HTML,
emitted verbatim). New writeups omit `format` and author in markdown.

Each writeup appears in the homepage preview (latest 4), the Lab Notes listing, and gets
its own page with prev/next navigation automatically.

**Spoiler etiquette is built in:** wrap any flag in a `flag-box` and readers
following along must deliberately click to reveal it — the answer never shows
by accident.

## 5 · Extras built in

- **Ctrl+K command palette** — jump to sections, writeups and actions (also the `ctrl k` chip next to the logo).
- **Print = instant CV** — `Ctrl+P` on any page produces a clean one-pager (print stylesheet, zero maintenance).
- **`sudo hire-me`** — a hidden egg: type it anywhere on the homepage… see what happens.
- **Hall of Fame** — `CONFIG.ctfSolvers`: a flag is split into **three base64 pieces** hidden in three spots (robots.txt · homepage source comment · browser console). Readers concatenate + base64-decode and email you the result; add solver names here.
- **walid-bot** — bottom-right chat bubble answering questions from your config data. Rule-based, offline, no APIs — edit answers in `js/bot.js`.
- **Per-article OG images** — each writeup has its own social-share card in `assets/og/`.
  `npm run sync` regenerates them; to rebuild cards only:

  ```bash
  npm install && npm run og    # regenerates all cards from js/writeups.js
  ```

## 6 · Feed & sitemap

`npm run sync` already rebuilds `feed.xml` + `sitemap.xml`. To regenerate them alone:

```bash
node gen.js      # or: npm run gen
```

Commit the generated files (`js/writeups.js`, `feed.xml`, `sitemap.xml`, `assets/og/`)
together with the markdown you added in `content/writeups/`.

## 6b · Custom domain (optional but recommended)

1. Buy `0xwalid.dev` (~$12/yr, any registrar).
2. Repo **Settings → Pages → Custom domain** → enter it → add the DNS records GitHub shows
   (`A` → 185.199.108.153 etc., or `CNAME` → `0xWalid.github.io`).
3. Add a file named `CNAME` containing just the domain to this repo root.
4. Enforce HTTPS once the check passes. Done — `.dev` TLD is HTTPS-enforced by browsers.

## 7 · Performance & accessibility notes

- No frameworks, no third-party CDNs, no trackers. **Fonts are self-hosted** (`assets/fonts/`, latin-subset woff2) so no request ever leaves your domain for styling. Regenerate app icons from the favicon with `npm run icons`.
- Optional analytics: a **cookieless GoatCounter** snippet is wired into both pages — replace the `0xwalid` code with your own after signing up free at [goatcounter.com](https://www.goatcounter.com/). Remove the two `<script data-goatcounter…>` lines to opt out entirely.
- Canvas pauses when hidden/offscreen; honors `prefers-reduced-motion`.
- Semantic HTML, skip-link, keyboard menu, focus-visible styles, spoiler-safe flags by default.

## 8 · Structure

```
website/
├── index.html            main one-page site
├── writeups/index.html   listing + article viewer (?p=slug)
├── 404.html              themed error page
├── now.html              /now + /uses page (from CONFIG.now)
├── robots.txt            crawler rules (+ a hint for humans)
├── sitemap.xml / feed.xml  generated by gen.js
├── .well-known/security.txt  RFC 9116 security contact
├── site.webmanifest       PWA manifest (icons, theme)
├── content/writeups/     ← markdown source of truth for writeups (edit me)
├── assets/               favicon.svg · app icons (png) · og.png · fonts/ (self-hosted woff2)
├── css/
│   ├── fonts.css         @font-face for self-hosted fonts
│   ├── style.css         design system (+ print CV styles)
│   └── writeups.css      article pages only
├── tools/
│   ├── sync.mjs          content/writeups/*.md → js/writeups.js
│   ├── gen-og.js         regenerates per-writeup OG cards
│   └── gen-icons.js      regenerates app icons from favicon design
└── js/
    ├── config.js         ← ALL your content (edit me)
    ├── writeups.js       generated by tools/sync.mjs — do not edit
    ├── main.js           core UX engine
    ├── render.js         renders config into sections
    ├── extras.js         palette, eggs, toggles
    └── bot.js            walid-bot brain
```
