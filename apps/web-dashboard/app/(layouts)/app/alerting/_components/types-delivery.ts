import type { NotificationChannel } from '../_lib/mock-data';

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


export type BaileysPairingPayload = {
  mode: 'pairing-code' | 'qr' | 'connected' | 'already-registered';
  pairing_required: boolean;
  pairing_code?: string;
  qr?: string;
  message: string;
};

