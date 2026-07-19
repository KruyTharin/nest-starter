export const HTTP_CLIENT = Symbol('HTTP_CLIENT');

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type HttpHeaders = Record<string, string>;
export type HttpQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface HttpRequestOptions {
  headers?: HttpHeaders;
  query?: HttpQuery;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface HttpRequest<TBody = unknown> extends HttpRequestOptions {
  method: HttpMethod;
  url: string;
  body?: TBody;
}

export interface HttpResponse<T = unknown> {
  status: number;
  headers: HttpHeaders;
  data: T;
}

export interface HttpClient {
  request<T = unknown>(req: HttpRequest): Promise<HttpResponse<T>>;
  get<T = unknown>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<T>>;
  post<T = unknown>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<T>>;
  put<T = unknown>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<T>>;
  patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<T>>;
  delete<T = unknown>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<T>>;
}
