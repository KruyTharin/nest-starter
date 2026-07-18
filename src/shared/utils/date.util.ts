export class DateUtil {
  static toISO(date: Date): string {
    return date.toISOString();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static isExpired(date: Date, now: Date = new Date()): boolean {
    return date.getTime() < now.getTime();
  }

  static isValid(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
  }
}
