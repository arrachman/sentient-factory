import { WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import type { WAProvider } from '../wa.interface';
import { type WaSendJobData } from './wa-queue.constants';
export declare class WaQueueProcessor extends WorkerHost {
    private readonly prisma;
    private readonly wa;
    private readonly logger;
    constructor(prisma: PrismaService, wa: WAProvider);
    process(job: Job<WaSendJobData>): Promise<{
        messageId?: string;
        status: string;
    }>;
}
