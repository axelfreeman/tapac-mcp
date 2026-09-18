/** Type definitions for @tapacapi/sdk (TAPAC REST API client). */

export interface TapacClientOptions {
  /** TAPAC API key sent as `Authorization: Bearer <key>`. Free key: https://tapacapi.com/get-key */
  apiKey?: string;
  /** Defaults to https://tapacapi.com */
  baseUrl?: string;
  /** Send `X-Sandbox: true` — sample data, no production side effects. */
  sandbox?: boolean;
  /** Per-request timeout in ms (default 60000). */
  timeoutMs?: number;
  /** Retries for 429/5xx/network errors (default 2). */
  retries?: number;
}

export interface ContactSearchParams {
  industry?: string;
  job_titles?: string[];
  company_size?: string;
  location?: string;
  source?: "website" | "telegram" | "discord";
  limit?: number;
}

export interface TapacContact {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  source?: string;
  verification?: string;
  [key: string]: unknown;
}

export interface TapacSearchResult {
  ok?: boolean;
  contacts?: TapacContact[];
  [key: string]: unknown;
}

export interface TapacStatus {
  ok?: boolean;
  version?: string;
  [key: string]: unknown;
}

export class TapacError extends Error {
  constructor(message: string, options?: { status?: number; body?: unknown; url?: string });
  status: number;
  body: unknown;
  url: string;
}

export class TapacClient {
  constructor(options?: TapacClientOptions);
  apiKey?: string;
  baseUrl: string;
  sandbox: boolean;
  timeoutMs: number;
  retries: number;
  health(): Promise<{ status?: string; [k: string]: unknown }>;
  status(): Promise<TapacStatus>;
  findContacts(params?: ContactSearchParams): Promise<TapacSearchResult>;
  verifyEmails(emails: string[]): Promise<{ results?: Array<{ email: string; [k: string]: unknown }>; [k: string]: unknown }>;
  getContact(contactId: string): Promise<TapacContact>;
  ask(query: string, options?: { limit?: number }): Promise<unknown>;
  metrics(): Promise<Record<string, unknown>>;
}

export const DEFAULT_BASE: string;
export const DEFAULT_TIMEOUT_MS: number;

declare const _default: {
  TapacClient: typeof TapacClient;
  TapacError: typeof TapacError;
  DEFAULT_BASE: string;
  DEFAULT_TIMEOUT_MS: number;
};
export default _default;
