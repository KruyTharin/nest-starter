import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
} from '@/shared/pagination/pagination.constants';
import {
  PaginatedResult,
  PaginationMeta,
  PaginationParams,
  SortMeta,
  SortParams,
} from '@/shared/pagination/pagination.types';
import { NumberUtil } from '@/shared/utils';

type BuildPaginationMetaOptions = {
  sort?: SortParams<string>;
  filters?: Record<string, unknown>;
};

export function normalizePaginationQuery(
  page = PAGINATION_DEFAULT_PAGE,
  limit = PAGINATION_DEFAULT_LIMIT,
): PaginationParams {
  const normalizedPage = NumberUtil.clamp(page, 1, Number.MAX_SAFE_INTEGER);
  const normalizedLimit = NumberUtil.clamp(limit, 1, PAGINATION_MAX_LIMIT);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
    take: normalizedLimit,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
  options: BuildPaginationMetaOptions = {},
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const sort: SortMeta | undefined = options.sort
    ? { by: options.sort.sortBy, order: options.sort.sortOrder }
    : undefined;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1,
    ...(sort ? { sort } : {}),
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  options: BuildPaginationMetaOptions = {},
): PaginatedResult<T> {
  return {
    items,
    meta: buildPaginationMeta(total, page, limit, options),
  };
}
