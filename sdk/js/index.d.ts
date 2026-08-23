export interface TapacClientOptions {
  apiKey?: string;
  baseUrl?: string;
  sandbox?: boolean;
}

export interface ContactSearchParams {
  industry?: string;
  job_titles?: string[];
  company_size?: string;
  location?: string;
  source?: string;
  limit?: number;
}

export class TapacClient {
  constructor(options?: TapacClientOptions);
  apiKey?: string;
  baseUrl: string;
  sandbox: boolean;
  status(): Promise<any>;
  findContacts(params?: ContactSearchParams): Promise<any>;
  verifyEmails(emails: string[]): Promise<any>;
}

export const DEFAULT_BASE: string;
