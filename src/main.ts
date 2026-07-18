import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import {
  HttpExceptionFilter,
  setupApiDocumentation,
  TransformInterceptor,
} from '@/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = configService.get<number>('app.port', 3001);
  const appVersion = configService.get<string>('app.version', 'v1');
  const baseUrl =
    configService.get<string>('app.baseUrl') ?? `http://localhost:${port}`;

  app.enableCors();
  app.setGlobalPrefix(`/api/${appVersion}`, {
    exclude: ['health', 'health/*path'],
  });

  setupApiDocumentation(app, configService);

  await app.listen(port);

  logger.log(`Port running on: ${port}`);
  logger.log(`Application is running on: ${baseUrl}/api/${appVersion}`);
  logger.log(`Health Check: ${baseUrl}/health`);
  logger.log(`Swagger UI: ${baseUrl}/docs`);
  logger.log(`Scalar UI: ${baseUrl}/reference`);
}
void bootstrap();
