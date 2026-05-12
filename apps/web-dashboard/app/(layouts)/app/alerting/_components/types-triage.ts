// Dead-letter triage records, summaries, audit, and saved views.

export type AlertDeadLetterTriageRecord = {
  delivery_id: number;
  event_id: number;
  event_key: string | null;
  event_title: string | null;
  rule_name: string | null;
  module_key: string | null;
  channel_type: string;
  target_value: string;
  provider_name: string | null;
  delivery_status: string;
  retry_count: number;
  max_retries: number;
  error_message: string | null;
  dead_lettered_at: string | null;
  dead_letter_reason: string | null;
  triage_id: number | null;
  triage_status: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  assigned_to: string | null;
  note: string | null;
  escalation_count: number;
  last_escalated_at: string | null;
  last_escalation_level: string | null;
  last_action_at: string | null;
  triage_updated_at: string | null;
  age_minutes: number;
  sla_due_at: string | null;
  sla_status: string;
  escalation_level: string;
  is_overdue: boolean;
  current_stage_index: number | null;
  current_stage_priority: number | null;
  next_stage_index: number | null;
  next_stage_priority: number | null;
  stage_count: number;
  has_next_stage: boolean;
  is_final_stage: boolean;
  repeating_final_stage: boolean;
  next_stage_targets: Array<{
    target_type: string;
    target_ref: string;
    priority: number;
  }>;
  escalation_timeline: Array<{
    escalation_delivery_id: number;
    channel_type: string;
    target_value: string;
    provider_name: string | null;
    delivery_status: string;
    requested_at: string | null;
    delivered_at: string | null;
    error_message: string | null;
    stage_index: number;
    stage_priority: number;
    routing_source: string;
    repeating_final_stage: boolean;
  }>;
  triage_audit_timeline: Array<{
    audit_id: number;
    action_type: string;
    previous_triage_status: string | null;
    next_triage_status: string | null;
    previous_acknowledged_at: string | null;
    next_acknowledged_at: string | null;
    previous_assigned_to: string | null;
    next_assigned_to: string | null;
    note_snapshot: string | null;
    detail_payload: Record<string, unknown>;
    created_by: string | null;
    created_at: string | null;
  }>;
};

export type AlertDeadLetterTriageSummary = {
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

export type AlertDeadLetterTriageAuditSummary = {
  total_entries: number;
  acknowledge_actions: number;
  unacknowledge_actions: number;
  status_change_actions: number;
  assignment_actions: number;
  note_change_actions: number;
  requeue_actions: number;
  auto_resolve_actions: number;
  latest_action_at: string | null;
  action_breakdown: Array<{
    action_type: string;
    count: number;
  }>;
  top_actors: Array<{
    actor: string;
    action_count: number;
  }>;
  activity_last_7d: Array<{
    date: string;
    count: number;
  }>;
};

export type AlertDeadLetterTriageFilterContext = {
  delivery_id: number | null;
  triage_status: string;
  acknowledged: string;
  sla_status: string;
  module_key: string;
  stage: string;
  search: string;
  sort_by: string;
  sort_order: string;
};

export type AlertTriageSavedViewRecord = {
  view_id: number;
  view_key: string;
  name: string;
  owner_actor: string | null;
  is_shared: boolean;
  is_default: boolean;
  filters_json: Record<string, unknown>;
  sort_by: string;
  sort_order: string;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string | null;
  is_owned_by_current_user: boolean;
};

export type AlertDeadLetterTriagePolicy = {
  sla_minutes: number;
  warning_after_minutes: number;
  critical_after_minutes: number;
};

