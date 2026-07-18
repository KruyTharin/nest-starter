import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorResponse, shouldSkipResponseFormatting } from '@/core/responses';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (shouldSkipResponseFormatting(request.url)) {
      if (exception instanceof HttpException) {
        response.status(exception.getStatus()).json(exception.getResponse());
        return;
      }

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = this.buildErrorResponse(
      exception,
      status,
      request.url,
    );

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    status: number,
    path: string,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          success: false,
          statusCode: status,
          message: exceptionResponse,
          path,
          timestamp,
        };
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as Record<string, unknown>;
        const message = this.extractMessage(body);

        return {
          success: false,
          statusCode: status,
          message,
          error:
            typeof body.error === 'string' ? body.error : exception.name,
          path,
          timestamp,
        };
      }
    }

    return {
      success: false,
      statusCode: status,
      message: 'Internal server error',
      error: 'Internal Server Error',
      path,
      timestamp,
    };
  }

  private extractMessage(body: Record<string, unknown>): string | string[] {
    const message = body.message;

    if (typeof message === 'string' || Array.isArray(message)) {
      return message;
    }

    if (typeof message === 'object' && message !== null) {
      return JSON.stringify(message);
    }

    return 'An unexpected error occurred';
  }
}
