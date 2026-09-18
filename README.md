# TAPAC — MCP Server for B2B Contact Finding

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![MCP native](https://img.shields.io/badge/MCP-native-8A2BE2)](https://modelcontextprotocol.io)
[![Lint](https://github.com/axelfreeman/tapac-mcp/actions/workflows/lint.yml/badge.svg)](https://github.com/axelfreeman/tapac-mcp/actions/workflows/lint.yml)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://pre-commit.com)

[![skills.sh](https://skills.sh/b/axelfreeman/tapac-mcp)](https://skills.sh/axelfreeman/tapac-mcp)

**Find & verify B2B contacts in real time.** Scrapes company websites, Discord, and Telegram — then validates every email via SMTP. Built as a native MCP server, so Claude, ChatGPT, Cursor, and any AI agent can call it directly.

> **Install in one command:**
> ```bash
> uvx --from git+https://github.com/axelfreeman/tapac-mcp tapac-mcp
> ```
> Then ask your agent: *"Find 20 VP Sales at US SaaS companies with 50–500 employees."*

---

## Why TAPAC

Databases rot. **23% of contacts change jobs every year** (ZoomInfo 2025), **40% of emails die within 2 years** (NeverBounce). Buy a contact list and a quarter of it is stale before you send a single email.

TAPAC doesn't sell a database. It scrapes **live** and validates **at request time**:

| | TAPAC | Static DBs (Apollo, ZoomInfo, Hunter) |
|---|---|---|
| Data source | Real-time scraping | Frozen snapshot |
| Bounce rate | **2–5%** | 10–35% |
| Validation | SMTP, in the moment | None / after the fact |
| MCP / AI agents | ✅ native | ❌ |
| Discord / Telegram | ✅ | ❌ |
| Pricing | Pay-per-use, $0.10–0.50/contact | $34–$15,000+/mo or /yr |

---

## Quick Start

### 1. Install

```bash
uvx --from git+https://github.com/axelfreeman/tapac-mcp tapac-mcp
```

Requires [`uv`](https://docs.astral.sh/uv/) (one-liner installer: `curl -LsSf https://astral.sh/uv/install.sh | sh`).

**Node instead of Python?** The same server ships on npm — no Python toolchain needed, Node 18+:

```bash
npx -y @tapacapi/mcp
```

```json
{
  "mcpServers": {
    "tapac": {
      "command": "npx",
      "args": ["-y", "@tapacapi/mcp"],
      "env": { "TAPAC_API_KEY": "your_key_here" }
    }
  }
}
```

Package: [`@tapacapi/mcp`](https://www.npmjs.com/package/@tapacapi/mcp).

### 2. Wire into your agent

The same `command` + `args` work everywhere. Pick your agent:

**Claude Desktop** — `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "tapac": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/axelfreeman/tapac-mcp", "tapac-mcp"]
    }
  }
}
```

**Claude Code** (terminal):
```bash
claude mcp add tapac -- uvx --from git+https://github.com/axelfreeman/tapac-mcp tapac-mcp
```

**Codex (OpenAI)** — `~/.codex/config.toml`:
```toml
[mcp_servers.tapac]
command = "uvx"
args = ["--from", "git+https://github.com/axelfreeman/tapac-mcp", "tapac-mcp"]
```

**Cursor** — `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "tapac": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/axelfreeman/tapac-mcp", "tapac-mcp"]
    }
  }
}
```

**Windsurf** — `~/.codeium/windsurf/mcp_config.json` (same JSON as Cursor).

**DeepSeek** — the chat app doesn't register local MCP servers natively. Use DeepSeek through an MCP-capable client (Claude Code / Cursor with the DeepSeek API), or connect to the hosted endpoint `https://tapacapi.com/mcp/sse`.

### 3. Get your free API key

First run points you to `https://tapacapi.com/get-key`. Set it once:
```bash
export TAPAC_API_KEY=your_key_here
```

### 4. Ask for contacts

> "Find 20 VP Sales at US SaaS companies with 50–500 employees, verify emails."

The agent asks for the criteria it needs, calls `tapac_find_contacts`, and returns verified contacts (name, title, company, email, source, verification status).

**100 free searches**, no credit card.

---

## Tools

### `tapac_find_contacts`

Find and verify B2B contacts.

| Param | Type | Description |
|---|---|---|
| `industry` | string | Vertical, e.g. "SaaS", "healthcare", "fintech" |
| `job_titles` | string[] | Roles, e.g. `["VP Sales", "CTO"]` |
| `company_size` | string | "50-500 employees", "startup", "enterprise" |
| `location` | string | "US", "Europe", "DACH", "remote" |
| `source` | string | `website` · `telegram` · `discord` |
| `limit` | int | How many contacts (default 10) |

### `tapac_status`

Server version + API-key state.

---

## Status

**Live.** Install it, wire it into your agent, grab a free API key, and ask for contacts.

---

## Demo script (no MCP wiring needed)

See the tool output shape instantly — run the tools directly without wiring the server:

```bash
uv run scripts/demo.py
```

It prints `tapac_status()` plus a sample `tapac_find_contacts()` call.

## Skill (optional)

`SKILL.md` documents the TAPAC tools for any agent that loads skills. Install it with a symlink so `git pull` keeps it fresh:

```bash
ln -s "$PWD" ~/.agents/skills/tapac
```

## Links

- **Website:** https://tapacapi.com
- **Deep Research Guide:** https://tapacapi.com/deep-research-guide.html
- **Free toolkit (self-hosted):** https://github.com/axelfreeman/b2b-contact-mining-kit
- **Author:** [Axel Freeman](https://axelfreeman.com)

## Need this done for you?

What's in this repo is the free half of the work: sourcing, verification, and the volume a test
actually needs to be readable. If you'd rather have that run against your own market:

- [Engagement, scope and public pricing](https://axelfreeman.com/marketing-engineer.html)
- [What actually ships in a done-for-you engagement](https://axelfreeman.com/done-for-you-lead-generation.html)
- [Proof — what is live right now](https://axelfreeman.com/proof.html)

## License

MIT.
