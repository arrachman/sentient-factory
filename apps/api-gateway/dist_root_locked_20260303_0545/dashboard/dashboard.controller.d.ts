import { Request } from 'express';
import { AskM2InsightDto } from './dto/ask-m2-insight.dto';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardInsightHistoryDto } from './dto/query-dashboard-insight-history.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    listDomains(): {
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            allowedGroupBy: readonly string[];
            allowedSortBy: readonly string[];
            specPath: string;
            sqlTemplateDir: string;
        }[];
    };
    health(): Promise<{
        success: boolean;
        data: {
            templateRoot: string;
            database: {
                host: string;
                port: number;
                user: string;
                database: string;
            };
            mysqlPing: boolean;
            templates: Array<{
                domain: "m1" | "m" | "m2" | "m2r" | "so";
                files: {
                    summary: boolean;
                    trends: boolean;
                    breakdown: boolean;
                    table: boolean;
                };
            }>;
        };
    }>;
    metadata(domain: string): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            templates: {
                summary: string;
                trends: string;
                breakdown: string;
                table: string;
            };
            sourceTables: {
                summary: string | null;
                trends: string | null;
                breakdown: string | null;
                table: string | null;
            };
            columnsByTable: {
                tableName: string;
                columns: string[];
                dateColumnCandidates: string[];
                selectedDateColumn: string | null;
            }[];
            allowlist: {
                groupBy: string[];
                sortBy: string[];
            };
            effective: {
                groupBy: string[];
                sortBy: string[];
            };
        };
    }>;
    summary(domain: string, query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    trends(domain: string, query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdown(domain: string, query: QueryDashboardBreakdownDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                groupBy: string;
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownSoStatus(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownSoRealisasi(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownSoSalesman(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownSoCustomer(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownM2Status(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownM2Cashflow(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownM2Branch(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    insightM2(req: Request & {
        user?: {
            id?: number | string;
        };
    }, query: QueryDashboardRangeDto): Promise<{
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
    askInsightM2(req: Request & {
        user?: {
            id?: number | string;
        };
    }, dto: AskM2InsightDto): Promise<{
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
    insightHistoryM2(req: Request & {
        user?: {
            id?: number | string;
        };
    }, query: QueryDashboardInsightHistoryDto): Promise<{
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
    table(domain: string, query: QueryDashboardTableDto): Promise<{
        success: boolean;
        data: {
            domain: "m1" | "m" | "m2" | "m2r" | "so";
            type: string;
            query: {
                page: number;
                pageSize: number;
                offset: number;
                sortBy: string;
                sortOrder: string;
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
}
