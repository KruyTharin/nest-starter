export class ObjectUtil {
  /**
   * Returns a copy of an object without the specified keys.
   * @param obj - Source object.
   * @param keys - Keys to remove.
   * @returns Object without the omitted keys.
   * @example
   * ObjectUtil.omit({ id: '1', email: 'a@b.com', passwordHash: 'x' }, ['passwordHash']);
   * // { id: '1', email: 'a@b.com' }
   */
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

  /**
   * Returns a new object with only the specified keys.
   * @param obj - Source object.
   * @param keys - Keys to keep.
   * @returns Object containing only picked keys.
   * @example
   * ObjectUtil.pick({ id: '1', email: 'a@b.com', name: 'Jane' }, ['id', 'email']);
   * // { id: '1', email: 'a@b.com' }
   */
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

  /**
   * Removes keys with undefined values from an object.
   * @param obj - Source object.
   * @returns Object without undefined values.
   * @example
   * ObjectUtil.removeUndefined({ name: 'Jane', age: undefined, active: true });
   * // { name: 'Jane', active: true }
   */
  static removeUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }

  /**
   * Checks whether an object has no own keys.
   * @param value - Object to check.
   * @returns True when the object is empty.
   * @example
   * ObjectUtil.isEmpty({});           // true
   * ObjectUtil.isEmpty({ id: '1' });  // false
   */
  static isEmpty(value: object): boolean {
    return Object.keys(value).length === 0;
  }
}
