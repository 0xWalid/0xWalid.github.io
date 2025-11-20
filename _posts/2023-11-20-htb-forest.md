---
layout: post
title: "HTB: Forest Writeup"
date: 2023-11-20
tags: [windows, active directory, ctf]
author: 0xWalid
excerpt: "A walkthrough of the Forest machine on HackTheBox. Topics include AS-REP Roasting, DCSync, and ACL abuse."
---

## Reconnaissance

Started with a standard Nmap scan:

```bash
nmap -sC -sV -oA nmap/forest 10.10.10.161
```

Discovered ports 88 (Kerberos), 135 (RPC), 139/445 (SMB), and 389 (LDAP).

## Initial Access

Using `GetNPUsers.py` from Impacket, I was able to perform an AS-REP Roasting attack against the domain users.

```bash
GetNPUsers.py htb.local/ -usersfile users.txt -format hashcat -outputfile hashes.asreproast
```

## Privilege Escalation

After cracking the hash, I gained access as `svc-alfresco`. Enumerating the domain with BloodHound revealed that this user was a member of the `Service Accounts` group, which had `GenericAll` rights over the `Exchange Windows Permissions` group.

This allowed for a DCSync attack to dump the NTLM hashes of the Administrator.
