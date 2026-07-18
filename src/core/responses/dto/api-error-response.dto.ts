import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorResponse } from '@/core/responses/response.types';

export class ApiErrorResponseDto implements ErrorResponse {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Validation failed' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be an email'],
      },
    ],
  })
  message!: string | string[];

  @ApiPropertyOptional({ example: 'Bad Request' })
  error?: string;

  @ApiProperty({ example: '/api/v1/users' })
  path!: string;

  @ApiProperty({ example: '2026-02-17T07:49:00.000Z' })
  timestamp!: string;
}
