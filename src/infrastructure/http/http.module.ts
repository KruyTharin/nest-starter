import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppHttpClient } from '@/infrastructure/http/http.client';
import { HTTP_CLIENT } from '@/infrastructure/http/http.types';

@Module({
  providers: [
    {
      provide: HTTP_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new AppHttpClient({
          timeoutMs: Number(config.get('http.timeoutMs') ?? 30_000),
          loggingEnabled: Boolean(config.get('http.logging.enabled')),
        }),
    },
  ],
  exports: [HTTP_CLIENT],
})
export class HttpClientModule {}
