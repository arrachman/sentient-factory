import { PrismaService } from '../prisma/prisma.service';
import { CreateErpRoleDto } from './dto/create-erp-role.dto';
import { UpdateErpRoleDto } from './dto/update-erp-role.dto';
import { QueryErpRoleDto } from './dto/query-erp-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';
export declare class ErpRolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpRoleDto, actorId?: string): Promise<{
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
    findOne(id: BigInt): Promise<{
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
    update(id: BigInt, dto: UpdateErpRoleDto, actorId?: string): Promise<{
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
    remove(id: BigInt, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    assignPermissions(id: BigInt, dto: AssignPermissionsDto, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPermissions(id: BigInt): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            code: string;
            group: string | null;
        }[];
    }>;
    assignMenus(id: BigInt, dto: AssignMenusDto, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMenus(id: BigInt): Promise<{
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
