---
slug: "ps-ssrf-03"
title: "Blind SSRF with out of band detection"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SSRF"]
date: "2026-01-01"
minutes: 4
visible: true
tldr: "blind Server-Side Request Forgery (SSRF) — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SSRF SERIES &middot; LAB 03 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/02-Server%20Side%20Request%20Forgery(SSRF)/03-%20Blind%20SSRF%20with%20out-of-band%20detection.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Identify and confirm a <strong>blind Server-Side Request Forgery (SSRF)</strong> vulnerability where <strong>no response, error, or content change</strong> is visible in the application, using <strong>out-of-band (OAST/DNS) interaction</strong> as the only detection mechanism.</p>
<h2>1. Initial Testing &amp; Input Discovery</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li></ul>
<p>All of them?</p>
<p><strong>Dead. Silent. Useless.</strong> No errors, no behavior change, no indication of SSRF.</p>
<p>Then attention shifted to <strong>HTTP headers</strong>.</p>
<h2>Interesting Header Found</h2>
<ul><li><code>Referer</code></li></ul>
<p>The application reflected <strong>trust</strong> in the <code>Referer</code> header value and forwarded it internally.</p>
<p>That’s a massive red flag — one dev brain-fart away from SSRF hell.</p>
<h2>2. Baseline Behavior</h2>
<h2>Normal Value</h2>
<pre class="code" data-lang="text"><code>Referer: https://&lt;lab-url&gt;
</code></pre>
<h2>Observation</h2>
<ul><li>Page behavior remained normal</li><li>No errors</li><li>No visible backend interaction</li></ul>
<p>At this point, <strong>any SSRF here would be blind as fuck</strong> — no UI signal at all.</p>
<h2>3. Testing for Blind SSRF (Out-of-Band)</h2>
<p>Since <strong>no visible feedback</strong> existed, the only sane approach was <strong>out-of-band detection</strong>.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="text"><code>Referer: http://&lt;your-burp-collaborator-subdomain&gt;
</code></pre>
<h2>Result</h2>
<ul><li><strong>DNS interaction received in Burp Collaborator</strong></li><li>Source: backend server / lab infrastructure</li><li>Application response: <strong>unchanged</strong></li></ul>
<p>This confirms:</p>
<ul><li>The backend <strong>made a request</strong></li><li>The request was <strong>server-side</strong></li><li>The app gave <strong>zero feedback</strong></li></ul>
<p>Classic blind SSRF. Quiet. Dangerous. Easy to miss. Fucking lethal.</p>
<h2>4. Why This Is Blind SSRF</h2>
<p>This vulnerability is classified as <strong>blind SSRF</strong> because:</p>
<ul><li>No response data is reflected</li><li>No errors are shown</li><li>No timing difference is visible</li><li>The page behaves exactly the same</li></ul>
<p>The <strong>only proof</strong> of exploitation is:</p>
<p>&gt; An out-of-band DNS interaction triggered by the backend &gt;</p>
<p>Without OAST, this SSRF would look completely nonexistent — which is exactly why defenders miss it and attackers love it.</p>
<h2>5. Attacker Mindset (This Is the Important Part)</h2>
<p>This lab teaches a brutal lesson most beginners don’t fucking get:</p>
<ul><li><strong>No response does NOT mean no vulnerability</strong></li><li>Silence often means <strong>blind execution</strong></li><li>Headers are not “metadata” — they’re attack surfaces</li><li>If input reaches a backend fetch function, <strong>SSRF is always on the table</strong></li></ul>
<p>Blind SSRF is about <strong>thinking beyond the browser</strong>.</p>
<p>If the app doesn’t talk back, you make the <strong>server talk to you</strong> instead.</p>
<h2>6. Why Burp Collaborator Matters</h2>
<p>Burp Collaborator enables detection of vulnerabilities that are:</p>
<ul><li>Blind</li><li>Asynchronous</li><li>Non-deterministic</li><li>Invisible in HTTP responses</li></ul>
<p>In real applications, blind SSRF is often used to:</p>
<ul><li>Scan internal networks</li><li>Hit metadata services</li><li>Interact with cloud APIs</li><li>Pivot deeper without raising alarms</li></ul>
<p>This lab stops at detection — but in the real world, this is where shit actually gets scary as fuck.</p>
<h2>7. Final Result</h2>
<ul><li>Backend server performed a DNS lookup to attacker-controlled domain</li><li>SSRF confirmed via out-of-band interaction</li><li>Lab marked as <strong>solved</strong></li></ul>
<h2>8. Notes for My Future Self</h2>
<ul><li>Blind SSRF exists even when everything “looks fine”</li><li>Headers are first-class attack vectors</li><li>OAST is mandatory for modern SSRF testing</li><li>If you don’t get feedback, <strong>force the server to leak existence</strong></li><li>Remember to test the functionality that have url in it somehow.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SSRF SERIES :: LAB 03 COMPLETE</code></details>
