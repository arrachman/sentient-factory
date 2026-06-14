import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataCitySlaDto } from './dto/create-master-data-city-sla.dto';
import { QueryMasterDataCitySlaDto } from './dto/query-master-data-city-sla.dto';
import { UpdateMasterDataCitySlaDto } from './dto/update-master-data-city-sla.dto';
export declare class MasterDataCitySlasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataCitySlaDto, actorId?: string): Promise<{
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
    update(id: number, dto: UpdateMasterDataCitySlaDto, actorId?: string): Promise<{
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
    remove(id: number, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private parseCityId;
    private ensureCityExists;
}
