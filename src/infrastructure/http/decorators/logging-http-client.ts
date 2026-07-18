import { Logger } from '@nestjs/common';
import { HttpClient, HttpRequest, HttpResponse } from '@/infrastructure/http/http.types';

export class LoggingHttpClient implements HttpClient {
  private readonly logger = new Logger('HttpClient');

  constructor(private readonly inner: HttpClient) {}

  async request<TResponse = unknown, TBody = unknown>(
    req: HttpRequest<TBody>,
  ): Promise<HttpResponse<TResponse>> {
    const start = Date.now();
    const res = await this.inner.request<TResponse, TBody>(req);
    const ms = Date.now() - start;

    this.logger.log(`${req.method} ${req.url} -> ${res.status} (${ms}ms)`);

    return res;
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
    return this.request<TResponse, never>({
      method: 'DELETE',
      url,
      ...options,
    });
  }
}
