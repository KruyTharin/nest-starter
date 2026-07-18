import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
} from '@/shared/pagination/pagination.constants';
import {
  PaginatedResult,
  PaginationMeta,
  PaginationParams,
} from '@/shared/pagination/pagination.types';

export function normalizePaginationQuery(
  page = PAGINATION_DEFAULT_PAGE,
  limit = PAGINATION_DEFAULT_LIMIT,
): PaginationParams {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(
    Math.max(1, limit),
    PAGINATION_MAX_LIMIT,
  );

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
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    items,
    meta: buildPaginationMeta(total, page, limit),
  };
}
