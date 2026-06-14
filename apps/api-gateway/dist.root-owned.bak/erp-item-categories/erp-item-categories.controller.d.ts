import { CreateErpItemCategoryDto } from './dto/create-erp-item-category.dto';
import { QueryErpItemCategoryDto } from './dto/query-erp-item-category.dto';
import { UpdateErpItemCategoryDto } from './dto/update-erp-item-category.dto';
import { ErpItemCategoriesService } from './erp-item-categories.service';
export declare class ErpItemCategoriesController {
    private readonly service;
    constructor(service: ErpItemCategoriesService);
    create(dto: CreateErpItemCategoryDto, req: any): Promise<{
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
    update(id: string, dto: UpdateErpItemCategoryDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
