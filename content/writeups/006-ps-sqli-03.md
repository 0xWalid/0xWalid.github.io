---
slug: "ps-sqli-03"
title: "Oracle SQL Injection – Extracting Database Type & Version (UNION‑Based Enumeration)"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-09"
minutes: 4
visible: true
tldr: "---…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 03 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/03-%20SQL%20injection%20attack%2C%20querying%20the%20database%20type%20and%20version%20on%20Oracle.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was located in the <strong>category</strong> field of a product listing endpoint.</li><li>Supplying a normal category value loaded items as expected.</li><li>Injecting a <strong>single quote (' )</strong> triggered an <strong>Internal Server Error</strong>:</li><li>This is a strong indicator that the input is inserted inside a SQL string literal.</li><li>This behavior suggested:</li><li>User input is directly concatenated into an SQL query.</li><li>The application does not sanitize or parameterize the category value.</li></ul>
<h2>2. Hypothesis**</h2>
<p>The backend query likely resembles something like:</p>
<pre class="code" data-lang="sql"><code>SELECT * FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>A single quote breaks the query</li><li>To extract database details, a <strong>UNION-based injection</strong> can be used.</li><li>Tried to get data with but didn't worked , then used SQL cheat sheet from Portwiggers and oracle syntax worked, that indicated underlying DB is oracle.</li></ul>
<p>Because Oracle requires a FROM clause when selecting static data, the payload must use:</p>
<pre class="code" data-lang="sql"><code>FROM dual</code></pre>
<p><strong>Hypothesis:</strong></p>
<p>If we identify the correct number of columns and at least one column accepting text, we can inject:</p>
<pre class="code" data-lang="sql"><code>UNION SELECT banner, NULL FROM v$version--</code></pre>
<p>…to retrieve Oracle version information.</p>
<h2>3. Test (Experiments Conducted)**</h2>
<h2>Test 1 — Injection Detection**</h2>
<ul><li><strong>Input:</strong> <code>'</code></li><li><strong>Actual:</strong> Internal Server Error</li><li><strong>Interpretation:</strong> Confirmed SQL injection vulnerability; Oracle syntax break.</li></ul>
<h2>Test 2 — Column Count Discovery**</h2>
<p>Tried successive payloads:</p>
<pre class="code" data-lang="sql"><code>' UNION SELECT NULL FROM dual--</code></pre>
<p>→ Error</p>
<pre class="code" data-lang="sql"><code>' UNION SELECT NULL, NULL FROM dual--
</code></pre>
<p>→ Page loaded successfully</p>
<p><strong>Interpretation:</strong> Query expects <strong>2 columns</strong>.</p>
<h2>Test 3 — Datatype Identification**</h2>
<p>Tested string acceptance:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT 'a','b' FROM dual--</code></pre>
<ul><li><strong>Actual:</strong> Page rendered correctly</li><li><strong>Interpretation:</strong></li><li>Both columns accept <strong>text data</strong></li><li>UNION-based extraction can proceed with string-returning system views.</li></ul>
<h2>Test 4 — Version Extraction Attempt**</h2>
<p>Payload used:</p>
<pre class="code" data-lang="sql"><code>' UNION SELECT banner, NULL FROM v$version--</code></pre>
<ul><li><strong>Actual:</strong> Page displayed version information.</li><li><strong>Interpretation:</strong> Successfully enumerated Oracle DB type &amp; version.</li></ul>
<h2>4. Result**</h2>
<h2>Payload Used**</h2>
<pre class="code" data-lang="sql"><code>' UNION SELECT banner, NULL FROM v$version--</code></pre>
<h2>Extracted Information**</h2>
<p>The server returned:</p>
<pre class="code" data-lang="text"><code>CORE 11.2.0.2.0 Production
NLSRTL Version 11.2.0.2.0 - Production
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production
PL/SQL Release 11.2.0.2.0 - Production
TNS for Linux: Version 11.2.0.2.0 - Production
</code></pre>
<h2>Proof of Lab Completion**</h2>
<ul><li>Version banners displayed directly in the application response.</li><li>This confirmed:</li><li>DBMS is <strong>Oracle 11g</strong></li><li>UNION-based SQL injection fully exploitable.</li><li>Screenshot</li></ul>
<p>&lt;img width="1185" height="653" alt="image" src="https://github.com/user-attachments/assets/7061f899-0196-4fa5-ae68-ea13c5c3a29b" /&gt;</p>
<h2>5. Learning (Deep Reasoning)**</h2>
<ul><li>Oracle <strong>requires strict column count &amp; datatype matching</strong>; understanding this is essential for crafting valid payloads.</li><li>Oracle queries cannot <code>SELECT 'a', 'b'</code> without a table, hence the need for <code>FROM dual</code>.</li><li><code>v$version</code> is one of Oracle’s most informative metadata views for version extraction.</li><li>Column count discovery is the foundational step in UNION SQLi:</li><li>Too few columns → syntax error</li><li>Too many columns → syntax error</li><li>Wrong types → datatype error</li><li>Learning to distinguish these Oracle error patterns is key to fast exploitation and enumeration.</li></ul>
<h2>6. Future Pattern Detection**</h2>
<p>Similar behavior indicates high chance of Oracle SQL injection:</p>
<ul><li><code>'</code> produces an <strong>Internal Server Error</strong> instead of safe handling.</li><li>Application echoes metadata or behaves differently depending on column type.</li><li>UNION SELECT requires <code>FROM dual</code>.</li><li>Presence of Oracle‑specific backend quirks (case sensitivity, datatype strictness).</li></ul>
<p>These patterns help predict Oracle backend + SQLi before payloading.</p>
<h2>7. Notes for My Future Self**</h2>
<ul><li>Always test <code>'</code> → quickest SQLi detector.</li><li>Oracle needs <strong>dual</strong> for static selects.</li><li><code>v$version</code> is the fastest path for version enumeration.</li><li>Column count discovery is mandatory before any Oracle UNION injection.</li><li>Datatype mismatches are your biggest Oracle enemy; probe carefully.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 03 COMPLETE</code></details>
