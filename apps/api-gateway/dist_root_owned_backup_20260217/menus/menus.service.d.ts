import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
type SidebarMenuItem = {
    id: number;
    key: string;
    title: string;
    path: string | null;
    icon: string | null;
    type: string;
    parentId: number | null;
    sortOrder: number;
    children: SidebarMenuItem[];
};
export declare class MenusService {
    private prisma;
    constructor(prisma: PrismaService);
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
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSidebarByUserId(userId: number | string): Promise<SidebarMenuItem[]>;
    private ensureParentExists;
    private ensureParentNotDescendant;
    private toActor;
    private serializeMenu;
}
export {};
