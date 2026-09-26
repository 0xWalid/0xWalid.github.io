---
slug: "ssrf-series-portswigger"
title: "SSRF Field Guide — Breaking Trust Between Servers"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SSRF","PortSwigger Academy"]
date: "2026-08-14"
minutes: 12
visible: true
tldr: "Demonstrates I can spot and exploit server-side request forgery across every defense tier — from naive local targets to hardened whitelist filters — with clean documentation throughout."
format: "html"
---

      <p>Seven labs attacking the invisible trust boundary between servers. Full notes in my <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)" target="_blank" rel="noopener">Learnings repo</a>. The recurring pattern: any feature where <em>the server fetches a URL you influence</em> is SSRF surface.</p>

      <h2>1 · Finding the Surface</h2>
      <p>In every variant, the entry point hid inside routine functionality — most memorably a stock-checker posting:</p>
      <pre class="code" data-lang="http"><code>POST /product/stock HTTP/1.1

stockApi=http://stock.weliketoshop.net:8080/product/stock/check?productId=1</code></pre>
      <p>User-controlled input that the <em>backend</em> requests = the app trusts me to choose its destinations.</p>

      <h2>2 · Localhost &amp; Adjacent Hosts</h2>
      <p>The first pair simply redirected that trust inward — <code class="inline">http://localhost/admin</code> exposed admin panels never meant for outside eyes, letting me delete user <code class="inline">carlos</code> without ever touching the admin UI directly.</p>

      <h2>3 · Beating Blacklists</h2>
      <p>Blacklist filters blocked literal strings like <code class="inline">127.0.0.1</code> and <code class="inline">admin</code>. Two classic escapes:</p>
      <ul>
        <li>Alternative IP representations: <code class="inline">2130706433</code>, <code class="inline">0x7f000001</code>, <code class="inline">0177.0.0.1</code></li>
        <li>Double URL-encoding — the back-end decodes once more than the filter does: <code class="inline">%2531%2532%2537...</code></li>
        <li>Chaining an <strong>open redirect</strong> on a whitelisted host so the server redirects itself into the internal network.</li>
      </ul>

      <h2>4 · Blind SSRF — Shellshock via Referer</h2>
      <p>No feedback channel at all? One lab let me control the <code class="inline">Referer</code> header of a request the server makes internally, smuggling a Shellshock payload that triggered an outbound DNS ping to my collaborator — proof of execution with zero response reflection.</p>

      <h2>5 · Whitelist Filters &amp; URL Parsing Quirks</h2>
      <p>The hardest lab validated the URL against an expected hostname — defeated with credential/fragment parsing chaos:</p>
      <pre class="code" data-lang="text"><code>https://expected-host@internal-host:port/%2Fadmin%2Fdelete?username=carlos#
└─ whitelist sees this ─┘   └── parser actually resolves here ──┘</code></pre>

      <h2>Defender's Corner</h2>
      <ul>
        <li>Allowlists must be enforced <em>after</em> canonical URL parsing — not on raw strings.</li>
        <li>Internal admin planes should require re-authentication, not network position alone.</li>
        <li>Egress filtering from server fleets kills OOB confirmation channels.</li>
      </ul>
