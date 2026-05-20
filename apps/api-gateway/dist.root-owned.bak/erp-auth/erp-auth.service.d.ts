import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { ErpAuthResponseDto } from './dto/erp-auth-response.dto';
export interface ErpLoginMeta {
    ipAddress?: string | null;
    userAgent?: string | null;
}
export declare class ErpAuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateErpUser(login: string, password: string): Promise<{
        name: string;
        id: bigint;
        email: string | null;
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
    } | null>;
    login(erpUser: Awaited<ReturnType<ErpAuthService['validateErpUser']>> & object, res: Response, meta?: ErpLoginMeta): Promise<ErpAuthResponseDto>;
    logout(res: Response): void;
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string | null;
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
    }>;
    private normalizeHeaderValue;
}
