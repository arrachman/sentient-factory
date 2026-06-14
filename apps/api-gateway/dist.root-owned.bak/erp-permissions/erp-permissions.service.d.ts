import { PrismaService } from '../prisma/prisma.service';
import { QueryErpPermissionDto } from './dto/query-erp-permission.dto';
export declare class ErpPermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryErpPermissionDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: BigInt): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            createdById: bigint | null;
            updatedById: bigint | null;
            group: string | null;
        };
    }>;
}
