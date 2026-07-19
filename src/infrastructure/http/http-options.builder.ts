import {
  HttpHeaders,
  HttpQuery,
  HttpRequestOptions,
} from '@/infrastructure/http/http.types';

export class HttpOptionsBuilder {
  private readonly requestHeaders: HttpHeaders = {};
  private readonly queryParams: Record<string, string | number | boolean> = {};
  private timeoutMs?: number;
  private abortSignal?: AbortSignal;

  header(key: string, value: string): this {
    const k = key.trim();
    const v = value.trim();
    if (k && v) this.requestHeaders[k] = v;
    return this;
  }

  headers(values: HttpHeaders): this {
    for (const [key, value] of Object.entries(values)) {
      this.header(key, value);
    }
    return this;
  }

  bearerToken(token: string): this {
    return this.header('Authorization', `Bearer ${token.trim()}`);
  }

  queryParam(key: string, value: HttpQuery[string]): this {
    if (value != null && value !== '') this.queryParams[key] = value;
    return this;
  }

  timeout(ms: number): this {
    this.timeoutMs = ms;
    return this;
  }

  signal(signal: AbortSignal): this {
    this.abortSignal = signal;
    return this;
  }

  build(): HttpRequestOptions {
    return {
      ...(Object.keys(this.requestHeaders).length && {
        headers: { ...this.requestHeaders },
      }),
      ...(Object.keys(this.queryParams).length && {
        query: { ...this.queryParams },
      }),
      ...(this.timeoutMs !== undefined && { timeoutMs: this.timeoutMs }),
      ...(this.abortSignal && { signal: this.abortSignal }),
    };
  }
}
