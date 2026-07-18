import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  name?: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiPropertyOptional({ example: '2026-07-18T08:00:00.000Z' })
  lastLoginAt?: Date | null;

  @ApiProperty({ example: '2026-07-18T08:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-18T08:00:00.000Z' })
  updatedAt!: Date;
}
