import { CreateErpWarehouseDto } from './dto/create-erp-warehouse.dto';
import { QueryErpWarehouseDto } from './dto/query-erp-warehouse.dto';
import { UpdateErpWarehouseDto } from './dto/update-erp-warehouse.dto';
import { ErpWarehousesService } from './erp-warehouses.service';
export declare class ErpWarehousesController {
    private readonly service;
    constructor(service: ErpWarehousesService);
    create(dto: CreateErpWarehouseDto, req: any): Promise<{
        success: boolean;
        data: {
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    findAll(query: QueryErpWarehouseDto): Promise<{
        success: boolean;
        data: ({
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            locationId: bigint;
            allowNegativeStock: boolean;
        })[];
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
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    update(id: string, dto: UpdateErpWarehouseDto, req: any): Promise<{
        success: boolean;
        data: {
            location: {
                name: string;
                id: bigint;
                code: string;
                branch: {
                    name: string;
                    id: bigint;
                    code: string;
                };
            };
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            locationId: bigint;
            allowNegativeStock: boolean;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
