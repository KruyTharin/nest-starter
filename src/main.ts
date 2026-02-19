import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from '@/app.module';
import { Logger } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.APP_PORT ?? 5000;
  const appVersion = process.env.APP_VERSION ?? 'v1';
  const baseUrl = process.env.BASE_URL ?? `http://localhost:${port}`;

  app.enableCors();
  app.setGlobalPrefix(`/api/${appVersion}`, {
    exclude: ['health', 'health/(.*)'],
  });

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? 'NestJS Starter API')
    .setDescription('The API description')
    .setVersion(process.env.APP_VERSION ?? '1.0')
    .addTag('nest')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Standard Swagger UI
  SwaggerModule.setup('docs', app, document);

  // Scalar API Reference
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(port);

  logger.log(`Port running on: ${port}`);
  logger.log(`🚀 Application is running on: ${baseUrl}/api/${appVersion}`);
  logger.log(`🏥 Health Check: ${baseUrl}/health`);
  logger.log(`📚 Swagger UI: ${baseUrl}/docs`);
  logger.log(`📑 Scalar UI: ${baseUrl}/reference`);
}
bootstrap();
