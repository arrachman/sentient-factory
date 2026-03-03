import { PrismaService } from '../prisma/prisma.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardMysqlService } from './dashboard-mysql.service';
export declare class DashboardService {
    private readonly dashboardMysqlService;
    private readonly prisma;
    private readonly supportedDomains;
    constructor(dashboardMysqlService: DashboardMysqlService, prisma: PrismaService);
    summary(domainInput: string, query: QueryDashboardRangeDto): Promise<{
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
    trends(domainInput: string, query: QueryDashboardRangeDto): Promise<{
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
    breakdown(domainInput: string, query: QueryDashboardBreakdownDto): Promise<{
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
    table(domainInput: string, query: QueryDashboardTableDto): Promise<{
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
    breakdownStatus(query: QueryDashboardRangeDto): Promise<{
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
    breakdownRealisasi(query: QueryDashboardRangeDto): Promise<{
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
    breakdownSalesman(query: QueryDashboardRangeDto): Promise<{
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
    breakdownCustomer(query: QueryDashboardRangeDto): Promise<{
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
    metadata(domainInput: string): Promise<{
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
    private assertDomain;
    private normalizeRange;
    private resolveAllowedGroupBy;
    private resolveAllowedSortBy;
    private resolveM2SourceCode;
    private wrapExecutionError;
    private executePresetBreakdown;
    private buildM2InsightPayload;
    private ensureInsightHistoryTable;
    private saveInsightHistory;
    private extractConfidenceAverage;
    private filterExistingColumns;
    private toNumber;
    private formatNumber;
    private formatMoneyCompact;
    private formatPercent;
    private toAuditUserId;
}
