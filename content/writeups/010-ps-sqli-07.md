---
slug: "ps-sqli-07"
title: "SQL injection UNION attack, determining the number of columns returned by the query"
platform: "PortSwigger"
difficulty: "Medium"
category: ["Web","SQLi"]
date: "2025-12-14"
minutes: 4
visible: true
tldr: "- The vulnerable parameter was the `category` parameter on the product listing page.\n- Normal request:\n    \n    ```\n    category=Pets\n    ```…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 07 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/07-%20SQL%20injection%20UNION%20attack%2C%20determining%20the%20number%20of%20columns%20returned%20by%20the%20query.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was the <strong><code>category</code></strong> parameter on the product listing page.</li><li>Normal request:</li></ul>
<p>``<code> category=Pets </code>``</p>
<p>→ Products displayed normally.</p>
<ul><li>Injecting a <strong>single quote (<code>'</code>)</strong> caused an <strong>Internal Server Error</strong>, indicating:</li><li>User input is embedded directly into an SQL string.</li><li>No proper sanitization or escaping is applied.</li><li>This confirmed a <strong>SQL injection vulnerability</strong>.</li><li>The lab objective was <strong>not</strong> to extract data, but to determine how many columns the backend query returns.</li></ul>
<h2>2. Hypothesis**</h2>
<p>Likely backend query structure:</p>
<pre class="code" data-lang="sql"><code>SELECT column1, column2, column3
FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>Since the input is inside a string literal, breaking it with <code>'</code> causes an error.</li><li>A <code>UNION SELECT</code> can be used <strong>only if</strong>:</li><li>The number of columns in the injected query <strong>matches</strong> the number of columns in the original query.</li><li>If the number of columns does <strong>not</strong> match:</li><li>The database throws an error.</li><li>If the number <strong>does</strong> match:</li><li>The error disappears and the page loads normally.</li></ul>
<p><strong>Goal:</strong></p>
<p>Find the exact number of columns by adjusting the number of <code>NULL</code> values in a <code>UNION SELECT</code>.</p>
<h2>3. Test (Experiments Conducted)**</h2>
<h2>Test 1 — Confirm SQL Injection**</h2>
<p><strong>Payload:</strong></p>
<pre class="code" data-lang="sql"><code>'</code></pre>
<p><strong>Result:</strong></p>
<ul><li>Internal Server Error.</li><li>Confirms SQL injection vulnerability.</li></ul>
<h2>Test 2 — UNION SELECT With Incremental NULLs**</h2>
<p>Started adding <code>NULL</code> values to a <code>UNION SELECT</code> statement.</p>
<p>Why <code>NULL</code>?</p>
<ul><li><code>NULL</code> is compatible with <strong>any datatype</strong>.</li><li>This avoids datatype mismatch errors while testing column count.</li></ul>
<p>Tried payloads like:</p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT NULL--
Pets' UNION SELECT NULL,NULL--</code></pre>
<p>These caused errors → column count still incorrect.</p>
<h2>Test 3 — Successful Column Count Detection**</h2>
<p><strong>Working payload:</strong></p>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT NULL,NULL,NULL--</code></pre>
<p><strong>Result:</strong></p>
<ul><li>Internal Server Error disappeared.</li><li>Page loaded successfully.</li><li>Lab completion animation appeared.</li><li>Screenshot:</li></ul>
<p>&lt;img width="1232" height="301" alt="image" src="https://github.com/user-attachments/assets/18ee563d-a457-4017-9c60-00ea4cc29db4" /&gt;</p>
<p><strong>Conclusion:</strong></p>
<p>&gt; The original query returns 3 columns. &gt;</p>
<p>At this point, the lab was solved.</p>
<h2>4. Final Payload Used**</h2>
<pre class="code" data-lang="sql"><code>Pets' UNION SELECT NULL,NULL,NULL--</code></pre>
<p>✔ Confirms that the backend query returns <strong>three columns</strong>.</p>
<h2>5. Clear Explanation**</h2>
<h2>Why does this work?**</h2>
<ul><li><code>UNION</code> combines the results of two queries.</li><li>SQL requires both queries to have:</li><li>The <strong>same number of columns</strong></li><li>Compatible datatypes in each column position</li><li>When the number of columns is wrong → database error.</li><li>When the number is correct → query executes normally.</li></ul>
<h2>Why use NULL?**</h2>
<ul><li><code>NULL</code> can represent any datatype.</li><li>This avoids worrying about whether a column expects text, numbers, etc.</li><li>It’s the safest way to count columns.</li></ul>
<h2>6. Key Learning**</h2>
<ul><li>Determining column count is a <strong>mandatory step</strong> before any UNION-based SQL injection.</li><li>Two common methods exist:</li><li><code>ORDER BY</code> method</li><li><code>UNION SELECT NULL,NULL,...</code> method (used here)</li><li>Error disappearing = <strong>success signal</strong>.</li><li>Once column count is known, you can:</li><li>Identify which columns accept text</li><li>Replace <code>NULL</code> with real values</li><li>Extract data in later labs</li></ul>
<h2>7. Notes for Future Me**</h2>
<ul><li>Always start with <code>'</code> to confirm SQL injection.</li><li>If the lab mentions UNION:</li><li>Immediately determine column count.</li><li>Use incremental <code>NULL</code> values:</li></ul>
<p>``` NULL NULL,NULL NULL,NULL,NULL</p>
<p>```</p>
<ul><li>When the page loads normally → stop counting.</li><li>Remember:</li></ul>
<p>&gt; Column count must match exactly, or UNION will fail. &gt;</p>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 07 COMPLETE</code></details>
