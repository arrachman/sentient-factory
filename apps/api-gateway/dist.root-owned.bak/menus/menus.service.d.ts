import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuSortBatchDto } from './dto/update-menu-sort-batch.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuSidebarService } from './menu-sidebar.service';
import { SidebarMenuItem } from './menu-tree.utils';
export declare class MenusService {
    private prisma;
    private sidebarService;
    constructor(prisma: PrismaService, sidebarService: MenuSidebarService);
    create(dto: CreateMenuDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            id: number;
            key: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: string;
            parentId: number | null;
            parentTitle: string | null;
            sortOrder: number;
            isVisible: boolean;
            isActive: boolean;
            permissionName: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(query: QueryMenuDto): Promise<{
        success: boolean;
        data: {
            id: number;
            key: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: string;
            parentId: number | null;
            parentTitle: string | null;
            sortOrder: number;
            isVisible: boolean;
            isActive: boolean;
            permissionName: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            key: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: string;
            parentId: number | null;
            parentTitle: string | null;
            sortOrder: number;
            isVisible: boolean;
            isActive: boolean;
            permissionName: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: number, dto: UpdateMenuDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            id: number;
            key: string;
            title: string;
            path: string | null;
            icon: string | null;
            type: string;
            parentId: number | null;
            parentTitle: string | null;
            sortOrder: number;
            isVisible: boolean;
            isActive: boolean;
            permissionName: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateSortBatch(dto: UpdateMenuSortBatchDto, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSidebarByUserId(userId: number | string): Promise<SidebarMenuItem[]>;
    private ensureParentExists;
    private ensureParentNotDescendant;
    private resolveGroupMenuIds;
    private toActor;
}
