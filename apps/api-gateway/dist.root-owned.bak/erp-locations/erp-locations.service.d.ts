import { PrismaService } from '../prisma/prisma.service';
import { CreateErpLocationDto } from './dto/create-erp-location.dto';
import { QueryErpLocationDto } from './dto/query-erp-location.dto';
import { UpdateErpLocationDto } from './dto/update-erp-location.dto';
export declare class ErpLocationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpLocationDto, actorId?: string): Promise<{
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
    findOne(id: bigint): Promise<{
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
    update(id: bigint, dto: UpdateErpLocationDto, actorId?: string): Promise<{
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
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
