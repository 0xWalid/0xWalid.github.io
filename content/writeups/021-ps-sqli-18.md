---
slug: "ps-sqli-18"
title: "SQL injection with filter bypass via XML encoding"
platform: "PortSwigger"
difficulty: "Hard"
category: ["Web","SQLi"]
date: "2025-12-23"
minutes: 4
visible: true
tldr: "SQL injection vulnerability in an XML-based POST request — solved and documented end to end."
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 18 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/18-SQL%20injection%20with%20filter%20bypass%20via%20XML%20encoding.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>Exploit a <strong>SQL injection vulnerability in an XML-based POST request</strong> by <strong>bypassing keyword filters using XML entity encoding</strong>, allowing extraction of <strong>usernames and passwords</strong> despite active WAF-style defenses.</p>
<h2>1. Initial Testing &amp; Vulnerability Identification</h2>
<h2>Parameters Tested</h2>
<ul><li>URL parameters</li><li>Product parameters</li></ul>
<p>No SQL injection behavior was observed in standard URL or product-based inputs.</p>
<h2>XML-Based Request Identified</h2>
<p>While analyzing application functionality, a <strong>POST request</strong> used to check stock availability was identified.</p>
<p>This request submitted data in <strong>XML format</strong>, making it a high‑value target for injection testing.</p>
<h2>Key Observation</h2>
<ul><li>Input was processed server-side from XML tags</li><li>Security controls were applied <strong>before SQL execution</strong></li><li>This suggested a <strong>filter-based defense</strong>, not a hardened query</li></ul>
<h2>2. Identifying the Injection Point</h2>
<h2>Injectable XML Parameter</h2>
<pre class="code" data-lang="xml"><code>&lt;storeId&gt;</code></pre>
<h2>Initial Test</h2>
<pre class="code" data-lang="xml"><code>&lt;storeId&gt;1 UNION SELECT&lt;/storeId&gt;</code></pre>
<h2>Result</h2>
<ul><li>Application responded with <strong>“Attack detected”</strong></li><li>Confirms:</li><li>Input is reaching a SQL query</li><li>Keywords like <code>UNION</code>, <code>SELECT</code>, and <code>'</code> are actively filtered</li></ul>
<p>This confirms <strong>SQL injection exists</strong>, but is <strong>protected by keyword filtering</strong>.</p>
<h2>3. Understanding the Filter Behavior</h2>
<h2>What Was Blocked</h2>
<ul><li><code>UNION</code></li><li><code>SELECT</code></li><li>Single quote (<code>'</code>)</li></ul>
<h2>Important Insight (Mindset Shift)</h2>
<p>&gt; Filters often inspect raw input, not the post‑parsed content. &gt;</p>
<p>This means:</p>
<ul><li>XML parsers decode entities <strong>after</strong> filtering</li><li>Encoded payloads can pass filters and execute normally in SQL</li></ul>
<p>This is a <strong>critical advantage</strong>:</p>
<ul><li>No need for time delays</li><li>No need for blind logic</li><li>Direct data extraction becomes possible</li></ul>
<h2>4. Filter Bypass via XML Entity Encoding</h2>
<h2>Strategy</h2>
<ul><li>Encode SQL keywords using <strong>numeric XML entities</strong></li><li>Encode single quotes using <code>&amp;apos;</code></li><li>Let the XML parser reconstruct the payload <strong>after</strong> filter inspection</li></ul>
<h2>5. Working Payload (Filter Bypass)</h2>
<pre class="code" data-lang="xml"><code>&lt;storeId&gt;
1&amp;#85;&amp;#110;&amp;#105;&amp;#111;&amp;#110;&amp;#83;&amp;#101;&amp;#108;&amp;#101;&amp;#99;&amp;#116;
username ||&amp;apos; +&amp;apos; || password FROM users
&lt;/storeId&gt;
</code></pre>
<h2>Decoded by Server As</h2>
<pre class="code" data-lang="sql"><code>1 UNION SELECT username||' + '|| password FROM users
</code></pre>
<h2>6. Successful Data Extraction</h2>
<h2>Result</h2>
<ul><li>“Attack detected” message <strong>did not appear</strong></li><li>Application returned:</li><li><strong>Usernames</strong></li><li><strong>Passwords</strong></li><li>Data was reflected directly in the response</li></ul>
<p>This confirms:</p>
<ul><li>Filter successfully bypassed</li><li>SQL query executed normally</li><li>Output was reflected in the application</li></ul>
<h2>7. Final Result</h2>
<pre class="code" data-lang="sql"><code>335 units
administrator + jc1023elqthareue3d67
wiener + cd0rzm0v4bujgasasz8i
carlos + w1it05wenc2tbwsta7n8</code></pre>
<ul><li>Logged in using extracted credentials</li><li>Application confirmed administrator access</li><li>Lab marked as <strong>Solved</strong></li><li>![Uploading image.png…]()</li></ul>
<h2>8. Key Takeaways (Important)</h2>
<h2>Why XML Encoding Is Powerful</h2>
<ul><li>Filters inspect <strong>raw input</strong></li><li>XML entities are decoded <strong>after filtering</strong></li><li>SQL engine receives <strong>fully reconstructed keywords</strong></li></ul>
<h2>When to Think About XML Encoding</h2>
<ul><li>Input is sent as XML</li><li>Keywords are blocked but errors are not shown</li><li>“Attack detected” style responses appear</li><li>UNION-based injection *should* work but doesn’t</li></ul>
<h2>9. Notes for My Future Self</h2>
<ul><li>XML inputs are <strong>high-risk injection points</strong></li><li>Keyword filtering ≠ SQL safety</li><li>XML entity encoding is a <strong>filter killer</strong></li><li>Always inspect request formats, not just parameters</li><li>If UNION is blocked, don’t quit — <strong>encode it</strong></li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 18 COMPLETE</code></details>
