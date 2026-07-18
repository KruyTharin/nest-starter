const SKIP_RESPONSE_FORMAT_PATHS = ['/health', '/docs', '/reference'] as const;

export function shouldSkipResponseFormatting(url: string): boolean {
  return SKIP_RESPONSE_FORMAT_PATHS.some((path) => url.includes(path));
}
