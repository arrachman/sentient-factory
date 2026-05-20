import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseMeta } from './user-admin.utils';
export declare class UserWarehouseService {
    private prisma;
    constructor(prisma: PrismaService);
    ensureWarehouseExists(warehouseId: number): Promise<void>;
    ensureRolesExist(roleIds: number[]): Promise<void>;
    syncRoles(userId: number, roleIds: number[], actorId?: string | number): Promise<void>;
    getCurrentWarehouseId(userId: string | number): Promise<number | null>;
    setWarehouseId(userId: number, warehouseId: number | null): Promise<void>;
    getWarehouseMapByUserIds(userIds: number[]): Promise<Record<string, WarehouseMeta>>;
    serializeUsersWithWarehouse(users: Array<User & {
        roles?: Array<{
            role: {
                id: number;
                name: string;
            };
        }>;
    }>): Promise<{
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
    }[]>;
}
