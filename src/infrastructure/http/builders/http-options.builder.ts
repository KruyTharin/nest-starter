import { HttpHeaders, HttpRequestOptions } from '@/infrastructure/http/http.types';

export class HttpOptionsBuilder {
  private requestHeaders: HttpHeaders = {};
  private queryParams: Record<string, string | number | boolean> = {};
  private requestTimeoutMs?: number;

  header(key: string, value: string): this {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (trimmedKey && trimmedValue) {
      this.requestHeaders[trimmedKey] = trimmedValue;
    }

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

  queryParam(
    key: string,
    value: string | number | boolean | null | undefined,
  ): this {
    if (value !== null && value !== undefined && value !== '') {
      this.queryParams[key] = value;
    }

    return this;
  }

  timeout(ms: number): this {
    this.requestTimeoutMs = ms;
    return this;
  }

  build(): HttpRequestOptions {
    const options: HttpRequestOptions = {};

    if (Object.keys(this.requestHeaders).length) {
      options.headers = this.requestHeaders;
    }

    if (Object.keys(this.queryParams).length) {
      options.query = this.queryParams;
    }

    if (this.requestTimeoutMs !== undefined) {
      options.timeoutMs = this.requestTimeoutMs;
    }

    return options;
  }
}
