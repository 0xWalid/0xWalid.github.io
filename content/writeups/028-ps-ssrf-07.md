---
slug: "ps-ssrf-07"
title: "SSRF with whitelist based input filter"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SSRF"]
date: "2026-01-20"
minutes: 4
visible: true
tldr: "Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 07 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/07-SSRF%20with%20whitelist-based%20input%20filter.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>Server-Side Request Forgery (SSRF)</strong> vulnerability protected by a <strong>whitelist-based input filter</strong> by abusing <strong>URL parsing inconsistencies</strong>, allowing access to an <strong>internal admin interface</strong> and deletion of the user <strong><code>carlos</code></strong>.</p>
<h2>1. Vulnerability Discovery</h2>
<h2>Feature Tested</h2>
<ul><li><strong>Check stock</strong> functionality on the product page</li></ul>
<p>This feature sends a <strong>POST request</strong> to the backend containing a URL parameter.</p>
<h2>Parameter Identified</h2>
<ul><li><strong><code>stockApi</code></strong></li></ul>
<p>The backend server fetches the supplied URL to retrieve stock information.</p>
<h2>2. Whitelist-Based Input Filter Identified</h2>
<h2>Allowed Domain</h2>
<p>The application only allowed URLs containing the domain:</p>
<pre class="code" data-lang="text"><code>stock.weliketoshop.net</code></pre>
<h2>Blocked Attempts</h2>
<p>When attempting values such as:</p>
<ul><li><code>localhost</code></li><li>Internal IP addresses</li></ul>
<p>The application responded with:</p>
<ul><li><strong>500 Internal Server Error</strong></li></ul>
<p>This indicates a <strong>strict whitelist</strong>, implemented using <strong>string matching</strong>, not proper URL parsing.</p>
<h2>3. Why This Whitelist Is Weak</h2>
<p>The filter only checks whether the allowed domain <strong>appears in the URL string</strong>, not whether it is actually the <strong>destination host</strong>.</p>
<p>This makes it vulnerable to:</p>
<ul><li>Userinfo (<code>@</code>) abuse</li><li>Fragment (<code>#</code>) parsing tricks</li><li>Encoding confusion</li></ul>
<h2>4. Whitelist Bypass Technique</h2>
<h2>Techniques Used</h2>
<ul><li><strong>Userinfo (<code>@</code>) abuse</strong></li><li><strong>Fragment identifier (<code>#</code>)</strong></li><li><strong>Double URL encoding</strong></li></ul>
<h2>Why This Works</h2>
<ul><li>Everything <strong>before <code>@</code></strong> is treated as userinfo</li><li>Everything <strong>after <code>@</code></strong> becomes the actual host</li><li>The fragment (<code>#</code>) is ignored by the server when making requests</li><li>Double encoding prevents the filter from recognizing blocked characters</li></ul>
<h2>5. Final Exploit Payload</h2>
<p>The following value was supplied to the <code>stockApi</code> parameter:</p>
<pre class="code" data-lang="text"><code>http%3a%2f%2flocalhost%2523%40stock.weliketoshop.net/admin/delete?username=carlos</code></pre>
<h2>Decoded Interpretation</h2>
<pre class="code" data-lang="text"><code>http://localhost#@stock.weliketoshop.net/admin/delete?username=carlos
</code></pre>
<ul><li>The filter sees: <code>stock.weliketoshop.net</code> ✅</li><li>The backend resolves the request to: <code>localhost</code> ❌</li><li>The fragment hides the true destination from the filter</li></ul>
<h2>6. Privileged Action Execution</h2>
<p>The backend request reached the internal admin interface and executed:</p>
<pre class="code" data-lang="text"><code>/admin/delete?username=carlos</code></pre>
<h2>Result</h2>
<ul><li>User <strong><code>carlos</code></strong> successfully deleted</li><li>The lab was immediately marked as <strong>solved</strong></li></ul>
<h2>7. Final Result</h2>
<pre class="code" data-lang="text"><code>Vulnerabilitytype: SSRF
Filtertype: Whitelist (string matching)
Bypass technique: @ + # +double URLencoding
Impact:Internaladminaccess
Lab status: Solved
</code></pre>
<h2>8. Key Takeaways (Attacker Mindset)</h2>
<ul><li>Whitelists are useless if they rely on <strong>string matching</strong></li><li>URL parsing is complex — attackers exploit that complexity</li><li>The <code>@</code> symbol is one of the most reliable SSRF bypass primitives</li><li>Encoding layers often defeat “secure” filters</li><li>If a backend fetches URLs, <strong>assume SSRF until proven otherwise</strong></li></ul>
<h2>9. Notes for My Future Self</h2>
<ul><li>Always test <code>@</code>, <code>#</code>, and encoding combinations against whitelists</li><li>Never trust filters that don’t parse URLs properly</li><li>SSRF defenses must validate:</li><li>Scheme</li><li>Host</li><li>Port</li><li>Redirect behavior</li><li>Anything less is bypassable</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 07 COMPLETE</code></details>
