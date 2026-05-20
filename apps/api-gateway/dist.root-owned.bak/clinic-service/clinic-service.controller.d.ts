import type { AuthRequest } from '../auth/types/auth-request';
import { ClinicServiceService } from './clinic-service.service';
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './dto/clinic-service.dto';
export declare class ClinicServiceController {
    private readonly service;
    constructor(service: ClinicServiceService);
    create(dto: CreateServiceDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            category: string;
            sessionCount: number;
            durationMinutes: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            slotOverrides: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    findAll(query: QueryServiceDto): Promise<{
        success: boolean;
        data: {
            bookedThisMonth: number;
            hasBookings: boolean;
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            category: string;
            sessionCount: number;
            durationMinutes: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            slotOverrides: import("@prisma/client/runtime/library").JsonValue;
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
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            category: string;
            sessionCount: number;
            durationMinutes: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            slotOverrides: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    update(id: number, dto: UpdateServiceDto, req: AuthRequest): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            category: string;
            sessionCount: number;
            durationMinutes: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            slotOverrides: import("@prisma/client/runtime/library").JsonValue;
        };
        message: string;
    }>;
    remove(id: number, req: AuthRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
