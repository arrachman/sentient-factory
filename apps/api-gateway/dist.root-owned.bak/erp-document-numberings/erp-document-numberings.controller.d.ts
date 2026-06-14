import { CreateErpDocumentNumberingDto } from './dto/create-erp-document-numbering.dto';
import { QueryErpDocumentNumberingDto } from './dto/query-erp-document-numbering.dto';
import { UpdateErpDocumentNumberingDto } from './dto/update-erp-document-numbering.dto';
import { ErpDocumentNumberingsService } from './erp-document-numberings.service';
export declare class ErpDocumentNumberingsController {
    private readonly service;
    constructor(service: ErpDocumentNumberingsService);
    create(dto: CreateErpDocumentNumberingDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            menuId: bigint | null;
            notes: string | null;
            prefix: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            documentCode: string;
            digitCount: number;
            resetPolicy: import("@prisma/client").$Enums.ErpNumberingReset;
            nextNumber: number;
            affectsLedger: boolean;
            affectsInventory: boolean;
            affectsCost: boolean;
        };
    }>;
    findAll(query: QueryErpDocumentNumberingDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            menuId: bigint | null;
            notes: string | null;
            prefix: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            documentCode: string;
            digitCount: number;
            resetPolicy: import("@prisma/client").$Enums.ErpNumberingReset;
            nextNumber: number;
            affectsLedger: boolean;
            affectsInventory: boolean;
            affectsCost: boolean;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            menu: {
                id: bigint;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                type: import("@prisma/client").$Enums.ErpMenuType;
                title: string;
                path: string | null;
                icon: string | null;
                parentId: bigint | null;
                sortOrder: number;
                code: string;
                legacyCode: string | null;
                createdById: bigint | null;
                updatedById: bigint | null;
            } | null;
        } & {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            menuId: bigint | null;
            notes: string | null;
            prefix: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            documentCode: string;
            digitCount: number;
            resetPolicy: import("@prisma/client").$Enums.ErpNumberingReset;
            nextNumber: number;
            affectsLedger: boolean;
            affectsInventory: boolean;
            affectsCost: boolean;
        };
    }>;
    update(id: string, dto: UpdateErpDocumentNumberingDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            menuId: bigint | null;
            notes: string | null;
            prefix: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            documentCode: string;
            digitCount: number;
            resetPolicy: import("@prisma/client").$Enums.ErpNumberingReset;
            nextNumber: number;
            affectsLedger: boolean;
            affectsInventory: boolean;
            affectsCost: boolean;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getNextNumber(documentCode: string): Promise<{
        success: boolean;
        data: {
            documentCode: string;
            docNumber: string;
            sequence: number;
        };
    }>;
}
