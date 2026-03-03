import { CreateMasterDataCityDto } from './dto/create-master-data-city.dto';
import { QueryMasterDataCityDto } from './dto/query-master-data-city.dto';
import { UpdateMasterDataCityDto } from './dto/update-master-data-city.dto';
import { MasterDataCitiesService } from './master-data-cities.service';
export declare class MasterDataCitiesController {
    private readonly service;
    constructor(service: MasterDataCitiesService);
    create(dto: CreateMasterDataCityDto, req: any): Promise<{
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
    update(id: number, dto: UpdateMasterDataCityDto, req: any): Promise<{
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
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
