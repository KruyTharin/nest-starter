import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ApiErrorResponseDto } from '@/core/responses';

export function ApiStandardErrorResponses(
  ...statusCodes: number[]
): MethodDecorator & ClassDecorator {
  const defaults = statusCodes.length > 0 ? statusCodes : [400, 404, 500];

  return applyDecorators(
    ...defaults.map((status) =>
      ApiResponse({ status, type: ApiErrorResponseDto }),
    ),
  );
}
