import { PrismaService } from '../prisma/prisma.service';
import { CreateErpFiscalPeriodDto } from './dto/create-erp-fiscal-period.dto';
import { QueryErpFiscalPeriodDto } from './dto/query-erp-fiscal-period.dto';
import { UpdateErpFiscalPeriodDto } from './dto/update-erp-fiscal-period.dto';
export declare class ErpFiscalPeriodsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpFiscalPeriodDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        };
    }>;
    findAll(query: QueryErpFiscalPeriodDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        }[];
    }>;
    findOne(id: bigint): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpFiscalPeriodDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    openPeriod(id: bigint, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        };
    }>;
    closePeriod(id: bigint, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.ErpFiscalPeriodStatus;
            year: number;
            createdById: bigint | null;
            updatedById: bigint | null;
            periodNo: number;
            startDate: Date;
            endDate: Date;
            closedAt: Date | null;
            closedById: bigint | null;
            softClosedAt: Date | null;
            reopenedAt: Date | null;
            reopenedById: bigint | null;
            reopenReason: string | null;
        };
    }>;
}
