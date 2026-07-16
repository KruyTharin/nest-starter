export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type HttpHeaders = Record<string, string>;

export interface HttpRequest<TBody = unknown> {
  method: HttpMethod;
  url: string;
  headers?: HttpHeaders;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: TBody;
  timeoutMs?: number;
}

export type HttpRequestOptions<TBody = unknown> = Omit<
  HttpRequest<TBody>,
  'method' | 'url' | 'body'
>;

export interface HttpResponse<T = unknown> {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  data: T;
}

export interface HttpClient {
  request<TResponse = unknown, TBody = unknown>(
    req: HttpRequest<TBody>,
  ): Promise<HttpResponse<TResponse>>;

  get<TResponse = unknown>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<TResponse>>;

  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions<TBody>,
  ): Promise<HttpResponse<TResponse>>;

  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions<TBody>,
  ): Promise<HttpResponse<TResponse>>;

  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions<TBody>,
  ): Promise<HttpResponse<TResponse>>;

  delete<TResponse = unknown>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<HttpResponse<TResponse>>;
}

