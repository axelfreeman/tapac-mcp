# @tapacapi/sdk

Official JavaScript/TypeScript SDK for [TAPAC](https://tapacapi.com) — find and verify B2B contacts programmatically.

TAPAC scrapes business contacts from company websites, Discord communities, and Telegram channels, then validates emails in real time via SMTP (2–5% bounce rate vs. the 25–35% industry average). This SDK wraps the TAPAC REST API.

## Install

```bash
npm install @tapacapi/sdk
```

## Quick start

```js
const { TapacClient } = require("@tapacapi/sdk");

const client = new TapacClient({ apiKey: "your-api-key" });

// Service status
await client.status();

// Find contacts
await client.findContacts({
  industry: "fintech",
  job_titles: ["CEO", "CTO"],
  location: "Singapore",
  source: "website",
  limit: 10,
});

// Verify emails in real time
await client.verifyEmails(["alex@example.com", "sam@example.com"]);
```

ES modules and TypeScript are supported out of the box.

## Sandbox mode

Pass `sandbox: true` to exercise the API without real lookups:

```js
const client = new TapacClient({ sandbox: true });
```

## Authentication

Pass your API key via `new TapacClient({ apiKey })`. The client sends it as a `Bearer` token. Keys are issued from the TAPAC developer portal at [tapacapi.com/developers](https://tapacapi.com/developers).

## Requirements

- Node.js 18+ (uses the built-in `fetch`)

## License

MIT
