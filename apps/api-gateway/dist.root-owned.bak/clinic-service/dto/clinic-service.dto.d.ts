export declare const SERVICE_CATEGORIES: readonly ["konseling", "terapi", "tes"];
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export declare class SlotOverrideDto {
    index: number;
    start: string;
    end: string;
}
export declare class CreateServiceDto {
    name: string;
    category: ServiceCategory;
    sessionCount: number;
    durationMinutes: number;
    basePrice: number;
    description?: string;
    isActive?: boolean;
    slotOverrides?: SlotOverrideDto[];
}
declare const UpdateServiceDto_base: import("@nestjs/common").Type<Partial<CreateServiceDto>>;
export declare class UpdateServiceDto extends UpdateServiceDto_base {
}
export declare class QueryServiceDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: ServiceCategory;
    isActive?: boolean;
}
export {};
