import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<User | null>;
    findOneByUsername(username: string): Promise<User | null>;
    findOneById(id: string | number): Promise<User | null>;
    findOneByUuid(id: string | number): Promise<User | null>;
    hasWarehouse(id: string | number): Promise<boolean>;
    getWarehouseMetaByUserUuid(id: string | number): Promise<{
        warehouseId: number | null;
        warehouseName: string | null;
    }>;
    getActiveRoleNamesByUserId(id: string | number): Promise<string[]>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    updateRefreshToken(_userId: string, _refreshToken: string | null): Promise<void>;
    private getCurrentWarehouseId;
}
