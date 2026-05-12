import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  // ── Delivery logs ────────────────────────────────────────────────────

  async alertingDeliveryLogs(eventId?: string) {
    const where = ['1 = 1'];
    if (eventId) {
      where.push(`d.event_id = ${Number(eventId) || 0}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        d.delivery_id,
        d.event_id,
        e.event_key,
        e.title AS event_title,
        COALESCE(rr.target_label, '') AS target_label,
        d.channel_type,
        d.target_value,
        d.provider_name,
        d.provider_message_id,
        d.delivery_status,
        d.response_payload,
        d.error_message,
        d.retry_count,
        d.max_retries,
        d.next_retry_at,
        d.last_attempt_at,
        d.dead_lettered_at,
        d.dead_letter_reason,
        d.requested_at,
        d.delivered_at
      FROM public.alert_delivery_log d
      LEFT JOIN public.alert_event e ON e.event_id = d.event_id
      LEFT JOIN public.alert_rule_recipient rr ON rr.recipient_id = d.recipient_id
      WHERE ${where.join(' AND ')}
      ORDER BY d.requested_at DESC, d.delivery_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        delivery_log_id: Number(row.delivery_id || 0),
        event_id: Number(row.event_id || 0),
        event_key: row.event_key || null,
        event_title: row.event_title || null,
        target_label: row.target_label || null,
        channel_type: row.channel_type,
        target_value: row.target_value,
        provider_key: row.provider_name || null,
        external_message_id: row.provider_message_id || null,
        delivery_status: row.delivery_status,
        error_message: row.error_message || null,
        retry_count: Number(row.retry_count || 0),
        max_retries: Number(row.max_retries || 0),
        next_retry_at: row.next_retry_at || null,
        last_attempt_at: row.last_attempt_at || null,
        dead_lettered_at: row.dead_lettered_at || null,
        dead_letter_reason: row.dead_letter_reason || null,
        queued_at: row.requested_at,
        sent_at: row.requested_at,
        delivered_at: row.delivered_at,
        response_payload: asJson(row.response_payload, {}),
      })),
    };
  }

  async requeueAlertingDeliveryLog(deliveryId: string, actor: string) {
    const normalizedDeliveryId = Number(deliveryId);
    if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
      throw new BadRequestException('Invalid delivery id.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT delivery_status
      FROM public.alert_delivery_log
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert delivery log not found.');
    }

    const currentStatus = String(existingRows[0].delivery_status || '')
      .trim()
      .toLowerCase();
    if (!['failed', 'dead-lettered'].includes(currentStatus)) {
      throw new BadRequestException('Only failed or dead-lettered deliveries can be requeued.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_delivery_log
      SET
        delivery_status = 'queued',
        retry_count = 0,
        next_retry_at = NOW(),
        last_attempt_at = NULL,
        error_message = NULL,
        dead_lettered_at = NULL,
        dead_letter_reason = NULL
      WHERE delivery_id = ${normalizedDeliveryId}
    `);

    const triageBeforeRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT triage_status, acknowledged_at, assigned_to, note
      FROM public.alert_dead_letter_triage
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_dead_letter_triage (
        delivery_id,
        triage_status,
        acknowledged_at,
        acknowledged_by,
        assigned_to,
        note,
        last_action_at,
        created_by,
        updated_by
      ) VALUES (
        ${normalizedDeliveryId},
        'requeued',
        NULL,
        NULL,
        '${escapeSqlLiteral(actor)}',
        'Delivery was manually requeued.',
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = 'requeued',
        acknowledged_at = NULL,
        acknowledged_by = NULL,
        assigned_to = '${escapeSqlLiteral(actor)}',
        note = 'Delivery was manually requeued.',
        last_action_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
    `);

    const triageBefore = triageBeforeRows[0];
    await this.createAlertDeadLetterTriageAudit({
      deliveryId: normalizedDeliveryId,
      actionType: 'requeue',
      previousTriageStatus: triageBefore?.triage_status ? String(triageBefore.triage_status) : null,
      nextTriageStatus: 'requeued',
      previousAcknowledgedAt: triageBefore?.acknowledged_at
        ? String(triageBefore.acknowledged_at)
        : null,
      nextAcknowledgedAt: null,
      previousAssignedTo: triageBefore?.assigned_to ? String(triageBefore.assigned_to) : null,
      nextAssignedTo: actor,
      noteSnapshot: 'Delivery was manually requeued.',
      detailPayload: {
        trigger: 'manual-requeue',
      },
      actor,
    });

    const deliveryRun = await this.dashboardService.runAlertDeliveryCycle(actor);
    const result = await this.alertingDeliveryLogs();
    return {
      success: true,
      data: {
        requeued_delivery_id: normalizedDeliveryId,
        delivery_run: deliveryRun.data,
        logs: result.data,
      },
    };
  }

  // ── Dead-letter triage ───────────────────────────────────────────────

  async alertingDeadLetterTriage(query: Record<string, unknown> = {}) {
    const normalizeString = (value: unknown) => {
      const nextValue = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
      return nextValue ? nextValue : null;
    };
    const normalizeNullableNumber = (value: unknown) => {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
    };
    const deliveryIdFilter = normalizeNullableNumber(query.deliveryId || query.delivery_id);
    const triageStatusFilter =
      normalizeString(query.triageStatus || query.triage_status)?.toLowerCase() || 'all';
    const acknowledgedFilterRaw = normalizeString(query.acknowledged)?.toLowerCase() || 'all';
    const acknowledgedFilter = ['acknowledged', 'unacknowledged', 'all'].includes(
      acknowledgedFilterRaw,
    )
      ? acknowledgedFilterRaw
      : acknowledgedFilterRaw === 'true'
        ? 'acknowledged'
        : acknowledgedFilterRaw === 'false'
          ? 'unacknowledged'
          : 'all';
    const slaStatusFilter =
      normalizeString(query.slaStatus || query.sla_status)?.toLowerCase() || 'all';
    const moduleFilter =
      normalizeString(query.moduleKey || query.module_key)?.toLowerCase() || 'all';
    const stageFilter = normalizeString(query.stage)?.toLowerCase() || 'all';
    const searchFilter = normalizeString(query.search)?.toLowerCase() || '';
    const sortByRaw =
      normalizeString(query.sortBy || query.sort_by)?.toLowerCase() || 'dead_lettered_at';
    const sortBy = [
      'dead_lettered_at',
      'age_minutes',
      'sla_due_at',
      'triage_updated_at',
      'escalation_count',
      'event_title',
    ].includes(sortByRaw)
      ? sortByRaw
      : 'dead_lettered_at';
    const sortOrder =
      String(query.sortOrder || query.sort_order || 'desc')
        .trim()
        .toLowerCase() === 'asc'
        ? 'asc'
        : 'desc';

    const [policy, escalationPolicies] = await Promise.all([
      this.getAlertingTriagePolicy(),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          policy_id,
          module_key,
          escalation_level,
          target_type,
          target_ref,
          priority
        FROM public.alert_triage_escalation_policy
        WHERE is_active = TRUE
          AND deleted_at IS NULL
        ORDER BY module_key, escalation_level, priority ASC, policy_id ASC
      `),
    ]);
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        d.delivery_id,
        d.event_id,
        e.event_key,
        e.title AS event_title,
        r.rule_name,
        r.module_key,
        d.channel_type,
        d.target_value,
        d.provider_name,
        d.delivery_status,
        d.retry_count,
        d.max_retries,
        d.error_message,
        d.dead_lettered_at,
        d.dead_letter_reason,
        t.triage_id,
        COALESCE(t.triage_status, 'open') AS triage_status,
        t.acknowledged_at,
        t.acknowledged_by,
        t.assigned_to,
        t.note,
        t.escalation_count,
        t.last_escalated_at,
        t.last_escalation_level,
        t.last_action_at,
        t.updated_at AS triage_updated_at
      FROM public.alert_delivery_log d
      LEFT JOIN public.alert_event e ON e.event_id = d.event_id
      LEFT JOIN public.alert_rule r ON r.rule_id = d.rule_id
      LEFT JOIN public.alert_dead_letter_triage t ON t.delivery_id = d.delivery_id
      WHERE d.delivery_status = 'dead-lettered'
         OR t.delivery_id IS NOT NULL
      ORDER BY COALESCE(d.dead_lettered_at, d.requested_at) DESC, d.delivery_id DESC
    `);

    const deliveryIds = rows
      .map((row) => Number(row.delivery_id || 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    const timelineRows = deliveryIds.length
      ? await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          d.delivery_id AS source_delivery_id,
          x.delivery_id AS escalation_delivery_id,
          x.channel_type,
          x.target_value,
          x.provider_name,
          x.delivery_status,
          x.requested_at,
          x.delivered_at,
          x.error_message,
          x.response_payload
        FROM public.alert_delivery_log d
        JOIN public.alert_delivery_log x
          ON (x.response_payload->>'source_delivery_id')::bigint = d.delivery_id
        WHERE d.delivery_id IN (${deliveryIds.join(', ')})
          AND COALESCE(x.response_payload->>'trigger', '') = 'triage-escalation'
        ORDER BY x.requested_at ASC, x.delivery_id ASC
      `)
      : [];

    const auditRows = deliveryIds.length
      ? await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          delivery_id,
          audit_id,
          action_type,
          previous_triage_status,
          next_triage_status,
          previous_acknowledged_at,
          next_acknowledged_at,
          previous_assigned_to,
          next_assigned_to,
          note_snapshot,
          detail_payload,
          created_by,
          created_at
        FROM public.alert_dead_letter_triage_audit
        WHERE delivery_id IN (${deliveryIds.join(', ')})
        ORDER BY created_at DESC, audit_id DESC
      `)
      : [];

    const timelineByDeliveryId = new Map<number, Array<Record<string, unknown>>>();
    for (const row of timelineRows) {
      const sourceDeliveryId = Number(row.source_delivery_id || 0);
      if (!timelineByDeliveryId.has(sourceDeliveryId)) {
        timelineByDeliveryId.set(sourceDeliveryId, []);
      }
      timelineByDeliveryId.get(sourceDeliveryId)?.push({
        escalation_delivery_id: Number(row.escalation_delivery_id || 0),
        channel_type: String(row.channel_type || ''),
        target_value: String(row.target_value || ''),
        provider_name: row.provider_name || null,
        delivery_status: String(row.delivery_status || ''),
        requested_at: row.requested_at || null,
        delivered_at: row.delivered_at || null,
        error_message: row.error_message || null,
        stage_index: Number(
          asJson<Record<string, unknown>>(row.response_payload, {})['escalation_stage_index'] || 0,
        ),
        stage_priority: Number(
          asJson<Record<string, unknown>>(row.response_payload, {})['escalation_stage_priority'] ||
            0,
        ),
        routing_source: String(
          asJson<Record<string, unknown>>(row.response_payload, {})['escalation_routing_source'] ||
            '',
        ),
        repeating_final_stage: Boolean(
          asJson<Record<string, unknown>>(row.response_payload, {})['repeating_final_stage'],
        ),
      });
    }

    const auditByDeliveryId = new Map<number, Array<Record<string, unknown>>>();
    for (const row of auditRows) {
      const sourceDeliveryId = Number(row.delivery_id || 0);
      if (!auditByDeliveryId.has(sourceDeliveryId)) {
        auditByDeliveryId.set(sourceDeliveryId, []);
      }
      auditByDeliveryId.get(sourceDeliveryId)?.push({
        audit_id: Number(row.audit_id || 0),
        action_type: String(row.action_type || ''),
        previous_triage_status: row.previous_triage_status
          ? String(row.previous_triage_status)
          : null,
        next_triage_status: row.next_triage_status ? String(row.next_triage_status) : null,
        previous_acknowledged_at: row.previous_acknowledged_at
          ? String(row.previous_acknowledged_at)
          : null,
        next_acknowledged_at: row.next_acknowledged_at ? String(row.next_acknowledged_at) : null,
        previous_assigned_to: row.previous_assigned_to ? String(row.previous_assigned_to) : null,
        next_assigned_to: row.next_assigned_to ? String(row.next_assigned_to) : null,
        note_snapshot: row.note_snapshot ? String(row.note_snapshot) : null,
        detail_payload: asJson(row.detail_payload, {}),
        created_by: row.created_by ? String(row.created_by) : null,
        created_at: row.created_at ? String(row.created_at) : null,
      });
    }

    const items = rows.map((row) => {
      const baseItem = {
        delivery_id: Number(row.delivery_id || 0),
        event_id: Number(row.event_id || 0),
        event_key: row.event_key || null,
        event_title: row.event_title || null,
        rule_name: row.rule_name || null,
        module_key: row.module_key || null,
        channel_type: row.channel_type,
        target_value: row.target_value,
        provider_name: row.provider_name || null,
        delivery_status: row.delivery_status,
        retry_count: Number(row.retry_count || 0),
        max_retries: Number(row.max_retries || 0),
        error_message: row.error_message || null,
        dead_lettered_at: row.dead_lettered_at || null,
        dead_letter_reason: row.dead_letter_reason || null,
        triage_id: row.triage_id ? Number(row.triage_id) : null,
        triage_status: row.triage_status,
        acknowledged_at: row.acknowledged_at || null,
        acknowledged_by: row.acknowledged_by || null,
        assigned_to: row.assigned_to || null,
        note: row.note || null,
        escalation_count: Number(row.escalation_count || 0),
        last_escalated_at: row.last_escalated_at || null,
        last_escalation_level: row.last_escalation_level || null,
        last_action_at: row.last_action_at || null,
        triage_updated_at: row.triage_updated_at || null,
      };

      const triageMetrics = this.buildAlertingTriageMetrics(baseItem, policy);
      const stageMetrics = this.buildAlertingTriageStageMetrics(
        {
          ...baseItem,
          ...triageMetrics,
        },
        escalationPolicies,
      );

      return {
        ...baseItem,
        ...triageMetrics,
        ...stageMetrics,
        escalation_timeline: timelineByDeliveryId.get(baseItem.delivery_id) || [],
        triage_audit_timeline: auditByDeliveryId.get(baseItem.delivery_id) || [],
      };
    });

    const filteredItems = items
      .filter((item) => {
        if (deliveryIdFilter && item.delivery_id !== deliveryIdFilter) {
          return false;
        }
        if (
          triageStatusFilter !== 'all' &&
          String(item.triage_status || '').toLowerCase() !== triageStatusFilter
        ) {
          return false;
        }
        if (acknowledgedFilter === 'acknowledged' && !item.acknowledged_at) {
          return false;
        }
        if (acknowledgedFilter === 'unacknowledged' && item.acknowledged_at) {
          return false;
        }
        if (
          slaStatusFilter !== 'all' &&
          String(item.sla_status || '').toLowerCase() !== slaStatusFilter
        ) {
          return false;
        }
        if (
          moduleFilter !== 'all' &&
          String(item.module_key || '').toLowerCase() !== moduleFilter
        ) {
          return false;
        }
        if (stageFilter === 'none' && Number(item.stage_count || 0) > 0) {
          return false;
        }
        if (stageFilter === 'staged' && Number(item.stage_count || 0) <= 0) {
          return false;
        }
        if (stageFilter === 'final' && !item.is_final_stage) {
          return false;
        }
        if (stageFilter === 'pending' && (!item.has_next_stage || item.is_final_stage)) {
          return false;
        }
        if (stageFilter === 'reminder' && !item.repeating_final_stage) {
          return false;
        }
        if (searchFilter) {
          const haystack = [
            item.event_title,
            item.rule_name,
            item.module_key,
            item.target_value,
            item.assigned_to,
            item.note,
            item.dead_letter_reason,
            item.error_message,
            item.channel_type,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(searchFilter)) {
            return false;
          }
        }
        return true;
      })
      .sort((left, right) => {
        const timestamp = (value: unknown) => {
          if (!value) return 0;
          const parsed = new Date(String(value)).getTime();
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const stringValue = (value: unknown) => String(value || '').toLowerCase();
        const leftValue = (() => {
          switch (sortBy) {
            case 'age_minutes':
              return Number(left.age_minutes || 0);
            case 'sla_due_at':
              return timestamp(left.sla_due_at);
            case 'triage_updated_at':
              return timestamp(left.triage_updated_at);
            case 'escalation_count':
              return Number(left.escalation_count || 0);
            case 'event_title':
              return stringValue(left.event_title);
            case 'dead_lettered_at':
            default:
              return timestamp(left.dead_lettered_at);
          }
        })();
        const rightValue = (() => {
          switch (sortBy) {
            case 'age_minutes':
              return Number(right.age_minutes || 0);
            case 'sla_due_at':
              return timestamp(right.sla_due_at);
            case 'triage_updated_at':
              return timestamp(right.triage_updated_at);
            case 'escalation_count':
              return Number(right.escalation_count || 0);
            case 'event_title':
              return stringValue(right.event_title);
            case 'dead_lettered_at':
            default:
              return timestamp(right.dead_lettered_at);
          }
        })();

        if (typeof leftValue === 'string' || typeof rightValue === 'string') {
          const comparison = String(leftValue).localeCompare(String(rightValue));
          return sortOrder === 'asc' ? comparison : comparison * -1;
        }

        const comparison = Number(leftValue) - Number(rightValue);
        return sortOrder === 'asc' ? comparison : comparison * -1;
      });

    const summary = {
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

    const auditEntries = filteredItems.flatMap((item) => item.triage_audit_timeline || []);
    const latestAuditTimestamp =
      auditEntries
        .map((entry) => String(entry.created_at || ''))
        .filter(Boolean)
        .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || null;
    const actionCounts = new Map<string, number>();
    const actorCounts = new Map<string, number>();
    const activityByDay = new Map<string, number>();
    for (const entry of auditEntries) {
      const actionType = String(entry.action_type || '');
      if (actionType) {
        actionCounts.set(actionType, (actionCounts.get(actionType) || 0) + 1);
      }
      const actor = String(entry.created_by || '').trim();
      if (actor) {
        actorCounts.set(actor, (actorCounts.get(actor) || 0) + 1);
      }
      const createdAt = String(entry.created_at || '');
      if (createdAt) {
        const dateKey = createdAt.slice(0, 10);
        if (dateKey) {
          activityByDay.set(dateKey, (activityByDay.get(dateKey) || 0) + 1);
        }
      }
    }
    const auditSummary = {
      total_entries: auditEntries.length,
      acknowledge_actions: auditEntries.filter((entry) => entry.action_type === 'acknowledge')
        .length,
      unacknowledge_actions: auditEntries.filter((entry) => entry.action_type === 'unacknowledge')
        .length,
      status_change_actions: auditEntries.filter((entry) => entry.action_type === 'status-change')
        .length,
      assignment_actions: auditEntries.filter((entry) => entry.action_type === 'assign').length,
      note_change_actions: auditEntries.filter((entry) => entry.action_type === 'note-change')
        .length,
      requeue_actions: auditEntries.filter((entry) => entry.action_type === 'requeue').length,
      auto_resolve_actions: auditEntries.filter((entry) => entry.action_type === 'auto-resolve')
        .length,
      latest_action_at: latestAuditTimestamp,
      action_breakdown: Array.from(actionCounts.entries())
        .map(([action_type, count]) => ({ action_type, count }))
        .sort(
          (left, right) =>
            right.count - left.count || left.action_type.localeCompare(right.action_type),
        ),
      top_actors: Array.from(actorCounts.entries())
        .map(([actor, action_count]) => ({ actor, action_count }))
        .sort(
          (left, right) =>
            right.action_count - left.action_count || left.actor.localeCompare(right.actor),
        )
        .slice(0, 5),
      activity_last_7d: Array.from(activityByDay.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((left, right) => left.date.localeCompare(right.date))
        .slice(-7),
    };

    return {
      success: true,
      data: filteredItems,
      policy,
      summary,
      audit_summary: auditSummary,
      filter_context: {
        delivery_id: deliveryIdFilter,
        triage_status: triageStatusFilter,
        acknowledged: acknowledgedFilter,
        sla_status: slaStatusFilter,
        module_key: moduleFilter,
        stage: stageFilter,
        search: searchFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    };
  }

  async updateAlertingDeadLetterTriage(
    deliveryId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedDeliveryId = Number(deliveryId);
    if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
      throw new BadRequestException('Invalid delivery id.');
    }

    const triageStatus = String(body.triageStatus || body.triage_status || '')
      .trim()
      .toLowerCase();
    const assignedTo =
      typeof body.assignedTo === 'string'
        ? body.assignedTo.trim()
        : typeof body.assigned_to === 'string'
          ? body.assigned_to.trim()
          : '';
    const note = typeof body.note === 'string' ? body.note.trim() : '';
    const acknowledge = Boolean(body.acknowledge ?? body.acknowledged ?? false);
    const unacknowledge = Boolean(body.unacknowledge ?? false);

    if (acknowledge && unacknowledge) {
      throw new BadRequestException('acknowledge and unacknowledge cannot both be true.');
    }

    if (!['open', 'investigating', 'requeued', 'resolved'].includes(triageStatus)) {
      throw new BadRequestException('Invalid triage status.');
    }

    const deliveryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        d.delivery_id,
        t.triage_status,
        t.acknowledged_at,
        t.assigned_to,
        t.note
      FROM public.alert_delivery_log d
      LEFT JOIN public.alert_dead_letter_triage t ON t.delivery_id = d.delivery_id
      WHERE d.delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    if (!deliveryRows[0]) {
      throw new NotFoundException('Alert delivery log not found.');
    }

    const existing = deliveryRows[0];

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_dead_letter_triage (
        delivery_id,
        triage_status,
        acknowledged_at,
        acknowledged_by,
        assigned_to,
        note,
        last_action_at,
        created_by,
        updated_by
      ) VALUES (
        ${normalizedDeliveryId},
        '${escapeSqlLiteral(triageStatus)}',
        ${acknowledge ? 'NOW()' : 'NULL'},
        ${acknowledge ? `'${escapeSqlLiteral(actor)}'` : 'NULL'},
        ${assignedTo ? `'${escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        ${note ? `'${escapeSqlLiteral(note)}'` : 'NULL'},
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = '${escapeSqlLiteral(triageStatus)}',
        acknowledged_at = ${
          acknowledge
            ? 'COALESCE(public.alert_dead_letter_triage.acknowledged_at, NOW())'
            : unacknowledge
              ? 'NULL'
              : triageStatus === 'open' || triageStatus === 'requeued'
                ? 'NULL'
                : 'public.alert_dead_letter_triage.acknowledged_at'
        },
        acknowledged_by = ${
          acknowledge
            ? `COALESCE(public.alert_dead_letter_triage.acknowledged_by, '${escapeSqlLiteral(actor)}')`
            : unacknowledge
              ? 'NULL'
              : triageStatus === 'open' || triageStatus === 'requeued'
                ? 'NULL'
                : 'public.alert_dead_letter_triage.acknowledged_by'
        },
        assigned_to = ${assignedTo ? `'${escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        note = ${note ? `'${escapeSqlLiteral(note)}'` : 'NULL'},
        last_action_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
    `);

    const previousStatus = existing?.triage_status ? String(existing.triage_status) : null;
    const previousAcknowledgedAt = existing?.acknowledged_at
      ? String(existing.acknowledged_at)
      : null;
    const previousAssignedTo = existing?.assigned_to ? String(existing.assigned_to) : null;
    const previousNote = existing?.note ? String(existing.note) : null;
    const nextAcknowledgedAt = acknowledge
      ? previousAcknowledgedAt || new Date().toISOString()
      : unacknowledge || triageStatus === 'open' || triageStatus === 'requeued'
        ? null
        : previousAcknowledgedAt;
    const actionType = acknowledge
      ? 'acknowledge'
      : unacknowledge
        ? 'unacknowledge'
        : previousStatus !== triageStatus
          ? 'status-change'
          : previousAssignedTo !== (assignedTo || null)
            ? 'assign'
            : previousNote !== (note || null)
              ? 'note-change'
              : 'update';

    await this.createAlertDeadLetterTriageAudit({
      deliveryId: normalizedDeliveryId,
      actionType,
      previousTriageStatus: previousStatus,
      nextTriageStatus: triageStatus,
      previousAcknowledgedAt,
      nextAcknowledgedAt,
      previousAssignedTo,
      nextAssignedTo: assignedTo || null,
      noteSnapshot: note || null,
      detailPayload: {
        acknowledge,
        unacknowledge,
      },
      actor,
    });

    return this.alertingDeadLetterTriage();
  }

  // ── Private triage helpers ───────────────────────────────────────────

  private async getAlertingTriagePolicy() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_sla_minutes', 'triage_escalation_policy')
    `);

    const settings = new Map<
      string,
      { value_text: string | null; value_json: Record<string, unknown> }
    >();
    for (const row of rows) {
      settings.set(String(row.setting_key || ''), {
        value_text: typeof row.value_text === 'string' ? row.value_text : null,
        value_json: asJson<Record<string, unknown>>(row.value_json, {}),
      });
    }

    const slaSetting = settings.get('triage_sla_minutes');
    const escalationSetting = settings.get('triage_escalation_policy');
    const configuredSla = Number(
      (slaSetting?.value_json?.minutes as number | string | undefined) ||
        (slaSetting?.value_text ? Number.parseInt(slaSetting.value_text, 10) : NaN),
    );
    const warningAfterMinutes = Number(
      (escalationSetting?.value_json?.warning_after_minutes as number | string | undefined) ||
        configuredSla,
    );
    const criticalAfterMinutes = Number(
      (escalationSetting?.value_json?.critical_after_minutes as number | string | undefined) ||
        (Number.isFinite(warningAfterMinutes) ? warningAfterMinutes * 2 : NaN),
    );

    return {
      sla_minutes: Number.isFinite(configuredSla) && configuredSla > 0 ? configuredSla : 60,
      warning_after_minutes:
        Number.isFinite(warningAfterMinutes) && warningAfterMinutes > 0 ? warningAfterMinutes : 60,
      critical_after_minutes:
        Number.isFinite(criticalAfterMinutes) && criticalAfterMinutes > 0
          ? criticalAfterMinutes
          : 120,
    };
  }

  private buildAlertingTriageMetrics(
    item: Record<string, unknown>,
    policy: { sla_minutes: number; warning_after_minutes: number; critical_after_minutes: number },
  ) {
    const normalizeTimestamp = (value: unknown) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === 'string') return value;
      return null;
    };
    const baseTimestamp =
      normalizeTimestamp(item.dead_lettered_at) ||
      normalizeTimestamp(item.last_action_at) ||
      normalizeTimestamp(item.triage_updated_at);

    if (!baseTimestamp) {
      return {
        age_minutes: 0,
        sla_due_at: null,
        sla_status: item.triage_status === 'resolved' ? 'resolved' : 'on-track',
        escalation_level: 'none',
        is_overdue: false,
      };
    }

    const baseTimeMs = new Date(baseTimestamp).getTime();
    if (Number.isNaN(baseTimeMs)) {
      return {
        age_minutes: 0,
        sla_due_at: null,
        sla_status: item.triage_status === 'resolved' ? 'resolved' : 'on-track',
        escalation_level: 'none',
        is_overdue: false,
      };
    }

    const ageMinutes = Math.max(0, Math.floor((Date.now() - baseTimeMs) / 60000));
    const slaDueAt = new Date(baseTimeMs + policy.sla_minutes * 60000).toISOString();
    const triageStatus = String(item.triage_status || '');

    if (triageStatus === 'resolved') {
      return {
        age_minutes: ageMinutes,
        sla_due_at: slaDueAt,
        sla_status: 'resolved',
        escalation_level: 'none',
        is_overdue: false,
      };
    }

    if (ageMinutes >= policy.critical_after_minutes) {
      return {
        age_minutes: ageMinutes,
        sla_due_at: slaDueAt,
        sla_status: 'critical',
        escalation_level: 'critical',
        is_overdue: true,
      };
    }

    if (ageMinutes >= policy.warning_after_minutes) {
      return {
        age_minutes: ageMinutes,
        sla_due_at: slaDueAt,
        sla_status: 'overdue',
        escalation_level: 'warning',
        is_overdue: true,
      };
    }

    return {
      age_minutes: ageMinutes,
      sla_due_at: slaDueAt,
      sla_status: 'on-track',
      escalation_level: 'none',
      is_overdue: false,
    };
  }

  private buildAlertingTriageStageMetrics(
    item: Record<string, unknown>,
    escalationPolicies: Array<Record<string, unknown>>,
  ) {
    const escalationLevel = String(item.escalation_level || 'none');
    const moduleKey = String(item.module_key || 'all');
    const lastEscalationLevel = String(item.last_escalation_level || '');
    const escalationCount = Number(item.escalation_count || 0);

    if (!['warning', 'critical'].includes(escalationLevel)) {
      return {
        current_stage_index: null,
        current_stage_priority: null,
        next_stage_index: null,
        next_stage_priority: null,
        stage_count: 0,
        has_next_stage: false,
        is_final_stage: false,
        next_stage_targets: [] as Array<{
          target_type: string;
          target_ref: string;
          priority: number;
        }>,
      };
    }

    const matchingPolicies = escalationPolicies
      .map((policy) => ({
        module_key: String(policy.module_key || ''),
        escalation_level: String(policy.escalation_level || ''),
        target_type: String(policy.target_type || ''),
        target_ref: String(policy.target_ref || ''),
        priority: Number(policy.priority || 0),
      }))
      .filter(
        (policy) =>
          policy.escalation_level === escalationLevel &&
          (policy.module_key === moduleKey || policy.module_key === 'all'),
      );

    const stagePriorities = Array.from(
      new Set(matchingPolicies.map((policy) => policy.priority)),
    ).sort((a, b) => a - b);
    if (!stagePriorities.length) {
      return {
        current_stage_index: null,
        current_stage_priority: null,
        next_stage_index: null,
        next_stage_priority: null,
        stage_count: 0,
        has_next_stage: false,
        is_final_stage: false,
        next_stage_targets: [] as Array<{
          target_type: string;
          target_ref: string;
          priority: number;
        }>,
      };
    }

    const currentStageIndex =
      lastEscalationLevel === escalationLevel
        ? Math.min(Math.max(escalationCount - 1, 0), stagePriorities.length - 1)
        : null;
    const currentStagePriority =
      currentStageIndex !== null ? (stagePriorities[currentStageIndex] ?? null) : null;
    const nextStageIndex =
      currentStageIndex === null
        ? 0
        : currentStageIndex + 1 < stagePriorities.length
          ? currentStageIndex + 1
          : null;
    const nextStagePriority =
      nextStageIndex !== null ? (stagePriorities[nextStageIndex] ?? null) : null;
    const nextStageTargets =
      nextStagePriority !== null
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
      repeating_final_stage:
        currentStageIndex !== null &&
        nextStageIndex === null &&
        lastEscalationLevel === escalationLevel &&
        escalationCount >= stagePriorities.length,
      next_stage_targets: nextStageTargets,
    };
  }
}
