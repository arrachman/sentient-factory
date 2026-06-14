import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpUserDto } from './dto/create-erp-user.dto';
import { UpdateErpUserDto } from './dto/update-erp-user.dto';
import { QueryErpUserDto } from './dto/query-erp-user.dto';
export declare class ErpUsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpUserDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            email: string | null;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            expiresAt: Date | null;
            code: string;
            metadata: Prisma.JsonValue | null;
            level: import("@prisma/client").$Enums.ErpUserLevel;
            language: string;
            defaultMenuId: bigint | null;
            homeBranchId: bigint | null;
            homeWarehouseId: bigint | null;
            salesmanPartnerId: bigint | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
        };
    }>;
    findAll(query: QueryErpUserDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            code: string;
            level: import("@prisma/client").$Enums.ErpUserLevel;
            language: string;
            homeBranchId: bigint | null;
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
            name: string;
            id: bigint;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            roles: {
                role: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            }[];
            expiresAt: Date | null;
            code: string;
            level: import("@prisma/client").$Enums.ErpUserLevel;
            language: string;
            defaultMenuId: bigint | null;
            homeBranchId: bigint | null;
            homeWarehouseId: bigint | null;
            createdById: bigint | null;
            updatedById: bigint | null;
        };
    }>;
    update(id: BigInt, dto: UpdateErpUserDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            email: string | null;
            isActive: boolean;
            updatedAt: Date;
            code: string;
            level: import("@prisma/client").$Enums.ErpUserLevel;
        };
    }>;
    remove(id: BigInt, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
