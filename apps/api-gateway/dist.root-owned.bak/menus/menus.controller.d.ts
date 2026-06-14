import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuSortBatchDto } from './dto/update-menu-sort-batch.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';
export declare class MenusController {
    private menusService;
    constructor(menusService: MenusService);
    create(dto: CreateMenuDto, req: any): Promise<{
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
    getSidebar(req: any): Promise<{
        success: boolean;
        data: any[];
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
    updateSortBatch(dto: UpdateMenuSortBatchDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    update(id: number, dto: UpdateMenuDto, req: any): Promise<{
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
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
