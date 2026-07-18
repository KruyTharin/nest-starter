export class ObjectUtil {
  static omit<T extends object, K extends keyof T>(
    obj: T,
    keys: readonly K[],
  ): Omit<T, K> {
    const result = { ...obj };

    for (const key of keys) {
      delete result[key];
    }

    return result;
  }

  static pick<T extends object, K extends keyof T>(
    obj: T,
    keys: readonly K[],
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }

    return result;
  }

  static removeUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }

  static isEmpty(value: object): boolean {
    return Object.keys(value).length === 0;
  }
}
