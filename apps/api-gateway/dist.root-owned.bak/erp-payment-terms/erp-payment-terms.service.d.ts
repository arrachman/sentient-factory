import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpPaymentTermDto } from './dto/create-erp-payment-term.dto';
import { QueryErpPaymentTermDto } from './dto/query-erp-payment-term.dto';
import { UpdateErpPaymentTermDto } from './dto/update-erp-payment-term.dto';
export declare class ErpPaymentTermsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpPaymentTermDto, actorId?: string): Promise<{
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
            netDays: number;
            discountDays1: number | null;
            discountPercent1: Prisma.Decimal | null;
            discountDays2: number | null;
            discountPercent2: Prisma.Decimal | null;
            penaltyPercent: Prisma.Decimal | null;
            penaltyPeriod: string | null;
        };
    }>;
    findAll(query: QueryErpPaymentTermDto): Promise<{
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
            netDays: number;
            discountDays1: number | null;
            discountPercent1: Prisma.Decimal | null;
            discountDays2: number | null;
            discountPercent2: Prisma.Decimal | null;
            penaltyPercent: Prisma.Decimal | null;
            penaltyPeriod: string | null;
        }[];
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
            netDays: number;
            discountDays1: number | null;
            discountPercent1: Prisma.Decimal | null;
            discountDays2: number | null;
            discountPercent2: Prisma.Decimal | null;
            penaltyPercent: Prisma.Decimal | null;
            penaltyPeriod: string | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpPaymentTermDto, actorId?: string): Promise<{
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
            netDays: number;
            discountDays1: number | null;
            discountPercent1: Prisma.Decimal | null;
            discountDays2: number | null;
            discountPercent2: Prisma.Decimal | null;
            penaltyPercent: Prisma.Decimal | null;
            penaltyPeriod: string | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
