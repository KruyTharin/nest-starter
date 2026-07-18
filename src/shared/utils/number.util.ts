export class NumberUtil {
  /**
   * Clamps a number between a minimum and maximum value.
   * @param value - The number to clamp.
   * @param min - The minimum allowed value.
   * @param max - The maximum allowed value.
   * @returns The clamped number.
   * @example
   * NumberUtil.clamp(15, 1, 10);   // 10
   * NumberUtil.clamp(-5, 1, 10);   // 1
   * NumberUtil.clamp(7, 1, 10);    // 7
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Parses a value to an integer with a fallback.
   * @param value - The value to parse.
   * @param fallback - The fallback when parsing fails.
   * @returns The parsed integer or fallback.
   * @example
   * NumberUtil.toInt('42', 0);     // 42
   * NumberUtil.toInt('abc', 10);   // 10
   * NumberUtil.toInt(undefined, 1); // 1
   */
  static toInt(value: unknown, fallback: number): number {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Parses a value to a float with a fallback.
   * @param value - The value to parse.
   * @param fallback - The fallback when parsing fails.
   * @returns The parsed float or fallback.
   * @example
   * NumberUtil.toFloat('3.14', 0);   // 3.14
   * NumberUtil.toFloat('abc', 1.5);  // 1.5
   */
  static toFloat(value: unknown, fallback: number): number {
    const parsed = Number.parseFloat(String(value));
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Checks if a number is finite and greater than zero.
   * @param value - The number to check.
   * @returns True when the number is positive.
   * @example
   * NumberUtil.isPositive(5);    // true
   * NumberUtil.isPositive(0);    // false
   * NumberUtil.isPositive(-1);   // false
   */
  static isPositive(value: number): boolean {
    return Number.isFinite(value) && value > 0;
  }

  /**
   * Rounds a number to a fixed number of decimal places.
   * @param value - The number to round.
   * @param decimals - Number of decimal places.
   * @returns The rounded number.
   * @example
   * NumberUtil.roundTo(3.14159, 2);  // 3.14
   * NumberUtil.roundTo(10.556, 1);   // 10.6
   */
  static roundTo(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
}
