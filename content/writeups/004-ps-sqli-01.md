---
slug: "ps-sqli-01"
title: "SQL Injection in WHERE Clause (Retrieve Hidden Data)"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-09"
minutes: 4
visible: true
tldr: "A boolean‑based SQL injection vulnerability inside the `category` parameter allowed retrieval of products normally hidden from the user.…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 01 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/01-%20SQL%20injection%20vulnerability%20in%20WHERE%20clause%20allowing%20retrieval%20of%20hidden%20data.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>A boolean‑based SQL injection vulnerability inside the <code>category</code> parameter allowed retrieval of products normally hidden from the user.</p>
<h2>1. Observation</h2>
<ul><li>The page displayed products based on the <code>category</code> parameter in the URL:</li></ul>
<p>/filter?category=gift</p>
<ul><li>Changing the value to numeric value changed the list of items shown.</li><li>Entering a <strong>double quote (")</strong> reflected normally on the page.</li><li>Entering a <strong>single quote (')</strong> caused an <strong>internal server error</strong>, breaking the SQL query.</li><li>This proved the input was directly used in a backend SQL statement without sanitization.</li><li>The parameter’s behaviour strongly suggested a backend LIKE/WHERE query selecting products by category.</li></ul>
<h2>2. Hypothesis</h2>
<ul><li>The backend likely uses a query similar to:</li></ul>
<pre class="code" data-lang="sql"><code>SELECT * FROM products WHERE category = '&lt;user_input&gt;';</code></pre>
<p>Because the page changed output based on input AND broke on <code>'</code>, it meant:</p>
<ul><li>User input is inserted inside quotes.</li><li>The query is not parameterized.</li><li>The WHERE clause can be manipulated using boolean logic.</li></ul>
<p>Therefore, injecting <code>' OR 1=1--</code> should return all products, including hidden ones.</p>
<p><strong>Hypothesis:</strong> The category parameter is vulnerable to boolean‑based SQL injection that can force the query to always return true.</p>
<h2>3. Test (Experiments Conducted)</h2>
<h2>Test 1 — Reflection + Behavior**</h2>
<ul><li><strong>Input:</strong> <code>1</code></li><li><strong>Expected:</strong> Category mismatch or empty results.</li><li><strong>Actual:</strong> Products Disappeared.</li><li><strong>Interpretation:</strong> Parameter influences SQL filtering.</li></ul>
<h2>Test 2 — Double Quote**</h2>
<ul><li><strong>Input:</strong> <code>"</code></li><li><strong>Expected:</strong> Possible break.</li><li><strong>Actual:</strong> Reflected safely.</li><li><strong>Interpretation:</strong> Backend treats input loosely; no strict typing.</li></ul>
<h2>Test 3 — Single Quote**</h2>
<ul><li><strong>Input:</strong> <code>'</code></li><li><strong>Expected:</strong> Query break.</li><li><strong>Actual:</strong> Internal server error.</li><li><strong>Interpretation:</strong> Confirms the input is injected inside an SQL string.</li></ul>
<h2>Test 4 — Boolean Injection**</h2>
<ul><li><strong>Input:</strong></li></ul>
<p>``<code>sql '+OR+1=1-- </code>``</p>
<ul><li><strong>Expected:</strong> Return all products.</li><li><strong>Actual:</strong> Hidden products appeared.</li><li><strong>Interpretation:</strong> Query successfully bypassed filtering.</li></ul>
<h2>4. Result</h2>
<h2>Payload Used**</h2>
<pre class="code" data-lang="sql"><code>'+OR+1=1--</code></pre>
<h2>What Happened**</h2>
<ul><li>The injected OR condition (<code>1=1</code>) forced the WHERE clause to always evaluate to true.</li><li>The <code>-</code> comment truncated the rest of the backend SQL.</li><li>The page now listed <strong>all products</strong>, including ones normally hidden.</li></ul>
<h2>Proof of Lab Completion</h2>
<ul><li>Hidden products appeared in the product list.</li><li>Lab objective completed exactly as required.</li><li>Screenshot:</li></ul>
<p>&lt;img width="1199" height="216" alt="image" src="https://github.com/user-attachments/assets/87724cce-1df9-43da-84b5-a975f41f4a54" /&gt;</p>
<h2>5. Learning (Deep Reasoning)</h2>
<ul><li><strong>Single quote (<code>'</code>) breaking the page</strong> proves the parameter is wrapped inside SQL string quotes.</li><li><strong>Double quote not breaking it</strong> hints the backend is not enforcing correct typing.</li><li><strong>Boolean‑based SQLi</strong> is effective when:</li><li>The input is part of a comparison.</li><li>The query expects a single value, not a full SELECT statement.</li><li>Multi‑SELECT attempts fail because the query structure expects a single expression, not a full different query.</li></ul>
<h2>6. Future Pattern Detection</h2>
<p>From now on, similar vulnerability signals include:</p>
<ul><li>Input affects query output directly.</li><li>Input shows visible page changes.</li><li>Injecting <code>'</code> breaks the page.</li><li>Error messages or internal server errors appear on malformed input.</li></ul>
<p>These are <strong>universal red flags</strong> for SQLi vulnerabilities in real apps.</p>
<h2>7. Notes for My Future Self</h2>
<ul><li>Early tests with <code>'</code> and <code>"</code> save time.</li><li>Always observe reflection patterns before brute forcing payloads.</li><li>Treat input-output behavior as x‑ray vision into backend logic.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 01 COMPLETE</code></details>
