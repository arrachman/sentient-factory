import { ErpItemType } from '@prisma/client';
export declare class QueryErpItemDto {
    page?: number;
    limit?: number;
    search?: string;
    itemType?: ErpItemType;
    categoryId?: string;
    unitId?: string;
    isActive?: boolean;
}
