// Runtime alerting settings & escalation policies.

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

