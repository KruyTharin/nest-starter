import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

import { shouldSkipResponseFormatting, SuccessResponse } from '@/core/responses';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T> | T> {
    const request = context.switchToHttp().getRequest<Request>();

    if (shouldSkipResponseFormatting(request.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map(
        (data: T): SuccessResponse<T> => ({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        }),
      ),
    );
  }
}
