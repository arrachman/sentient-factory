import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataWarehouseDto } from './dto/create-master-data-warehouse.dto';
import { QueryMasterDataWarehouseDto } from './dto/query-master-data-warehouse.dto';
import { UpdateMasterDataWarehouseDto } from './dto/update-master-data-warehouse.dto';
export declare class MasterDataWarehousesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataWarehouseDto, actorId?: string): Promise<{
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
    update(id: number, dto: UpdateMasterDataWarehouseDto, actorId?: string): Promise<{
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
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
