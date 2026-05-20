import { ErpMenu } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpSysMenuDto } from './dto/create-erp-sys-menu.dto';
import { QueryErpSysMenuDto } from './dto/query-erp-sys-menu.dto';
import { UpdateErpSysMenuDto } from './dto/update-erp-sys-menu.dto';
type MenuNode = ErpMenu & {
    children: MenuNode[];
};
export declare class ErpSysMenusService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpSysMenuDto, actorId?: string): Promise<{
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
    findOne(id: bigint): Promise<{
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
    getTree(): Promise<{
        success: boolean;
        data: MenuNode[];
    }>;
    getMyMenus(userId: string, erpLevel: string): Promise<{
        success: boolean;
        data: MenuNode[];
    }>;
    update(id: bigint, dto: UpdateErpSysMenuDto, actorId?: string): Promise<{
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
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
