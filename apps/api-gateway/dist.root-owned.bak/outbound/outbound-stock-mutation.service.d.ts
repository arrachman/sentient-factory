import { PrismaService } from '../prisma/prisma.service';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
export declare class OutboundStockMutationService {
    private prisma;
    constructor(prisma: PrismaService);
    findStockMutationReport(query: QueryStockMutationReportDto): Promise<{
        success: boolean;
        data: {
            itemId: number;
            warehouseId: number;
            supplierNames: string[];
            description: string;
            batchNumber: string;
            expiryDate: Date | null;
            total: number;
            actualToday: number;
            actualThreeMonths: number;
            actualSixMonths: number;
            expire: string;
            remarks: string;
        }[];
        meta: {
            total: number;
        };
    }>;
}
