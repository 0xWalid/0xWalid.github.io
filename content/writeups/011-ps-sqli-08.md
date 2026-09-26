---
slug: "ps-sqli-08"
title: "SQL injection UNION attack, finding a column containing text"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-14"
minutes: 4
visible: true
tldr: "- The vulnerable parameter was `category` in the product filtering feature.\n- Normal values such as `Accessories` loaded products correctly.\n- Injecti…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 08 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/08-%20SQL%20injection%20UNION%20attack%2C%20finding%20a%20column%20containing%20text.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was <strong><code>category</code></strong> in the product filtering feature.</li><li>Normal values such as <code>Accessories</code> loaded products correctly.</li><li>Injecting a <strong>single quote (<code>'</code>)</strong> caused abnormal behavior, confirming:</li><li>User input is embedded inside a quoted SQL string.</li><li>No proper sanitization or escaping is applied.</li><li>This lab did <strong>not</strong> require extracting data from tables.</li><li>The objective was to identify <strong>which column can render text</strong> in a UNION query.</li></ul>
<h2>2. Hypothesis**</h2>
<p>Likely backend query structure:</p>
<pre class="code" data-lang="sql"><code>SELECT col1, col2, col3
FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p><strong>Reasoning:</strong></p>
<ul><li>UNION-based SQL injection requires:</li><li>The <strong>exact number of columns</strong></li><li><strong>Datatype compatibility</strong> across each column</li><li>Therefore:</li><li>Each column must be tested individually with a string literal.</li><li>The column that executes without error is the one that accepts text.</li></ul>
<p><strong>Goal:</strong> Identify the string-compatible column and inject the lab-provided string.</p>
<h2>3. Tests (Experiments Conducted)**</h2>
<h2>Test 1 — Confirm column count**</h2>
<p>After basic testing, a UNION query with <strong>three columns</strong> executed without errors.</p>
<p><strong>Conclusion:</strong></p>
<p>✅ The original query returns <strong>3 columns</strong>.</p>
<h2>Test 2 — Identify the text-accepting column**</h2>
<p><strong>Payload used:</strong></p>
<pre class="code" data-lang="sql"><code>Accessories' UNION SELECT NULL,'a',NULL--
</code></pre>
<p><strong>Why this works:</strong></p>
<ul><li><code>NULL</code> is datatype-agnostic in Oracle.</li><li><code>'a'</code> is a string literal.</li><li>Placing the string in the <strong>second column</strong> caused no error.</li></ul>
<p><strong>Conclusion:</strong></p>
<p>🧠 <strong>Column 2 accepts string data</strong></p>
<p>This is the key insight required to solve the lab.</p>
<h2>Test 3 — Inject the required string**</h2>
<p>The lab required displaying the following string:</p>
<pre class="code" data-lang="text"><code>27o7HVGK
</code></pre>
<p><strong>Final payload:</strong></p>
<pre class="code" data-lang="sql"><code>Accessories' UNION SELECT NULL,'27o7HVGK',NULL--
</code></pre>
<p><strong>Result:</strong></p>
<ul><li>Query executed successfully.</li><li>Application accepted the payload.</li><li>The lab displayed the <strong>“Lab Solved”</strong> animation.</li><li>Screenshot</li></ul>
<p>&lt;img width="1275" height="258" alt="image" src="https://github.com/user-attachments/assets/7f3a0063-a5d4-43e4-9c56-31a91ad685b0" /&gt;</p>
<h2>4. Result**</h2>
<h2>Final Working Payload**</h2>
<pre class="code" data-lang="sql"><code>Accessories' UNION SELECT NULL,'27o7HVGK',NULL--
</code></pre>
<h2>Confirmed Facts**</h2>
<ul><li>Vulnerable parameter: <code>category</code></li><li>Total columns: <strong>3</strong></li><li>Text-compatible column: <strong>2</strong></li><li>No data extraction required</li><li>Lab solved via successful UNION execution</li></ul>
<h2>5. Learning (Reference When Feeling Lost)**</h2>
<p>This lab focuses on <strong>datatype reasoning</strong>, not data extraction.</p>
<p><strong>Key takeaways:</strong></p>
<ul><li>UNION-based SQL injection always requires:</li><li>Correct column count</li><li>Correct datatype placement</li><li>Strings must be placed in string-compatible columns</li><li>Numeric columns reject string input</li><li><code>NULL</code> is extremely useful:</li><li>It can safely fill columns when the datatype is unknown</li><li>The purpose of this lab is <strong>column discovery</strong>, not exploitation.</li></ul>
<p><strong>Mental shortcut:</strong></p>
<p>&gt; If a string does not cause an error in a column, that column accepts text. &gt;</p>
<h2>6. Future Notes**</h2>
<p>When solving <strong>“find a column containing text”</strong> labs:</p>
<ul><li>Always determine the column count first.</li><li>Use <code>NULL</code> in all columns except one.</li><li>Rotate the string literal through each column:</li><li><code>NULL,'a',NULL</code></li><li><code>'a',NULL,NULL</code></li><li><code>NULL,NULL,'a'</code></li><li>The column that does not error is the string-compatible column.</li><li>Replace <code>'a'</code> with the required lab string.</li><li>Avoid overcomplicating the process.</li></ul>
<h2>7. Notes for My Future Self**</h2>
<ul><li><code>NULL</code> is a safe placeholder during UNION testing.</li><li>Test one column at a time.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 08 COMPLETE</code></details>
