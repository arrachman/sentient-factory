import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly service;
    constructor(service: SessionsService);
    create(dto: CreateSessionDto, req: any): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                email: string;
                username: string;
                fullName: string | null;
            };
        } & {
            token: string;
            expiresAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            userId: number;
        };
    }>;
    findAll(query: QuerySessionDto): Promise<{
        success: boolean;
        data: ({
            user: {
                id: number;
                email: string;
                username: string;
                fullName: string | null;
            };
        } & {
            token: string;
            expiresAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            userId: number;
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
                id: number;
                email: string;
                username: string;
                fullName: string | null;
            };
        } & {
            token: string;
            expiresAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            userId: number;
        };
    }>;
    update(id: number, dto: UpdateSessionDto, req: any): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                email: string;
                username: string;
                fullName: string | null;
            };
        } & {
            token: string;
            expiresAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            userId: number;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
