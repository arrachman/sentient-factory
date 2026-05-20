"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAlertingTriageStageMetrics = exports.buildAlertingTriageMetrics = exports.buildTriageAuditSummary = exports.buildTriageSummary = void 0;
exports.triageNormalizeString = triageNormalizeString;
exports.triageNormalizeNullableNumber = triageNormalizeNullableNumber;
exports.parseTriageQueryParams = parseTriageQueryParams;
exports.buildTimelineByDeliveryId = buildTimelineByDeliveryId;
exports.buildAuditByDeliveryId = buildAuditByDeliveryId;
exports.mapTriageRow = mapTriageRow;
exports.filterAndSortTriageItems = filterAndSortTriageItems;
const dashboard_utils_1 = require("./dashboard.utils");
function triageNormalizeString(value) {
    const next = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
    return next || null;
}
function triageNormalizeNullableNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}
function parseTriageQueryParams(query) {
    const deliveryIdFilter = triageNormalizeNullableNumber(query.deliveryId || query.delivery_id);
    const triageStatusFilter = triageNormalizeString(query.triageStatus || query.triage_status)?.toLowerCase() || 'all';
    const acknowledgedFilterRaw = triageNormalizeString(query.acknowledged)?.toLowerCase() || 'all';
    const acknowledgedFilter = ['acknowledged', 'unacknowledged', 'all'].includes(acknowledgedFilterRaw)
        ? acknowledgedFilterRaw
        : acknowledgedFilterRaw === 'true'
            ? 'acknowledged'
            : acknowledgedFilterRaw === 'false'
                ? 'unacknowledged'
                : 'all';
    const slaStatusFilter = triageNormalizeString(query.slaStatus || query.sla_status)?.toLowerCase() || 'all';
    const moduleFilter = triageNormalizeString(query.moduleKey || query.module_key)?.toLowerCase() || 'all';
    const stageFilter = triageNormalizeString(query.stage)?.toLowerCase() || 'all';
    const searchFilter = triageNormalizeString(query.search)?.toLowerCase() || '';
    const sortByRaw = triageNormalizeString(query.sortBy || query.sort_by)?.toLowerCase() || 'dead_lettered_at';
    const sortBy = [
        'dead_lettered_at',
        'age_minutes',
        'sla_due_at',
        'triage_updated_at',
        'escalation_count',
        'event_title',
    ].includes(sortByRaw)
        ? sortByRaw
        : 'dead_lettered_at';
    const sortOrder = String(query.sortOrder || query.sort_order || 'desc')
        .trim()
        .toLowerCase() === 'asc'
        ? 'asc'
        : 'desc';
    return {
        deliveryIdFilter,
        triageStatusFilter,
        acknowledgedFilter,
        slaStatusFilter,
        moduleFilter,
        stageFilter,
        searchFilter,
        sortBy,
        sortOrder,
    };
}
function buildTimelineByDeliveryId(timelineRows) {
    const map = new Map();
    for (const row of timelineRows) {
        const sourceDeliveryId = Number(row.source_delivery_id || 0);
        if (!map.has(sourceDeliveryId)) {
            map.set(sourceDeliveryId, []);
        }
        map.get(sourceDeliveryId)?.push({
            escalation_delivery_id: Number(row.escalation_delivery_id || 0),
            channel_type: String(row.channel_type || ''),
            target_value: String(row.target_value || ''),
            provider_name: row.provider_name || null,
            delivery_status: String(row.delivery_status || ''),
            requested_at: row.requested_at || null,
            delivered_at: row.delivered_at || null,
            error_message: row.error_message || null,
            stage_index: Number((0, dashboard_utils_1.asJson)(row.response_payload, {})['escalation_stage_index'] || 0),
            stage_priority: Number((0, dashboard_utils_1.asJson)(row.response_payload, {})['escalation_stage_priority'] || 0),
            routing_source: String((0, dashboard_utils_1.asJson)(row.response_payload, {})['escalation_routing_source'] || ''),
            repeating_final_stage: Boolean((0, dashboard_utils_1.asJson)(row.response_payload, {})['repeating_final_stage']),
        });
    }
    return map;
}
function buildAuditByDeliveryId(auditRows) {
    const map = new Map();
    for (const row of auditRows) {
        const sourceDeliveryId = Number(row.delivery_id || 0);
        if (!map.has(sourceDeliveryId)) {
            map.set(sourceDeliveryId, []);
        }
        map.get(sourceDeliveryId)?.push({
            audit_id: Number(row.audit_id || 0),
            action_type: String(row.action_type || ''),
            previous_triage_status: row.previous_triage_status
                ? String(row.previous_triage_status)
                : null,
            next_triage_status: row.next_triage_status ? String(row.next_triage_status) : null,
            previous_acknowledged_at: row.previous_acknowledged_at
                ? String(row.previous_acknowledged_at)
                : null,
            next_acknowledged_at: row.next_acknowledged_at ? String(row.next_acknowledged_at) : null,
            previous_assigned_to: row.previous_assigned_to ? String(row.previous_assigned_to) : null,
            next_assigned_to: row.next_assigned_to ? String(row.next_assigned_to) : null,
            note_snapshot: row.note_snapshot ? String(row.note_snapshot) : null,
            detail_payload: (0, dashboard_utils_1.asJson)(row.detail_payload, {}),
            created_by: row.created_by ? String(row.created_by) : null,
            created_at: row.created_at ? String(row.created_at) : null,
        });
    }
    return map;
}
function mapTriageRow(row) {
    return {
        delivery_id: Number(row.delivery_id || 0),
        event_id: Number(row.event_id || 0),
        event_key: row.event_key || null,
        event_title: row.event_title || null,
        rule_name: row.rule_name || null,
        module_key: row.module_key || null,
        channel_type: row.channel_type,
        target_value: row.target_value,
        provider_name: row.provider_name || null,
        delivery_status: row.delivery_status,
        retry_count: Number(row.retry_count || 0),
        max_retries: Number(row.max_retries || 0),
        error_message: row.error_message || null,
        dead_lettered_at: row.dead_lettered_at || null,
        dead_letter_reason: row.dead_letter_reason || null,
        triage_id: row.triage_id ? Number(row.triage_id) : null,
        triage_status: row.triage_status,
        acknowledged_at: row.acknowledged_at || null,
        acknowledged_by: row.acknowledged_by || null,
        assigned_to: row.assigned_to || null,
        note: row.note || null,
        escalation_count: Number(row.escalation_count || 0),
        last_escalated_at: row.last_escalated_at || null,
        last_escalation_level: row.last_escalation_level || null,
        last_action_at: row.last_action_at || null,
        triage_updated_at: row.triage_updated_at || null,
    };
}
function filterAndSortTriageItems(items, params) {
    const { deliveryIdFilter, triageStatusFilter, acknowledgedFilter, slaStatusFilter, moduleFilter, stageFilter, searchFilter, sortBy, sortOrder, } = params;
    const filtered = items.filter((item) => {
        if (deliveryIdFilter && item.delivery_id !== deliveryIdFilter)
            return false;
        if (triageStatusFilter !== 'all' &&
            String(item.triage_status || '').toLowerCase() !== triageStatusFilter)
            return false;
        if (acknowledgedFilter === 'acknowledged' && !item.acknowledged_at)
            return false;
        if (acknowledgedFilter === 'unacknowledged' && item.acknowledged_at)
            return false;
        if (slaStatusFilter !== 'all' &&
            String(item.sla_status || '').toLowerCase() !== slaStatusFilter)
            return false;
        if (moduleFilter !== 'all' && String(item.module_key || '').toLowerCase() !== moduleFilter)
            return false;
        if (stageFilter === 'none' && Number(item.stage_count || 0) > 0)
            return false;
        if (stageFilter === 'staged' && Number(item.stage_count || 0) <= 0)
            return false;
        if (stageFilter === 'final' && !item.is_final_stage)
            return false;
        if (stageFilter === 'pending' && (!item.has_next_stage || item.is_final_stage))
            return false;
        if (stageFilter === 'reminder' && !item.repeating_final_stage)
            return false;
        if (searchFilter) {
            const haystack = [
                item.event_title,
                item.rule_name,
                item.module_key,
                item.target_value,
                item.assigned_to,
                item.note,
                item.dead_letter_reason,
                item.error_message,
                item.channel_type,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            if (!haystack.includes(searchFilter))
                return false;
        }
        return true;
    });
    const timestamp = (value) => {
        if (!value)
            return 0;
        const parsed = new Date(String(value)).getTime();
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const stringValue = (value) => String(value || '').toLowerCase();
    return filtered.sort((left, right) => {
        const getVal = (item) => {
            switch (sortBy) {
                case 'age_minutes':
                    return Number(item.age_minutes || 0);
                case 'sla_due_at':
                    return timestamp(item.sla_due_at);
                case 'triage_updated_at':
                    return timestamp(item.triage_updated_at);
                case 'escalation_count':
                    return Number(item.escalation_count || 0);
                case 'event_title':
                    return stringValue(item.event_title);
                case 'dead_lettered_at':
                default:
                    return timestamp(item.dead_lettered_at);
            }
        };
        const leftValue = getVal(left);
        const rightValue = getVal(right);
        if (typeof leftValue === 'string' || typeof rightValue === 'string') {
            const cmp = String(leftValue).localeCompare(String(rightValue));
            return sortOrder === 'asc' ? cmp : cmp * -1;
        }
        const cmp = Number(leftValue) - Number(rightValue);
        return sortOrder === 'asc' ? cmp : cmp * -1;
    });
}
var alerting_triage_metrics_utils_1 = require("./alerting-triage-metrics.utils");
Object.defineProperty(exports, "buildTriageSummary", { enumerable: true, get: function () { return alerting_triage_metrics_utils_1.buildTriageSummary; } });
Object.defineProperty(exports, "buildTriageAuditSummary", { enumerable: true, get: function () { return alerting_triage_metrics_utils_1.buildTriageAuditSummary; } });
Object.defineProperty(exports, "buildAlertingTriageMetrics", { enumerable: true, get: function () { return alerting_triage_metrics_utils_1.buildAlertingTriageMetrics; } });
Object.defineProperty(exports, "buildAlertingTriageStageMetrics", { enumerable: true, get: function () { return alerting_triage_metrics_utils_1.buildAlertingTriageStageMetrics; } });
//# sourceMappingURL=alerting-triage.utils.js.map