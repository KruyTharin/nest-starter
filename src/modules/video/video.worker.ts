import { VIDEO_QUEUE_NAME } from '@/common/constants/video.constant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(VIDEO_QUEUE_NAME.VIDEO)
export class VideoWorker extends WorkerHost {
  async process(job: Job) {
    console.log('Processing video job', job.id);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    throw new Error('Video job failed');
  }

  @OnWorkerEvent('completed')
  async onVideoCompleted(job: Job) {
    console.log('Video job completed', job.id);
  }

  @OnWorkerEvent('failed')
  async onVideoFailed(job: Job) {
    console.log('Video job failed', job.id);
  }

  @OnWorkerEvent('progress')
  async onVideoProgress(job: Job) {
    console.log('Video job progress', job.id);
  }
}
