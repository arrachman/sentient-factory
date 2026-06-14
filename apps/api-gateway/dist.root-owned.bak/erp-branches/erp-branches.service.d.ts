import { PrismaService } from '../prisma/prisma.service';
import { CreateErpBranchDto } from './dto/create-erp-branch.dto';
import { QueryErpBranchDto } from './dto/query-erp-branch.dto';
import { UpdateErpBranchDto } from './dto/update-erp-branch.dto';
export declare class ErpBranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpBranchDto, actorId?: string): Promise<{
        success: boolean;
        data: {
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
            addressLine1: string | null;
            addressLine2: string | null;
            fax: string | null;
        };
    }>;
    findAll(query: QueryErpBranchDto): Promise<{
        success: boolean;
        data: {
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
            addressLine1: string | null;
            addressLine2: string | null;
            fax: string | null;
        }[];
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
            addressLine1: string | null;
            addressLine2: string | null;
            fax: string | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpBranchDto, actorId?: string): Promise<{
        success: boolean;
        data: {
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
            addressLine1: string | null;
            addressLine2: string | null;
            fax: string | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
