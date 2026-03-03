import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAuditLogDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            userName: string | null;
            userEmail: string | null;
            user?: {
                fullName?: string | null;
                username?: string | null;
                email?: string | null;
            } | null;
        };
    }>;
    findAll(query: QueryAuditLogDto): Promise<{
        success: boolean;
        data: {
            userName: string | null;
            userEmail: string | null;
            user?: {
                fullName?: string | null;
                username?: string | null;
                email?: string | null;
            } | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            userName: string | null;
            userEmail: string | null;
            user?: {
                fullName?: string | null;
                username?: string | null;
                email?: string | null;
            } | null;
        };
    }>;
    update(id: number, dto: UpdateAuditLogDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            userName: string | null;
            userEmail: string | null;
            user?: {
                fullName?: string | null;
                username?: string | null;
                email?: string | null;
            } | null;
        };
    }>;
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private ensureUserExists;
    private normalizeJsonInput;
    private serializeItem;
}
