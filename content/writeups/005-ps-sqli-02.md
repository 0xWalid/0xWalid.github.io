---
slug: "ps-sqli-02"
title: "SQL Injection Vulnerability Allowing Login Bypass"
platform: "PortSwigger"
difficulty: "Easy"
category: ["Web","SQLi"]
date: "2025-12-09"
minutes: 4
visible: true
tldr: "A classic boolean‑based SQL injection inside the login form allowed authentication as the `administrator` user without knowing the password.…"
format: "html"
---

<p class="mono lab-crumb">PORTSWIGGER ACADEMY // SQLi SERIES &middot; LAB 02 &middot; <a href="https://github.com/0xWalid/Learnings/tree/main/Portswiggers/01-Sql%20Injection%20Labs/02-%20SQL%20injection%20vulnerability%20allowing%20login%20bypass.md" target="_blank" rel="noopener">original notes &#8599;</a></p>
<p>A classic boolean‑based SQL injection inside the login form allowed authentication as the <code>administrator</code> user without knowing the password.</p>
<h2>1. Observation</h2>
<ul><li>The target endpoint was:</li></ul>
<p><code>/login</code></p>
<ul><li>Supplying <strong>wrong credentials</strong> produced a normal “invalid login” response.</li><li>Injecting a <strong>single quote (')</strong> into either the username or password triggered an <strong>Internal Server Error</strong>.</li><li>This error strongly indicated:</li><li>The input is embedded inside a backend SQL query.</li><li>The query is not parameterized.</li><li>The server breaks when SQL syntax becomes invalid.</li><li>The behaviour matched classic broken-string‑literal patterns seen in SQL injection.</li></ul>
<h2>2. Hypothesis</h2>
<p>The server likely uses a vulnerable login query resembling:</p>
<pre class="code" data-lang="sql"><code>SELECT * FROM users
WHERE username='&lt;user_input&gt;' AND password='&lt;pass_input&gt;';</code></pre>
<p>Reasoning:</p>
<ul><li>Because <code>'</code> breaks the query, user input is <strong>inside single quotes</strong>.</li><li>Since invalid input causes a server error instead of safe handling, the query is directly concatenated.</li><li>If the password field can be manipulated, a Boolean condition such as:</li></ul>
<pre class="code" data-lang="sql"><code>' OR 1=1--</code></pre>
<p>…should cause the WHERE clause to always evaluate to <strong>true</strong>, returning the first user in the table — normally the administrator.</p>
<p><strong>Hypothesis:</strong></p>
<p>Injecting a Boolean expression in the <strong>password</strong> field will bypass authentication and log in as administrator.</p>
<h2>3. Test (Experiments Conducted)</h2>
<h2>Test 1 — Wrong Credentials**</h2>
<ul><li><strong>Input:</strong> incorrect username/password</li><li><strong>Actual:</strong> login failed</li><li><strong>Interpretation:</strong> baseline behaviour confirmed.</li></ul>
<h2>Test 2 — Single Quote Injection**</h2>
<ul><li><strong>Input (username or password):</strong> <code>'</code></li><li><strong>Actual:</strong> Internal Server Error</li><li><strong>Interpretation:</strong> clear proof the string literal broke the backend SQL.</li></ul>
<h2>Test 3 — Boolean Injection Attempt**</h2>
<ul><li><strong>Username:</strong> <code>admin</code></li><li><strong>Password:</strong> <code>' OR 1=1--</code></li><li><strong>Expected:</strong> bypass authentication</li><li><strong>Actual:</strong> login successful</li><li><strong>Interpretation:</strong> query manipulated successfully and conditions forced to true.</li></ul>
<h2>4. Result</h2>
<h2>Payload Used**</h2>
<pre class="code" data-lang="sql"><code>' OR 1=1--</code></pre>
<h2>What Happened**</h2>
<ul><li><code>username='admin'</code> matched the admin account.</li><li>Injected <code>OR 1=1</code> always evaluates to <code>true</code>.</li><li><code>-</code> commented out the rest of the SQL query.</li><li>The application logged in as <strong>administrator</strong> despite the password being irrelevant.</li></ul>
<h2>Proof of Lab Completion</h2>
<ul><li>Dashboard displayed: *“Your username is: administrator”*</li><li>Screenshot:</li></ul>
<p>&lt;img width="1173" height="561" alt="image" src="https://github.com/user-attachments/assets/014ebf60-f5a6-481d-a7e2-5f90c6aeda2b" /&gt;</p>
<h2>5. Learning (Deep Reasoning)</h2>
<ul><li><strong>Single-quote breaks</strong> are the strongest signal of SQL injection.</li><li>Authentication queries are extremely vulnerable because:</li><li>They rely on strict equality checks.</li><li>Developers often concatenate strings directly.</li><li>Boolean‑based SQLi is the simplest and most reliable login bypass technique.</li><li>Attempting additional <code>SELECT</code> statements fails because:</li><li>This query expects <strong>expressions</strong>, not <strong>new SELECT blocks</strong>.</li><li>Understanding query structure is critical to choosing correct payloads.</li></ul>
<h2>6. Future Pattern Detection</h2>
<p>This lab reinforces that the following behaviors almost always indicate login SQL injection:</p>
<ul><li>Internal errors triggered by <code>'</code>.</li><li>No rate‑limiting or captcha.</li><li>Password field behaves differently with malformed input.</li><li>Login failure vs server error states are distinguishable.</li><li>Login form returns user dashboard on a *true* boolean condition, even without password validation.</li></ul>
<p>These cues help identify SQLi before payload testing.</p>
<h2>7. Notes for My Future Self</h2>
<ul><li>Always test <code>'</code> first — fastest detector of vulnerable queries.</li><li>Boolean‑based injections are often enough for login bypass.</li><li>Understand the backend’s expected SQL structure before selecting payloads.</li><li>Treat login forms as prime targets — developers often handle them dangerously.</li></ul>

<details class="flag-box"><summary><span class="flag-label">LAB STATUS</span><span class="flag-hint"></span></summary><code>SQLi SERIES :: LAB 02 COMPLETE</code></details>
