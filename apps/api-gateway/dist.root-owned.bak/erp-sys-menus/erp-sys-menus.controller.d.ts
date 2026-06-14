import { CreateErpSysMenuDto } from './dto/create-erp-sys-menu.dto';
import { QueryErpSysMenuDto } from './dto/query-erp-sys-menu.dto';
import { UpdateErpSysMenuDto } from './dto/update-erp-sys-menu.dto';
import { ErpSysMenusService } from './erp-sys-menus.service';
export declare class ErpSysMenusController {
    private readonly service;
    constructor(service: ErpSysMenusService);
    create(dto: CreateErpSysMenuDto, req: any): Promise<{
        success: boolean;
        data: {
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        };
    }>;
    findAll(query: QueryErpSysMenuDto): Promise<{
        success: boolean;
        data: {
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        }[];
    }>;
    getTree(): Promise<{
        success: boolean;
        data: ({
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        } & {
            children: ({
                id: bigint;
                code: string;
                title: string;
                path: string | null;
                icon: string | null;
                type: import("@prisma/client").$Enums.ErpMenuType;
                sortOrder: number;
                isActive: boolean;
                legacyCode: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdById: bigint | null;
                updatedById: bigint | null;
                deletedAt: Date | null;
                parentId: bigint | null;
            } & any)[];
        })[];
    }>;
    getMyMenus(req: any): Promise<{
        success: boolean;
        data: ({
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        } & {
            children: ({
                id: bigint;
                code: string;
                title: string;
                path: string | null;
                icon: string | null;
                type: import("@prisma/client").$Enums.ErpMenuType;
                sortOrder: number;
                isActive: boolean;
                legacyCode: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdById: bigint | null;
                updatedById: bigint | null;
                deletedAt: Date | null;
                parentId: bigint | null;
            } & any)[];
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            children: {
                id: bigint;
                code: string;
                title: string;
                path: string | null;
                icon: string | null;
                type: import("@prisma/client").$Enums.ErpMenuType;
                sortOrder: number;
                isActive: boolean;
                legacyCode: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdById: bigint | null;
                updatedById: bigint | null;
                deletedAt: Date | null;
                parentId: bigint | null;
            }[];
        } & {
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        };
    }>;
    update(id: string, dto: UpdateErpSysMenuDto, req: any): Promise<{
        success: boolean;
        data: {
            id: bigint;
            code: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: import("@prisma/client").$Enums.ErpMenuType;
            sortOrder: number;
            isActive: boolean;
            legacyCode: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: bigint | null;
            updatedById: bigint | null;
            deletedAt: Date | null;
            parentId: bigint | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
