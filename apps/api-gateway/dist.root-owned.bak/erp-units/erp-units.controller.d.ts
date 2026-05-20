import { CreateErpUnitDto } from './dto/create-erp-unit.dto';
import { QueryErpUnitDto } from './dto/query-erp-unit.dto';
import { UpdateErpUnitDto } from './dto/update-erp-unit.dto';
import { ErpUnitsService } from './erp-units.service';
export declare class ErpUnitsController {
    private readonly service;
    constructor(service: ErpUnitsService);
    create(dto: CreateErpUnitDto, req: any): Promise<{
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
            conversionFactor: import("@prisma/client/runtime/library").Decimal;
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
            conversionFactor: import("@prisma/client/runtime/library").Decimal;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
            conversionFactor: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    update(id: string, dto: UpdateErpUnitDto, req: any): Promise<{
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
            conversionFactor: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
