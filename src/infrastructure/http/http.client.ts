import { Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  createExternalHttpException,
  ExternalHttpErrorCode,
} from '@/core/exceptions/external-http.exception';
import {
  HttpClient,
  HttpHeaders,
  HttpQuery,
  HttpRequest,
  HttpRequestOptions,
  HttpResponse,
} from '@/infrastructure/http/http.types';

type TimedConfig = InternalAxiosRequestConfig & {
  metadata?: { startedAt: number };
};

export interface AppHttpClientOptions {
  baseURL?: string;
  timeoutMs: number;
  defaultHeaders?: HttpHeaders;
  loggingEnabled?: boolean;
}

const DEFAULT_HEADERS: HttpHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export class AppHttpClient implements HttpClient {
  private readonly client: AxiosInstance;
  private readonly timeoutMs: number;
  private readonly logger = new Logger(AppHttpClient.name);

  constructor(options: AppHttpClientOptions) {
    this.timeoutMs = options.timeoutMs;
    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeoutMs,
      headers: options.defaultHeaders ?? DEFAULT_HEADERS,
    });

    if (options.loggingEnabled) {
      this.enableLogging();
    }
  }

  async request<T = unknown>(req: HttpRequest): Promise<HttpResponse<T>> {
    try {
      const res = await this.client.request<T>({
        method: req.method,
        url: req.url,
        params: cleanQuery(req.query),
        data: req.body,
        headers: req.headers,
        timeout: req.timeoutMs ?? this.timeoutMs,
        signal: req.signal,
      });

      return {
        status: res.status,
        headers: flattenHeaders(res.headers),
        data: res.data,
      };
    } catch (error) {
      throw mapAxiosError(error, req.method, req.url);
    }
  }

  get<T = unknown>(url: string, options?: HttpRequestOptions) {
    return this.request<T>({ method: 'GET', url, ...options });
  }

  post<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>({ method: 'POST', url, body, ...options });
  }

  put<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>({ method: 'PUT', url, body, ...options });
  }

  patch<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>({ method: 'PATCH', url, body, ...options });
  }

  delete<T = unknown>(url: string, options?: HttpRequestOptions) {
    return this.request<T>({ method: 'DELETE', url, ...options });
  }

  private enableLogging(): void {
    this.client.interceptors.request.use((config: TimedConfig) => {
      config.metadata = { startedAt: Date.now() };
      return config;
    });

    this.client.interceptors.response.use(
      (res) => {
        this.logger.log(formatLog(res.config as TimedConfig, res.status));
        return res;
      },
      (error: AxiosError) => {
        this.logger.warn(
          formatLog(
            error.config as TimedConfig | undefined,
            error.response?.status ?? error.code ?? 'ERR',
          ),
        );
        return Promise.reject(error);
      },
    );
  }
}

function cleanQuery(query?: HttpQuery) {
  if (!query) return undefined;

  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== '') out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

function flattenHeaders(headers: Record<string, unknown>): HttpHeaders {
  const out: HttpHeaders = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') out[key] = value;
    else if (Array.isArray(value)) out[key] = value.join(', ');
    else if (value != null) out[key] = String(value);
  }
  return out;
}

function formatLog(config: TimedConfig | undefined, status: number | string) {
  const method = (config?.method ?? 'GET').toUpperCase();
  const url = config?.url ?? '';
  const startedAt = config?.metadata?.startedAt;
  const ms = startedAt !== undefined ? ` (${Date.now() - startedAt}ms)` : '';
  return `${method} ${url} -> ${status}${ms}`;
}

function mapAxiosError(error: unknown, method: string, url: string) {
  if (!axios.isAxiosError(error)) {
    return externalFail('NETWORK', method, url, 'External request failed');
  }

  if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
    return externalFail('ABORTED', method, url, `External request aborted: ${method} ${url}`);
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return externalFail('TIMEOUT', method, url, `External request timed out: ${method} ${url}`);
  }

  if (error.response) {
    return createExternalHttpException({
      kind: 'HTTP',
      method,
      url,
      upstreamStatus: error.response.status,
      upstreamBody: error.response.data,
      message: `External request failed with status ${error.response.status}`,
    });
  }

  return externalFail('NETWORK', method, url, `External request network error: ${method} ${url}`);
}

function externalFail(
  kind: ExternalHttpErrorCode,
  method: string,
  url: string,
  message: string,
) {
  return createExternalHttpException({ kind, method, url, message });
}
