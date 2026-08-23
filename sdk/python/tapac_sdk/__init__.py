"""TAPAC SDK — official Python client for the TAPAC REST API."""
from __future__ import annotations

import httpx

DEFAULT_BASE = "https://tapacapi.com"


class TapacClient:
    def __init__(self, api_key: str | None = None, base_url: str = DEFAULT_BASE, sandbox: bool = False):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.sandbox = sandbox

    def _headers(self) -> dict:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        if self.sandbox:
            h["X-Sandbox"] = "true"
        return h

    def _request(self, method: str, path: str, **kwargs):
        r = httpx.request(method, f"{self.base_url}{path}", headers=self._headers(), **kwargs)
        r.raise_for_status()
        return r.json()

    def status(self) -> dict:
        return self._request("GET", "/v1/status")

    def find_contacts(self, industry="", job_titles=None, company_size="", location="", source="website", limit=10) -> dict:
        return self._request("POST", "/v1/contacts/search", json={
            "industry": industry,
            "job_titles": job_titles or [],
            "company_size": company_size,
            "location": location,
            "source": source,
            "limit": limit,
        })

    def verify_emails(self, emails: list[str]) -> dict:
        return self._request("POST", "/v1/contacts/verify", json={"emails": emails})
