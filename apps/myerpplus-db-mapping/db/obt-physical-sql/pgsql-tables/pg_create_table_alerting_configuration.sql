CREATE TABLE IF NOT EXISTS public.alert_notification_channel (
  channel_id BIGSERIAL PRIMARY KEY,
  channel_key VARCHAR(160) NOT NULL UNIQUE,
  channel_type VARCHAR(40) NOT NULL,
  label VARCHAR(200) NOT NULL,
  target_value VARCHAR(200) NOT NULL,
  ownership_type VARCHAR(30) NOT NULL DEFAULT 'standalone',
  owner_label VARCHAR(160) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_notification_channel_type CHECK (
    channel_type = ANY (ARRAY['wa-group'::varchar, 'wa-personal'::varchar, 'email'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_notification_channel_ownership CHECK (
    ownership_type = ANY (ARRAY['standalone'::varchar, 'internal_user'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_notification_channel_status CHECK (
    status = ANY (ARRAY['connected'::varchar, 'draft'::varchar, 'failed'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_notification_channel_type
  ON public.alert_notification_channel (channel_type, is_active, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.alert_runtime_setting (
  setting_id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_group VARCHAR(80) NOT NULL,
  label VARCHAR(160) NOT NULL,
  value_text TEXT NULL,
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alert_provider_session_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  provider_name VARCHAR(80) NOT NULL,
  channel_type VARCHAR(40) NOT NULL,
  action_type VARCHAR(40) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'captured',
  pairing_mode VARCHAR(30) NULL,
  phone_number VARCHAR(40) NULL,
  auth_dir TEXT NULL,
  detail_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT NULL,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_alert_provider_session_audit_channel_type CHECK (
    channel_type = ANY (ARRAY['wa-group'::varchar, 'wa-personal'::varchar, 'email'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_provider_session_audit_action_type CHECK (
    action_type = ANY (ARRAY['health-check'::varchar, 'pairing-start'::varchar, 'pairing-result'::varchar, 'session-refresh'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_provider_session_audit_status CHECK (
    status = ANY (ARRAY['captured'::varchar, 'success'::varchar, 'failed'::varchar, 'warning'::varchar]::text[])
  )
);

CREATE TABLE IF NOT EXISTS public.alert_provider_session_state (
  session_state_id BIGSERIAL PRIMARY KEY,
  provider_name VARCHAR(80) NOT NULL,
  channel_type VARCHAR(40) NOT NULL,
  session_key VARCHAR(160) NOT NULL,
  session_status VARCHAR(30) NOT NULL DEFAULT 'disconnected',
  pairing_mode VARCHAR(30) NULL,
  phone_number VARCHAR(40) NULL,
  auth_dir TEXT NULL,
  status_message TEXT NULL,
  last_health_check_at TIMESTAMPTZ NULL,
  last_pairing_started_at TIMESTAMPTZ NULL,
  last_pairing_result_at TIMESTAMPTZ NULL,
  last_connected_at TIMESTAMPTZ NULL,
  last_disconnected_at TIMESTAMPTZ NULL,
  detail_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_alert_provider_session_state_session_key UNIQUE (session_key),
  CONSTRAINT chk_alert_provider_session_state_channel_type CHECK (
    channel_type = ANY (ARRAY['wa-group'::varchar, 'wa-personal'::varchar, 'email'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_provider_session_state_status CHECK (
    session_status = ANY (
      ARRAY[
        'disabled'::varchar,
        'disconnected'::varchar,
        'pairing-required'::varchar,
        'pairing-in-progress'::varchar,
        'ready'::varchar,
        'connected'::varchar,
        'error'::varchar
      ]::text[]
    )
  )
);

CREATE TABLE IF NOT EXISTS public.alert_triage_escalation_policy (
  policy_id BIGSERIAL PRIMARY KEY,
  module_key VARCHAR(80) NOT NULL,
  escalation_level VARCHAR(30) NOT NULL,
  target_type VARCHAR(30) NOT NULL DEFAULT 'channel',
  target_ref VARCHAR(160) NOT NULL,
  priority INT NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_alert_triage_escalation_policy_level CHECK (
    escalation_level = ANY (ARRAY['warning'::varchar, 'critical'::varchar]::text[])
  ),
  CONSTRAINT chk_alert_triage_escalation_policy_target_type CHECK (
    target_type = ANY (ARRAY['channel'::varchar, 'role'::varchar, 'team'::varchar]::text[])
  )
);

CREATE TABLE IF NOT EXISTS public.alert_routing_role (
  role_id BIGSERIAL PRIMARY KEY,
  role_key VARCHAR(120) NOT NULL UNIQUE,
  label VARCHAR(160) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alert_routing_team (
  team_id BIGSERIAL PRIMARY KEY,
  team_key VARCHAR(120) NOT NULL UNIQUE,
  label VARCHAR(160) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alert_routing_role_channel (
  role_channel_id BIGSERIAL PRIMARY KEY,
  role_key VARCHAR(120) NOT NULL,
  channel_key VARCHAR(160) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_alert_routing_role_channel UNIQUE (role_key, channel_key)
);

CREATE TABLE IF NOT EXISTS public.alert_routing_team_channel (
  team_channel_id BIGSERIAL PRIMARY KEY,
  team_key VARCHAR(120) NOT NULL,
  channel_key VARCHAR(160) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_alert_routing_team_channel UNIQUE (team_key, channel_key)
);

CREATE TABLE IF NOT EXISTS public.alert_triage_saved_view (
  view_id BIGSERIAL PRIMARY KEY,
  view_key VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  owner_actor VARCHAR(160) NULL,
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  filters_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_by VARCHAR(80) NOT NULL DEFAULT 'dead_lettered_at',
  sort_order VARCHAR(10) NOT NULL DEFAULT 'desc',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NULL,
  updated_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_alert_triage_saved_view_sort_order CHECK (
    sort_order = ANY (ARRAY['asc'::varchar, 'desc'::varchar]::text[])
  )
);

CREATE INDEX IF NOT EXISTS idx_alert_runtime_setting_group
  ON public.alert_runtime_setting (setting_group, is_active, setting_key);

CREATE INDEX IF NOT EXISTS idx_alert_provider_session_audit_provider
  ON public.alert_provider_session_audit (provider_name, channel_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alert_provider_session_audit_action
  ON public.alert_provider_session_audit (action_type, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alert_provider_session_state_provider
  ON public.alert_provider_session_state (provider_name, channel_type, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_alert_triage_escalation_policy_lookup
  ON public.alert_triage_escalation_policy (module_key, escalation_level, is_active, priority);

CREATE INDEX IF NOT EXISTS idx_alert_triage_saved_view_lookup
  ON public.alert_triage_saved_view (owner_actor, is_shared, is_active, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_alert_routing_role_active
  ON public.alert_routing_role (is_active, role_key);

CREATE INDEX IF NOT EXISTS idx_alert_routing_team_active
  ON public.alert_routing_team (is_active, team_key);

CREATE INDEX IF NOT EXISTS idx_alert_routing_role_channel_lookup
  ON public.alert_routing_role_channel (role_key, is_active, channel_key);

CREATE INDEX IF NOT EXISTS idx_alert_routing_team_channel_lookup
  ON public.alert_routing_team_channel (team_key, is_active, channel_key);

DROP TRIGGER IF EXISTS trg_alert_notification_channel_updated_at ON public.alert_notification_channel;
CREATE TRIGGER trg_alert_notification_channel_updated_at
BEFORE UPDATE ON public.alert_notification_channel
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_runtime_setting_updated_at ON public.alert_runtime_setting;
CREATE TRIGGER trg_alert_runtime_setting_updated_at
BEFORE UPDATE ON public.alert_runtime_setting
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_provider_session_audit_updated_at ON public.alert_provider_session_audit;
CREATE TRIGGER trg_alert_provider_session_audit_updated_at
BEFORE UPDATE ON public.alert_provider_session_audit
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_provider_session_state_updated_at ON public.alert_provider_session_state;
CREATE TRIGGER trg_alert_provider_session_state_updated_at
BEFORE UPDATE ON public.alert_provider_session_state
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_triage_escalation_policy_updated_at ON public.alert_triage_escalation_policy;
CREATE TRIGGER trg_alert_triage_escalation_policy_updated_at
BEFORE UPDATE ON public.alert_triage_escalation_policy
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_triage_saved_view_updated_at ON public.alert_triage_saved_view;
CREATE TRIGGER trg_alert_triage_saved_view_updated_at
BEFORE UPDATE ON public.alert_triage_saved_view
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_routing_role_updated_at ON public.alert_routing_role;
CREATE TRIGGER trg_alert_routing_role_updated_at
BEFORE UPDATE ON public.alert_routing_role
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_routing_team_updated_at ON public.alert_routing_team;
CREATE TRIGGER trg_alert_routing_team_updated_at
BEFORE UPDATE ON public.alert_routing_team
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_routing_role_channel_updated_at ON public.alert_routing_role_channel;
CREATE TRIGGER trg_alert_routing_role_channel_updated_at
BEFORE UPDATE ON public.alert_routing_role_channel
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

DROP TRIGGER IF EXISTS trg_alert_routing_team_channel_updated_at ON public.alert_routing_team_channel;
CREATE TRIGGER trg_alert_routing_team_channel_updated_at
BEFORE UPDATE ON public.alert_routing_team_channel
FOR EACH ROW
EXECUTE FUNCTION public.set_row_updated_at();

INSERT INTO public.alert_notification_channel (
  channel_key,
  channel_type,
  label,
  target_value,
  ownership_type,
  owner_label,
  status,
  metadata,
  is_active,
  created_by,
  updated_by
) VALUES
  (
    'channel-finance-lead-wa-personal',
    'wa-personal',
    'Finance Lead',
    '+6281211112222',
    'internal_user',
    'Finance Manager',
    'connected',
    '{}'::jsonb,
    TRUE,
    'system',
    'system'
  ),
  (
    'channel-ops-alert-group',
    'wa-group',
    'Ops Alert Group',
    'ops-alert-group',
    'standalone',
    NULL,
    'connected',
    '{}'::jsonb,
    TRUE,
    'system',
    'system'
  ),
  (
    'channel-management-distribution',
    'email',
    'Management Distribution',
    'management@fr-labs.my.id',
    'standalone',
    NULL,
    'connected',
    '{}'::jsonb,
    TRUE,
    'system',
    'system'
  )
ON CONFLICT (channel_key) DO UPDATE SET
  label = EXCLUDED.label,
  target_value = EXCLUDED.target_value,
  ownership_type = EXCLUDED.ownership_type,
  owner_label = EXCLUDED.owner_label,
  status = EXCLUDED.status,
  metadata = EXCLUDED.metadata,
  is_active = EXCLUDED.is_active,
  deleted_at = NULL,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_runtime_setting (
  setting_key,
  setting_group,
  label,
  value_text,
  value_json,
  description,
  is_active,
  created_by,
  updated_by
) VALUES
  (
    'quiet_hours',
    'execution',
    'Quiet Hours',
    '23:00 - 06:00 UTC',
    '{"start":"23:00","end":"06:00","timezone":"UTC"}'::jsonb,
    'Suppress low-priority notifications during quiet hours.',
    TRUE,
    'system',
    'system'
  ),
  (
    'dedup_window_minutes',
    'execution',
    'Default Dedup Window',
    '30 minutes',
    '{"minutes":30}'::jsonb,
    'Avoid duplicate event creation and notification bursts.',
    TRUE,
    'system',
    'system'
  ),
  (
    'retry_policy',
    'delivery',
    'Retry Policy',
    '3 attempts with exponential backoff',
    '{"attempts":3,"strategy":"exponential_backoff"}'::jsonb,
    'Retry failed deliveries before marking them as failed.',
    TRUE,
    'system',
    'system'
  ),
  (
    'triage_sla_minutes',
    'operations',
    'Triage SLA',
    '60 minutes',
    '{"minutes":60}'::jsonb,
    'Target time to acknowledge and start handling dead-letter triage items.',
    TRUE,
    'system',
    'system'
  ),
  (
    'triage_escalation_policy',
    'operations',
    'Triage Escalation Policy',
    'Warning at SLA, critical at 2x SLA',
    '{"warning_after_minutes":60,"critical_after_minutes":120}'::jsonb,
    'Escalation thresholds for dead-letter triage items that are not being resolved in time.',
    TRUE,
    'system',
    'system'
  ),
  (
    'triage_escalation_channel_key',
    'operations',
    'Triage Escalation Channel',
    'channel-ops-alert-group',
    '{"channel_key":"channel-ops-alert-group"}'::jsonb,
    'Notification channel used when overdue or critical triage items need escalation.',
    TRUE,
    'system',
    'system'
  ),
  (
    'triage_escalation_cooldown_minutes',
    'operations',
    'Triage Escalation Cooldown',
    '60 minutes',
    '{"minutes":60}'::jsonb,
    'Minimum cooldown before the same triage item can be escalated again at the same severity level.',
    TRUE,
    'system',
    'system'
  ),
  (
    'triage_auto_close_on_recovery',
    'operations',
    'Auto Close Triage On Recovery',
    'enabled',
    '{"enabled":true}'::jsonb,
    'Automatically resolve triage items when a requeued delivery succeeds.',
    TRUE,
    'system',
    'system'
  )
ON CONFLICT (setting_key) DO UPDATE SET
  label = EXCLUDED.label,
  value_text = EXCLUDED.value_text,
  value_json = EXCLUDED.value_json,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_triage_escalation_policy (
  module_key,
  escalation_level,
  target_type,
  target_ref,
  priority,
  is_active,
  metadata,
  created_by,
  updated_by
) VALUES
  (
    'finance',
    'critical',
    'channel',
    'channel-management-distribution',
    20,
    TRUE,
    '{"reason":"finance critical escalation to management distribution"}'::jsonb,
    'system',
    'system'
  ),
  (
    'sales',
    'critical',
    'channel',
    'channel-ops-alert-group',
    20,
    TRUE,
    '{"reason":"sales critical escalation to ops group"}'::jsonb,
    'system',
    'system'
  ),
  (
    'warehouse',
    'warning',
    'channel',
    'channel-ops-alert-group',
    20,
    TRUE,
    '{"reason":"warehouse warning escalation to ops group"}'::jsonb,
    'system',
    'system'
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.alert_triage_saved_view (
  view_key,
  name,
  owner_actor,
  is_shared,
  is_default,
  filters_json,
  sort_by,
  sort_order,
  metadata,
  is_active,
  created_by,
  updated_by
) VALUES
  (
    'triage-critical-unacked',
    'Critical Unacknowledged',
    NULL,
    TRUE,
    FALSE,
    '{"acknowledged":"unacknowledged","slaStatus":"critical"}'::jsonb,
    'age_minutes',
    'desc',
    '{"system":true}'::jsonb,
    TRUE,
    'system',
    'system'
  ),
  (
    'triage-finance-overdue',
    'Finance Overdue Queue',
    NULL,
    TRUE,
    FALSE,
    '{"moduleKey":"finance","slaStatus":"overdue"}'::jsonb,
    'sla_due_at',
    'asc',
    '{"system":true}'::jsonb,
    TRUE,
    'system',
    'system'
  ),
  (
    'triage-final-stage-reminders',
    'Final Stage Reminders',
    NULL,
    TRUE,
    FALSE,
    '{"stage":"reminder"}'::jsonb,
    'triage_updated_at',
    'desc',
    '{"system":true}'::jsonb,
    TRUE,
    'system',
    'system'
  )
ON CONFLICT (view_key) DO UPDATE SET
  name = EXCLUDED.name,
  is_shared = EXCLUDED.is_shared,
  is_default = EXCLUDED.is_default,
  filters_json = EXCLUDED.filters_json,
  sort_by = EXCLUDED.sort_by,
  sort_order = EXCLUDED.sort_order,
  metadata = EXCLUDED.metadata,
  is_active = EXCLUDED.is_active,
  deleted_at = NULL,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_routing_role (
  role_key,
  label,
  description,
  is_active,
  metadata,
  created_by,
  updated_by
) VALUES
  (
    'finance-manager',
    'Finance Manager',
    'Primary finance escalation owner.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  ),
  (
    'warehouse-supervisor',
    'Warehouse Supervisor',
    'Primary warehouse escalation owner.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  ),
  (
    'sales-manager',
    'Sales Manager',
    'Primary sales escalation owner.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  )
ON CONFLICT (role_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_routing_team (
  team_key,
  label,
  description,
  is_active,
  metadata,
  created_by,
  updated_by
) VALUES
  (
    'ops',
    'Ops Team',
    'Operations escalation group.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  ),
  (
    'finance-leadership',
    'Finance Leadership',
    'Finance leadership escalation group.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  ),
  (
    'management',
    'Management',
    'Executive management routing group.',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  )
ON CONFLICT (team_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_routing_role_channel (
  role_key,
  channel_key,
  is_active,
  metadata,
  created_by,
  updated_by
) VALUES
  (
    'finance-manager',
    'channel-finance-lead-wa-personal',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  )
ON CONFLICT (role_key, channel_key) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_by = EXCLUDED.updated_by;

INSERT INTO public.alert_routing_team_channel (
  team_key,
  channel_key,
  is_active,
  metadata,
  created_by,
  updated_by
) VALUES
  (
    'ops',
    'channel-ops-alert-group',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  ),
  (
    'management',
    'channel-management-distribution',
    TRUE,
    '{}'::jsonb,
    'system',
    'system'
  )
ON CONFLICT (team_key, channel_key) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_by = EXCLUDED.updated_by;
