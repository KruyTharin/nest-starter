export const ErrorCode = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  HTTP_BAD_REQUEST: 'HTTP_BAD_REQUEST',
  HTTP_UNAUTHORIZED: 'HTTP_UNAUTHORIZED',
  HTTP_FORBIDDEN: 'HTTP_FORBIDDEN',
  HTTP_NOT_FOUND: 'HTTP_NOT_FOUND',
  HTTP_CONFLICT: 'HTTP_CONFLICT',
  HTTP_UNPROCESSABLE_ENTITY: 'HTTP_UNPROCESSABLE_ENTITY',
  HTTP_TOO_MANY_REQUESTS: 'HTTP_TOO_MANY_REQUESTS',
  HTTP_BAD_GATEWAY: 'HTTP_BAD_GATEWAY',
  HTTP_GATEWAY_TIMEOUT: 'HTTP_GATEWAY_TIMEOUT',
  HTTP_SERVICE_UNAVAILABLE: 'HTTP_SERVICE_UNAVAILABLE',
  HTTP_ERROR: 'HTTP_ERROR',

  DB_UNIQUE_VIOLATION: 'DB_UNIQUE_VIOLATION',
  DB_RECORD_NOT_FOUND: 'DB_RECORD_NOT_FOUND',
  DB_FK_VIOLATION: 'DB_FK_VIOLATION',
  DB_INVALID_QUERY: 'DB_INVALID_QUERY',
  DB_TABLE_UNAVAILABLE: 'DB_TABLE_UNAVAILABLE',
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_ERROR: 'DB_ERROR',

  EXTERNAL_HTTP_ERROR: 'EXTERNAL_HTTP_ERROR',
  EXTERNAL_TIMEOUT: 'EXTERNAL_TIMEOUT',
  EXTERNAL_NETWORK_ERROR: 'EXTERNAL_NETWORK_ERROR',
  EXTERNAL_ABORTED: 'EXTERNAL_ABORTED',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const ERROR_CODE_SET = new Set<string>(Object.values(ErrorCode));

export function isErrorCode(value: string): value is ErrorCode {
  return ERROR_CODE_SET.has(value);
}

export function errorCodeFromHttpStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.HTTP_BAD_REQUEST;
    case 401:
      return ErrorCode.HTTP_UNAUTHORIZED;
    case 403:
      return ErrorCode.HTTP_FORBIDDEN;
    case 404:
      return ErrorCode.HTTP_NOT_FOUND;
    case 409:
      return ErrorCode.HTTP_CONFLICT;
    case 422:
      return ErrorCode.HTTP_UNPROCESSABLE_ENTITY;
    case 429:
      return ErrorCode.HTTP_TOO_MANY_REQUESTS;
    case 502:
      return ErrorCode.HTTP_BAD_GATEWAY;
    case 503:
      return ErrorCode.HTTP_SERVICE_UNAVAILABLE;
    case 504:
      return ErrorCode.HTTP_GATEWAY_TIMEOUT;
    default:
      return status >= 500
        ? ErrorCode.INTERNAL_SERVER_ERROR
        : ErrorCode.HTTP_ERROR;
  }
}
