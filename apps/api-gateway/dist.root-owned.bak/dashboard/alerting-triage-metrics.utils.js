"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTriageSummary = buildTriageSummary;
exports.buildTriageAuditSummary = buildTriageAuditSummary;
exports.buildAlertingTriageMetrics = buildAlertingTriageMetrics;
exports.buildAlertingTriageStageMetrics = buildAlertingTriageStageMetrics;
function buildTriageSummary(filteredItems) {
    return {
        total_items: filteredItems.length,
        open_items: filteredItems.filter((item) => item.triage_status === 'open').length,
        acknowledged_items: filteredItems.filter((item) => Boolean(item.acknowledged_at)).length,
        investigating_items: filteredItems.filter((item) => item.triage_status === 'investigating')
            .length,
        requeued_items: filteredItems.filter((item) => item.triage_status === 'requeued').length,
        resolved_items: filteredItems.filter((item) => item.triage_status === 'resolved').length,
        overdue_items: filteredItems.filter((item) => item.sla_status === 'overdue').length,
        critical_items: filteredItems.filter((item) => item.sla_status === 'critical').length,
        unassigned_items: filteredItems.filter((item) => !item.assigned_to).length,
        staged_items: filteredItems.filter((item) => Number(item.stage_count || 0) > 0).length,
        final_stage_items: filteredItems.filter((item) => Boolean(item.is_final_stage)).length,
        pending_next_stage_items: filteredItems.filter((item) => Boolean(item.has_next_stage)).length,
    };
}
function buildTriageAuditSummary(filteredItems) {
    const auditEntries = filteredItems.flatMap((item) => item.triage_audit_timeline || []);
    const latestAuditTimestamp = auditEntries
        .map((entry) => String(entry.created_at || ''))
        .filter(Boolean)
        .sort((l, r) => new Date(r).getTime() - new Date(l).getTime())[0] || null;
    const actionCounts = new Map();
    const actorCounts = new Map();
    const activityByDay = new Map();
    for (const entry of auditEntries) {
        const actionType = String(entry.action_type || '');
        if (actionType)
            actionCounts.set(actionType, (actionCounts.get(actionType) || 0) + 1);
        const actor = String(entry.created_by || '').trim();
        if (actor)
            actorCounts.set(actor, (actorCounts.get(actor) || 0) + 1);
        const createdAt = String(entry.created_at || '');
        if (createdAt) {
            const dateKey = createdAt.slice(0, 10);
            if (dateKey)
                activityByDay.set(dateKey, (activityByDay.get(dateKey) || 0) + 1);
        }
    }
    return {
        total_entries: auditEntries.length,
        acknowledge_actions: auditEntries.filter((e) => e.action_type === 'acknowledge').length,
        unacknowledge_actions: auditEntries.filter((e) => e.action_type === 'unacknowledge').length,
        status_change_actions: auditEntries.filter((e) => e.action_type === 'status-change').length,
        assignment_actions: auditEntries.filter((e) => e.action_type === 'assign').length,
        note_change_actions: auditEntries.filter((e) => e.action_type === 'note-change').length,
        requeue_actions: auditEntries.filter((e) => e.action_type === 'requeue').length,
        auto_resolve_actions: auditEntries.filter((e) => e.action_type === 'auto-resolve').length,
        latest_action_at: latestAuditTimestamp,
        action_breakdown: Array.from(actionCounts.entries())
            .map(([action_type, count]) => ({ action_type, count }))
            .sort((l, r) => r.count - l.count || l.action_type.localeCompare(r.action_type)),
        top_actors: Array.from(actorCounts.entries())
            .map(([actor, action_count]) => ({ actor, action_count }))
            .sort((l, r) => r.action_count - l.action_count || l.actor.localeCompare(r.actor))
            .slice(0, 5),
        activity_last_7d: Array.from(activityByDay.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((l, r) => l.date.localeCompare(r.date))
            .slice(-7),
    };
}
function buildAlertingTriageMetrics(item, policy) {
    const normalizeTimestamp = (value) => {
        if (value instanceof Date)
            return value.toISOString();
        if (typeof value === 'string')
            return value;
        return null;
    };
    const baseTimestamp = normalizeTimestamp(item.dead_lettered_at) ||
        normalizeTimestamp(item.last_action_at) ||
        normalizeTimestamp(item.triage_updated_at);
    const empty = {
        age_minutes: 0,
        sla_due_at: null,
        sla_status: item.triage_status === 'resolved' ? 'resolved' : 'on-track',
        escalation_level: 'none',
        is_overdue: false,
    };
    if (!baseTimestamp)
        return empty;
    const baseTimeMs = new Date(baseTimestamp).getTime();
    if (Number.isNaN(baseTimeMs))
        return empty;
    const ageMinutes = Math.max(0, Math.floor((Date.now() - baseTimeMs) / 60000));
    const slaDueAt = new Date(baseTimeMs + policy.sla_minutes * 60000).toISOString();
    const triageStatus = String(item.triage_status || '');
    if (triageStatus === 'resolved') {
        return { age_minutes: ageMinutes, sla_due_at: slaDueAt, sla_status: 'resolved', escalation_level: 'none', is_overdue: false };
    }
    if (ageMinutes >= policy.critical_after_minutes) {
        return { age_minutes: ageMinutes, sla_due_at: slaDueAt, sla_status: 'critical', escalation_level: 'critical', is_overdue: true };
    }
    if (ageMinutes >= policy.warning_after_minutes) {
        return { age_minutes: ageMinutes, sla_due_at: slaDueAt, sla_status: 'overdue', escalation_level: 'warning', is_overdue: true };
    }
    return { age_minutes: ageMinutes, sla_due_at: slaDueAt, sla_status: 'on-track', escalation_level: 'none', is_overdue: false };
}
function buildAlertingTriageStageMetrics(item, escalationPolicies) {
    const escalationLevel = String(item.escalation_level || 'none');
    const moduleKey = String(item.module_key || 'all');
    const lastEscalationLevel = String(item.last_escalation_level || '');
    const escalationCount = Number(item.escalation_count || 0);
    const emptyStage = {
        current_stage_index: null,
        current_stage_priority: null,
        next_stage_index: null,
        next_stage_priority: null,
        stage_count: 0,
        has_next_stage: false,
        is_final_stage: false,
        next_stage_targets: [],
    };
    if (!['warning', 'critical'].includes(escalationLevel))
        return emptyStage;
    const matchingPolicies = escalationPolicies
        .map((policy) => ({
        module_key: String(policy.module_key || ''),
        escalation_level: String(policy.escalation_level || ''),
        target_type: String(policy.target_type || ''),
        target_ref: String(policy.target_ref || ''),
        priority: Number(policy.priority || 0),
    }))
        .filter((policy) => policy.escalation_level === escalationLevel &&
        (policy.module_key === moduleKey || policy.module_key === 'all'));
    const stagePriorities = Array.from(new Set(matchingPolicies.map((policy) => policy.priority))).sort((a, b) => a - b);
    if (!stagePriorities.length)
        return emptyStage;
    const currentStageIndex = lastEscalationLevel === escalationLevel
        ? Math.min(Math.max(escalationCount - 1, 0), stagePriorities.length - 1)
        : null;
    const currentStagePriority = currentStageIndex !== null ? (stagePriorities[currentStageIndex] ?? null) : null;
    const nextStageIndex = currentStageIndex === null
        ? 0
        : currentStageIndex + 1 < stagePriorities.length
            ? currentStageIndex + 1
            : null;
    const nextStagePriority = nextStageIndex !== null ? (stagePriorities[nextStageIndex] ?? null) : null;
    const nextStageTargets = nextStagePriority !== null
        ? matchingPolicies
            .filter((policy) => policy.priority === nextStagePriority)
            .map((policy) => ({
            target_type: policy.target_type,
            target_ref: policy.target_ref,
            priority: policy.priority,
        }))
        : [];
    return {
        current_stage_index: currentStageIndex,
        current_stage_priority: currentStagePriority,
        next_stage_index: nextStageIndex,
        next_stage_priority: nextStagePriority,
        stage_count: stagePriorities.length,
        has_next_stage: nextStageIndex !== null,
        is_final_stage: currentStageIndex !== null && nextStageIndex === null,
        repeating_final_stage: currentStageIndex !== null &&
            nextStageIndex === null &&
            lastEscalationLevel === escalationLevel &&
            escalationCount >= stagePriorities.length,
        next_stage_targets: nextStageTargets,
    };
}
//# sourceMappingURL=alerting-triage-metrics.utils.js.map