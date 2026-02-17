import { CreateMasterDataWarehouseDto } from './dto/create-master-data-warehouse.dto';
import { QueryMasterDataWarehouseDto } from './dto/query-master-data-warehouse.dto';
import { UpdateMasterDataWarehouseDto } from './dto/update-master-data-warehouse.dto';
import { MasterDataWarehousesService } from './master-data-warehouses.service';
export declare class MasterDataWarehousesController {
    private readonly service;
    constructor(service: MasterDataWarehousesService);
    create(dto: CreateMasterDataWarehouseDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            locationName: string | null;
            addressDetail: string | null;
        };
    }>;
    findAll(query: QueryMasterDataWarehouseDto): Promise<{
        success: boolean;
        data: ({
            city: {
                name: string;
                id: number;
                postalCode: string;
            };
        } & {
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            locationName: string | null;
            addressDetail: string | null;
        })[];
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
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            locationName: string | null;
            addressDetail: string | null;
        };
    }>;
    update(id: number, dto: UpdateMasterDataWarehouseDto, req: any): Promise<{
        success: boolean;
        data: {
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            locationName: string | null;
            addressDetail: string | null;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
