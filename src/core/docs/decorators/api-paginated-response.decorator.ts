import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationMetaDto } from '@/core/responses/dto/pagination-meta.dto';

export function ApiPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(model, PaginationMetaDto),
    ApiOkResponse({
      description: 'Paginated list',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          timestamp: {
            type: 'string',
            example: '2026-07-18T08:00:00.000Z',
          },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: { $ref: getSchemaPath(PaginationMetaDto) },
            },
            required: ['items', 'meta'],
          },
        },
        required: ['success', 'data', 'timestamp'],
      },
    }),
  );
}
