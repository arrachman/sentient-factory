import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpTaxDto } from './dto/create-erp-tax.dto';
import { QueryErpTaxDto } from './dto/query-erp-tax.dto';
import { UpdateErpTaxDto } from './dto/update-erp-tax.dto';
export declare class ErpTaxesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpTaxDto, actorId?: string): Promise<{
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
            rate: Prisma.Decimal;
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
            rate: Prisma.Decimal;
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
    findOne(id: bigint): Promise<{
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
            rate: Prisma.Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpTaxDto, actorId?: string): Promise<{
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
            rate: Prisma.Decimal;
            saleAccountId: bigint | null;
            purchaseAccountId: bigint | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
