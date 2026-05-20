import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWarehouseService } from './user-warehouse.service';
export declare class UserAdminService {
    private prisma;
    private warehouseSvc;
    constructor(prisma: PrismaService, warehouseSvc: UserWarehouseService);
    findAll(query: QueryUserDto): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
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
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    createFromAdmin(dto: CreateUserDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    update(id: number, dto: UpdateUserDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roleIds: number[];
            roleId: number | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
        };
    }>;
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
