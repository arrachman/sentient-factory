import { ErpAddressType } from '@prisma/client';
export declare class CreateErpPartnerAddressDto {
    type: ErpAddressType;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    fax?: string;
    isDefault?: boolean;
}
