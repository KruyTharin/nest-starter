import {
  buildExactFilter,
  buildTextSearchFilter,
  mergeWhereClauses,
} from '@/shared/pagination/filter.util';
import { normalizePaginationQuery } from '@/shared/pagination/pagination.util';
import { buildPrismaOrderBy, resolveSort } from '@/shared/pagination/sort.util';
import { FindUsersQueryDto, USER_SORT_FIELDS } from './dto/find-users-query.dto';



export function buildUserListQuery(query: FindUsersQueryDto) {
  const pagination = normalizePaginationQuery(query.page, query.limit);
  const sort = resolveSort(query.sortBy, query.sortOrder, {
    allowedFields: USER_SORT_FIELDS,
    defaultField: 'createdAt',
  });

  const where = mergeWhereClauses(
    buildTextSearchFilter(query.search, ['email', 'name']),
    buildExactFilter(query.isActive) !== undefined
      ? { isActive: query.isActive }
      : undefined,
  );

  return {
    pagination,
    sort,
    where,
    orderBy: buildPrismaOrderBy(sort),
  };
}
