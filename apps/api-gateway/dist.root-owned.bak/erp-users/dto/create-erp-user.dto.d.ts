import { ErpUserLevel } from '@prisma/client';
export declare class CreateErpUserDto {
    username: string;
    email?: string;
    password: string;
    fullName: string;
    erpLevel: ErpUserLevel;
    isActive?: boolean;
    branchId?: string;
}
