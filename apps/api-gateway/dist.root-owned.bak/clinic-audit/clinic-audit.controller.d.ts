import { ClinicAuditService, type QueryAuditDto } from './clinic-audit.service';
export declare class ClinicAuditController {
    private readonly service;
    constructor(service: ClinicAuditService);
    findAll(query: QueryAuditDto): Promise<{
        success: boolean;
        data: {
            userName: string | null;
            user: undefined;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            userId: number | null;
            ipAddress: string | null;
            userAgent: string | null;
            action: string;
            entityType: string;
            entityId: string | null;
            oldData: import("@prisma/client/runtime/library").JsonValue | null;
            newData: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
