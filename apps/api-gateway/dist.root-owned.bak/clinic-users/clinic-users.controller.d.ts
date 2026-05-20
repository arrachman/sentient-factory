import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicUsersService } from './clinic-users.service';
import { CreateClinicUserDto, QueryClinicUserDto, UpdateClinicUserDto } from './dto/clinic-users.dto';
export declare class ClinicUsersController {
    private readonly service;
    constructor(service: ClinicUsersService);
    create(dto: CreateClinicUserDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            roles: {
                id: number;
                name: string;
                description: string | null;
            }[];
        };
        message: string;
    }>;
    findAll(query: QueryClinicUserDto): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            roles: {
                id: number;
                name: string;
                description: string | null;
            }[];
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
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            roles: {
                id: number;
                name: string;
                description: string | null;
            }[];
        };
    }>;
    update(id: number, dto: UpdateClinicUserDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            roles: {
                id: number;
                name: string;
                description: string | null;
            }[];
        };
        message: string;
    }>;
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
