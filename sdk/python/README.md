# tapac-sdk

Official Python SDK for [TAPAC](https://tapacapi.com) — find and verify B2B contacts programmatically.

TAPAC scrapes business contacts from company websites, Discord communities, and Telegram channels, then validates emails in real time via SMTP (2–5% bounce rate vs. the 25–35% industry average). This SDK wraps the TAPAC REST API.

## Install

```bash
pip install tapac-sdk
```

## Quick start

```python
from tapac_sdk import TapacClient

client = TapacClient(api_key="your-api-key")

# Service status
print(client.status())

# Find contacts
result = client.find_contacts(
    industry="fintech",
    job_titles=["CEO", "CTO"],
    location="Singapore",
    source="website",
    limit=10,
)

# Verify emails in real time
verified = client.verify_emails(["alex@example.com", "sam@example.com"])
```

## Sandbox mode

Pass `sandbox=True` to exercise the API without real lookups:

```python
client = TapacClient(sandbox=True)
```

## Authentication

Pass your API key to `TapacClient(api_key=...)`. The client sends it as a `Bearer` token. Keys are issued from the TAPAC developer portal at [tapacapi.com/developers](https://tapacapi.com/developers).

## Requirements

- Python 3.9+
- [`httpx`](https://www.python-httpx.dev/) (installed automatically)

## License

MIT
