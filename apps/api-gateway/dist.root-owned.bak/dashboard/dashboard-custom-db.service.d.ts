import { PrismaService } from '../prisma/prisma.service';
import { DashboardCustomDbWidgetService } from './dashboard-custom-db-widget.service';
export declare class DashboardCustomDbService {
    private readonly prisma;
    private readonly customDbWidgetService;
    constructor(prisma: PrismaService, customDbWidgetService: DashboardCustomDbWidgetService);
    customDbPinTargets(): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
    }>;
    customDbCatalog(dashboardKey: string): Promise<{
        success: boolean;
        data: {
            layout_config: {};
            default_filter_values: {};
            widgets: {
                ui_config: {};
                filter_binding: never[];
                widget_order: number;
                queries: {
                    query_params: never[];
                    output_columns: never[];
                    default_limit: number | null;
                }[];
            }[];
            filters: Record<string, unknown>[];
        };
    }>;
    updateCustomDbCatalog(dashboardKey: string, body: {
        title?: string;
        description?: string | null;
    }): Promise<{
        success: boolean;
    }>;
    executeCustomDbQuery(dashboardKey: string, queryKey: string, params: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            label: unknown;
            sql: string;
            columns: string[];
            rows: Record<string, unknown>[];
        };
    }>;
    pinCustomDbWidget(body: {
        dashboardKey?: string;
        title?: string;
        description?: string | null;
        widgetKind?: string;
        chartType?: string | null;
        spanClassName?: string | null;
        sqlTemplate?: string;
        outputColumns?: string[];
        queryLabel?: string;
    }): Promise<{
        success: boolean;
        data: {
            dashboard_key: string;
            widget_key: string;
            query_key: string;
        };
    }>;
    updateCustomDbWidget(widgetId: string, body: {
        title?: string;
        description?: string | null;
        spanClassName?: string | null;
        widgetOrder?: number | null;
        chartType?: string | null;
        defaultLimit?: number | null;
    }): Promise<{
        success: boolean;
    }>;
    deleteCustomDbWidget(widgetId: string): Promise<{
        success: boolean;
    }>;
    duplicateCustomDbWidget(widgetId: string): Promise<{
        success: boolean;
        data: {
            widget_id: string;
            widget_key: string;
        };
    }>;
    private buildCustomDashboardLookupSql;
    private findCustomDashboardIdOrThrow;
    private findResolvedDashboardKeyOrThrow;
    private renderSqlTemplate;
    private toSqlLiteral;
}
