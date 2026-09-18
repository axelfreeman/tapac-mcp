# @tapacapi/mcp

TAPAC MCP server over stdio — find and verify B2B business contacts (real-time sourcing
from public company websites, Telegram, and Discord, with SMTP email verification) from
any MCP-compatible agent.

2–5% bounce rate vs 10–35% for static databases. Pay-per-use, $0.10–0.50 per contact,
100 free searches.

## Install

```bash
npx -y @tapacapi/mcp
```

Add it to your MCP client (Claude Desktop, Claude Code, Cursor, Codex, Windsurf, or any
other agent that speaks MCP):

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

Get a free API key — 100 searches included — at <https://tapacapi.com/get-key>.
Without a key the server still starts and returns onboarding instructions instead of
contacts, so you can wire it up before you have a key.

## Tools

| Tool | What it does |
| --- | --- |
| `tapac_find_contacts` | Find and verify contacts. Params: `industry`, `job_titles`, `company_size`, `location`, `source` (`website` \| `telegram` \| `discord`), `limit`. |
| `tapac_status` | Server version, API-key state, and live API reachability. |

Every contact comes back with name, title, company, email, source, and SMTP verification
status. The server never invents contacts — it returns exactly what the API returns.

## Examples

- "Find 20 VP Sales at US SaaS companies with 50–500 employees"
  → `tapac_find_contacts(industry="SaaS", job_titles=["VP Sales"], company_size="50-500 employees", location="US", limit=20)`
- "Find leads in a Telegram/Discord community" → `tapac_find_contacts(source="telegram", ...)`
- "Is my TAPAC key working?" → `tapac_status()`

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `TAPAC_API_KEY` | — | API key from <https://tapacapi.com/get-key> |
| `TAPAC_BASE_URL` | `https://tapacapi.com` | API base URL |
| `TAPAC_TIMEOUT_MS` | `60000` | Request timeout |

## Links

- Product & docs: <https://tapacapi.com>
- Repository (Python MCP server, SKILL.md, AGENTS.md): <https://github.com/axelfreeman/tapac-mcp>
- JavaScript/TypeScript SDK: `@tapacapi/sdk`
- Python SDK: `tapac-sdk`

MIT licensed.
