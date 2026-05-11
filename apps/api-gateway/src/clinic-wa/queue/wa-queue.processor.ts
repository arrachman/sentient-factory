import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import type { WAProvider } from '../wa.interface';
import { WA_PROVIDER } from '../wa.tokens';
import { WA_JOB_SEND, WA_QUEUE_NAME, type WaSendJobData } from './wa-queue.constants';

@Processor(WA_QUEUE_NAME)
export class WaQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(WaQueueProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(WA_PROVIDER) private readonly wa: WAProvider,
  ) {
    super();
  }

  async process(job: Job<WaSendJobData>): Promise<{ messageId?: string; status: string }> {
    if (job.name !== WA_JOB_SEND) {
      throw new Error(`Unknown job name: ${job.name}`);
    }
    const { logId, recipientPhone, body, metadata } = job.data;
    const attempt = job.attemptsMade + 1;

    this.logger.log(
      `Processing WA job ${job.id} (logId=${logId}) attempt ${attempt}/${job.opts.attempts ?? 1}`,
    );

    const result = await this.wa.send({
      toPhone: recipientPhone,
      body,
      callbackUrl: process.env.FONNTE_WEBHOOK_URL,
      metadata: { logId, attempt, ...metadata },
    });

    if (result.status === 'failed') {
      await this.prisma.clinicWaLog.update({
        where: { id: logId },
        data: {
          retryCount: attempt,
          status: attempt >= (job.opts.attempts ?? 1) ? 'gagal' : 'queued',
          errorReason: result.errorReason ?? null,
          failedAt: attempt >= (job.opts.attempts ?? 1) ? new Date() : null,
        },
      });
      throw new Error(result.errorReason ?? 'WA provider failed');
    }

    const status = result.status === 'sent' ? 'terkirim' : 'queued';
    await this.prisma.clinicWaLog.update({
      where: { id: logId },
      data: {
        messageId: result.messageId,
        status,
        retryCount: attempt,
        sentAt: result.status === 'sent' ? new Date() : null,
        errorReason: null,
      },
    });

    return { messageId: result.messageId, status };
  }
}
