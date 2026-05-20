import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpAccountDto } from './dto/create-erp-account.dto';
import { QueryErpAccountDto } from './dto/query-erp-account.dto';
import { UpdateErpAccountDto } from './dto/update-erp-account.dto';
export declare class ErpAccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpAccountDto, actorId?: string): Promise<{
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
            openingBalance: Prisma.Decimal;
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
            openingBalance: Prisma.Decimal;
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
            openingBalance: Prisma.Decimal;
        };
    }>;
    update(id: bigint, dto: UpdateErpAccountDto, actorId?: string): Promise<{
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
            openingBalance: Prisma.Decimal;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
