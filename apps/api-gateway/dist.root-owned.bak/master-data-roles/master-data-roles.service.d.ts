import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataRoleDto } from './dto/create-master-data-role.dto';
import { QueryMasterDataRoleDto } from './dto/query-master-data-role.dto';
import { UpdateMasterDataRoleDto } from './dto/update-master-data-role.dto';
import { UpdateRoleMenusDto } from './dto/update-role-menus.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { RolePermissionsService } from './role-permissions.service';
export declare class MasterDataRolesService {
    private prisma;
    private rolePermissionsService;
    constructor(prisma: PrismaService, rolePermissionsService: RolePermissionsService);
    create(dto: CreateMasterDataRoleDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            isSystem: boolean;
        };
    }>;
    findAll(query: QueryMasterDataRoleDto): Promise<{
        success: boolean;
        data: {
            permissionCount: number;
            menuCount: number;
            permissions: {
                permissionId: number;
            }[];
            menus: {
                menuId: number;
            }[];
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            isSystem: boolean;
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
            permissions: {
                name: string;
                id: number;
                module: string;
                action: string;
            }[];
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            isSystem: boolean;
        };
    }>;
    update(id: number, dto: UpdateMasterDataRoleDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            isSystem: boolean;
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    getRolePermissions(id: number): Promise<{
        success: boolean;
        data: {
            roleId: number;
            permissionIds: number[];
        };
    }>;
    updateRolePermissions(id: number, dto: UpdateRolePermissionsDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            roleId: number;
            permissionIds: number[];
        };
    }>;
    getRoleMenus(id: number): Promise<{
        success: boolean;
        data: {
            roleId: number;
            menuIds: number[];
        };
    }>;
    updateRoleMenus(id: number, dto: UpdateRoleMenusDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            roleId: number;
            menuIds: number[];
        };
    }>;
    private toActor;
}
