import { PrismaService } from '../prisma/prisma.service';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { OutboundStockMutationService } from './outbound-stock-mutation.service';
export declare class OutboundStockReportService {
    private prisma;
    private outboundStockMutationService;
    constructor(prisma: PrismaService, outboundStockMutationService: OutboundStockMutationService);
    findStockBatchReport(query: QueryStockBatchReportDto): Promise<{
        success: boolean;
        data: {
            id: bigint;
            item: {
                name: string;
                id: number;
                code: string;
                uom: {
                    name: string;
                    id: number;
                    code: string;
                };
            };
            warehouse: {
                name: string;
                id: number;
            };
            batch: {
                id: number;
                batchNumber: string;
            };
            supplierNames: string[];
            transactionDate: Date;
            mmfOrDo: string;
            description: string;
            inbound: number;
            outbound: number;
            balance: number;
            replenish: string;
        }[];
        meta: {
            total: number;
        };
    }>;
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
