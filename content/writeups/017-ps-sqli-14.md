---
slug: "ps-sqli-14"
title: "Lab: Blind SQL injection with time delays"
platform: "PortSwigger"
difficulty: "Hard"
category: ["Web","SQLi"]
date: "2025-12-23"
minutes: 4
visible: true
tldr: "blind SQL injection vulnerability using time delays — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 14 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/14-%20Lab%3A%20Blind%20SQL%20injection%20with%20time%20delays.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>blind SQL injection vulnerability using time delays</strong> to confirm SQL injection by triggering a <strong>measurable delay in server response</strong>, without retrieving any database information.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li><li>POST parameters</li><li>Cookie parameters</li></ul>
<p>All parameters were tested with a single quote (<code>'</code>) and <strong>no abnormal behavior</strong> was observed.</p>
<h2>Cookie-Based Testing</h2>
<p>While inspecting the HTTP request, a cookie parameter named <strong><code>TrackingId</code></strong> was identified.</p>
<h2>Observation</h2>
<ul><li>Normal <code>TrackingId</code> → Application behaves normally</li><li>Adding a single quote (<code>'</code>) → <strong>No visible change</strong></li><li>No error messages</li><li>No content differences</li></ul>
<p>At this point, both <strong>error-based</strong> and <strong>boolean-based</strong> SQL injection appeared unavailable.</p>
<h2>IMPORTANT — Mindset Shift</h2>
<p>&gt; When an application shows no errors and no content differences, it does not mean SQL injection is impossible. &gt;</p>
<p>This is the correct moment to switch from:</p>
<ul><li>*Output-based thinking*</li></ul>
<p>to:</p>
<ul><li>*Side-channel thinking*</li></ul>
<p><strong>Time is still observable.</strong></p>
<p>This mindset allows detection of SQL injection even when the application appears completely silent.</p>
<h2>2. Switching to Time-Based Blind SQL Injection</h2>
<p>Since no visible feedback was available, a <strong>time-delay payload</strong> was used to determine whether injected SQL was still executed by the backend.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>'|| pg_sleep(10)--
</code></pre>
<h2>Injection Point</h2>
<pre class="code" data-lang="text"><code>Cookie: TrackingId=&lt;value&gt;'||pg_sleep(10)--
</code></pre>
<h2>3. Confirming Time Delay Execution</h2>
<h2>Result</h2>
<ul><li>The server response was delayed by approximately <strong>10 seconds</strong></li><li>The delay was <strong>consistent and repeatable</strong></li><li>Page content remained <strong>exactly the same</strong></li><li>No error messages were displayed</li></ul>
<p>This confirms:</p>
<ul><li>User input is executed within a SQL query</li><li>The database supports <code>pg_sleep()</code> (PostgreSQL)</li><li>The application is vulnerable to <strong>blind SQL injection using time delays</strong></li></ul>
<h2>4. Why This Is Blind SQL Injection</h2>
<p>In this lab:</p>
<ul><li>No SQL errors are displayed</li><li>No query output is reflected</li><li>No boolean differences are observable</li></ul>
<p>The <strong>only feedback channel</strong> is <strong>response time</strong>.</p>
<p>Therefore:</p>
<ul><li><code>UNION SELECT</code> is useless</li><li>Error-based SQLi is impossible</li><li>Conditional logic is unnecessary for this lab</li></ul>
<p>A <strong>simple, unconditional delay</strong> is sufficient to confirm exploitation.</p>
<h2>5. Lab Completion Condition</h2>
<p>Unlike information-retrieval labs, this lab requires only:</p>
<ul><li>Proof that attacker-controlled SQL can trigger a <strong>measurable delay</strong></li></ul>
<p>Once the 10-second delay was confirmed:</p>
<ul><li>The lab was <strong>immediately marked as solved</strong></li><li>No further exploitation was required</li></ul>
<h2>6. Final Result</h2>
<ul><li>SQL injection confirmed via time delay</li><li>No data extraction required</li><li>Lab marked as <strong>Solved</strong></li><li>Screenshot:</li><li>&lt;img width="1234" height="216" alt="image" src="https://github.com/user-attachments/assets/c7b90587-0bc0-43b9-b4ac-d905032a51e2" /&gt;</li></ul>
<h2>7. Future Testing Notes (Important)</h2>
<h2>When Testing SQL Injection:</h2>
<ul><li>Always test <strong>all inputs</strong>:</li><li>URL parameters</li><li>POST data</li><li>Cookies</li><li>Headers</li><li>If:</li><li>No errors</li><li>No output differences</li></ul>
<p>→ <strong>Immediately test time delays</strong></p>
<ul><li>Time-based SQLi is useful when:</li><li>Errors are suppressed</li><li>Responses are static</li><li>Even a <strong>single confirmed delay</strong> is a valid vulnerability</li></ul>
<h2>8. Notes for My Future Self</h2>
<ul><li>Silence does not equal security</li><li>Time is a reliable side channel</li><li>Cookies are common blind SQLi entry points</li><li>Not all labs require data extraction</li><li>Confirming execution is sometimes enough</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 14 COMPLETE</code></details>
