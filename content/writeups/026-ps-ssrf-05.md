---
slug: "ps-ssrf-05"
title: "Initial Testing & Vulnerability Identification"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SSRF"]
date: "2026-01-01"
minutes: 4
visible: true
tldr: "Exploit a Server‑Side Request Forgery (SSRF) vulnerability by abusing an open redirection flaw in the *Next product* feature to access an internal adm…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 05 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/05-SSRF%20with%20filter%20bypass%20via%20open%20redirection%20vulnerability.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>Server‑Side Request Forgery (SSRF)</strong> vulnerability by abusing an <strong>open redirection flaw</strong> in the *Next product* feature to access an <strong>internal admin endpoint</strong>, ultimately deleting the user <strong><code>carlos</code></strong>.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Feature Tested</h2>
<ul><li><strong>Next product</strong> functionality on the product page</li></ul>
<p>This feature triggers a <strong>POST request</strong> to the backend to retrieve the next product.</p>
<h2>Parameter Identified</h2>
<ul><li><code>stockApi</code></li></ul>
<p>This parameter is used by the backend to fetch product-related data and can be influenced by user input.</p>
<h2>2. Identifying the Open Redirect</h2>
<p>While analyzing the request, it was observed that the application internally calls the endpoint:</p>
<pre class="code" data-lang="text"><code>/product/nextProduct
</code></pre>
<p>This endpoint accepts two parameters:</p>
<ul><li><code>currentProductId</code></li><li><code>path</code></li></ul>
<h2>Observation</h2>
<p>By modifying the <code>path</code> parameter to an external URL, the application <strong>redirected the request without validation</strong>.</p>
<p>Example behavior:</p>
<ul><li>Setting <code>path=google.com</code> caused a redirect to Google</li><li>No filtering or hostname validation was applied</li></ul>
<p>This confirms the presence of an <strong>open redirection vulnerability</strong>.</p>
<h2>3. Why Open Redirects Matter for SSRF</h2>
<p>The backend <strong>trusts and follows redirects</strong> when fetching URLs supplied via <code>stockApi</code>.</p>
<p>This enables an attack chain where:</p>
<ul><li><code>stockApi</code> points to a <strong>legitimate internal endpoint</strong></li><li>That endpoint performs a redirect</li><li>The redirect leads to an <strong>internal system</strong></li><li>The backend follows it automatically</li></ul>
<p>This effectively <strong>bypasses SSRF protections</strong>, even if direct internal URLs are restricted.</p>
<h2>4. Confirming Internal Access</h2>
<p>Testing internal IP addresses showed that internal services were reachable and returned <strong>HTTP 200 responses</strong>, confirming:</p>
<ul><li>The backend can access internal systems</li><li>SSRF exploitation is possible</li></ul>
<h2>5. SSRF + Open Redirect Exploitation Chain</h2>
<h2>Final Payload Used</h2>
<pre class="code" data-lang="text"><code>/product/nextProduct%3fcurrentProductId%3d1%26path%3dhttp%3a//192.168.0.12%3a8080/admin/delete?username=carlos
</code></pre>
<h2>How This Works</h2>
<ul><li><code>stockApi</code> is controlled by the attacker</li><li>It calls <code>/product/nextProduct</code></li><li>The <code>path</code> parameter triggers an <strong>open redirect</strong></li><li>The redirect points to an <strong>internal admin endpoint</strong></li><li>The backend follows the redirect and executes the request</li></ul>
<h2>6. Privileged Action Execution</h2>
<p>The redirected request reached the internal admin interface and executed:</p>
<pre class="code" data-lang="text"><code>/admin/delete?username=carlos
</code></pre>
<h2>Result</h2>
<ul><li>The user <strong><code>carlos</code></strong> was deleted successfully</li><li>No authentication was required due to internal trust</li><li>The lab was marked as <strong>solved immediately</strong></li></ul>
<h2>7. Final Result</h2>
<pre class="code" data-lang="text"><code>Action performed:Deleteuser
Targetuser: carlos
Accesslevel:Internaladmin
Lab status: Solved
</code></pre>
<h2>8. Key Takeaways (Attacker Mindset)</h2>
<ul><li>Open redirects turn <strong>low‑impact bugs into critical ones</strong></li><li>SSRF defenses fail if redirect chains are not considered</li><li>Never assume “safe” internal endpoints are harmless</li><li>Always test navigation features for redirect behavior</li><li>SSRF exploitation is about <strong>controlling request flow</strong>, not just URLs</li></ul>
<h2>9. Notes for My Future Self</h2>
<ul><li>If SSRF seems blocked, look for redirect gadgets</li><li>Any parameter named <code>path</code>, <code>next</code>, or <code>url</code> is suspicious</li><li>Backend redirect-following equals attacker-controlled routing</li><li>SSRF vulnerabilities are usually <strong>chains, not single bugs</strong></li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 05 COMPLETE</code></details>
