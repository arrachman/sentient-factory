import type { AlertSeverity, AlertStatus, NotificationChannel } from '../_lib/mock-data';

export const moduleOptions = ['All Modules', 'Sales', 'Finance', 'Warehouse', 'Purchasing'] as const;
export const internalUserOptions = [
  'Finance Manager',
  'Warehouse Supervisor',
  'Sales Manager',
  'Procurement Analyst',
] as const;

export type ModuleOption = (typeof moduleOptions)[number];
export type InternalUserOption = (typeof internalUserOptions)[number];

export type BusinessMetricGoal = {
  metric_goal_id: number;
  stakeholder_role: string;
  stakeholder_name: string | null;
  goal_statement: string;
  decision_context: string | null;
  business_question: string | null;
  priority: string;
  owner_name: string | null;
  is_primary: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
};

export type MetricConditionMapping = {
  mapping_id: number;
  semantic_ref: string;
  comparison_type: string;
  value_type: string;
  ui_condition_key: string;
  ui_condition_label: string;
  operator_key: string;
  operator_label: string;
  example_metric_key: string | null;
  example_condition: string | null;
  input_config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  is_default: boolean;
  sort_order: number;
};

export type BusinessMetricOption = {
  metric_id: number;
  metric_key: string;
  label: string;
  short_label: string | null;
  module_key: string;
  description: string | null;
  business_definition: string | null;
  unit: string | null;
  value_type: string;
  comparison_type: string | null;
  source_type: string;
  source_ref: string | null;
  semantic_ref: string | null;
  canonical_semantic_key: string | null;
  semantic_label: string | null;
  semantic_entity_key: string | null;
  semantic_measure_key: string | null;
  semantic_definition: string | null;
  semantic_calculation_summary: string | null;
  system_metric_ref: string | null;
  system_metric_label: string | null;
  system_source_table: string | null;
  system_aggregation_type: string | null;
  supported_dimensions: string[];
  default_filters: Record<string, unknown>;
  tags: string[];
  owner_name: string | null;
  review_status: string;
  goal_count: number;
  goals: BusinessMetricGoal[];
  condition_mapping_count: number;
  condition_mappings: MetricConditionMapping[];
};

export type SavedQueryOption = {
  session_id: string;
  prompt_id: string;
  title: string;
  prompt: string;
  query_sql: string;
  channel: string | null;
  mode: string | null;
  last_prompt_at: string | null;
  created_at: string | null;
};

export type AlertEventRecord = {
  event_id: number;
  event_key: string;
  rule_id: number;
  rule_name: string;
  module_key: string;
  metric_label: string | null;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source_ref: string | null;
  event_payload: Record<string, unknown>;
  detected_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  deliveries: Array<{
    channel_type: string;
    target_value: string;
    delivery_status: string;
  }>;
};

export type AlertRuleRecord = {
  rule_id: number;
  rule_key: string;
  rule_name: string;
  description: string;
  module_key: string;
  severity: AlertSeverity;
  schedule_value: string;
  primary_channel: string;
  status: string;
  is_active: boolean;
  last_run_at: string | null;
  created_at: string | null;
  metric_label: string | null;
  recipients: Array<{
    recipient_id: number;
    channel_type: string;
    target_label: string;
    target_value: string;
  }>;
};

export type AlertRuleDetailRecord = AlertRuleRecord & {
  source_type: string;
  source_ref: string | null;
  metric_id: number | null;
  system_metric_ref: string | null;
  semantic_ref: string | null;
  condition_mapping_id: number | null;
  condition_mapping_key: string | null;
  condition_operator_key: string | null;
  comparison_type: string | null;
  value_type: string | null;
  schedule_type: string;
  condition_summary: string | null;
  condition_config: Record<string, unknown>;
  source_context: Record<string, unknown>;
  message_template: string | null;
  recent_events: Array<{
    event_id: number;
    event_key: string;
    title: string;
    severity: string;
    status: string;
    detected_at: string | null;
  }>;
  run_history: Array<{
    run_log_id: number;
    run_status: string;
    matched_count: number;
    triggered_event_count: number;
    started_at: string | null;
    finished_at: string | null;
    error_message: string | null;
  }>;
};

export type AlertDeliveryLogRecord = {
  delivery_log_id: number;
  event_id: number;
  event_key: string;
  event_title: string;
  channel_type: string;
  target_label: string;
  target_value: string;
  delivery_status: string;
  provider_key: string | null;
  external_message_id: string | null;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  last_attempt_at: string | null;
  dead_lettered_at: string | null;
  dead_letter_reason: string | null;
  queued_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
};

export type AlertDeliveryStatusRecord = {
  channel_type: 'wa-group' | 'wa-personal' | 'email';
  provider_mode: 'smtp' | 'webhook' | 'dry-run' | 'baileys';
  provider_name: string;
  is_configured: boolean;
};

export type AlertDeliveryStatusPayload = {
  scheduler_interval_ms: number;
  delivery_interval_ms: number;
  triage_escalation_interval_ms: number;
  channels: AlertDeliveryStatusRecord[];
};

export type PersistedAlertChannelRecord = {
  channel_id: number;
  channel_key: string;
  channel_type: 'wa-group' | 'wa-personal' | 'email';
  label: string;
  target_value: string;
  ownership_type: NotificationChannel['ownership'];
  owner_label: string | null;
  status: NotificationChannel['status'];
  is_active: boolean;
  metadata: Record<string, unknown>;
};

