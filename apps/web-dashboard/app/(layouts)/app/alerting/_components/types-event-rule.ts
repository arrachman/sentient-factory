import type { AlertSeverity, AlertStatus } from '../_lib/mock-data';

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

