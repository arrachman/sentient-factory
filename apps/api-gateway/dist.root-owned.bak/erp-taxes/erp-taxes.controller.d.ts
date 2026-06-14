import { CreateErpTaxDto } from './dto/create-erp-tax.dto';
import { QueryErpTaxDto } from './dto/query-erp-tax.dto';
import { UpdateErpTaxDto } from './dto/update-erp-tax.dto';
import { ErpTaxesService } from './erp-taxes.service';
export declare class ErpTaxesController {
    private readonly service;
    constructor(service: ErpTaxesService);
    create(dto: CreateErpTaxDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
        };
    }>;
    findAll(query: QueryErpTaxDto): Promise<{
        success: boolean;
        data: ({
            saleAccount: {
                name: string;
                id: bigint;
                code: string;
            } | null;
            purchaseAccount: {
                name: string;
                id: bigint;
                code: string;
            } | null;
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
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
            saleAccount: {
                name: string;
                id: bigint;
                code: string;
            } | null;
            purchaseAccount: {
                name: string;
                id: bigint;
                code: string;
            } | null;
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
        };
    }>;
    update(id: string, dto: UpdateErpTaxDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
