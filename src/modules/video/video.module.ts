import { VIDEO_QUEUE_NAME } from '@/common/constants/video.constant';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoWorker } from './video.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: VIDEO_QUEUE_NAME.VIDEO,
    }),
  ],
  controllers: [VideoController],
  providers: [VideoWorker],
})
export class VideoModule {}
