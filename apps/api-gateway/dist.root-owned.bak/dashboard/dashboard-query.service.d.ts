import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardQueryM2Service } from './dashboard-query-m2.service';
import { DashboardQueryM2CrService } from './dashboard-query-m2cr.service';
import { DashboardKpiService } from './dashboard-kpi.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
export declare class DashboardQueryService {
    private readonly dashboardMysqlService;
    private readonly dashboardInsightService;
    private readonly dashboardQueryM2Service;
    private readonly dashboardQueryM2CrService;
    private readonly dashboardKpiService;
    private readonly supportedDomains;
    private readonly logger;
    constructor(dashboardMysqlService: DashboardMysqlService, dashboardInsightService: DashboardInsightService, dashboardQueryM2Service: DashboardQueryM2Service, dashboardQueryM2CrService: DashboardQueryM2CrService, dashboardKpiService: DashboardKpiService);
    summary(domainInput: string, query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    topContactsM2Sm(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    contactDrilldownM2Sm(query: QueryDashboardRangeDto & {
        kontakId?: string;
    }): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                kontakId: number;
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownM2Status(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            domain: "m2";
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
            domain: "m2";
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
            domain: "m2";
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            sqlTemplatePath: string;
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    summaryM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    trendsM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownSourceM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    topContactsM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    topOutstandingContactsM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    topBranchesM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    contactDrilldownM2Cr(query: QueryDashboardRangeDto & {
        kontakId?: string;
    }): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                kontakId: number;
                fromDate: string;
                toDate: string;
            };
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    tableM2Cr(query: QueryDashboardTableDto): Promise<{
        success: boolean;
        data: {
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
            rows: import("mysql2").RowDataPacket[];
        };
    }>;
    insightM2Cr(query: QueryDashboardRangeDto): Promise<{
        success: boolean;
        data: {
            type: string;
            query: {
                fromDate: string;
                toDate: string;
            };
            model: {
                provider: string;
                version: string;
            };
            insights: {
                text: string;
                confidence: number;
            }[];
            anomalies: string[];
            recommendations: string[];
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
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
                domain: "m" | "m1" | "m2" | "m2r" | "so";
                files: {
                    summary: boolean;
                    trends: boolean;
                    breakdown: boolean;
                    table: boolean;
                };
            }>;
        };
    }>;
    managerKpis(): Promise<{
        success: boolean;
        data: {
            cards: ({
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                formula: string;
                numerator?: undefined;
                denominator?: undefined;
                delta?: undefined;
                deltaLabel?: undefined;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                numerator: number;
                denominator: number;
                delta: number;
                deltaLabel: string;
                formula: string;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                delta: number;
                deltaLabel: string;
                formula: string;
                numerator?: undefined;
                denominator?: undefined;
            } | {
                title: string;
                subtitle: string;
                value: number;
                unit: string;
                formattedValue: string;
                numerator: number;
                denominator: number;
                formula: string;
                delta?: undefined;
                deltaLabel?: undefined;
            })[];
            breakdown: {
                dataFreshnessByDomain: {
                    domain: string;
                    datasetCount: number;
                    compliantCount: number;
                    compliancePct: number;
                }[];
            };
        };
    }>;
    metadata(domainInput: string): Promise<{
        success: boolean;
        data: {
            domain: "m" | "m1" | "m2" | "m2r" | "so";
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
    private executePresetBreakdown;
}
