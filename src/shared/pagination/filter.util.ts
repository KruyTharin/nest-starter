import { StringUtil } from '@/shared/utils';

export function buildTextSearchFilter<TField extends string>(
  search: string | undefined,
  fields: readonly TField[],
):
  | {
      OR: Array<Record<TField, { contains: string; mode: 'insensitive' }>>;
    }
  | undefined {
  if (StringUtil.isBlank(search)) {
    return undefined;
  }

  const term = search!.trim();

  return {
    OR: fields.map((field) => ({
      [field]: { contains: term, mode: 'insensitive' },
    })) as Array<Record<TField, { contains: string; mode: 'insensitive' }>>,
  };
}

export function buildExactFilter<T>(value: T | undefined): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return value;
}

export function mergeWhereClauses(
  ...clauses: Array<Record<string, unknown> | undefined>
): Record<string, unknown> | undefined {
  const activeClauses = clauses.filter(
    (clause): clause is Record<string, unknown> => clause !== undefined,
  );

  if (activeClauses.length === 0) {
    return undefined;
  }

  if (activeClauses.length === 1) {
    return activeClauses[0];
  }

  return { AND: activeClauses };
}

export function buildAppliedFilters(
  filters: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const applied = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

  return Object.keys(applied).length > 0 ? applied : undefined;
}
