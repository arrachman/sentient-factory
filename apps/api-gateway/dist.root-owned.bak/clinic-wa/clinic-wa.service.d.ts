import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, FonnteWebhookDto, QueryTemplateDto, QueryWaLogDto, SendTestDto, UpdateTemplateDto } from './dto/wa.dto';
import type { WAProvider } from './wa.interface';
import { type WaSendJobData } from './queue/wa-queue.constants';
export declare class ClinicWaService {
    private readonly prisma;
    private readonly wa;
    private readonly config;
    private readonly waQueue;
    private readonly logger;
    private readonly queueEnabled;
    constructor(prisma: PrismaService, wa: WAProvider, config: ConfigService, waQueue: Queue<WaSendJobData>);
    createTemplate(dto: CreateTemplateDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string;
            triggerEvent: string | null;
            body: string;
            recipients: string[];
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
        message: string;
    }>;
    findAllTemplates(query: QueryTemplateDto): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string;
            triggerEvent: string | null;
            body: string;
            recipients: string[];
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneTemplate(id: number): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string;
            triggerEvent: string | null;
            body: string;
            recipients: string[];
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    updateTemplate(id: number, dto: UpdateTemplateDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string;
            triggerEvent: string | null;
            body: string;
            recipients: string[];
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
        message: string;
    }>;
    removeTemplate(id: number, actorId?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllLogs(query: QueryWaLogDto): Promise<{
        success: boolean;
        data: ({
            template: {
                name: string;
                category: string;
                id: number;
            } | null;
        } & {
            body: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            id: number;
            templateId: number | null;
            recipientType: string;
            recipientPhone: string;
            messageId: string | null;
            status: string;
            errorReason: string | null;
            retryCount: number;
            bookingId: number | null;
            metadata: Prisma.JsonValue;
            sentAt: Date | null;
            deliveredAt: Date | null;
            readAt: Date | null;
            failedAt: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStats(date?: string): Promise<{
        success: boolean;
        data: {
            sentToday: number;
            readToday: number;
            failedToday: number;
            readRate: number;
        };
    }>;
    sendTest(dto: SendTestDto, actorId?: number): Promise<{
        success: boolean;
        data: {
            logId: number;
            status: string;
            messageId?: undefined;
        };
        message: string;
    } | {
        success: boolean;
        data: {
            logId: number;
            status: string;
            messageId: string;
        };
        message: string | undefined;
    }>;
    dispatch(params: {
        templateName: string;
        recipientType: 'klien' | 'psikolog';
        recipientPhone: string;
        variables: Record<string, string | number>;
        bookingId?: number;
    }): Promise<{
        success: boolean;
        data: {
            logId: number;
            status: string;
            messageId?: undefined;
        };
        message: string;
    } | {
        success: boolean;
        data: {
            logId: number;
            status: string;
            messageId: string;
        };
        message: string | undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    private dispatchRaw;
    handleWebhook(dto: FonnteWebhookDto): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            logId: number;
            status: string;
        };
        error?: undefined;
    }>;
}
