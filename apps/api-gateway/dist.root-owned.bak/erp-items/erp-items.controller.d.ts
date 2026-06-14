import { CreateErpItemDto } from './dto/create-erp-item.dto';
import { QueryErpItemDto } from './dto/query-erp-item.dto';
import { UpdateErpItemDto } from './dto/update-erp-item.dto';
import { ErpItemsService } from './erp-items.service';
export declare class ErpItemsController {
    private readonly service;
    constructor(service: ErpItemsService);
    create(dto: CreateErpItemDto, req: any): Promise<{
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
            weight: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: import("@prisma/client/runtime/library").Decimal;
            purchasePrice: import("@prisma/client/runtime/library").Decimal;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            minStock: import("@prisma/client/runtime/library").Decimal;
            maxStock: import("@prisma/client/runtime/library").Decimal;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: import("@prisma/client/runtime/library").Decimal;
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
            weight: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: import("@prisma/client/runtime/library").Decimal;
            purchasePrice: import("@prisma/client/runtime/library").Decimal;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            minStock: import("@prisma/client/runtime/library").Decimal;
            maxStock: import("@prisma/client/runtime/library").Decimal;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: import("@prisma/client/runtime/library").Decimal;
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
    findOne(id: string): Promise<{
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
            weight: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: import("@prisma/client/runtime/library").Decimal;
            purchasePrice: import("@prisma/client/runtime/library").Decimal;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            minStock: import("@prisma/client/runtime/library").Decimal;
            maxStock: import("@prisma/client/runtime/library").Decimal;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: import("@prisma/client/runtime/library").Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
        };
    }>;
    update(id: string, dto: UpdateErpItemDto, req: any): Promise<{
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
            weight: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
            categoryId: bigint;
            barcode: string | null;
            standardCost: import("@prisma/client/runtime/library").Decimal;
            purchasePrice: import("@prisma/client/runtime/library").Decimal;
            salePrice: import("@prisma/client/runtime/library").Decimal;
            minStock: import("@prisma/client/runtime/library").Decimal;
            maxStock: import("@prisma/client/runtime/library").Decimal;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            tracksSerial: boolean;
            tracksBatch: boolean;
            tracksBin: boolean;
            baseUnitId: bigint;
            averageCost: import("@prisma/client/runtime/library").Decimal;
            purchaseTaxId: bigint | null;
            saleTaxId: bigint | null;
            primarySupplierId: bigint | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
