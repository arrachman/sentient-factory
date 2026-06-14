import { ErpPartnerCategoryKind } from '@prisma/client';
export declare class CreateErpPartnerCategoryDto {
    code: string;
    name: string;
    kind: ErpPartnerCategoryKind;
    isActive?: boolean;
}
