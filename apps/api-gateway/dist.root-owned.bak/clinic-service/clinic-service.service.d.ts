import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './dto/clinic-service.dto';
export declare class ClinicServiceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private normalizeSlotOverrides;
    create(dto: CreateServiceDto, actorId?: number): Promise<{
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
            basePrice: Prisma.Decimal;
            slotOverrides: Prisma.JsonValue;
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
            basePrice: Prisma.Decimal;
            slotOverrides: Prisma.JsonValue;
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
            basePrice: Prisma.Decimal;
            slotOverrides: Prisma.JsonValue;
        };
    }>;
    update(id: number, dto: UpdateServiceDto, actorId?: number): Promise<{
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
            basePrice: Prisma.Decimal;
            slotOverrides: Prisma.JsonValue;
        };
        message: string;
    }>;
    remove(id: number, actorId?: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
