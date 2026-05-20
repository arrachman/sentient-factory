export declare const GENDERS: readonly ["L", "P"];
export type Gender = (typeof GENDERS)[number];
export declare const CLIENT_CATEGORIES: readonly ["dewasa", "remaja", "anak", "pasangan", "keluarga"];
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];
export declare const CLIENT_STATUSES: readonly ["baru", "aktif", "selesai"];
export type ClientStatus = (typeof CLIENT_STATUSES)[number];
export declare class CreateClientDto {
    name: string;
    gender: Gender;
    age?: number;
    category?: ClientCategory;
    phoneWa: string;
    medicalRecordNumber?: string;
    preferredServiceType?: string;
    email?: string;
    address?: string;
    notes?: string;
    waOptedOut?: boolean;
    isActive?: boolean;
}
declare const UpdateClientDto_base: import("@nestjs/common").Type<Partial<CreateClientDto>>;
export declare class UpdateClientDto extends UpdateClientDto_base {
}
export declare class QueryClientDto {
    page?: number;
    limit?: number;
    search?: string;
    gender?: Gender;
    category?: ClientCategory;
    status?: ClientStatus;
    waOptedOut?: boolean;
    isActive?: boolean;
}
export {};
