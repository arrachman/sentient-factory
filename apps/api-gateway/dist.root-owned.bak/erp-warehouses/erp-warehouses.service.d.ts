import { PrismaService } from '../prisma/prisma.service';
import { CreateErpWarehouseDto } from './dto/create-erp-warehouse.dto';
import { QueryErpWarehouseDto } from './dto/query-erp-warehouse.dto';
import { UpdateErpWarehouseDto } from './dto/update-erp-warehouse.dto';
export declare class ErpWarehousesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpWarehouseDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
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
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    findAll(query: QueryErpWarehouseDto): Promise<{
        success: boolean;
        data: ({
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
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
            locationId: bigint;
            allowNegativeStock: boolean;
        })[];
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
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
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
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    update(id: bigint, dto: UpdateErpWarehouseDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
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
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
