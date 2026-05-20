import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpCurrencyDto } from './dto/create-erp-currency.dto';
import { QueryErpCurrencyDto } from './dto/query-erp-currency.dto';
import { UpdateErpCurrencyDto } from './dto/update-erp-currency.dto';
import { CreateErpCurrencyRateDto } from './dto/create-erp-currency-rate.dto';
export declare class ErpCurrenciesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpCurrencyDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            symbol: string | null;
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
        };
    }>;
    findAll(query: QueryErpCurrencyDto): Promise<{
        success: boolean;
        data: {
            symbol: string | null;
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
            rates: {
                id: bigint;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                createdById: bigint | null;
                updatedById: bigint | null;
                currencyId: bigint;
                rateDate: Date;
                rate: Prisma.Decimal;
            }[];
        } & {
            symbol: string | null;
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
        };
    }>;
    update(id: bigint, dto: UpdateErpCurrencyDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            symbol: string | null;
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
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addRate(currencyId: bigint, dto: CreateErpCurrencyRateDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            currencyId: bigint;
            rateDate: Date;
            rate: Prisma.Decimal;
        };
    }>;
    getRates(currencyId: bigint, query: {
        page?: number;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: {
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            currencyId: bigint;
            rateDate: Date;
            rate: Prisma.Decimal;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
