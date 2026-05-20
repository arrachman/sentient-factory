import { PrismaService } from '../prisma/prisma.service';
export declare class AlertingInsightQueryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    alertingInsights(moduleKey?: string, snapshotId?: string): Promise<{
        success: boolean;
        data: {
            snapshot_id: number;
            metric_key: unknown;
            metric_label: unknown;
            module_key: unknown;
            snapshot_at: unknown;
            insight_text: unknown;
            recommendation_preview: unknown;
            anomaly_level: unknown;
            status: unknown;
            is_alert_candidate: boolean;
            current_value: unknown;
            comparison_value: unknown;
            change_pct: unknown;
            trend_label: unknown;
            source_ref: unknown;
            dimensions: {};
            evidence_payload: {};
        }[];
    }>;
    alertingSavedQueries(channel?: string, limit?: string): Promise<{
        success: boolean;
        data: Record<string, unknown>[];
    }>;
    alertingEvents(moduleKey?: string, eventId?: string): Promise<{
        success: boolean;
        data: {
            event_id: number;
            event_key: unknown;
            rule_id: number;
            rule_name: unknown;
            module_key: unknown;
            metric_label: {} | null;
            title: unknown;
            description: unknown;
            severity: unknown;
            status: unknown;
            source_ref: {} | null;
            event_payload: {};
            detected_at: unknown;
            acknowledged_at: unknown;
            resolved_at: unknown;
            deliveries: never[];
        }[];
    }>;
    private mapAlertingInsightRow;
    mapAlertEventRow(row: Record<string, unknown>): {
        event_id: number;
        event_key: unknown;
        rule_id: number;
        rule_name: unknown;
        module_key: unknown;
        metric_label: {} | null;
        title: unknown;
        description: unknown;
        severity: unknown;
        status: unknown;
        source_ref: {} | null;
        event_payload: {};
        detected_at: unknown;
        acknowledged_at: unknown;
        resolved_at: unknown;
        deliveries: never[];
    };
    private getAiBaseUrl;
    private fetchAlertingSavedQueryJson;
}
