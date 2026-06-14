import { PrismaService } from '../prisma/prisma.service';
import { CreateErpItemCategoryDto } from './dto/create-erp-item-category.dto';
import { QueryErpItemCategoryDto } from './dto/query-erp-item-category.dto';
import { UpdateErpItemCategoryDto } from './dto/update-erp-item-category.dto';
export declare class ErpItemCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpItemCategoryDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            parentId: bigint | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
        };
    }>;
    findAll(query: QueryErpItemCategoryDto): Promise<{
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
            parentId: bigint | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
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
                isActive: boolean;
                code: string;
            }[];
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            parentId: bigint | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpItemCategoryDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            parentId: bigint | null;
            code: string;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            inventoryAccountId: bigint | null;
            cogsAccountId: bigint | null;
            salesAccountId: bigint | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
