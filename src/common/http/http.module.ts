import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppHttpClient } from './adapters/app-http-client';
import { LoggingHttpClient } from './decorators/logging-http-client';
import { HttpClient } from './http.types';
import { HTTP_CLIENT } from './http.tokens';

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
