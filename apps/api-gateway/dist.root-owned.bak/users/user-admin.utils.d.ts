import { User } from '@prisma/client';
export type WarehouseMeta = {
    warehouseId: number | null;
    warehouseName: string | null;
};
export declare function normalizeWarehouseId(warehouseId?: string): number | null | undefined;
export declare function normalizeRoleIds(roleIds?: string[], roleId?: string): number[] | undefined;
export declare function serializeUser(user: User & {
    roles?: Array<{
        role: {
            id: number;
            name: string;
        };
    }>;
}, warehouseMeta?: WarehouseMeta): {
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
