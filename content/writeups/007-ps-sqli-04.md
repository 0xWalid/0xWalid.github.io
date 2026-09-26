---
slug: "ps-sqli-04"
title: "SQL injection attack, querying the database type and version on MySQL and Microsoft"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-10"
minutes: 6
visible: true
tldr: "- The vulnerable parameter was located in the category field of a product listing endpoint.\n- The original value was `category=Pets`. Supplying normal…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 04 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/04-%20SQL%20injection%20attack%2C%20querying%20the%20database%20type%20and%20version%20on%20MySQL%20and%20Microsoft.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<h2>1. Observation**</h2>
<ul><li>The vulnerable parameter was located in the <strong>category</strong> field of a product listing endpoint.</li><li>The original value was <code>category=Pets</code>. Supplying normal category values (e.g., <code>Pets</code>) loaded items as expected.</li><li>Injecting a <strong>single quote (<code>'</code>)</strong> triggered an <strong>Internal Server Error</strong> — a strong indicator the input is placed inside a SQL string literal.</li><li>Trying <code>UNION SELECT NULL, NULL --</code> produced internal errors when using <code>--</code> for comment; switching comment style to <code>#</code> resolved that.</li><li>Payloads placed directly in the browser URL did not behave as expected due to browser safety/encoding; sending payloads via <strong>Burp Suite</strong> produced the intended server-side execution.</li><li><strong>Intuition:</strong> Input is concatenated into a SQL query without proper sanitization; UNION-based extraction may be possible after discovering column count and compatible datatypes.</li></ul>
<h2>2. Hypothesis**</h2>
<p>The backend query likely resembles:</p>
<pre class="code" data-lang="sql"><code>SELECT * FROM products
WHERE category = '&lt;user_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>A single quote breaks the query → input is inside a quoted SQL string.</li><li>To leak DB metadata (type/version), a <code>UNION SELECT</code> injection can be used <strong>if</strong> we find the correct number of columns and at least one column that accepts text.</li><li>Comment styles matter: some apps filter/handle <code>--</code> differently; <code>#</code> may work on MySQL.</li><li>Browser encoding/safety can mask payload behavior; <strong>must use an interceptor (Burp)</strong> to ensure payloads hit the server unchanged.</li></ul>
<p><strong>Goal:</strong> Identify column count &amp; a string-accepting column, then run a payload like:</p>
<pre class="code" data-lang="sql"><code>' UNION SELECT @@version, 'x' #
</code></pre>
<p>to retrieve MySQL version from <code>@@version</code>.</p>
<h2>3. Test (Experiments Conducted)**</h2>
<h2>Test 1 — Injection Detection**</h2>
<ul><li><strong>Input:</strong> <code>'</code></li><li><strong>Actual:</strong> Internal Server Error</li><li><strong>Interpretation:</strong> Confirmed SQL injection vulnerability; input breaks SQL string handling.</li></ul>
<h2>Test 2 — Column Count Discovery**</h2>
<ul><li><strong>Tried:</strong> <code>' UNION SELECT NULL --</code> and variations with <code>--</code> comment</li><li><strong>Result:</strong> Internal Server Error (app does not accept <code>--</code> style or blocks it).</li><li><strong>Change:</strong> Replaced comment <code>--</code> with <code>#</code> and used Burp to send payloads.</li><li><strong>Observed:</strong> After switching to <code>#</code>, able to test union payloads more reliably.</li></ul>
<p>*(Attempted increasing number of <code>NULL</code>s up to 3 with <code>--</code> but the same internal error persisted until switching comment style and using Burp.)*</p>
<h2>Test 3 — Final Version Extraction**</h2>
<ul><li><strong>Payload used (sent via Burp):</strong></li></ul>
<pre class="code" data-lang="sql"><code>Pets'union select @@version,'b'#</code></pre>
<ul><li><strong>Actual Response (extracted from page):</strong></li></ul>
<pre class="code" data-lang="sql"><code>8.0.42-0ubuntu0.20.04.1
b
</code></pre>
<ul><li><strong>Interpretation:</strong> The <code>@@version</code> global variable printed the MySQL server version; second column echoed the literal <code>'b'</code>, confirming the UNION succeeded and the column accepted string data.</li></ul>
<p>&gt; Note: Boolean-based tests were not performed for this lab — the UNION technique achieved the objective directly. &gt;</p>
<h2>4. Result**</h2>
<h2>Payloads &amp; Techniques**</h2>
<ul><li>Detection: <code>'</code> → Internal Server Error.</li><li>Column / comment adjustments: <code>#</code> comment worked where <code>--</code> did not.</li><li>Final extraction payload:</li></ul>
<pre class="code" data-lang="sql"><code>Pets'union select @@version,'b'#</code></pre>
<h2>Extracted Information (Proof)**</h2>
<ul><li>Returned from server:</li></ul>
<pre class="code" data-lang="sql"><code>8.0.42-0ubuntu0.20.04.1
b</code></pre>
<ul><li><strong>Conclusion:</strong> DBMS is <strong>MySQL 8.0.42</strong> (Ubuntu packaging). UNION-based SQL injection is exploitable on the <code>category</code> parameter.</li><li><strong>Proof of Lab Completion:</strong> Version string displayed in application response.</li><li>Screeshot</li></ul>
<p>&lt;img width="1232" height="520" alt="image" src="https://github.com/user-attachments/assets/512faed2-dac8-45a2-ba28-3f6bdb5c2664" /&gt;</p>
<h2>5. Learning (Deep Reasoning)**</h2>
<ul><li><strong>Single-quote behavior:</strong> <code>'</code> causing an Internal Server Error strongly indicates user input is injected into a quoted SQL string. This is the fastest detection technique for string-based SQLi.</li><li><strong>Comment style matters:</strong> Some filters or SQL dialect handling in the application can block <code>--</code>or treat it specially; <code>#</code> works in MySQL. Always try alternate comment syntaxes when <code>--</code> fails.</li><li><strong>Browser vs. Proxy:</strong> Modern browsers auto-encode or sanitize certain characters; always test payloads via an intercepting proxy (Burp) to ensure server-received input matches your intended payload.</li><li><strong>UNION mechanics:</strong> To use <code>UNION SELECT</code> you must match the number of columns and compatible types. Finding that a literal string in the second column (<code>'b'</code>) rendered correctly confirmed at least one text-accepting column.</li><li><strong><code>@@version</code> utility:</strong> MySQL exposes <code>@@version</code> as a quick way to enumerate server version; returning it via UNION is low-effort and high-confidence for determining DBMS type/version.</li><li><strong>Exploit flow efficiency:</strong> If UNION works, you can extract metadata quickly without need for time-consuming Boolean-based enumeration. Always attempt easier enumeration techniques first (e.g., global variables, metadata tables).</li></ul>
<h2>6. Future Pattern Detection**</h2>
<p>When you see these signals, suspect MySQL UNION-based SQLi:</p>
<ul><li><code>'</code> → Internal Server Error (string literal break).</li><li>Application reflects input or shows additional rows/products after injection attempts.</li><li><code>--</code> causing errors but <code>#</code> working suggests MySQL or a parser that treats <code>--</code> specially (or filters it).</li><li>Successful UNION with <code>@@version</code> or similar global variables returns DB info.</li><li>Payloads succeed only when sent via proxy — browser auto-sanitization was masking true behaviour.</li></ul>
<p>These patterns  quickly predict MySQL backend and the most effective extraction techniques.</p>
<h2>7. Notes for My Future Self**</h2>
<ul><li>Always test <code>'</code> first — it’s the quickest SQLi detector for string-based queries.</li><li>If <code>--</code> fails, try <code>#</code> and test in Burp. Don’t trust browser behavior.</li><li>Use <code>@@version</code> for a fast MySQL version disclosure via UNION.</li><li>Confirm column count / datatypes by injecting literals (<code>'a'</code>, <code>'b'</code>) and <code>NULL</code>s.</li><li>If UNION works, prioritize metadata extraction (version, user(), database()) before slower boolean/time techniques.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 04 COMPLETE</code></details>
