---
layout: post
title: "Linux Privilege Escalation: Sudo Token Manipulation"
date: 2023-11-18
tags: [linux, ctf]
author: 0xWalid
excerpt: "Exploiting a misconfigured sudoers file and manipulating tokens to gain root access."
---

## Discovery

During enumeration, I checked the sudo capabilities of the current user:

```bash
sudo -l
```

The output showed that the user could run `/usr/bin/vim` as root without a password.

## Exploitation

This is a classic GTFOBins vector. I simply spawned a shell from within Vim:

```bash
sudo vim -c ':!/bin/sh'
```

And just like that, I had a root shell.