export type AlertRuntimeSettingRecord = {
  setting_id: number;
  setting_key: string;
  setting_group: string;
  label: string;
  value_text: string | null;
  value_json: Record<string, unknown>;
  description: string | null;
  is_active: boolean;
};

export type AlertEscalationPolicyRecord = {
  policy_id: number;
  module_key: string;
  escalation_level: 'warning' | 'critical';
  target_type: 'channel' | 'role' | 'team';
  target_ref: string;
  priority: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string | null;
};

export type AlertAnalyticsPayload = {
  summary: {
    total_events: number;
    open_events: number;
    acknowledged_events: number;
    resolved_events: number;
    critical_events: number;
    last_24h_events: number;
  };
  noisy_rules: Array<{
    rule_id: number;
    rule_name: string;
    module_key: string;
    event_count_24h: number;
    open_count_24h: number;
    last_detected_at: string | null;
  }>;
  unresolved_by_module: Array<{
    module_key: string;
    unresolved_count: number;
  }>;
  rule_effectiveness: Array<{
    rule_id: number;
    rule_name: string;
    module_key: string;
    total_runs: number;
    successful_runs: number;
    triggered_events: number;
    avg_events_per_run: number;
    total_events: number;
    open_events: number;
    acknowledged_events: number;
    resolved_events: number;
    total_deliveries: number;
    delivered_deliveries: number;
    failed_deliveries: number;
    dead_lettered_deliveries: number;
    acknowledgement_rate: number;
    resolution_rate: number;
    delivery_success_rate: number;
    last_run_at: string | null;
  }>;
};

export type AlertDeliveryObservabilityPayload = {
  summary: {
    total_logs: number;
    delivered_logs: number;
    queued_logs: number;
    failed_logs: number;
    dead_lettered_logs: number;
    retried_logs: number;
  };
  by_channel: Array<{
    channel_type: string;
    total_logs: number;
    delivered_logs: number;
    failed_logs: number;
    queued_logs: number;
  }>;
  top_providers: Array<{
    provider_name: string;
    total_logs: number;
    failed_logs: number;
  }>;
  pending_retries: Array<{
    delivery_id: number;
    channel_type: string;
    target_value: string;
    retry_count: number;
    max_retries: number;
    next_retry_at: string | null;
  }>;
  dead_letters: Array<{
    delivery_id: number;
    channel_type: string;
    target_value: string;
    retry_count: number;
    max_retries: number;
    dead_lettered_at: string | null;
    dead_letter_reason: string | null;
  }>;
};

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

export type AlertOpsPayload = {
  analytics: AlertAnalyticsPayload;
  delivery_observability: AlertDeliveryObservabilityPayload;
  delivery_status: AlertDeliveryStatusPayload;
  provider_health: {
    smtp: {
      configured: boolean;
      host: string | null;
      port: number | null;
      secure: boolean;
      from: string | null;
      has_auth: boolean;
    };
    baileys: {
      enabled: boolean;
      auth_dir: string | null;
      auth_dir_exists: boolean;
      auth_file_count: number;
      creds_present: boolean;
      session_ready: boolean;
      last_auth_update_at: string | null;
      pairing_required: boolean;
      status_label: string;
    };
    recent_pairing_attempts: Array<{
      audit_id: number;
      provider_name: string;
      channel_type: string;
      action_type: string;
      status: string;
      pairing_mode: string | null;
      phone_number: string | null;
      auth_dir: string | null;
      detail_payload: Record<string, unknown>;
      error_message: string | null;
      created_by: string | null;
      created_at: string | null;
    }>;
    session_states: Array<{
      session_state_id: number;
      provider_name: string;
      channel_type: string;
      session_key: string;
      session_status: string;
      pairing_mode: string | null;
      phone_number: string | null;
      auth_dir: string | null;
      status_message: string | null;
      last_health_check_at: string | null;
      last_pairing_started_at: string | null;
      last_pairing_result_at: string | null;
      last_connected_at: string | null;
      last_disconnected_at: string | null;
      detail_payload: Record<string, unknown>;
      is_active: boolean;
      updated_at: string | null;
    }>;
  };
  triage: {
    summary: AlertDeadLetterTriageSummary;
    policy: AlertDeadLetterTriagePolicy;
    audit_summary: AlertDeadLetterTriageAuditSummary;
  };
  highlights: {
    open_events: number;
    dead_lettered_logs: number;
    configured_channels: number;
    dry_run_channels: number;
    overdue_triage_items: number;
  };
};

export type BaileysPairingPayload = {
  mode: 'pairing-code' | 'qr' | 'connected' | 'already-registered';
  pairing_required: boolean;
  pairing_code?: string;
  qr?: string;
  message: string;
};

export type AlertTemplateRecord = {
  template_id: number;
  template_key: string;
  name: string;
  description: string | null;
  module_key: string;
  severity: AlertSeverity;
  recommended_channels: string[];
  default_recipients: string[];
  source_type: string | null;
  source_ref: string | null;
  schedule_value: string | null;
  condition_summary: string | null;
  message_template: string | null;
  metadata: Record<string, unknown>;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
};

export type SystemMetricOption = {
  system_metric_id: number;
  metric_key: string;
  label: string;
  module_key: string;
  description: string | null;
  source_table: string | null;
  source_type: string;
  resolver_key: string | null;
  aggregation_type: string | null;
  value_type: string;
  supported_dimensions: string[];
  supported_filters: string[];
  default_filters: Record<string, unknown>;
  tags: string[];
  owner_name: string | null;
  review_status: string;
};
