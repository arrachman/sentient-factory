import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataDivisionDto } from './dto/create-master-data-division.dto';
import { QueryMasterDataDivisionDto } from './dto/query-master-data-division.dto';
import { UpdateMasterDataDivisionDto } from './dto/update-master-data-division.dto';
export declare class MasterDataDivisionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataDivisionDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            description: string | null;
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
        };
    }>;
    findAll(query: QueryMasterDataDivisionDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
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
            description: string | null;
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
        };
    }>;
    update(id: number, dto: UpdateMasterDataDivisionDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            description: string | null;
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
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    private toActor;
}
