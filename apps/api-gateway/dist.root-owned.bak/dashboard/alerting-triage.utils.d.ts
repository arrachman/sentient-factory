export declare function triageNormalizeString(value: unknown): string | null;
export declare function triageNormalizeNullableNumber(value: unknown): number | null;
export interface TriageQueryParams {
    deliveryIdFilter: number | null;
    triageStatusFilter: string;
    acknowledgedFilter: string;
    slaStatusFilter: string;
    moduleFilter: string;
    stageFilter: string;
    searchFilter: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export declare function parseTriageQueryParams(query: Record<string, unknown>): TriageQueryParams;
export declare function buildTimelineByDeliveryId(timelineRows: Array<Record<string, unknown>>): Map<number, Array<Record<string, unknown>>>;
export declare function buildAuditByDeliveryId(auditRows: Array<Record<string, unknown>>): Map<number, Array<Record<string, unknown>>>;
export declare function mapTriageRow(row: Record<string, unknown>): Record<string, unknown>;
export declare function filterAndSortTriageItems(items: Array<Record<string, unknown>>, params: TriageQueryParams): Array<Record<string, unknown>>;
export { buildTriageSummary, buildTriageAuditSummary, buildAlertingTriageMetrics, buildAlertingTriageStageMetrics, } from './alerting-triage-metrics.utils';
