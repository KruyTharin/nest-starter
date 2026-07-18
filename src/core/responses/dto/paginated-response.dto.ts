import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaginationMetaDto } from '@/core/responses/dto/pagination-meta.dto';
import { PaginatedResult } from '@/shared/pagination';

export class PaginatedResponseDto<T> implements PaginatedResult<T> {
  @ApiProperty({ isArray: true })
  items!: T[];

  @ApiProperty({ type: PaginationMetaDto })
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}
