"""End-to-end: install via uvx one-liner + full MCP handshake."""
import asyncio

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    params = StdioServerParameters(
        command="uvx",
        args=["--from", "git+https://github.com/axelfreeman/tapac-mcp", "tapac-mcp"],
        env={"TAPAC_API_KEY": "e2e_test_key"},
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print("TOOLS:", sorted(t.name for t in tools.tools))
            r = await session.call_tool(
                "tapac_find_contacts",
                {"industry": "fintech", "job_titles": ["CFO"], "location": "EU", "limit": 5},
            )
            print("--- result ---")
            print(r.content[0].text if r.content else r)


if __name__ == "__main__":
    asyncio.run(main())
