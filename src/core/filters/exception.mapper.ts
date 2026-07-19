import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { ExternalHttpException } from '@/core/exceptions/external-http.exception';
import {
  ErrorCode,
  errorCodeFromHttpStatus,
  isErrorCode,
} from '@/core/responses/error-codes';

export interface MappedError {
  statusCode: number;
  errorCode: ErrorCode;
  message: string | string[];
  error: string;
}

export function mapException(exception: unknown): MappedError {
  if (exception instanceof HttpException) {
    return mapHttpException(exception);
  }

  const prisma = mapPrismaError(exception);
  if (prisma) {
    return prisma;
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    error: 'Internal Server Error',
  };
}

export function getPrismaLogCode(exception: unknown): string | null {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    return exception.code;
  }
  if (exception instanceof Prisma.PrismaClientValidationError) {
    return 'VALIDATION_ERROR';
  }
  if (exception instanceof Prisma.PrismaClientInitializationError) {
    return 'INITIALIZATION_ERROR';
  }
  return null;
}

export function getExceptionCause(exception: unknown): unknown {
  if (exception instanceof HttpException && exception.cause != null) {
    return exception.cause;
  }

  return undefined;
}

export function getPrismaLogCodeFromChain(exception: unknown): string | null {
  return (
    getPrismaLogCode(exception) ??
    getPrismaLogCode(getExceptionCause(exception))
  );
}

export function formatExceptionCause(cause: unknown): string {
  if (cause instanceof Prisma.PrismaClientKnownRequestError) {
    return `${cause.code}: ${cause.message}`;
  }

  if (cause instanceof Error) {
    return cause.message;
  }

  return String(cause);
}

export function getExceptionLogStack(exception: unknown): string {
  const cause = getExceptionCause(exception);
  const source = cause ?? exception;

  if (source instanceof Error) {
    return source.stack ?? source.message;
  }

  return String(source);
}

export function isExternalHttpException(
  exception: unknown,
): exception is ExternalHttpException {
  return exception instanceof ExternalHttpException;
}

function mapHttpException(exception: HttpException): MappedError {
  const statusCode = exception.getStatus();
  const res = exception.getResponse();

  if (typeof res === 'string') {
    return {
      statusCode,
      errorCode: errorCodeFromHttpStatus(statusCode),
      message: res,
      error: exception.name,
    };
  }

  const body = res as Record<string, unknown>;
  const errorCode =
    typeof body.errorCode === 'string' && isErrorCode(body.errorCode)
      ? body.errorCode
      : errorCodeFromHttpStatus(statusCode);

  return {
    statusCode,
    errorCode,
    message: extractMessage(body),
    error: typeof body.error === 'string' ? body.error : exception.name,
  };
}

function mapPrismaError(exception: unknown): MappedError | null {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    return mapKnownRequestError(exception);
  }

  if (exception instanceof Prisma.PrismaClientValidationError) {
    return mapped(
      HttpStatus.BAD_REQUEST,
      ErrorCode.DB_INVALID_QUERY,
      'Invalid database query',
      'Bad Request',
    );
  }

  if (exception instanceof Prisma.PrismaClientInitializationError) {
    return mapped(
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCode.DB_CONNECTION_FAILED,
      'Database connection failed',
      'Service Unavailable',
    );
  }

  return null;
}

function mapKnownRequestError(
  exception: Prisma.PrismaClientKnownRequestError,
): MappedError {
  switch (exception.code) {
    case 'P2002':
      return mapped(
        HttpStatus.CONFLICT,
        ErrorCode.DB_UNIQUE_VIOLATION,
        uniqueConstraintMessage(exception.meta),
        'Conflict',
      );
    case 'P2025':
    case 'P2001':
      return mapped(
        HttpStatus.NOT_FOUND,
        ErrorCode.DB_RECORD_NOT_FOUND,
        'Record not found',
        'Not Found',
      );
    case 'P2003':
      return mapped(
        HttpStatus.BAD_REQUEST,
        ErrorCode.DB_FK_VIOLATION,
        'Related record was not found',
        'Bad Request',
      );
    case 'P2000':
    case 'P2014':
    case 'P2016':
      return mapped(
        HttpStatus.BAD_REQUEST,
        ErrorCode.DB_INVALID_QUERY,
        'Invalid database query',
        'Bad Request',
      );
    case 'P2021':
      return mapped(
        HttpStatus.SERVICE_UNAVAILABLE,
        ErrorCode.DB_TABLE_UNAVAILABLE,
        'Database table is unavailable',
        'Service Unavailable',
      );
    default:
      return mapped(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.DB_ERROR,
        'Database error',
        'Internal Server Error',
      );
  }
}

function mapped(
  statusCode: number,
  errorCode: ErrorCode,
  message: string,
  error: string,
): MappedError {
  return { statusCode, errorCode, message, error };
}

function uniqueConstraintMessage(meta?: Record<string, unknown>): string {
  const target = meta?.target;

  if (Array.isArray(target) && target.length > 0) {
    return `Duplicate value for: ${target.join(', ')}`;
  }

  if (typeof target === 'string' && target.length > 0) {
    return `Duplicate value for: ${target}`;
  }

  return 'A record with this value already exists';
}

function extractMessage(body: Record<string, unknown>): string | string[] {
  const message = body.message;

  if (typeof message === 'string' || Array.isArray(message)) return message;
  if (message != null) return JSON.stringify(message);

  return 'An unexpected error occurred';
}

function formatMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join(', ') : message;
}

export { formatMessage };
