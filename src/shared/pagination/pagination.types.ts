export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface SortParams<TField extends string = string> {
  sortBy: TField;
  sortOrder: SortOrder;
}

export interface SortMeta {
  by: string;
  order: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  sort?: SortMeta;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListMetaOptions {
  sort?: SortParams<string>;
  filters?: Record<string, unknown>;
}
