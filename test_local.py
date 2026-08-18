"""Local stdio test for the TAPAC MCP server."""
import asyncio
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "tapac_mcp.server"],
        env={},
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print("TOOLS:", sorted(t.name for t in tools.tools))

            r = await session.call_tool("tapac_status", {})
            print("\n--- tapac_status ---")
            print(r.content[0].text if r.content else r)

            r = await session.call_tool(
                "tapac_find_contacts",
                {"industry": "SaaS", "job_titles": ["VP Sales"], "location": "US", "limit": 20},
            )
            print("\n--- tapac_find_contacts (no key) ---")
            print(r.content[0].text if r.content else r)

            r = await session.call_tool("tapac_find_contacts", {"industry": "", "location": ""})
            print("\n--- tapac_find_contacts (empty target, no key) ---")
            print(r.content[0].text if r.content else r)


if __name__ == "__main__":
    asyncio.run(main())
