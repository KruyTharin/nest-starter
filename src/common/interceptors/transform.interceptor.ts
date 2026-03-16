import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

import { Response } from '@/common/dtos/api-response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T> | T> {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip transformation for health checks and documentation
    if (
      request.url.includes('/health') ||
      request.url.includes('/docs') ||
      request.url.includes('/reference')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map(
        (data: T): Response<T> => ({
          data,
          timestamp: new Date().toISOString(),
        }),
      ),
    );
  }
}
