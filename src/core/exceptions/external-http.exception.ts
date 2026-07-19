import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/core/responses/error-codes';

export type ExternalHttpErrorCode = 'HTTP' | 'TIMEOUT' | 'NETWORK' | 'ABORTED';

export interface ExternalHttpExceptionParams {
  kind: ExternalHttpErrorCode;
  method: string;
  url: string;
  message: string;
  upstreamStatus?: number;
  upstreamBody?: unknown;
  cause?: unknown;
}

const ERROR_CODE_BY_KIND: Record<ExternalHttpErrorCode, ErrorCode> = {
  HTTP: ErrorCode.EXTERNAL_HTTP_ERROR,
  TIMEOUT: ErrorCode.EXTERNAL_TIMEOUT,
  NETWORK: ErrorCode.EXTERNAL_NETWORK_ERROR,
  ABORTED: ErrorCode.EXTERNAL_ABORTED,
};

/** Internal — thrown by HttpClient only. Filter detects it for richer logs. */
export class ExternalHttpException extends HttpException {
  readonly kind: ExternalHttpErrorCode;
  readonly method: string;
  readonly url: string;
  readonly upstreamStatus?: number;
  readonly upstreamBody?: unknown;

  constructor(params: ExternalHttpExceptionParams) {
    const status =
      params.kind === 'TIMEOUT' || params.kind === 'ABORTED'
        ? HttpStatus.GATEWAY_TIMEOUT
        : HttpStatus.BAD_GATEWAY;

    const error =
      status === HttpStatus.GATEWAY_TIMEOUT ? 'Gateway Timeout' : 'Bad Gateway';

    super(
      {
        message: params.message,
        error,
        errorCode: ERROR_CODE_BY_KIND[params.kind],
      },
      status,
      toHttpOptions(params.cause),
    );

    this.kind = params.kind;
    this.method = params.method;
    this.url = params.url;
    this.upstreamStatus = params.upstreamStatus;
    this.upstreamBody = params.upstreamBody;
  }
}

function toHttpOptions(cause: unknown): HttpExceptionOptions | undefined {
  if (cause == null) return undefined;
  return { cause };
}

export function createExternalHttpException(
  params: ExternalHttpExceptionParams,
): ExternalHttpException {
  return new ExternalHttpException(params);
}
