import { CreateErpFiscalPeriodDto } from './dto/create-erp-fiscal-period.dto';
import { QueryErpFiscalPeriodDto } from './dto/query-erp-fiscal-period.dto';
import { UpdateErpFiscalPeriodDto } from './dto/update-erp-fiscal-period.dto';
import { ErpFiscalPeriodsService } from './erp-fiscal-periods.service';
export declare class ErpFiscalPeriodsController {
    private readonly service;
    constructor(service: ErpFiscalPeriodsService);
    create(dto: CreateErpFiscalPeriodDto, req: any): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateErpFiscalPeriodDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    openPeriod(id: string, req: any): Promise<{
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
    closePeriod(id: string, req: any): Promise<{
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
