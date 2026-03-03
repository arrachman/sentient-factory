import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataProvinceDto } from './dto/create-master-data-province.dto';
import { QueryMasterDataProvinceDto } from './dto/query-master-data-province.dto';
import { UpdateMasterDataProvinceDto } from './dto/update-master-data-province.dto';
export declare class MasterDataProvincesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataProvinceDto, actorId?: string): Promise<{
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
            isoCode: string;
        };
    }>;
    findAll(query: QueryMasterDataProvinceDto): Promise<{
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
            isoCode: string;
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
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            isoCode: string;
        };
    }>;
    update(id: number, dto: UpdateMasterDataProvinceDto, actorId?: string): Promise<{
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
            isoCode: string;
        };
    }>;
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
