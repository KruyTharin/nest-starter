export class DateUtil {
  /**
   * Converts a Date to an ISO-8601 string.
   * @param date - The date to convert.
   * @returns ISO string representation.
   * @example
   * DateUtil.toISO(new Date('2026-07-18T08:00:00.000Z'));
   * // '2026-07-18T08:00:00.000Z'
   */
  static toISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Adds days to a date without mutating the original.
   * @param date - The starting date.
   * @param days - Number of days to add.
   * @returns A new Date instance.
   * @example
   * const date = new Date('2026-07-18');
   * DateUtil.addDays(date, 7); // 2026-07-25
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Checks whether a date is in the past.
   * @param date - The date to check.
   * @param now - Reference date, defaults to current time.
   * @returns True when the date is expired.
   * @example
   * DateUtil.isExpired(new Date('2020-01-01')); // true
   * DateUtil.isExpired(new Date('2099-01-01')); // false
   */
  static isExpired(date: Date, now: Date = new Date()): boolean {
    return date.getTime() < now.getTime();
  }

  /**
   * Type guard for valid Date instances.
   * @param value - The value to check.
   * @returns True when value is a valid Date.
   * @example
   * DateUtil.isValid(new Date());           // true
   * DateUtil.isValid(new Date('invalid'));  // false
   * DateUtil.isValid('2026-07-18');         // false
   */
  static isValid(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
  }
}
