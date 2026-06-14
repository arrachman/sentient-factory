import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardCustomDbWidgetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private slugify;
    private findOrCreateCustomDashboardId;
    private resolveRouteSegment;
}
