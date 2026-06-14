import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpItemDto } from './dto/create-erp-item.dto';
import { QueryErpItemDto } from './dto/query-erp-item.dto';
import { UpdateErpItemDto } from './dto/update-erp-item.dto';
export declare class ErpItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpItemDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            category: {
                name: string;
                id: bigint;
                code: string;
            };
            baseUnit: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpItemType;
            code: string;
            weight: Prisma.Decimal | null;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: Prisma.Decimal;
            purchasePrice: Prisma.Decimal;
            salePrice: Prisma.Decimal;
            minStock: Prisma.Decimal;
            maxStock: Prisma.Decimal;
            reorderQty: Prisma.Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: Prisma.Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
        };
    }>;
    findAll(query: QueryErpItemDto): Promise<{
        success: boolean;
        data: ({
            category: {
                name: string;
                id: bigint;
                code: string;
            };
            baseUnit: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpItemType;
            code: string;
            weight: Prisma.Decimal | null;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: Prisma.Decimal;
            purchasePrice: Prisma.Decimal;
            salePrice: Prisma.Decimal;
            minStock: Prisma.Decimal;
            maxStock: Prisma.Decimal;
            reorderQty: Prisma.Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: Prisma.Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
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
            category: {
                name: string;
                id: bigint;
                code: string;
            };
            baseUnit: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpItemType;
            code: string;
            weight: Prisma.Decimal | null;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: Prisma.Decimal;
            purchasePrice: Prisma.Decimal;
            salePrice: Prisma.Decimal;
            minStock: Prisma.Decimal;
            maxStock: Prisma.Decimal;
            reorderQty: Prisma.Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: Prisma.Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpItemDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            category: {
                name: string;
                id: bigint;
                code: string;
            };
            baseUnit: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpItemType;
            code: string;
            weight: Prisma.Decimal | null;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: Prisma.Decimal;
            purchasePrice: Prisma.Decimal;
            salePrice: Prisma.Decimal;
            minStock: Prisma.Decimal;
            maxStock: Prisma.Decimal;
            reorderQty: Prisma.Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: Prisma.Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
