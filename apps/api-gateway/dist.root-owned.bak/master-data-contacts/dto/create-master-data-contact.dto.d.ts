declare const CONTACT_TYPES: readonly ["customer", "supplier", "company"];
export declare class CreateMasterDataContactDto {
    code: string;
    name: string;
    tax?: string;
    website?: string;
    address?: string;
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    type: (typeof CONTACT_TYPES)[number];
    contactFirstName?: string;
    contactEmail?: string;
    contactPhone?: string;
}
export {};
