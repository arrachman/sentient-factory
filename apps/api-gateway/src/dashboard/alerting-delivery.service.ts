import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardService } from './dashboard.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';

/**
 * AlertingDeliveryService
 *
 * Owns delivery-side persistence helpers: triage audit, provider session
 * audit/state, test-rule bootstrap, triage recovery config.
 *
 * `runAlertDeliveryCycle` still lives on DashboardService (it depends on
 * dispatchAlertDelivery + channel-specific senders that have not been
 * migrated yet). This service exposes it through a forwardRef pass-through
 * so that AlertingConfigService.testAlertingChannel keeps working.
 */
@Injectable()
export class AlertingDeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => DashboardService))
    private readonly dashboardService: DashboardService,
  ) {}

  // ── forwardRef pass-through (will be migrated in a later commit) ────
  runAlertDeliveryCycle(actor: string) {
    return this.dashboardService.runAlertDeliveryCycle(actor);
  }

  // ── real bodies ─────────────────────────────────────────────────────

  async ensureAlertingTestRule(actor: string) {
    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT rule_id, rule_key
      FROM public.alert_rule
      WHERE rule_key = 'system-test-send-rule'
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing[0]?.rule_id) {
      return {
        rule_id: Number(existing[0].rule_id),
        rule_key: String(existing[0].rule_key || 'system-test-send-rule'),
      };
    }

    const inserted = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_rule (
        rule_key,
        rule_name,
        description,
        module_key,
        source_type,
        source_ref,
        metric_id,
        system_metric_ref,
        semantic_ref,
        condition_mapping_id,
        condition_mapping_key,
        condition_operator_key,
        comparison_type,
        value_type,
        schedule_type,
        schedule_value,
        severity,
        primary_channel,
        condition_summary,
        condition_config,
        source_context,
        message_template,
        status,
        is_active,
        created_by,
        updated_by
      ) VALUES (
        'system-test-send-rule',
        'System Test Send Rule',
        'Internal rule used to validate alert notification channels.',
        'alerting',
        'manual-rule-source',
        'test-send',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'threshold',
        'text',
        'preset',
        'daily',
        'low',
        'email',
        'Internal test-send rule',
        '{}'::jsonb,
        '{"system":true,"purpose":"test-send"}'::jsonb,
        'This is a test notification from the alerting module.',
        'active',
        TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      RETURNING rule_id, rule_key
    `);

    return {
      rule_id: Number(inserted[0]?.rule_id || 0),
      rule_key: String(inserted[0]?.rule_key || 'system-test-send-rule'),
    };
  }

  async createAlertProviderSessionAudit(input: {
    providerName: string;
    channelType: 'wa-group' | 'wa-personal' | 'email';
    actionType: 'health-check' | 'pairing-start' | 'pairing-result' | 'session-refresh';
    status: 'captured' | 'success' | 'failed' | 'warning';
    pairingMode?: string | null;
    phoneNumber?: string | null;
    authDir?: string | null;
    detailPayload?: Record<string, unknown>;
    errorMessage?: string | null;
    actor: string;
  }) {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_provider_session_audit (
        provider_name,
        channel_type,
        action_type,
        status,
        pairing_mode,
        phone_number,
        auth_dir,
        detail_payload,
        error_message,
        created_by,
        updated_by
      ) VALUES (
        '${escapeSqlLiteral(input.providerName)}',
        '${escapeSqlLiteral(input.channelType)}',
        '${escapeSqlLiteral(input.actionType)}',
        '${escapeSqlLiteral(input.status)}',
        ${input.pairingMode ? `'${escapeSqlLiteral(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${escapeSqlLiteral(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${escapeSqlLiteral(input.authDir)}'` : 'NULL'},
        '${escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        ${input.errorMessage ? `'${escapeSqlLiteral(input.errorMessage)}'` : 'NULL'},
        '${escapeSqlLiteral(input.actor)}',
        '${escapeSqlLiteral(input.actor)}'
      )
    `);
  }

  async upsertAlertProviderSessionState(input: {
    providerName: string;
    channelType: 'wa-group' | 'wa-personal' | 'email';
    sessionKey: string;
    sessionStatus:
      | 'disabled'
      | 'disconnected'
      | 'pairing-required'
      | 'pairing-in-progress'
      | 'ready'
      | 'connected'
      | 'error';
    pairingMode?: string | null;
    phoneNumber?: string | null;
    authDir?: string | null;
    statusMessage?: string | null;
    detailPayload?: Record<string, unknown>;
    lastHealthCheckAt?: Date | null;
    lastPairingStartedAt?: Date | null;
    lastPairingResultAt?: Date | null;
    lastConnectedAt?: Date | null;
    lastDisconnectedAt?: Date | null;
    actor: string;
  }) {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_provider_session_state (
        provider_name,
        channel_type,
        session_key,
        session_status,
        pairing_mode,
        phone_number,
        auth_dir,
        status_message,
        last_health_check_at,
        last_pairing_started_at,
        last_pairing_result_at,
        last_connected_at,
        last_disconnected_at,
        detail_payload,
        is_active,
        created_by,
        updated_by
      ) VALUES (
        '${escapeSqlLiteral(input.providerName)}',
        '${escapeSqlLiteral(input.channelType)}',
        '${escapeSqlLiteral(input.sessionKey)}',
        '${escapeSqlLiteral(input.sessionStatus)}',
        ${input.pairingMode ? `'${escapeSqlLiteral(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${escapeSqlLiteral(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${escapeSqlLiteral(input.authDir)}'` : 'NULL'},
        ${input.statusMessage ? `'${escapeSqlLiteral(input.statusMessage)}'` : 'NULL'},
        ${input.lastHealthCheckAt ? `'${input.lastHealthCheckAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingStartedAt ? `'${input.lastPairingStartedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingResultAt ? `'${input.lastPairingResultAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastConnectedAt ? `'${input.lastConnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastDisconnectedAt ? `'${input.lastDisconnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        '${escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        TRUE,
        '${escapeSqlLiteral(input.actor)}',
        '${escapeSqlLiteral(input.actor)}'
      )
      ON CONFLICT (session_key) DO UPDATE SET
        session_status = EXCLUDED.session_status,
        pairing_mode = EXCLUDED.pairing_mode,
        phone_number = EXCLUDED.phone_number,
        auth_dir = EXCLUDED.auth_dir,
        status_message = EXCLUDED.status_message,
        last_health_check_at = COALESCE(EXCLUDED.last_health_check_at, public.alert_provider_session_state.last_health_check_at),
        last_pairing_started_at = COALESCE(EXCLUDED.last_pairing_started_at, public.alert_provider_session_state.last_pairing_started_at),
        last_pairing_result_at = COALESCE(EXCLUDED.last_pairing_result_at, public.alert_provider_session_state.last_pairing_result_at),
        last_connected_at = COALESCE(EXCLUDED.last_connected_at, public.alert_provider_session_state.last_connected_at),
        last_disconnected_at = COALESCE(EXCLUDED.last_disconnected_at, public.alert_provider_session_state.last_disconnected_at),
        detail_payload = EXCLUDED.detail_payload,
        is_active = TRUE,
        updated_by = EXCLUDED.updated_by
    `);
  }

  async createAlertDeadLetterTriageAudit(input: {
    deliveryId: number;
    actionType: string;
    previousTriageStatus: string | null;
    nextTriageStatus: string | null;
    previousAcknowledgedAt: string | null;
    nextAcknowledgedAt: string | null;
    previousAssignedTo: string | null;
    nextAssignedTo: string | null;
    noteSnapshot: string | null;
    detailPayload: Record<string, unknown>;
    actor: string;
  }) {
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_dead_letter_triage_audit (
        delivery_id,
        action_type,
        previous_triage_status,
        next_triage_status,
        previous_acknowledged_at,
        next_acknowledged_at,
        previous_assigned_to,
        next_assigned_to,
        note_snapshot,
        detail_payload,
        created_by
      ) VALUES (
        ${input.deliveryId},
        '${escapeSqlLiteral(input.actionType)}',
        ${input.previousTriageStatus ? `'${escapeSqlLiteral(input.previousTriageStatus)}'` : 'NULL'},
        ${input.nextTriageStatus ? `'${escapeSqlLiteral(input.nextTriageStatus)}'` : 'NULL'},
        ${input.previousAcknowledgedAt ? `'${escapeSqlLiteral(input.previousAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.nextAcknowledgedAt ? `'${escapeSqlLiteral(input.nextAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.previousAssignedTo ? `'${escapeSqlLiteral(input.previousAssignedTo)}'` : 'NULL'},
        ${input.nextAssignedTo ? `'${escapeSqlLiteral(input.nextAssignedTo)}'` : 'NULL'},
        ${input.noteSnapshot ? `'${escapeSqlLiteral(input.noteSnapshot)}'` : 'NULL'},
        '${escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        '${escapeSqlLiteral(input.actor)}'
      )
    `);
  }

  async getAlertingTriageRecoveryConfig() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key = 'triage_auto_close_on_recovery'
      LIMIT 1
    `);

    const row = rows[0];
    const valueJson = asJson<Record<string, unknown>>(row?.value_json, {});
    const valueText =
      typeof row?.value_text === 'string' ? row.value_text.trim().toLowerCase() : '';
    const enabled =
      typeof valueJson['enabled'] === 'boolean'
        ? Boolean(valueJson['enabled'])
        : ['enabled', 'true', 'yes', '1', 'on'].includes(valueText);

    return { enabled };
  }
}
