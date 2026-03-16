import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { THROTTLER_DEFAULT_CONFIG } from './common/constants/throttler.constant';
import { BullModule } from '@nestjs/bullmq';
import { VideoModule } from './modules/video/video.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [THROTTLER_DEFAULT_CONFIG],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT) ?? 6379,
          password: process.env.REDIS_PASSWORD ?? 'secret',
        }),
      ),
      getTracker: (req: { headers: Record<string, unknown>; ip: string }) => {
        // Rate limit per tenant if x-tenant-id header present, else fall back to IP
        const tenantId = req.headers['x-tenant-id'];
        return typeof tenantId === 'string' && tenantId.length > 0
          ? tenantId
          : req.ip;
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT) ?? 6379,
        password: process.env.REDIS_PASSWORD ?? 'secret',
      },
      defaultJobOptions: {
        attempts: 3,
      },
    }),
    PrismaModule,
    HealthModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
