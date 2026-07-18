import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupApiDocumentation(
  app: INestApplication,
  configService: ConfigService,
): void {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name', 'NestJS Starter API'))
    .setDescription('The API description')
    .setVersion(configService.get<string>('app.version', 'v1'))
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.use(
    '/reference',
    apiReference({
      url: '/docs-json',
    }),
  );
}
