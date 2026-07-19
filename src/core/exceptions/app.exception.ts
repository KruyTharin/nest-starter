import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

import { ErrorCode, isErrorCode } from '@/core/responses/error-codes';

export interface AppExceptionBody {
  message: string | string[];
  error: string;
  errorCode: ErrorCode;
}

export class AppException extends HttpException {
  constructor(
    status: HttpStatus,
    body: AppExceptionBody,
    options?: HttpExceptionOptions,
  ) {
    super(body, status, options);
  }
}

export function isAppException(exception: unknown): exception is AppException {
  return exception instanceof AppException;
}

export function isAppExceptionBody(value: unknown): value is AppExceptionBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    (typeof body.message === 'string' || Array.isArray(body.message)) &&
    typeof body.error === 'string' &&
    typeof body.errorCode === 'string' &&
    isErrorCode(body.errorCode)
  );
}
