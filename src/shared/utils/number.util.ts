export class NumberUtil {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static toInt(value: unknown, fallback: number): number {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  static toFloat(value: unknown, fallback: number): number {
    const parsed = Number.parseFloat(String(value));
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  static isPositive(value: number): boolean {
    return Number.isFinite(value) && value > 0;
  }

  static roundTo(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
}
