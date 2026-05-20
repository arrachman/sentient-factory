import { PrismaService } from '../prisma/prisma.service';
import { CreateErpDocumentNumberingDto } from './dto/create-erp-document-numbering.dto';
import { QueryErpDocumentNumberingDto } from './dto/query-erp-document-numbering.dto';
import { UpdateErpDocumentNumberingDto } from './dto/update-erp-document-numbering.dto';
export declare class ErpDocumentNumberingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpDocumentNumberingDto, actorId?: string): Promise<{
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
    findOne(id: bigint): Promise<{
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
    update(id: bigint, dto: UpdateErpDocumentNumberingDto, actorId?: string): Promise<{
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
    remove(id: bigint, actorId?: string): Promise<{
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
