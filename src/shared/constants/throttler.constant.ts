import { seconds } from '@nestjs/throttler';

export const THROTTLER_DEFAULT_CONFIG = {
  name: 'default',
  ttl: seconds(60), // 60 seconds window
  limit: 100, // max 100 requests per window per tenant
};
