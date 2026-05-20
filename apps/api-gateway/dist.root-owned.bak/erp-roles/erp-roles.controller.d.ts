import { AssignMenusDto } from './dto/assign-menus.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateErpRoleDto } from './dto/create-erp-role.dto';
import { QueryErpRoleDto } from './dto/query-erp-role.dto';
import { UpdateErpRoleDto } from './dto/update-erp-role.dto';
import { ErpRolesService } from './erp-roles.service';
export declare class ErpRolesController {
    private readonly service;
    constructor(service: ErpRolesService);
    create(dto: CreateErpRoleDto, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
        };
    }>;
    findAll(query: QueryErpRoleDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
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
            description: string | null;
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
        };
    }>;
    update(id: string, dto: UpdateErpRoleDto, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    assignPermissions(id: string, dto: AssignPermissionsDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getPermissions(id: string): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            code: string;
            group: string | null;
        }[];
    }>;
    assignMenus(id: string, dto: AssignMenusDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMenus(id: string): Promise<{
        success: boolean;
        data: {
            canView: boolean;
            canCreate: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canApprove: boolean;
            canPrint: boolean;
            canExport: boolean;
            canImport: boolean;
            isFavorite: boolean;
            id: bigint;
            type: import("@prisma/client").$Enums.ErpMenuType;
            title: string;
            path: string | null;
            icon: string | null;
            sortOrder: number;
            code: string;
        }[];
    }>;
}
