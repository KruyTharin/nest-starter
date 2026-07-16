import axios, { AxiosError, AxiosInstance } from 'axios';
import { HttpClient, HttpRequest, HttpResponse } from '../http.types';

export const DEFAULT_HTTP_HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export interface AppHttpClientOptions {
  baseURL?: string;
  timeoutMs: number;
  defaultHeaders?: Record<string, string>;
}

function toQueryParams(
  query?: HttpRequest['query'],
): Record<string, string | number | boolean> | undefined {
  if (!query) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(query)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export class AppHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(private readonly options: AppHttpClientOptions) {
    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeoutMs,
      headers: options.defaultHeaders ?? DEFAULT_HTTP_HEADERS,
      // Do not throw on non-2xx by default; we want a consistent response shape.
      validateStatus: () => true,
    });
  }

  async request<TResponse = unknown, TBody = unknown>(
    req: HttpRequest<TBody>,
  ): Promise<HttpResponse<TResponse>> {
    try {
      const res = await this.client.request<TResponse>({
        method: req.method,
        url: req.url,
        params: toQueryParams(req.query),
        data: req.body,
        headers: req.headers,
        timeout: req.timeoutMs ?? this.options.timeoutMs,
      });

      return {
        status: res.status,
        headers: res.headers as Record<string, string | string[] | undefined>,
        data: res.data,
      };
    } catch (err) {
      const e = err as AxiosError;
      // Network/timeout/DNS/etc. Create a synthetic response.
      const code = (e as any)?.code as string | undefined;
      const status = code === 'ECONNABORTED' ? 408 : 0;
      return {
        status,
        headers: {},
        data: undefined as unknown as TResponse,
      };
    }
  }

  get<TResponse = unknown>(
    url: string,
    options?: Omit<HttpRequest<never>, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, never>({ method: 'GET', url, ...options });
  }

  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Omit<HttpRequest<TBody>, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>({
      method: 'POST',
      url,
      body,
      ...options,
    });
  }

  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Omit<HttpRequest<TBody>, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>({
      method: 'PUT',
      url,
      body,
      ...options,
    });
  }

  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Omit<HttpRequest<TBody>, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>({
      method: 'PATCH',
      url,
      body,
      ...options,
    });
  }

  delete<TResponse = unknown>(
    url: string,
    options?: Omit<HttpRequest<never>, 'method' | 'url' | 'body'>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, never>({ method: 'DELETE', url, ...options });
  }
}
