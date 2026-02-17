import { CreateMasterDataCitySlaDto } from './dto/create-master-data-city-sla.dto';
import { QueryMasterDataCitySlaDto } from './dto/query-master-data-city-sla.dto';
import { UpdateMasterDataCitySlaDto } from './dto/update-master-data-city-sla.dto';
import { MasterDataCitySlasService } from './master-data-city-slas.service';
export declare class MasterDataCitySlasController {
    private readonly service;
    constructor(service: MasterDataCitySlasService);
    create(dto: CreateMasterDataCitySlaDto, req: any): Promise<{
        success: boolean;
        data: {
            city: {
                name: string;
                id: number;
                province: {
                    name: string;
                    id: number;
                    isoCode: string;
                };
                postalCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            stdLeadTimeDays: number;
            stdReturnDoDays: number;
        };
    }>;
    findAll(query: QueryMasterDataCitySlaDto): Promise<{
        success: boolean;
        data: ({
            city: {
                name: string;
                id: number;
                province: {
                    name: string;
                    id: number;
                    isoCode: string;
                };
                postalCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            stdLeadTimeDays: number;
            stdReturnDoDays: number;
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
            city: {
                name: string;
                id: number;
                province: {
                    name: string;
                    id: number;
                    isoCode: string;
                };
                postalCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            stdLeadTimeDays: number;
            stdReturnDoDays: number;
        };
    }>;
    update(id: number, dto: UpdateMasterDataCitySlaDto, req: any): Promise<{
        success: boolean;
        data: {
            city: {
                name: string;
                id: number;
                province: {
                    name: string;
                    id: number;
                    isoCode: string;
                };
                postalCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            cityId: number;
            stdLeadTimeDays: number;
            stdReturnDoDays: number;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
