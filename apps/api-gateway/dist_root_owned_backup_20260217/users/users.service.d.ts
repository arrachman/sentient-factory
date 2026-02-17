import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
type WarehouseMeta = {
    warehouseId: number | null;
    warehouseName: string | null;
};
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<User | null>;
    findOneByUsername(username: string): Promise<User | null>;
    findOneById(id: string | number): Promise<User | null>;
    findOneByUuid(id: string | number): Promise<User | null>;
    hasWarehouse(id: string | number): Promise<boolean>;
    getWarehouseMetaByUserUuid(id: string | number): Promise<WarehouseMeta>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    createFromAdmin(dto: CreateUserDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
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
    findAll(query: QueryUserDto): Promise<{
        success: boolean;
        data: {
            warehouseId: number | null;
            warehouseName: string | null;
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
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
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
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
            roles: string[];
            role: string | null;
            id: number;
            email: string;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
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
    updateRefreshToken(_userId: string, _refreshToken: string | null): Promise<void>;
    private normalizeWarehouseId;
    private ensureWarehouseExists;
    private getCurrentWarehouseId;
    private setWarehouseId;
    private getWarehouseMapByUserUuids;
    private serializeUsersWithWarehouse;
    private serializeUser;
}
export {};
