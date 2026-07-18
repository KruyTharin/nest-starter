import { SortOrder, SortParams } from '@/shared/pagination/pagination.types';

type ResolveSortOptions<TField extends string> = {
  allowedFields: readonly TField[];
  defaultField: TField;
  defaultOrder?: SortOrder;
};

export function resolveSort<TField extends string>(
  sortBy: TField | undefined,
  sortOrder: SortOrder | undefined,
  options: ResolveSortOptions<TField>,
): SortParams<TField> {
  const { allowedFields, defaultField, defaultOrder = SortOrder.Desc } = options;

  const field = sortBy && allowedFields.includes(sortBy) ? sortBy : defaultField;
  const order =
    sortOrder === SortOrder.Asc || sortOrder === SortOrder.Desc
      ? sortOrder
      : defaultOrder;

  return { sortBy: field, sortOrder: order };
}

export function buildPrismaOrderBy<TField extends string>(
  sort: SortParams<TField>,
): Record<TField, SortOrder> {
  return { [sort.sortBy]: sort.sortOrder } as Record<TField, SortOrder>;
}
