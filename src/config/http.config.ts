import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  timeoutMs: Number(process.env.HTTP_TIMEOUT_MS ?? 10_000),
  logging: {
    enabled:
      (process.env.HTTP_LOGGING ??
        (process.env.NODE_ENV === 'development' ? 'true' : 'false'))
        .toLowerCase() === 'true',
  },
}));

