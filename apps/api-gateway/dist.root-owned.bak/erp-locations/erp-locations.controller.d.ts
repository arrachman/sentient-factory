import { CreateErpLocationDto } from './dto/create-erp-location.dto';
import { QueryErpLocationDto } from './dto/query-erp-location.dto';
import { UpdateErpLocationDto } from './dto/update-erp-location.dto';
import { ErpLocationsService } from './erp-locations.service';
export declare class ErpLocationsController {
    private readonly service;
    constructor(service: ErpLocationsService);
    create(dto: CreateErpLocationDto, req: any): Promise<{
        success: boolean;
        data: {
            branch: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            city: string | null;
            code: string;
            notes: string | null;
            postalCode: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint;
            addressLine1: string | null;
        };
    }>;
    findAll(query: QueryErpLocationDto): Promise<{
        success: boolean;
        data: ({
            branch: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            city: string | null;
            code: string;
            notes: string | null;
            postalCode: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint;
            addressLine1: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            branch: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            city: string | null;
            code: string;
            notes: string | null;
            postalCode: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint;
            addressLine1: string | null;
        };
    }>;
    update(id: string, dto: UpdateErpLocationDto, req: any): Promise<{
        success: boolean;
        data: {
            branch: {
                name: string;
                id: bigint;
                code: string;
            };
        } & {
            name: string;
            id: bigint;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            city: string | null;
            code: string;
            notes: string | null;
            postalCode: string | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint;
            addressLine1: string | null;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
