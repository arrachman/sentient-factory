import { QueryErpPermissionDto } from './dto/query-erp-permission.dto';
import { ErpPermissionsService } from './erp-permissions.service';
export declare class ErpPermissionsController {
    private readonly service;
    constructor(service: ErpPermissionsService);
    findAll(query: QueryErpPermissionDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string | null;
        };
    }>;
}
