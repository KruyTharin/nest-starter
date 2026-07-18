import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PaginationQueryDto } from '@/shared/pagination/dto/pagination-query.dto';
import { SortOrder } from '@/shared/pagination/pagination.types';

export const USER_SORT_FIELDS = [
  'createdAt',
  'email',
  'name',
  'updatedAt',
] as const;

export type UserSortField = (typeof USER_SORT_FIELDS)[number];

export class FindUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search by email or name',
    example: 'jane',
  })
  @IsOptional()
  @IsString() 
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: USER_SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(USER_SORT_FIELDS)
  sortBy?: UserSortField = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortOrder,
    default: SortOrder.Desc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.Desc;
}
