/**
 * TAPAC MCP server (stdio) — find and verify B2B business contacts.
 *
 * Run:  npx @tapacapi/mcp
 * Key:  https://tapacapi.com/get-key  ->  TAPAC_API_KEY
 */

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const VERSION = "1.0.0";
const BASE_URL = (process.env.TAPAC_BASE_URL || "https://tapacapi.com").replace(/\/$/, "");
const KEY_URL = "https://tapacapi.com/get-key";
const DOCS_URL = "https://tapacapi.com";
const TIMEOUT_MS = Number(process.env.TAPAC_TIMEOUT_MS || 60000);

function apiKey() {
  return (process.env.TAPAC_API_KEY || "").trim();
}

function onboarding() {
  return [
    "👋 TAPAC is installed and running.",
    "",
    "To start finding contacts, grab your free API key:",
    KEY_URL,
    "",
    "Then set it as an environment variable:",
    "```",
    "export TAPAC_API_KEY=your_key_here",
    "```",
    "",
    "After that, ask me for contacts — for example:",
    '"Find 20 VP Sales at US SaaS companies with 50-500 employees"',
    "",
    `Docs: ${DOCS_URL}`,
  ].join("\n");
}

async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const key = apiKey();
  if (key) headers.Authorization = `Bearer ${key}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

const pretty = (data) => (typeof data === "string" ? data : JSON.stringify(data, null, 2));

const server = new McpServer(
  { name: "tapac", version: VERSION },
  {
    instructions:
      "TAPAC finds and verifies B2B business contacts. When the user asks for contacts, " +
      "ask for the target criteria (industry, job_titles, company_size, location, source), " +
      "then call tapac_find_contacts. Never invent contacts — only return what the tool returns.",
  },
);

server.tool(
  "tapac_find_contacts",
  "Find and verify B2B business contacts in real time. Ask the user for these criteria before calling: " +
    'industry ("SaaS", "healthcare", "fintech"), job_titles (["VP Sales", "CTO", "Head of Growth"]), ' +
    'company_size ("50-500 employees", "startup", "enterprise"), location ("US", "Europe", "DACH", "remote"), ' +
    'source ("website", "telegram", "discord"), limit (default 10). ' +
    "Returns verified contacts (name, title, company, email, source, verification status) with SMTP verification.",
  {
    industry: z.string().optional().describe('vertical, e.g. "SaaS", "healthcare", "fintech"'),
    job_titles: z.array(z.string()).optional().describe('roles, e.g. ["VP Sales", "CTO"]'),
    company_size: z.string().optional().describe('e.g. "50-500 employees", "startup"'),
    location: z.string().optional().describe('geography, e.g. "US", "Europe", "remote"'),
    source: z.enum(["website", "telegram", "discord"]).optional().describe("where to search"),
    limit: z.number().int().min(1).max(100).optional().describe("how many contacts to return"),
  },
  async ({ industry, job_titles, company_size, location, source, limit }) => {
    if (!apiKey()) {
      return { content: [{ type: "text", text: onboarding() }] };
    }
    if (!industry && !(job_titles && job_titles.length) && !location) {
      return {
        content: [
          {
            type: "text",
            text:
              "I need a bit more to search. Tell me at least one of: industry, job_titles, or location.\n\n" +
              'Example: "SaaS companies, VP Sales and CTO roles, US, 50-500 employees"',
          },
        ],
      };
    }
    const { ok, status, data } = await api("/v1/contacts/search", {
      method: "POST",
      body: {
        industry: industry || "",
        job_titles: job_titles || [],
        company_size: company_size || "",
        location: location || "",
        source: source || "website",
        limit: limit || 10,
      },
    });
    if (!ok) {
      return {
        content: [
          {
            type: "text",
            text: `TAPAC API error ${status}: ${pretty(data)}\n\nDocs: ${DOCS_URL}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: pretty(data) }] };
  },
);

server.tool("tapac_status", "Check TAPAC server status, version, and API-key state.", {}, async () => {
  const key = apiKey();
  const keyState = key ? "✓ active" : `✗ not set (get one at ${KEY_URL})`;
  let apiState = "";
  try {
    const { ok, status, data } = await api("/v1/status");
    apiState = `\nAPI: ${ok ? "reachable" : `error ${status}`} — ${pretty(data)}`;
  } catch (err) {
    apiState = `\nAPI: unreachable (${err.message})`;
  }
  return {
    content: [{ type: "text", text: `TAPAC MCP server v${VERSION}\nAPI key: ${keyState}${apiState}\nDocs: ${DOCS_URL}` }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`TAPAC MCP server v${VERSION} ready on stdio\n`);
}

module.exports = { main, onboarding, apiKey };

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(`TAPAC MCP server failed: ${err.stack || err}\n`);
    process.exit(1);
  });
}
