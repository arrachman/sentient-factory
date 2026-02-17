export declare class CreateAuditLogDto {
    userId?: number;
    action: string;
    entityType: string;
    entityId?: string;
    oldData?: unknown;
    newData?: unknown;
    ipAddress?: string;
    userAgent?: string;
}
