import { ErpMenuType } from '@prisma/client';
export declare class CreateErpSysMenuDto {
    code: string;
    title: string;
    path?: string;
    icon?: string;
    type: ErpMenuType;
    parentId?: string | null;
    sortOrder: number;
    isActive: boolean;
}
