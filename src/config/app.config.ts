import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT ?? '3001', 10),
  name: process.env.APP_NAME ?? 'NestJS Starter API',
  version: process.env.APP_VERSION ?? 'v1',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3001',
}));
