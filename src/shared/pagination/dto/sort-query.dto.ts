import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { SortOrder } from '@/shared/pagination/pagination.types';

export class SortQueryDto {
  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortOrder,
    default: SortOrder.Desc,
    example: SortOrder.Desc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.Desc;
}
