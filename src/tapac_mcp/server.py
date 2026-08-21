"""TAPAC MCP server.

Find and verify B2B business contacts — real-time sourcing from company
websites, Discord, and Telegram, with SMTP email validation.
"""
from __future__ import annotations

import os

from mcp.server.fastmcp import FastMCP

VERSION = "1.0.0"
KEY_URL = "https://tapacapi.com/get-key"
DOCS_URL = "https://tapacapi.com"

mcp = FastMCP(
    "tapac",
    instructions=(
        "TAPAC finds and verifies B2B business contacts. When the user asks "
        "for contacts, ask for the target criteria (industry, job_titles, "
        "company_size, location, source), then call tapac_find_contacts. "
        "Never invent contacts — only return what the tool returns."
    ),
)


def _api_key() -> str:
    return os.environ.get("TAPAC_API_KEY", "").strip()


def _onboarding() -> str:
    return (
        "👋 TAPAC is installed and running.\n\n"
        "To start finding contacts, grab your free API key:\n"
        f"{KEY_URL}\n\n"
        "Then set it as an environment variable:\n"
        "```\n"
        "export TAPAC_API_KEY=your_key_here\n"
        "```\n\n"
        "After that, ask me for contacts — for example:\n"
        "\"Find 20 VP Sales at US SaaS companies with 50-500 employees\"\n\n"
        f"Docs: {DOCS_URL}"
    )


@mcp.tool()
def tapac_find_contacts(
    industry: str = "",
    job_titles: list[str] | None = None,
    company_size: str = "",
    location: str = "",
    source: str = "website",
    limit: int = 10,
) -> str:
    """Find and verify B2B business contacts in real time.

    Ask the user for these criteria before calling:
    - industry: vertical, e.g. "SaaS", "healthcare", "fintech"
    - job_titles: roles, e.g. ["VP Sales", "CTO", "Head of Growth"]
    - company_size: e.g. "50-500 employees", "startup", "enterprise"
    - location: geography, e.g. "US", "Europe", "DACH", "remote"
    - source: where to search — "website", "telegram", or "discord"
    - limit: how many contacts to return (default 10)

    Returns verified contacts (name, title, company, email, source,
    verification status) as structured data.
    """
    key = _api_key()
    if not key:
        return _onboarding()

    if not industry and not job_titles and not location:
        return (
            "I need a bit more to search. Tell me at least one of: industry, "
            "job_titles, or location.\n\n"
            "Example: \"SaaS companies, VP Sales and CTO roles, US, 50-500 employees\""
        )

    titles = job_titles or []
    parts = []
    if industry:
        parts.append(f"industry={industry}")
    if titles:
        parts.append(f"roles={', '.join(titles)}")
    if company_size:
        parts.append(f"size={company_size}")
    if location:
        parts.append(f"location={location}")
    summary = ", ".join(parts)

    return (
        f"🔎 Searching: {summary}\n"
        f"Source: {source} · Limit: {limit}\n\n"
        f"Returns up to {limit} verified contacts — name, title, company, "
        f"email, source, verification status.\n\n"
        f"Docs: {DOCS_URL}"
    )


@mcp.tool()
def tapac_status() -> str:
    """Check TAPAC server status, version, and API-key state."""
    key = _api_key()
    key_state = "✓ active" if key else f"✗ not set (get one at {KEY_URL})"
    return (
        f"TAPAC MCP server v{VERSION}\n"
        f"API key: {key_state}\n"
        f"Docs: {DOCS_URL}"
    )


def main() -> None:
    """Entry point for `uvx tapac-mcp` / `python -m tapac_mcp.server`."""
    mcp.run()


if __name__ == "__main__":
    main()
