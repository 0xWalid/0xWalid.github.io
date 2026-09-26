---
slug: "ps-sqli-10"
title: "SQL injection UNION attack, retrieving multiple values in a single column"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-16"
minutes: 4
visible: true
tldr: "- The vulnerable parameter was `category` in the product filtering functionality.\n- Supplying normal category values such as `Gifts` returned valid pr…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 10 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/10-%20%20SQL%20injection%20UNION%20attack%2C%20retrieving%20multiple%20values%20in%20a%20single%20column.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was <strong><code>category</code></strong> in the product filtering functionality.</li><li>Supplying normal category values such as <code>Gifts</code> returned valid product listings.</li><li>Injecting a <strong>single quote (<code>'</code>)</strong> altered application behavior, confirming that:</li><li>User input is concatenated into a SQL query</li><li>The input is placed inside a <strong>quoted string context</strong></li><li>Previous UNION-based testing confirmed:</li><li>The query returns <strong>2 columns</strong></li><li>The <strong>second column</strong> accepts <strong>string data</strong></li><li>The lab explicitly stated:</li><li>The target table is <strong><code>users</code></strong></li><li>The goal is to retrieve the <strong>administrator</strong> credentials</li><li>Only <strong>one column</strong> of the UNION result is rendered in the response, requiring multiple values to be combined into a single column.</li></ul>
<h2>2. Hypothesis**</h2>
<p>Likely backend query structure:</p>
<pre class="code" data-lang="sql"><code>SELECT col1, col2
FROM products
WHERE category='&lt;user_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>UNION injection is possible due to lack of input sanitization.</li><li>Since only one column is reflected in the response:</li><li>Username and password must be <strong>concatenated into a single string</strong></li><li>The database uses <strong>Oracle-style concatenation</strong>, which relies on:</li><li>The <code>||</code> operator for combining strings</li></ul>
<p><strong>Goal:</strong></p>
<p>Combine <code>username</code> and <code>password</code> into one output column and retrieve administrator credentials.</p>
<h2>3. Tests (Experiments Conducted)**</h2>
<h2>Test 1 — Confirm column count**</h2>
<p>Payload used:</p>
<pre class="code" data-lang="sql"><code>'UNION SELECT NULL,NULL--</code></pre>
<ul><li>Result: No error</li><li>Conclusion: The query returns <strong>2 columns</strong></li></ul>
<h2>Test 2 — Identify string-compatible column**</h2>
<p>Earlier testing confirmed:</p>
<ul><li>The <strong>second column</strong> accepts string data</li><li>This column will be used to display concatenated output</li></ul>
<h2>Test 3 — Retrieve multiple values in a single column**</h2>
<p>Payload used:</p>
<pre class="code" data-lang="sql"><code>Gifts' UNION SELECT NULL, username||'+'||password FROM users--</code></pre>
<p>Explanation:</p>
<ul><li><code>username||'+'||password</code> concatenates:</li><li>Username</li><li>A visible separator (<code>+</code>)</li><li>Password</li><li><code>NULL</code> is used in the first column to maintain column count compatibility</li><li>Oracle’s <code>||</code> operator ensures proper string concatenation</li></ul>
<h2>4. Result**</h2>
<ul><li>The application returned a combined string containing: <strong><code>administrator 2mxdy1qfh55wrln6nu4s</code></strong></li><li>The <strong>administrator username</strong></li><li>The <strong>administrator password</strong></li><li>The lab validated successful exploitation and was marked as <strong>solved</strong></li><li>Screenshot</li></ul>
<p>&lt;img width="1234" height="551" alt="image" src="https://github.com/user-attachments/assets/6ecfbfdd-b8b0-46dd-8536-c3febb7264fc" /&gt;</p>
<h2>5. Learning (Core Concept)**</h2>
<p>This lab teaches an essential real-world technique:</p>
<ul><li>When only <strong>one column is reflected</strong>, you must:</li><li>Combine multiple fields into a <strong>single output string</strong></li><li>Key points:</li><li>Column count must match exactly</li><li>Datatypes must be compatible</li><li>Database-specific concatenation syntax matters</li></ul>
<p>Common concatenation syntax:</p>
<ul><li><strong>Oracle / PostgreSQL:</strong> <code>column1 || column2</code></li><li><strong>MySQL:</strong> <code>CONCAT(column1, column2)</code></li></ul>
<p>Understanding this avoids trial-and-error guessing and enables efficient exploitation.</p>
<h2>6. Future Notes (Quick Recall Guide)**</h2>
<p>When facing similar labs or real-world targets:</p>
<ul><li>Identify reflected columns</li><li>Confirm which column accepts strings</li><li>If only one column is visible:</li><li>Concatenate required values into that column</li><li>Use correct DBMS syntax:</li><li>Oracle → <code>||</code></li><li>MySQL → <code>CONCAT()</code></li><li>Add a clear separator between values for readability</li><li>Verify results in the application response</li></ul>
<h2>7. Notes for My Future Self**</h2>
<ul><li>Always adapt concatenation syntax to the database type</li><li>If output is limited, combine values — don’t force multiple columns</li><li><code>NULL</code> is useful for padding unused columns</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 10 COMPLETE</code></details>
