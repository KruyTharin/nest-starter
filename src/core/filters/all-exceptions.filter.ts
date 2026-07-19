import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  formatExceptionCause,
  formatMessage,
  getExceptionCause,
  getExceptionLogStack,
  getPrismaLogCodeFromChain,
  isExternalHttpException,
  mapException,
  MappedError,
} from '@/core/filters/exception.mapper';
import { ErrorResponse, shouldSkipResponseFormatting } from '@/core/responses';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const mapped = mapException(exception);

    this.logException(exception, mapped, request);

    const body: ErrorResponse = {
      success: false,
      ...mapped,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (shouldSkipResponseFormatting(request.url)) {
      const { success: _s, path: _p, timestamp: _t, ...plain } = body;
      response.status(mapped.statusCode).json(plain);
      return;
    }

    response.status(mapped.statusCode).json(body);
  }

  private logException(
    exception: unknown,
    mapped: MappedError,
    request: Request,
  ): void {
    const prismaCode = getPrismaLogCodeFromChain(exception);
    const shouldLog =
      prismaCode != null ||
      isExternalHttpException(exception) ||
      exception instanceof HttpException ||
      mapped.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR;

    if (!shouldLog) return;

    const tag = prismaCode
      ? `[${mapped.errorCode} prisma=${prismaCode}]`
      : isExternalHttpException(exception)
        ? `[${mapped.errorCode} upstream=${exception.upstreamStatus ?? 'n/a'}]`
        : `[${mapped.errorCode}]`;

    const cause = getExceptionCause(exception);
    const causeDetail =
      cause != null ? ` | cause: ${formatExceptionCause(cause)}` : '';
    const stack = getExceptionLogStack(exception);

    this.logger.error(
      `${request.method} ${request.url} -> ${mapped.statusCode} ${tag} | ${mapped.error}: ${formatMessage(mapped.message)}${causeDetail}`,
      stack,
    );
  }
}
