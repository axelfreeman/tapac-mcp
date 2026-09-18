/**
 * TAPAC SDK — official JavaScript client for the TAPAC REST API.
 *
 *   const { TapacClient } = require("@tapacapi/sdk");
 *   const tapac = new TapacClient({ apiKey: process.env.TAPAC_API_KEY });
 *   const { contacts } = await tapac.findContacts({ industry: "SaaS", limit: 10 });
 *
 * Docs: https://tapacapi.com/developers · Keys: https://tapacapi.com/get-key
 * @module @tapacapi/sdk
 */

const DEFAULT_BASE = "https://tapacapi.com";
const DEFAULT_TIMEOUT_MS = 60000;
const DEFAULT_RETRIES = 2;

/** Error thrown for any non-2xx response. Carries `status` and the parsed `body`. */
class TapacError extends Error {
  constructor(message, { status = 0, body = null, url = "" } = {}) {
    super(message);
    this.name = "TapacError";
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class TapacClient {
  /**
   * @param {object} [options]
   * @param {string} [options.apiKey]  TAPAC API key (Bearer). Free key: https://tapacapi.com/get-key
   * @param {string} [options.baseUrl] Defaults to https://tapacapi.com
   * @param {boolean} [options.sandbox] Send `X-Sandbox: true` — sample data, no production side effects
   * @param {number} [options.timeoutMs] Per-request timeout (default 60000)
   * @param {number} [options.retries] Retries for 429/5xx/network errors (default 2)
   */
  constructor({ apiKey, baseUrl = DEFAULT_BASE, sandbox = false, timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES } = {}) {
    if (!baseUrl || typeof baseUrl !== "string") throw new TypeError("baseUrl must be a non-empty string");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.sandbox = sandbox;
    this.timeoutMs = timeoutMs;
    this.retries = retries;
  }

  async _request(path, { method = "GET", body, query } = {}) {
    let url = `${this.baseUrl}${path}`;
    if (query) {
      const qs = new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""),
      ).toString();
      if (qs) url += `?${qs}`;
    }

    const headers = { "Content-Type": "application/json", Accept: "application/json" };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    if (this.sandbox) headers["X-Sandbox"] = "true";

    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(url, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { raw: text };
        }
        if (!res.ok) {
          const err = new TapacError(
            `TAPAC API ${res.status} ${method} ${path}: ${(data && (data.detail || data.error)) || text.slice(0, 200)}`,
            { status: res.status, body: data, url },
          );
          if ((res.status === 429 || res.status >= 500) && attempt < this.retries) {
            lastError = err;
            await sleep(300 * (attempt + 1) ** 2);
            continue;
          }
          throw err;
        }
        return data;
      } catch (err) {
        if (err instanceof TapacError) throw err;
        lastError = err;
        if (attempt < this.retries) {
          await sleep(300 * (attempt + 1) ** 2);
          continue;
        }
        throw new TapacError(`TAPAC request failed: ${err.message}`, { url });
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  /** GET /health — unauthenticated liveness probe. */
  health() {
    return this._request("/health");
  }

  /** GET /v1/status — API version, key state and remaining quota. */
  status() {
    return this._request("/v1/status");
  }

  /**
   * POST /v1/contacts/search — find B2B contacts, every email SMTP-verified in the same call.
   * @param {object} [params]
   * @param {string} [params.industry]
   * @param {string[]} [params.job_titles]
   * @param {string} [params.company_size]
   * @param {string} [params.location]
   * @param {"website"|"telegram"|"discord"} [params.source]
   * @param {number} [params.limit]
   */
  findContacts({ industry, job_titles, company_size, location, source, limit } = {}) {
    const body = {};
    if (industry !== undefined) body.industry = industry;
    if (job_titles !== undefined) body.job_titles = job_titles;
    if (company_size !== undefined) body.company_size = company_size;
    if (location !== undefined) body.location = location;
    if (source !== undefined) body.source = source;
    if (limit !== undefined) body.limit = limit;
    return this._request("/v1/contacts/search", { method: "POST", body });
  }

  /**
   * POST /v1/contacts/verify — SMTP-verify a batch of addresses.
   * @param {string[]} emails
   */
  verifyEmails(emails) {
    if (!Array.isArray(emails)) throw new TypeError("verifyEmails(emails) expects an array of addresses");
    return this._request("/v1/contacts/verify", { method: "POST", body: { emails } });
  }

  /** GET /v1/contacts/{id} — fetch one previously found contact. */
  getContact(contactId) {
    if (!contactId) throw new TypeError("getContact(id) expects a contact id");
    return this._request(`/v1/contacts/${encodeURIComponent(contactId)}`);
  }

  /** POST /ask — natural-language query answered by the API (NLWeb). */
  ask(query, { limit } = {}) {
    return this._request("/ask", { method: "POST", body: { query, limit } });
  }

  /** GET /metrics — per-endpoint access counts for the current key. */
  metrics() {
    return this._request("/metrics");
  }
}

module.exports = { TapacClient, TapacError, DEFAULT_BASE, DEFAULT_TIMEOUT_MS };
