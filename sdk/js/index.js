/**
 * TAPAC SDK — official JavaScript client for the TAPAC REST API.
 * @module @tapac/sdk
 */

const DEFAULT_BASE = "https://tapacapi.com";

class TapacClient {
  constructor({ apiKey, baseUrl = DEFAULT_BASE, sandbox = false } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.sandbox = sandbox;
  }

  async _request(path, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    if (this.sandbox) headers["X-Sandbox"] = "true";
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = new Error(`TAPAC API ${res.status}: ${await res.text()}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  status() {
    return this._request("/v1/status");
  }

  findContacts({ industry, job_titles, company_size, location, source, limit } = {}) {
    return this._request("/v1/contacts/search", {
      method: "POST",
      body: { industry, job_titles, company_size, location, source, limit },
    });
  }

  verifyEmails(emails) {
    return this._request("/v1/contacts/verify", { method: "POST", body: { emails } });
  }
}

module.exports = { TapacClient, DEFAULT_BASE };
