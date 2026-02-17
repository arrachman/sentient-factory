import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataPermissionDto } from './dto/create-master-data-permission.dto';
import { QueryMasterDataPermissionDto } from './dto/query-master-data-permission.dto';
import { UpdateMasterDataPermissionDto } from './dto/update-master-data-permission.dto';
export declare class MasterDataPermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMasterDataPermissionDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    findAll(query: QueryMasterDataPermissionDto): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
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
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    update(id: number, dto: UpdateMasterDataPermissionDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            name: string;
            description: string | null;
            module: string;
            action: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    private toActor;
}
