import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type QueryAuditDto = {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: string;
    userId?: number;
};
export declare class ClinicAuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
            oldData: Prisma.JsonValue | null;
            newData: Prisma.JsonValue | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
