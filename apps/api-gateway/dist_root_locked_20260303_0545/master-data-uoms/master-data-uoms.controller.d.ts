import { CreateMasterDataUomDto } from './dto/create-master-data-uom.dto';
import { QueryMasterDataUomDto } from './dto/query-master-data-uom.dto';
import { UpdateMasterDataUomDto } from './dto/update-master-data-uom.dto';
import { MasterDataUomsService } from './master-data-uoms.service';
export declare class MasterDataUomsController {
    private readonly service;
    constructor(service: MasterDataUomsService);
    create(dto: CreateMasterDataUomDto, req: any): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
        };
    }>;
    findAll(query: QueryMasterDataUomDto): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
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
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
        };
    }>;
    update(id: number, dto: UpdateMasterDataUomDto, req: any): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
