import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationMeta, SortOrder } from '@/shared/pagination';

class SortMetaDto {
  @ApiProperty({ example: 'createdAt' })
  by!: string;

  @ApiProperty({ enum: SortOrder, example: SortOrder.Desc })
  order!: SortOrder;
}

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;

  @ApiPropertyOptional({ type: SortMetaDto })
  sort?: SortMetaDto;
}
