import { ErpFiscalPeriodStatus } from '@prisma/client';
export declare class CreateErpFiscalPeriodDto {
    year: number;
    periodNo: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status?: ErpFiscalPeriodStatus;
}
