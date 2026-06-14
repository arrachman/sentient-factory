import { CreateErpPaymentTermDto } from './dto/create-erp-payment-term.dto';
import { QueryErpPaymentTermDto } from './dto/query-erp-payment-term.dto';
import { UpdateErpPaymentTermDto } from './dto/update-erp-payment-term.dto';
import { ErpPaymentTermsService } from './erp-payment-terms.service';
export declare class ErpPaymentTermsController {
    private readonly service;
    constructor(service: ErpPaymentTermsService);
    create(dto: CreateErpPaymentTermDto, req: any): Promise<{
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
            discountPercent1: import("@prisma/client/runtime/library").Decimal | null;
            discountDays2: number | null;
            discountPercent2: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPercent: import("@prisma/client/runtime/library").Decimal | null;
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
            discountPercent1: import("@prisma/client/runtime/library").Decimal | null;
            discountDays2: number | null;
            discountPercent2: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPercent: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPeriod: string | null;
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
            discountPercent1: import("@prisma/client/runtime/library").Decimal | null;
            discountDays2: number | null;
            discountPercent2: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPercent: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPeriod: string | null;
        };
    }>;
    update(id: string, dto: UpdateErpPaymentTermDto, req: any): Promise<{
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
            discountPercent1: import("@prisma/client/runtime/library").Decimal | null;
            discountDays2: number | null;
            discountPercent2: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPercent: import("@prisma/client/runtime/library").Decimal | null;
            penaltyPeriod: string | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
