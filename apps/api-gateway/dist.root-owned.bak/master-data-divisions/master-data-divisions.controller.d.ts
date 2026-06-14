import { CreateMasterDataDivisionDto } from './dto/create-master-data-division.dto';
import { QueryMasterDataDivisionDto } from './dto/query-master-data-division.dto';
import { UpdateMasterDataDivisionDto } from './dto/update-master-data-division.dto';
import { MasterDataDivisionsService } from './master-data-divisions.service';
export declare class MasterDataDivisionsController {
    private readonly service;
    constructor(service: MasterDataDivisionsService);
    create(dto: CreateMasterDataDivisionDto, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
        };
    }>;
    findAll(query: QueryMasterDataDivisionDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
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
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            code: string;
        };
    }>;
    update(id: number, dto: UpdateMasterDataDivisionDto, req: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: number;
            isActive: boolean;
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
