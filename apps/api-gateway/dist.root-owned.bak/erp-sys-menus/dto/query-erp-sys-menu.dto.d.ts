import { ErpMenuType } from '@prisma/client';
export declare class QueryErpSysMenuDto {
    type?: ErpMenuType;
    parentId?: string;
    isActive?: boolean;
}
