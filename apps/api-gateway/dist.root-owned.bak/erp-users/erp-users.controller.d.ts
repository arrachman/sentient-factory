import { CreateErpUserDto } from './dto/create-erp-user.dto';
import { QueryErpUserDto } from './dto/query-erp-user.dto';
import { UpdateErpUserDto } from './dto/update-erp-user.dto';
import { ErpUsersService } from './erp-users.service';
export declare class ErpUsersController {
    private readonly service;
    constructor(service: ErpUsersService);
    create(dto: CreateErpUserDto, req: any): Promise<{
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
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateErpUserDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
