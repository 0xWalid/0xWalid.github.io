---
slug: "ps-ssrf-04"
title: "SSRF with blacklist based input filter"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SSRF"]
date: "2026-01-01"
minutes: 4
visible: true
tldr: "Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 04 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/04-SSRF%20with%20blacklist-based%20input%20filter.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>Server-Side Request Forgery (SSRF)</strong> vulnerability protected by a <strong>blacklist-based input filter</strong> to access an internal admin interface and <strong>delete the user <code>carlos</code></strong>.</p>
<h2>1. Vulnerability Discovery</h2>
<h2>Entry Point Identification</h2>
<p>While interacting with the product stock functionality, a <strong>POST request</strong> was observed being sent to the backend when clicking <strong>“Check stock”</strong>.</p>
<p>Inside the POST body, a parameter named <strong><code>stockApi</code></strong> was found to contain a URL.</p>
<h2>Normal Behavior</h2>
<pre class="code" data-lang="text"><code>stockApi=http://stock.weliketoshop.net:8080/product/stock/check?productId=1&amp;storeId=1</code></pre>
<p>This strongly indicates:</p>
<ul><li>The backend server fetches the URL server-side</li><li>The application trusts user-controlled input for backend requests</li></ul>
<p>This is a <strong>classic SSRF attack surface</strong>.</p>
<h2>2. Blacklist-Based Filtering Observed</h2>
<p>Initial SSRF attempts using common internal targets were blocked.</p>
<h2>Blocked Patterns</h2>
<p>The application rejected requests containing:</p>
<ul><li><code>localhost</code></li><li><code>127.0.0.1</code></li><li><code>/admin</code></li></ul>
<p>Whenever these appeared, the application blocked the request instead of forwarding it.</p>
<p>This confirms the presence of a <strong>blacklist-based input filter</strong>, rather than a proper allowlist or URL parsing validation.</p>
<h2>3. Bypassing the Blacklist</h2>
<h2>1️⃣ Bypassing Localhost Restrictions</h2>
<p>Instead of using <code>127.0.0.1</code>, the loopback address was rewritten as:</p>
<pre class="code" data-lang="text"><code>127.1
</code></pre>
<p>This works because:</p>
<ul><li><code>127.0.0.0/8</code> is all loopback</li><li>Many filters only block the exact string <code>127.0.0.1</code></li><li>The backend OS still resolves <code>127.1</code> to localhost</li></ul>
<h2>2️⃣ Bypassing <code>/admin</code> Filtering with Double URL Encoding</h2>
<p>The <code>/admin</code> path was blocked when sent directly.</p>
<p>To bypass this:</p>
<ul><li>Each character in <code>admin</code> was <strong>double URL‑encoded</strong></li><li>This bypasses string-based filters that do not decode input multiple times</li><li>The backend decodes it later, after the filter is bypassed</li></ul>
<p>Encoded form:</p>
<pre class="code" data-lang="text"><code>%25%36%31%25%36%34%25%36%44%25%36%39%25%36%45
</code></pre>
<p>Which resolves to:</p>
<pre class="code" data-lang="text"><code>/admin
</code></pre>
<h2>4. Final Exploit Payload</h2>
<p>The final working payload used in the <code>stockApi</code> parameter was:</p>
<pre class="code" data-lang="text"><code>http%3a%2f%2f127.1%2f%25%36%31%25%36%34%25%36%44%25%36%39%25%36%45/delete?username=carlos
</code></pre>
<h2>What This Does</h2>
<ul><li>Forces the backend to make a request to:</li><li>Internal host: <code>127.1</code></li><li>Internal path: <code>/admin/delete</code></li><li>Deletes the user <code>carlos</code> from the admin interface</li></ul>
<h2>5. Lab Completion</h2>
<ul><li>The request was processed successfully</li><li>The user <code>carlos</code> was deleted</li><li>The lab was immediately marked as <strong>solved</strong></li></ul>
<h2>6. Key Takeaways</h2>
<h2>Why Blacklists Fail</h2>
<ul><li>Blacklists only block <strong>known strings</strong></li><li>They do not understand:</li><li>IP ranges</li><li>URL normalization</li><li>Encoding layers</li><li>Attackers only need <strong>one alternative representation</strong></li></ul>
<h2>Attacker Mindset</h2>
<ul><li>SSRF is about <strong>how the backend parses URLs</strong>, not what the frontend allows</li><li>If input reaches a request function:</li><li>Assume filters are weak</li><li>Try alternate IP formats</li><li>Try encoding, double encoding, mixed encoding</li><li>Never trust a filter that works by “blocking words”</li></ul>
<h2>7. Notes for Future Testing</h2>
<ul><li>Always test SSRF inputs with:</li><li>Alternate loopback IPs (<code>127.1</code>, <code>2130706433</code>, IPv6)</li><li>Encoded paths</li><li>Double and mixed encoding</li><li>Blacklist = bypass opportunity</li><li>Proper SSRF defense requires <strong>strict allowlists</strong>, not string matching</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 04 COMPLETE</code></details>
