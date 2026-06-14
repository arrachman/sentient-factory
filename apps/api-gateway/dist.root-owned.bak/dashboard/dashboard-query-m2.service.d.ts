import { DashboardMysqlService } from './dashboard-mysql.service';
export declare class DashboardQueryM2Service {
    private readonly dashboardMysqlService;
    constructor(dashboardMysqlService: DashboardMysqlService);
    topContactsM2Sm(normalizedRange: {
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
    contactDrilldownM2Sm(normalizedRange: {
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
    breakdownM2Status(normalizedRange: {
        fromDate: string;
        toDate: string;
    }, sourceCode: string | null): Promise<{
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
    breakdownM2Cashflow(normalizedRange: {
        fromDate: string;
        toDate: string;
    }, sourceCode: string | null): Promise<{
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
    breakdownM2Branch(normalizedRange: {
        fromDate: string;
        toDate: string;
    }, sourceCode: string | null): Promise<{
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
    validateKontakId(rawKontakId?: string): number;
    private executePresetBreakdown;
}
