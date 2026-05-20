import { ErpAccountType, ErpAccountKind } from '@prisma/client';
export declare class QueryErpAccountDto {
    page?: number;
    limit?: number;
    search?: string;
    accountType?: ErpAccountType;
    accountKind?: ErpAccountKind;
    parentId?: string;
    isActive?: boolean;
}
