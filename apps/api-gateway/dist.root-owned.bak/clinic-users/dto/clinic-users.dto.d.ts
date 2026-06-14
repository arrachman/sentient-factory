export declare class CreateClinicUserDto {
    email: string;
    fullName: string;
    username?: string;
    password?: string;
    roles: string[];
    isActive?: boolean;
}
declare const UpdateClinicUserDto_base: import("@nestjs/common").Type<Partial<CreateClinicUserDto>>;
export declare class UpdateClinicUserDto extends UpdateClinicUserDto_base {
}
export declare class QueryClinicUserDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}
export {};
