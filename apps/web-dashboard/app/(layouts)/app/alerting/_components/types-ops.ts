import type { AlertDeadLetterTriageAuditSummary, AlertDeadLetterTriagePolicy, AlertDeadLetterTriageSummary } from './types-triage';
import type { AlertDeliveryStatusPayload } from './types-delivery';

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

