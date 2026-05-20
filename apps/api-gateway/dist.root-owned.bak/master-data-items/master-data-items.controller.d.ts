import { CreateMasterDataItemDto } from './dto/create-master-data-item.dto';
import { QueryMasterDataItemDto } from './dto/query-master-data-item.dto';
import { UpdateMasterDataItemDto } from './dto/update-master-data-item.dto';
import { MasterDataItemsService } from './master-data-items.service';
export declare class MasterDataItemsController {
    private readonly service;
    constructor(service: MasterDataItemsService);
    create(dto: CreateMasterDataItemDto, req: any): Promise<{
        success: boolean;
        data: {
            uom: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
        } & {
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
            category: string;
            uomId: number;
            itemType: string;
        };
    }>;
    findAll(query: QueryMasterDataItemDto): Promise<{
        success: boolean;
        data: ({
            uom: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
        } & {
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
            category: string;
            uomId: number;
            itemType: string;
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
            uom: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
        } & {
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
            category: string;
            uomId: number;
            itemType: string;
        };
    }>;
    update(id: number, dto: UpdateMasterDataItemDto, req: any): Promise<{
        success: boolean;
        data: {
            uom: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
        } & {
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
            category: string;
            uomId: number;
            itemType: string;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
