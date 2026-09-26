---
slug: "ps-ssrf-01"
title: "Basic SSRF against the local server"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SSRF"]
date: "2025-12-28"
minutes: 4
visible: true
tldr: "Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 01 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/01-%20Basic%20SSRF%20against%20the%20local%20server.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>Server-Side Request Forgery (SSRF)</strong> vulnerability to access an <strong>internal admin interface</strong> running on the local server and perform an <strong>unauthorized administrative action</strong>.</p>
<h2>1. Initial Recon &amp; Functionality Analysis</h2>
<h2>Application Context</h2>
<p>The lab simulates an <strong>e-commerce website</strong> where users can browse products and check their availability before purchasing.</p>
<h2>Stock Check Functionality</h2>
<p>Each product includes a <strong>“Check stock”</strong> button.</p>
<p>Clicking this button triggers a backend request to an internal stock-checking service.</p>
<p>This functionality immediately stands out as a potential SSRF vector because:</p>
<ul><li>The server fetches a URL on behalf of the user</li><li>The destination appears to be configurable via user-controlled input</li></ul>
<h2>2. Identifying the SSRF Injection Point</h2>
<h2>Vulnerable Parameter</h2>
<ul><li><strong>Parameter:</strong> <code>stockApi</code></li><li><strong>Location:</strong> HTTP POST body</li><li><strong>Request Type:</strong> Sent when checking product stock</li></ul>
<h2>Normal Parameter Value</h2>
<pre class="code" data-lang="markdown"><code>http://stock.weliketoshop.net:8080/product/stock/check?productId=1&amp;storeId=1</code></pre>
<h2>Key Observation</h2>
<ul><li>The parameter contains a <strong>full URL</strong></li><li>This indicates the backend server makes an <strong>HTTP request to the supplied address</strong></li><li>No validation appears to restrict internal destinations</li></ul>
<p>This confirms <code>stockApi</code> as a <strong>classic SSRF sink</strong>.</p>
<h2>3. Confirming SSRF by Targeting Localhost</h2>
<h2>Test Payload</h2>
<p>The hostname in the <code>stockApi</code> parameter was modified to point to the local server:</p>
<pre class="code" data-lang="text"><code>http://localhost</code></pre>
<h2>Result</h2>
<ul><li>The response returned an <strong>internal admin panel</strong></li><li>This confirms:</li><li>The backend server is issuing the request</li><li>Requests to <code>localhost</code> are allowed</li><li>Internal services are exposed through SSRF</li></ul>
<p>At this point, SSRF is <strong>fully confirmed</strong>.</p>
<h2>4. Understanding the Impact</h2>
<h2>Why This Works</h2>
<ul><li>The application trusts user-supplied URLs</li><li>The backend server has access to internal services</li><li><code>localhost</code> resolves to the server itself</li><li>No allowlist or hostname validation is enforced</li></ul>
<p>This allows an attacker to:</p>
<ul><li>Access internal admin interfaces</li><li>Interact with privileged endpoints</li><li>Perform sensitive actions</li></ul>
<h2>5. Exploiting the Admin Interface</h2>
<h2>Discovered Admin Endpoint</h2>
<p>The internal admin panel exposed a user management endpoint.</p>
<h2>Exploit Request</h2>
<pre class="code" data-lang="text"><code>http://localhost/admin/delete?username=carlos</code></pre>
<h2>Result</h2>
<ul><li>The user <strong>carlos</strong> was deleted successfully</li><li>No authentication was required</li><li>Action executed with <strong>server-level privileges</strong></li></ul>
<h2>6. Final Result</h2>
<ul><li>Internal admin interface accessed via SSRF</li><li>Administrative action performed successfully</li><li>Target user deleted</li><li>Lab marked as <strong>Solved</strong></li><li>Screenshot:</li><li>&lt;img width="1173" height="191" alt="image" src="https://github.com/user-attachments/assets/8d1a1823-ad01-47f9-b3da-ce64688ccbc5" /&gt;</li></ul>
<h2>7. Key Takeaways</h2>
<h2>SSRF Testing Mindset</h2>
<ul><li>Any feature that fetches a URL is a potential SSRF</li><li>Always test:</li><li><code>localhost</code></li><li><code>127.0.0.1</code></li><li>Internal hostnames</li><li>Different ports</li><li>SSRF often leads to:</li><li>Admin panels</li><li>Metadata services</li><li>Internal APIs</li></ul>
<h2>Why SSRF Is Dangerous</h2>
<ul><li>Bypasses network segmentation</li><li>Turns the server into an internal proxy</li><li>Often leads directly to <strong>full compromise</strong></li></ul>
<h2>8. Notes for My Future Self</h2>
<ul><li>Stock checkers are SSRF magnets</li><li>Full URLs in parameters are a red flag</li><li>Always try <code>localhost</code> first</li><li>SSRF impact depends on <strong>what the server can reach</strong></li><li>Internal admin panels are common and often unprotected</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 01 COMPLETE</code></details>
