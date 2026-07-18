import { ApiProperty } from '@nestjs/swagger';

type StatusList = Record<string, { status: string }>;

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({
    example: {
      database: { status: 'up' },
    },
  })
  info: StatusList = {};

  @ApiProperty({
    example: {},
  })
  error: Record<string, unknown> = {};

  @ApiProperty({
    example: {
      database: { status: 'up' },
    },
  })
  details: StatusList = {};
}
