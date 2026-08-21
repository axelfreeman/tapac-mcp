---
name: tapac
description: Find and verify B2B business contacts in real time — source prospects from public company websites, Discord and Telegram, with instant email verification (2–5% bounce vs 10–35% for static databases). Use when the user wants to find business emails or phone numbers, build a cold-outreach lead list, source prospects from a company website or a Discord/Telegram community, replace Apollo/ZoomInfo/Hunter, or check whether an email address is real.
---

# TAPAC

TAPAC finds and verifies B2B business contacts in real time — sourcing from public company websites, Discord, and Telegram, with instant email verification. 2–5% bounce rate vs 10–35% for static databases.

## Tools

- `tapac_find_contacts(industry, job_titles, company_size, location, source, limit)` → verified contacts (name, title, company, email, source, verification status)
- `tapac_status()` → server version + API-key state

## Setup

1. Install and wire the server into your agent — full per-agent instructions (Claude Desktop, Claude Code, Cursor, Codex, Windsurf) are in the README.
2. Get a free API key at https://tapacapi.com/get-key and set `TAPAC_API_KEY`.

## Workflows

- "Find 20 VP Sales at US SaaS companies" → `tapac_find_contacts(industry="SaaS", job_titles=["VP Sales"], company_size="50-500 employees", location="US", limit=20)`
- "Find leads in a Discord/Telegram community" → `tapac_find_contacts(source="discord" | "telegram", ...)`
- "Verify these emails" → email verification is built into every `tapac_find_contacts` call.
