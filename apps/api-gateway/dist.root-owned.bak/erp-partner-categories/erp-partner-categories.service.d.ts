import { PrismaService } from '../prisma/prisma.service';
import { CreateErpPartnerCategoryDto } from './dto/create-erp-partner-category.dto';
import { QueryErpPartnerCategoryDto } from './dto/query-erp-partner-category.dto';
import { UpdateErpPartnerCategoryDto } from './dto/update-erp-partner-category.dto';
export declare class ErpPartnerCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpPartnerCategoryDto, actorId?: string): Promise<{
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
            kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            salesTier: number | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpPartnerCategoryDto, actorId?: string): Promise<{
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
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
