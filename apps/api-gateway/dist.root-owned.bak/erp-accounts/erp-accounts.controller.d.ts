import { CreateErpAccountDto } from './dto/create-erp-account.dto';
import { QueryErpAccountDto } from './dto/query-erp-account.dto';
import { UpdateErpAccountDto } from './dto/update-erp-account.dto';
import { ErpAccountsService } from './erp-accounts.service';
export declare class ErpAccountsController {
    private readonly service;
    constructor(service: ErpAccountsService);
    create(dto: CreateErpAccountDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpAccountType;
            parentId: bigint | null;
            code: string;
            notes: string | null;
            level: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            kind: import("@prisma/client").$Enums.ErpAccountKind;
            bankName: string | null;
            currencyId: bigint | null;
            alias: string | null;
            normalBalance: import("@prisma/client").$Enums.ErpNormalBalance;
            cashFlowCategory: import("@prisma/client").$Enums.ErpCashFlowCategory | null;
            isControlAccount: boolean;
            bankAccountNo: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    findAll(query: QueryErpAccountDto): Promise<{
        success: boolean;
        data: ({
            parent: {
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
            type: import("@prisma/client").$Enums.ErpAccountType;
            parentId: bigint | null;
            code: string;
            notes: string | null;
            level: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            kind: import("@prisma/client").$Enums.ErpAccountKind;
            bankName: string | null;
            currencyId: bigint | null;
            alias: string | null;
            normalBalance: import("@prisma/client").$Enums.ErpNormalBalance;
            cashFlowCategory: import("@prisma/client").$Enums.ErpCashFlowCategory | null;
            isControlAccount: boolean;
            bankAccountNo: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
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
            parent: {
                name: string;
                id: bigint;
                code: string;
            } | null;
            children: {
                name: string;
                id: bigint;
                code: string;
            }[];
            currency: {
                symbol: string | null;
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
            type: import("@prisma/client").$Enums.ErpAccountType;
            parentId: bigint | null;
            code: string;
            notes: string | null;
            level: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            kind: import("@prisma/client").$Enums.ErpAccountKind;
            bankName: string | null;
            currencyId: bigint | null;
            alias: string | null;
            normalBalance: import("@prisma/client").$Enums.ErpNormalBalance;
            cashFlowCategory: import("@prisma/client").$Enums.ErpCashFlowCategory | null;
            isControlAccount: boolean;
            bankAccountNo: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    update(id: string, dto: UpdateErpAccountDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.ErpAccountType;
            parentId: bigint | null;
            code: string;
            notes: string | null;
            level: number;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            kind: import("@prisma/client").$Enums.ErpAccountKind;
            bankName: string | null;
            currencyId: bigint | null;
            alias: string | null;
            normalBalance: import("@prisma/client").$Enums.ErpNormalBalance;
            cashFlowCategory: import("@prisma/client").$Enums.ErpCashFlowCategory | null;
            isControlAccount: boolean;
            bankAccountNo: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
