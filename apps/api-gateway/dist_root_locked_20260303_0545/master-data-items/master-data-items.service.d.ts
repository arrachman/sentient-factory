import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataItemDto } from './dto/create-master-data-item.dto';
import { QueryMasterDataItemDto } from './dto/query-master-data-item.dto';
import { UpdateMasterDataItemDto } from './dto/update-master-data-item.dto';
export declare class MasterDataItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataItemDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            uom: {
                type: string;
                name: string;
                id: number;
                code: string;
            };
        } & {
            name: string;
            isActive: boolean;
            id: number;
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
                type: string;
                name: string;
                id: number;
                code: string;
            };
        } & {
            name: string;
            isActive: boolean;
            id: number;
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
                type: string;
                name: string;
                id: number;
                code: string;
            };
        } & {
            name: string;
            isActive: boolean;
            id: number;
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
    update(id: number, dto: UpdateMasterDataItemDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            uom: {
                type: string;
                name: string;
                id: number;
                code: string;
            };
        } & {
            name: string;
            isActive: boolean;
            id: number;
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
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
