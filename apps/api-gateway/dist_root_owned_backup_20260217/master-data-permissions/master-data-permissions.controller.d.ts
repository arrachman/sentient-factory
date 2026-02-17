import { CreateMasterDataPermissionDto } from './dto/create-master-data-permission.dto';
import { QueryMasterDataPermissionDto } from './dto/query-master-data-permission.dto';
import { UpdateMasterDataPermissionDto } from './dto/update-master-data-permission.dto';
import { MasterDataPermissionsService } from './master-data-permissions.service';
export declare class MasterDataPermissionsController {
    private readonly service;
    constructor(service: MasterDataPermissionsService);
    create(dto: CreateMasterDataPermissionDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    findAll(query: QueryMasterDataPermissionDto): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    update(id: number, dto: UpdateMasterDataPermissionDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
