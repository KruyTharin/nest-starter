import { VIDEO_QUEUE_NAME } from '@/common/constants/video.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('video')
export class VideoController {
  constructor(
    @InjectQueue(VIDEO_QUEUE_NAME.VIDEO) private readonly videoQueue: Queue,
  ) {}

  @Post('process')
  async processVideo() {
    await this.videoQueue.add('process', {
      fileName: 'test-video',
      fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileType: 'video/mp4',
      userId: '123',
      tenantId: '123',
    });

    return { message: 'Video processing job added to the queue successfully' };
  }
}
