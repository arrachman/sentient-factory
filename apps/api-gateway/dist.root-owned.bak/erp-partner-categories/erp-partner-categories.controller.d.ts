import { CreateErpPartnerCategoryDto } from './dto/create-erp-partner-category.dto';
import { QueryErpPartnerCategoryDto } from './dto/query-erp-partner-category.dto';
import { UpdateErpPartnerCategoryDto } from './dto/update-erp-partner-category.dto';
import { ErpPartnerCategoriesService } from './erp-partner-categories.service';
export declare class ErpPartnerCategoriesController {
    private readonly service;
    constructor(service: ErpPartnerCategoriesService);
    create(dto: CreateErpPartnerCategoryDto, req: any): Promise<{
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
            kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            salesTier: number | null;
        };
    }>;
    findAll(query: QueryErpPartnerCategoryDto): Promise<{
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
            kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            salesTier: number | null;
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
            kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            salesTier: number | null;
        };
    }>;
    update(id: string, dto: UpdateErpPartnerCategoryDto, req: any): Promise<{
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
            kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            salesTier: number | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
