import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpUnitDto } from './dto/create-erp-unit.dto';
import { QueryErpUnitDto } from './dto/query-erp-unit.dto';
import { UpdateErpUnitDto } from './dto/update-erp-unit.dto';
export declare class ErpUnitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpUnitDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            conversionFactor: Prisma.Decimal;
        };
    }>;
    findAll(query: QueryErpUnitDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            conversionFactor: Prisma.Decimal;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: bigint): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            conversionFactor: Prisma.Decimal;
        };
    }>;
    update(id: bigint, dto: UpdateErpUnitDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            conversionFactor: Prisma.Decimal;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
