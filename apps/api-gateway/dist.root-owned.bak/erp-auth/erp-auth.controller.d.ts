import { Request, Response } from 'express';
import { ErpAuthService } from './erp-auth.service';
import { ErpLoginDto } from './dto/erp-login.dto';
import { ErpAuthResponseDto } from './dto/erp-auth-response.dto';
export declare class ErpAuthController {
    private readonly erpAuthService;
    constructor(erpAuthService: ErpAuthService);
    login(dto: ErpLoginDto, req: Request, res: Response): Promise<{
        success: boolean;
        data: ErpAuthResponseDto;
    }>;
    logout(res: Response): {
        success: boolean;
        message: string;
    };
    getMe(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
