import { CreateErpCurrencyDto } from './dto/create-erp-currency.dto';
import { QueryErpCurrencyDto } from './dto/query-erp-currency.dto';
import { UpdateErpCurrencyDto } from './dto/update-erp-currency.dto';
import { CreateErpCurrencyRateDto } from './dto/create-erp-currency-rate.dto';
import { ErpCurrenciesService } from './erp-currencies.service';
export declare class ErpCurrenciesController {
    private readonly service;
    constructor(service: ErpCurrenciesService);
    create(dto: CreateErpCurrencyDto, req: any): Promise<{
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
    findOne(id: string): Promise<{
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
                rate: import("@prisma/client/runtime/library").Decimal;
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
    update(id: string, dto: UpdateErpCurrencyDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    addRate(id: string, dto: CreateErpCurrencyRateDto, req: any): Promise<{
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
            rate: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    getRates(id: string, page?: string, limit?: string): Promise<{
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
            rate: import("@prisma/client/runtime/library").Decimal;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
