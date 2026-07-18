export class StringUtil {
  /**
   * Checks if a string is blank.
   * @param value - The string to check.
   * @returns True if the string is blank, false otherwise.
   * @example
   * StringUtil.isBlank('');        // true
   * StringUtil.isBlank('  ');      // true
   * StringUtil.isBlank(null);      // true
   * StringUtil.isBlank('hello');   // false
   */
  static isBlank(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim().length === 0;
  }

  /**
   * Capitalizes the first letter of a string.
   * @param value - The string to capitalize.
   * @returns The capitalized string.
   * @example
   * StringUtil.capitalize('hello');  // 'Hello'
   * StringUtil.capitalize('');       // ''
   */
  static capitalize(value: string): string {
    if (StringUtil.isBlank(value)) {
      return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /**
   * Truncates a string to a specified length.
   * @param value - The string to truncate.
   * @param maxLength - The maximum length of the string.
   * @param suffix - The suffix to add when truncated.
   * @returns The truncated string.
   * @example
   * StringUtil.truncate('Hello World', 8);           // 'Hello...'
   * StringUtil.truncate('Hi', 10);                   // 'Hi'
   * StringUtil.truncate('Hello World', 8, '…');      // 'Hello W…'
   */
  static truncate(value: string, maxLength: number, suffix = '...'): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength - suffix.length)}${suffix}`;
  }

  /**
   * Converts a string to a URL-friendly slug.
   * @param value - The string to convert.
   * @returns The slug.
   * @example
   * StringUtil.toSlug('Hello World!');     // 'hello-world'
   * StringUtil.toSlug('  NestJS Starter '); // 'nestjs-starter'
   */
  static toSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Masks an email address for display.
   * @param email - The email address to mask.
   * @returns The masked email address.
   * @example
   * StringUtil.maskEmail('jane@example.com');  // 'j***@example.com'
   * StringUtil.maskEmail('invalid-email');     // 'invalid-email'
   */
  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      return email;
    }

    const visible = localPart.slice(0, 1);
    return `${visible}***@${domain}`;
  }
}
