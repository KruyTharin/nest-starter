import { buildPaginatedResult } from '@/shared/pagination/pagination.util';
import {
  PaginatedResult,
  PaginationParams,
} from '@/shared/pagination/pagination.types';

type PaginateOptions<T> = {
  pagination: PaginationParams;
  findMany: (skip: number, take: number) => Promise<T[]>;
  count: () => Promise<number>;
};

export async function paginate<T>(
  options: PaginateOptions<T>,
): Promise<PaginatedResult<T>> {
  const { pagination, findMany, count } = options;

  const [items, total] = await Promise.all([
    findMany(pagination.skip, pagination.take),
    count(),
  ]);

  return buildPaginatedResult(items, total, pagination.page, pagination.limit);
}
