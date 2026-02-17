import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataCityDto } from './dto/create-master-data-city.dto';
import { QueryMasterDataCityDto } from './dto/query-master-data-city.dto';
import { UpdateMasterDataCityDto } from './dto/update-master-data-city.dto';
export declare class MasterDataCitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataCityDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            province: {
                name: string;
                id: number;
                isoCode: string;
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
            provinceId: number;
            postalCode: string;
        };
    }>;
    findAll(query: QueryMasterDataCityDto): Promise<{
        success: boolean;
        data: ({
            province: {
                name: string;
                id: number;
                isoCode: string;
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
            provinceId: number;
            postalCode: string;
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
            province: {
                name: string;
                id: number;
                isoCode: string;
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
            provinceId: number;
            postalCode: string;
        };
    }>;
    update(id: number, dto: UpdateMasterDataCityDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            province: {
                name: string;
                id: number;
                isoCode: string;
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
            provinceId: number;
            postalCode: string;
        };
    }>;
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
