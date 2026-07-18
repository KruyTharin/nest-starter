import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppHttpClient } from '@/infrastructure/http/adapters/app-http-client';
import { LoggingHttpClient } from '@/infrastructure/http/decorators/logging-http-client';
import { HttpClient } from '@/infrastructure/http/http.types';
import { HTTP_CLIENT } from '@/infrastructure/http/http.tokens';

@Module({
  providers: [
    {
      provide: HTTP_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): HttpClient => {
        const timeoutMs = Number(config.get('http.timeoutMs') ?? 30_000);
        const loggingEnabled = Boolean(config.get('http.logging.enabled'));

        let client: HttpClient = new AppHttpClient({ timeoutMs });

        if (loggingEnabled) {
          client = new LoggingHttpClient(client);
        }

        return client;
      },
    },
  ],
  exports: [HTTP_CLIENT],
})
export class HttpClientModule {}
