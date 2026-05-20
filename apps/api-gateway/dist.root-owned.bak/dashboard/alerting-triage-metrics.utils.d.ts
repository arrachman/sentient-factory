export declare function buildTriageSummary(filteredItems: Array<Record<string, unknown>>): {
    total_items: number;
    open_items: number;
    acknowledged_items: number;
    investigating_items: number;
    requeued_items: number;
    resolved_items: number;
    overdue_items: number;
    critical_items: number;
    unassigned_items: number;
    staged_items: number;
    final_stage_items: number;
    pending_next_stage_items: number;
};
export declare function buildTriageAuditSummary(filteredItems: Array<Record<string, unknown>>): {
    total_entries: number;
    acknowledge_actions: number;
    unacknowledge_actions: number;
    status_change_actions: number;
    assignment_actions: number;
    note_change_actions: number;
    requeue_actions: number;
    auto_resolve_actions: number;
    latest_action_at: string | null;
    action_breakdown: {
        action_type: string;
        count: number;
    }[];
    top_actors: {
        actor: string;
        action_count: number;
    }[];
    activity_last_7d: {
        date: string;
        count: number;
    }[];
};
export declare function buildAlertingTriageMetrics(item: Record<string, unknown>, policy: {
    sla_minutes: number;
    warning_after_minutes: number;
    critical_after_minutes: number;
}): {
    age_minutes: number;
    sla_due_at: null;
    sla_status: string;
    escalation_level: string;
    is_overdue: boolean;
} | {
    age_minutes: number;
    sla_due_at: string;
    sla_status: string;
    escalation_level: string;
    is_overdue: boolean;
};
export declare function buildAlertingTriageStageMetrics(item: Record<string, unknown>, escalationPolicies: Array<Record<string, unknown>>): {
    current_stage_index: null;
    current_stage_priority: null;
    next_stage_index: null;
    next_stage_priority: null;
    stage_count: number;
    has_next_stage: boolean;
    is_final_stage: boolean;
    next_stage_targets: Array<{
        target_type: string;
        target_ref: string;
        priority: number;
    }>;
} | {
    current_stage_index: number | null;
    current_stage_priority: number | null;
    next_stage_index: number | null;
    next_stage_priority: number | null;
    stage_count: number;
    has_next_stage: boolean;
    is_final_stage: boolean;
    repeating_final_stage: boolean;
    next_stage_targets: {
        target_type: string;
        target_ref: string;
        priority: number;
    }[];
};
