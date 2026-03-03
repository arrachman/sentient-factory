declare const CONTACT_TYPES: readonly ["customer", "supplier", "company"];
export declare class QueryMasterDataContactDto {
    page?: number;
    limit?: number;
    search?: string;
    type?: (typeof CONTACT_TYPES)[number];
}
export {};
