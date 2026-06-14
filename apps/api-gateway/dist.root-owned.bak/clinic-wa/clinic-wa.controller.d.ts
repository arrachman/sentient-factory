import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicWaService } from './clinic-wa.service';
import { CreateTemplateDto, QueryTemplateDto, QueryWaLogDto, SendTestDto, UpdateTemplateDto } from './dto/wa.dto';
export declare class ClinicWaController {
    private readonly service;
    constructor(service: ClinicWaService);
    createTemplate(dto: CreateTemplateDto, req: AuthRequest): Promise<{
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
    updateTemplate(id: number, dto: UpdateTemplateDto, req: AuthRequest): Promise<{
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
    removeTemplate(id: number, req: AuthRequest): Promise<{
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
            metadata: import("@prisma/client/runtime/library").JsonValue;
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
    sendTest(dto: SendTestDto, req: AuthRequest): Promise<{
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
    webhook(body: Record<string, unknown>): Promise<{
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
