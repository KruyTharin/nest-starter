import { ApiProperty } from '@nestjs/swagger';

import { SuccessResponse } from '@/core/responses/response.types';

export class ApiSuccessResponseDto<T> implements SuccessResponse<T> {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty()
  data!: T;

  @ApiProperty({ example: '2026-02-17T07:49:00.000Z' })
  timestamp!: string;
}
