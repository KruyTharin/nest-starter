import { ApiProperty } from '@nestjs/swagger';

export interface Response<T> {
  data: T;
  timestamp: string;
}

export class ApiResponseDto<T> implements Response<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2026-02-17T07:49:00.000Z' })
  timestamp: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({
    example: {
      database: 'up',
      memory_heap: 'up',
    },
  })
  details: Record<string, string>;
}
