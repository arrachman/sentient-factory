import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSessionDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            user: {
                email: string;
                username: string;
                fullName: string | null;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            userId: number;
            ipAddress: string | null;
            userAgent: string | null;
            token: string;
            expiresAt: Date;
        };
    }>;
    findAll(query: QuerySessionDto): Promise<{
        success: boolean;
        data: ({
            user: {
                email: string;
                username: string;
                fullName: string | null;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            userId: number;
            ipAddress: string | null;
            userAgent: string | null;
            token: string;
            expiresAt: Date;
        })[];
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
            user: {
                email: string;
                username: string;
                fullName: string | null;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            userId: number;
            ipAddress: string | null;
            userAgent: string | null;
            token: string;
            expiresAt: Date;
        };
    }>;
    update(id: number, dto: UpdateSessionDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            user: {
                email: string;
                username: string;
                fullName: string | null;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            userId: number;
            ipAddress: string | null;
            userAgent: string | null;
            token: string;
            expiresAt: Date;
        };
    }>;
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private parseUserId;
    private parseExpiresAt;
    private ensureUserExists;
}
