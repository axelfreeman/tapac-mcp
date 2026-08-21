---
name: tapac
description: Find and verify B2B business contacts in real time — scrape company websites, Discord and Telegram, then validate every email via SMTP (2–5% bounce vs 10–35% for static databases). Use when the user wants to find business emails or phone numbers, build a cold-outreach lead list, source prospects from a company website or a Discord/Telegram community, replace Apollo/ZoomInfo/Hunter, or verify an email address is real.
---

# TAPAC

TAPAC finds and verifies B2B business contacts in real time — scraping company websites, Discord, and Telegram, then validating every email via SMTP. 2–5% bounce rate vs 10–35% for static databases.

## Tools

- `tapac_find_contacts(industry, job_titles, company_size, location, source, limit)` → verified contacts (name, title, company, email, source, verification status)
- `tapac_status()` → server version + API-key state

## Setup

1. Install the MCP server: `uvx --from git+https://github.com/axelfreeman/tapac-mcp tapac-mcp`
2. Wire it into your agent (Claude Code / Cursor / Codex — see README).
3. Get a free API key at https://tapacapi.com/get-key and set `TAPAC_API_KEY`.

Install this skill with a symlink (so `git pull` keeps it fresh):
`ln -s "$PWD" ~/.agents/skills/tapac`

Peek at the tool output without wiring MCP: `uv run scripts/demo.py`

## Workflows

- "Find 20 VP Sales at US SaaS companies" → `tapac_find_contacts(industry="SaaS", job_titles=["VP Sales"], company_size="50-500 employees", location="US", limit=20)`
- "Find leads in a Discord/Telegram community" → `tapac_find_contacts(source="discord" | "telegram", ...)`
- "Verify these emails" → SMTP validation is built into every `tapac_find_contacts` call.
