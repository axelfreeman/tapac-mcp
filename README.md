# TAPAC — MCP Server for B2B Contact Finding

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

### 2. Wire into your agent

**Claude Desktop** (`claude_desktop_config.json`):
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

**Cursor / Windsurf** — same `command` + `args`, add as an MCP server in settings.

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

**Beta.** The install + tool interface + API-key onboarding are live. The full scrape → SMTP-validation engine is being wired in — it ships next. Until then, `tapac_find_contacts` captures your target and returns a clear beta response, so you can install and look inside the product today.

---

## Links

- **Website:** https://tapacapi.com
- **Deep Research Guide:** https://tapacapi.com/deep-research-guide.html
- **Free toolkit (self-hosted):** https://github.com/axelfreeman/b2b-contact-mining-kit
- **Author:** [Axel Freeman](https://axelfreeman.com)

## License

MIT.
