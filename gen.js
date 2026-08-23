/* run `bun gen.js` after editing js/writeups.js — regenerates sitemap.xml + feed.xml */

const fs = require("fs");
const BASE = "https://0xwalid.github.io";
const src = fs.readFileSync(__dirname + "/js/writeups.js", "utf8");
const WRITEUPS = new Function(src + "; return WRITEUPS;")();
const visible = WRITEUPS.filter(w => w.visible !== false)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

function rfc822(d) {
  const t = new Date(d + "T12:00:00Z");
  return isNaN(t) ? new Date().toUTCString() : t.toUTCString();
}

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE}/</loc></url>
  <url><loc>${BASE}/writeups/</loc></url>
${visible.map(w =>
  `  <url><loc>${BASE}/writeups/index.html?p=${encodeURIComponent(w.slug)}</loc><lastmod>${w.date}</lastmod></url>`
).join("\n")}
</urlset>
`;
fs.writeFileSync(__dirname + "/sitemap.xml", sitemap);

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>0xWalid — Lab Notes</title>
  <link>${BASE}/writeups/</link>
  <description>Security writeups, labs and AI security research by Waleed (0xWalid).</description>
  <language>en</language>
${visible.map(w => `  <item>
    <title>${esc(w.title)}</title>
    <link>${BASE}/writeups/index.html?p=${encodeURIComponent(w.slug)}</link>
    <guid isPermaLink="false">${esc(w.slug)}</guid>
    <pubDate>${rfc822(w.date)}</pubDate>
    <description>${esc(w.tldr)}</description>
  </item>`).join("\n")}
</channel></rss>
`;
fs.writeFileSync(__dirname + "/feed.xml", feed);

console.log(`generated: ${visible.length} items -> sitemap.xml, feed.xml`);
