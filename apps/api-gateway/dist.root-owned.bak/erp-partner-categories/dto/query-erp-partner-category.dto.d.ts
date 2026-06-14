import { ErpPartnerCategoryKind } from '@prisma/client';
export declare class QueryErpPartnerCategoryDto {
    page?: number;
    limit?: number;
    search?: string;
    kind?: ErpPartnerCategoryKind;
    isActive?: boolean;
}
