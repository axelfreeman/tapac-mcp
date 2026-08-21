#!/usr/bin/env python3
"""TAPAC demo — exercise the MCP tools without wiring the server.

Run:  uv run scripts/demo.py   (installs deps from pyproject.toml)
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from tapac_mcp.server import tapac_status, tapac_find_contacts  # noqa: E402

bar = "=" * 62

print(bar)
print(tapac_status())
print(bar)
print(
    tapac_find_contacts(
        industry="SaaS",
        job_titles=["VP Sales", "CTO"],
        company_size="50-500 employees",
        location="US",
        source="website",
        limit=10,
    )
)
print(bar)
