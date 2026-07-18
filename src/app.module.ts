import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { Redis } from 'ioredis';

import { configs } from '@/config';
import { HealthModule } from '@/modules/health/health.module';
import { UserModule } from '@/modules/user/user.module';
import { VideoModule } from '@/modules/video/video.module';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { THROTTLER_DEFAULT_CONFIG } from '@/shared/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [THROTTLER_DEFAULT_CONFIG],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: config.get<string>('redis.host'),
            port: config.get<number>('redis.port'),
            password: config.get<string>('redis.password'),
          }),
        ),
        getTracker: (req: Record<string, unknown>) => {
          const headers = req.headers as Record<string, string | undefined>;
          const tenantId = headers?.['x-tenant-id'];
          return typeof tenantId === 'string' && tenantId.length > 0
            ? tenantId
            : (req.ip as string);
        },
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password'),
        },
        defaultJobOptions: {
          attempts: 3,
        },
      }),
    }),
    InfrastructureModule,
    HealthModule,
    UserModule,
    VideoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
