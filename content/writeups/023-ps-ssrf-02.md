---
slug: "ps-ssrf-02"
title: "Basic SSRF against another back end system"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SSRF"]
date: "2025-12-29"
minutes: 4
visible: true
tldr: "Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 02 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/02-Basic%20SSRF%20against%20another%20back-end%20system.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>Server-Side Request Forgery (SSRF)</strong> vulnerability to access an <strong>internal back-end system hosted on a private IP address</strong>, then perform an <strong>unauthorized administrative action</strong>.</p>
<h2>1. Initial Recon &amp; Functionality Analysis</h2>
<h2>Application Context</h2>
<p>The application is an <strong>e-commerce platform</strong> that allows users to browse products and check stock availability before purchasing.</p>
<h2>Stock Check Functionality</h2>
<p>Each product includes a <strong>“Check stock”</strong> button that triggers a backend request to a stock-checking service.</p>
<p>This functionality is a common SSRF target because:</p>
<ul><li>The server fetches a URL on behalf of the user</li><li>The destination is controlled via user input</li></ul>
<h2>2. Identifying the SSRF Injection Point</h2>
<h2>Vulnerable Parameter</h2>
<ul><li><strong>Parameter:</strong> <code>stockApi</code></li><li><strong>Location:</strong> HTTP POST body</li><li><strong>Triggered by:</strong> Clicking “Check stock”</li></ul>
<h2>Normal Parameter Value</h2>
<pre class="code" data-lang="text"><code>http://stock.weliketoshop.net:8080/product/stock/check?productId=1&amp;storeId=1
</code></pre>
<h2>Key Observation</h2>
<ul><li>The parameter contains a <strong>full URL</strong></li><li>This confirms the backend server makes an HTTP request to the supplied address</li><li>No validation restricts access to internal destinations</li></ul>
<p>This confirms <code>stockApi</code> as an <strong>SSRF sink</strong>.</p>
<h2>3. Why Localhost Was Not Enough</h2>
<p>Unlike the previous lab:</p>
<ul><li>Accessing <code>localhost</code> did <strong>not</strong> expose the admin interface</li><li>This indicates the admin panel is hosted on a <strong>different internal system</strong>, not the same server</li></ul>
<p>This shifts the attacker mindset from:</p>
<p>&gt; “Attack the same server” &gt;</p>
<p>to:</p>
<p>&gt; “Enumerate the internal network” &gt;</p>
<h2>4. Internal Network Enumeration via SSRF</h2>
<h2>Strategy</h2>
<p>Use SSRF to:</p>
<ul><li>Target <strong>private IP ranges</strong></li><li>Identify reachable internal services</li><li>Discover administrative interfaces</li></ul>
<h2>Private IP Range Tested</h2>
<pre class="code" data-lang="text"><code>192.168.0.1-255
</code></pre>
<h2>Discovered Internal System and deleted carlos user</h2>
<pre class="code" data-lang="text"><code>http://192.168.0.160:8080/admin/delete?username=carlos
</code></pre>
<h2>Result</h2>
<ul><li>The admin interface was accessible</li><li>No authentication was required</li><li>Confirms successful <strong>cross-system SSRF</strong></li><li>&lt;img width="1188" height="199" alt="image" src="https://github.com/user-attachments/assets/e3c748f8-475a-4d75-8d3b-167ee0e1849b" /&gt;</li></ul>
<h2>5. Exploiting the Internal Admin Interface</h2>
<h2>Discovered Endpoint</h2>
<p>The internal admin panel exposed a user management function.</p>
<h2>Exploit Request</h2>
<pre class="code" data-lang="text"><code>http://192.168.0.160:8080/admin/delete?username=carlos
</code></pre>
<h2>Result</h2>
<ul><li>The user <strong>carlos</strong> was deleted successfully</li><li>The request executed with <strong>internal system privileges</strong></li><li>No authentication or authorization checks were enforced</li></ul>
<h2>6. Final Result</h2>
<ul><li>SSRF used to access a <strong>different back-end system</strong></li><li>Internal admin panel discovered via IP enumeration</li><li>Administrative action performed successfully</li><li>Lab marked as <strong>Solved</strong></li></ul>
<h2>7. Key Takeaways</h2>
<h2>SSRF Testing Mindset</h2>
<ul><li>SSRF is not limited to <code>localhost</code></li><li>Always enumerate:</li><li>Private IP ranges</li><li>Different ports</li><li>Adjacent internal systems</li><li>SSRF often acts as a <strong>bridge between network segments</strong></li></ul>
<h2>Why This Lab Matters</h2>
<ul><li>Demonstrates lateral movement via SSRF</li><li>Shows how one vulnerable feature can expose an entire internal network</li><li>Highlights the danger of trusting backend-to-backend traffic</li></ul>
<h2>8. Notes for My Future Self</h2>
<ul><li>Stock-check APIs are prime SSRF targets</li><li>If localhost fails, enumerate internal IPs</li><li>Admin panels are often hosted on separate systems</li><li>SSRF impact depends on <strong>what the server can reach</strong></li><li>Network isolation alone is not a defense</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 02 COMPLETE</code></details>
