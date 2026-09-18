# @tapacapi/sdk

Official JavaScript/TypeScript SDK for [TAPAC](https://tapacapi.com) — find and verify B2B contacts programmatically.

TAPAC sources business contacts from company websites, Discord servers and Telegram channels, then validates every mailbox over SMTP in the same call (2–5% bounce on returned contacts, against the 10–35% typical of stored databases). This SDK wraps the TAPAC REST API: zero dependencies, ESM + CommonJS, typed, with retries and a sandbox mode.

## Install

```bash
npm install @tapacapi/sdk
```

Node 18+ (uses the built-in `fetch`).

## Quick start

```js
import { TapacClient } from "@tapacapi/sdk";      // or: const { TapacClient } = require("@tapacapi/sdk")

const tapac = new TapacClient({ apiKey: process.env.TAPAC_API_KEY });

// Key state + remaining quota
await tapac.status();

// Find contacts — every email comes back SMTP-verified
const { contacts } = await tapac.findContacts({
  industry: "fintech",
  job_titles: ["CEO", "CTO"],
  location: "Singapore",
  source: "website",
  limit: 10,
});

// Verify a list before a send
await tapac.verifyEmails(["alex@example.com", "sam@example.com"]);
```

Keys are free (100 searches) at [tapacapi.com/get-key](https://tapacapi.com/get-key).

## Methods

| Method | Endpoint | What it does |
| --- | --- | --- |
| `health()` | `GET /health` | Unauthenticated liveness probe. |
| `status()` | `GET /v1/status` | API version, key state, remaining quota. |
| `findContacts(params)` | `POST /v1/contacts/search` | Find contacts; emails are SMTP-verified in the same call. |
| `verifyEmails(emails)` | `POST /v1/contacts/verify` | Verify a batch of addresses. |
| `getContact(id)` | `GET /v1/contacts/{id}` | Fetch one previously returned contact. |
| `ask(query)` | `POST /ask` | Natural-language query (NLWeb). |
| `metrics()` | `GET /metrics` | Per-endpoint access counts for your key. |

`findContacts` accepts `industry`, `job_titles`, `company_size`, `location`, `source` (`website` \| `telegram` \| `discord`) and `limit`.

## Sandbox mode

Exercise the API without real lookups — the response is sample data and nothing is recorded in production:

```js
const tapac = new TapacClient({ apiKey: process.env.TAPAC_API_KEY, sandbox: true });
await tapac.findContacts({ industry: "SaaS", limit: 5 });
```

## Errors, timeouts, retries

```js
import { TapacClient, TapacError } from "@tapacapi/sdk";

const tapac = new TapacClient({ apiKey: KEY, timeoutMs: 30_000, retries: 3 });

try {
  await tapac.findContacts({ industry: "SaaS" });
} catch (err) {
  if (err instanceof TapacError) console.error(err.status, err.body);   // 401 -> get a key
  else throw err;
}
```

429 and 5xx responses (and network failures) are retried with backoff; everything else fails fast with a `TapacError` carrying `status` and the parsed `body`.

## TypeScript

Types ship with the package (`index.d.ts`) — no `@types` install:

```ts
import { TapacClient, type ContactSearchParams, type TapacContact } from "@tapacapi/sdk";

const params: ContactSearchParams = { industry: "SaaS", job_titles: ["VP Sales"], limit: 20 };
const { contacts } = await new TapacClient({ apiKey: KEY }).findContacts(params);
const first: TapacContact | undefined = contacts?.[0];
```

## Links

- Machine-readable spec: [tapacapi.com/openapi.json](https://tapacapi.com/openapi.json) (OpenAPI 3.1)
- Developers quickstart: [tapacapi.com/developers](https://tapacapi.com/developers)
- MCP server for agents: `npx -y @tapacapi/mcp` · [tapacapi.com/mcp.html](https://tapacapi.com/mcp.html)
- Source: [github.com/axelfreeman/tapac-mcp](https://github.com/axelfreeman/tapac-mcp)

MIT.
