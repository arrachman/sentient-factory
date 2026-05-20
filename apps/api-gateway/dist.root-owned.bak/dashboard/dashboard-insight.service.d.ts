import { PrismaService } from '../prisma/prisma.service';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
export declare class DashboardInsightService {
    private readonly prisma;
    private readonly dashboardMysqlService;
    private readonly logger;
    constructor(prisma: PrismaService, dashboardMysqlService: DashboardMysqlService);
    insightM2(query: QueryDashboardRangeDto & {
        feature?: string;
    }, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            summary: {
                totalRows: number;
                totalDebit: number;
                totalKredit: number;
                netCashflow: number;
            };
            insightItems: {
                text: string;
                confidence: number;
            }[];
            insights: {
                text: string;
                confidence: number;
            }[];
            anomalies: string[];
            recommendations: string[];
            confidenceAvg: number;
            domain: "m2";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            model: {
                provider: string;
                version: string;
            };
        };
    }>;
    askInsightM2(dto: {
        question: string;
        fromDate?: string;
        toDate?: string;
        feature?: string;
    }, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            question: string;
            answer: string;
            confidence: number;
            recommendations: string[];
            anomalies: string[];
            domain: "m2";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            model: {
                provider: string;
                version: string;
            };
        };
    }>;
    insightHistoryM2(query: QueryDashboardRangeDto & {
        feature?: string;
        page?: number;
        pageSize?: number;
    }, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            domain: "m2";
            type: string;
            query: {
                feature: string;
                page: number;
                pageSize: number;
                offset: number;
                fromDate: string;
                toDate: string;
            };
            rows: Record<string, unknown>[];
        };
    }>;
    private buildM2InsightPayload;
    private ensureInsightHistoryTable;
    private saveInsightHistory;
}
