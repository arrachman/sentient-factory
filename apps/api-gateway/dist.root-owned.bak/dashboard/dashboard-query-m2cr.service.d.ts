import { DashboardMysqlService } from './dashboard-mysql.service';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
export declare class DashboardQueryM2CrService {
    private readonly dashboardMysqlService;
    constructor(dashboardMysqlService: DashboardMysqlService);
    summaryM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    trendsM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    breakdownSourceM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    breakdownStatusBayarM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    topContactsM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    topOutstandingContactsM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    topBranchesM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    contactDrilldownM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }, kontakId: number): Promise<{
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
    tableM2Cr(query: QueryDashboardTableDto, normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    insightM2Cr(normalizedRange: {
        fromDate: string;
        toDate: string;
    }): Promise<{
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
    validateKontakId(rawKontakId?: string): number;
}
