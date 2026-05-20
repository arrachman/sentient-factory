import { ErpUserLevel } from '@prisma/client';
export declare class QueryErpUserDto {
    page?: number;
    limit?: number;
    search?: string;
    erpLevel?: ErpUserLevel;
    isActive?: boolean;
}
