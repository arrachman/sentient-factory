import { PrismaService } from '../prisma/prisma.service';
import { UpdateRoleMenusDto } from './dto/update-role-menus.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
export declare class RolePermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
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
