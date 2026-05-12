import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { access, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardMysqlService } from './dashboard-mysql.service';

const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'] as const;
type SupportedDomain = (typeof SUPPORTED_DOMAINS)[number];

const DOMAIN_FIELD_ALLOWLIST: Record<
  SupportedDomain,
  {
    groupBy: readonly string[];
    sortBy: readonly string[];
  }
> = {
  m1: {
    groupBy: [
      'sumber',
      'cabang',
      'lokasi',
      'gudang',
      'tipebarang',
      'tipehpp',
      'matauang',
      'divisi',
      'subdivisi',
    ],
    sortBy: ['id', 'tgl', 'inputtgl', 'postingtgl', 'saldojml', 'saldonilai', 'saldohpp'],
  },
  m: {
    groupBy: ['abstatus', 'abshift', 'abkaryawan', 'abtgl'],
    sortBy: ['adid', 'adtgl', 'adinputtgl', 'admodifikasitgl', 'adtotalpotongan', 'adkurs'],
  },
  m2r: {
    groupBy: ['apstatuslunas', 'apkontaknama', 'apsumber', 'apmatauang', 'aptgl'],
    sortBy: ['nmtahun', 'nmbulan', 'nmsaldo', 'nmdebit', 'nmkredit', 'nmanggaran'],
  },
  m2: {
    groupBy: ['tsumber', 'tcabang', 'tmatauang', 'tstatus', 'tstatuslunas'],
    sortBy: [
      'tid',
      'ttgl',
      'tinputtgl',
      'tpostingtgl',
      'tcabang',
      'tsumber',
      'tdebit',
      'tkredit',
      'tstatus',
      'tstatuslunas',
    ],
  },
  so: {
    groupBy: ['sostatus', 'sostatusrealisasi', 'socustomer', 'sobagianpenjualan'],
    sortBy: [
      'soid',
      'sotgl',
      'socustomer',
      'sobagianpenjualan',
      'sostatus',
      'sostatusrealisasi',
      'total_lines',
      'total_qty',
      'grand_total',
      'total_paid',
    ],
  },
};

@Injectable()
export class DashboardService {
  private readonly supportedDomains: readonly SupportedDomain[] = SUPPORTED_DOMAINS;
  private readonly logger = new Logger(DashboardService.name);
  private alertDeliveryRunning = false;
  private smtpTransporter: Transporter | null = null;

  constructor(
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
    @Inject(forwardRef(() => AlertingConfigService))
    private readonly alertingConfigService: AlertingConfigService,
    private readonly alertingObservabilityService: AlertingObservabilityService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
    @Inject(forwardRef(() => AlertingDeliveryService))
    private readonly alertingDeliveryService: AlertingDeliveryService,
  ) {}

  async customDbPinTargets() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COALESCE(d.dashboard_id::text, '') AS dashboard_id,
        COALESCE(d.dashboard_key, m.key) AS dashboard_key,
        COALESCE(d.title, m.title) AS dashboard_title,
        m.id::text AS menu_id,
        m.key AS menu_key,
        m.title AS menu_title,
        COALESCE(m.path, '') AS route_path
      FROM public.m0_menu m
      LEFT JOIN public.m0_menu parent
        ON parent.id = m.parent_id
      LEFT JOIN public.dashboard d
        ON d.menu_id = m.id
       AND d.is_active = true
      WHERE m.is_active = true
        AND COALESCE(m.is_visible, true) = true
        AND COALESCE(m.path, '') <> ''
        AND (
          parent.key = 'dashboard'
          OR m.key = 'dashboard'
          OR m.path LIKE '/app/dashboard/%'
        )
      ORDER BY m.sort_order NULLS LAST, m.id
    `);

    return { success: true, data: rows };
  }

  async alertingBusinessMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingBusinessMetrics(moduleKey);
  }

  async alertingSystemMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingSystemMetrics(moduleKey);
  }

  async alertingMetricBuilderContext(moduleKey?: string, metricKey?: string) {
    return this.alertingRuleService.alertingMetricBuilderContext(moduleKey, metricKey);
  }

  async alertingInsights(moduleKey?: string, snapshotId?: string) {
    return this.alertingRuleService.alertingInsights(moduleKey, snapshotId);
  }

  async alertingSavedQueries(channel?: string, limit?: string) {
    return this.alertingRuleService.alertingSavedQueries(channel, limit);
  }

  async alertingRules(moduleKey?: string) {
    return this.alertingRuleService.alertingRules(moduleKey);
  }

  async alertingRuleDetail(ruleId: string) {
    return this.alertingRuleService.alertingRuleDetail(ruleId);
  }

  async runAlertingSchedulerCycle(actor = 'system-scheduler') {
    return this.alertingSchedulerService.runAlertingSchedulerCycle(actor);
  }

  async runAlertDeliveryCycle(actor = 'system-delivery') {
    if (this.alertDeliveryRunning) {
      return { success: true, data: { processed_delivery_count: 0, skipped: true, results: [] } };
    }

    this.alertDeliveryRunning = true;
    try {
      const triageRecoveryConfig = await this.alertingDeliveryService.getAlertingTriageRecoveryConfig();
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          d.delivery_id,
          d.event_id,
          d.rule_id,
          d.channel_type,
          d.target_value,
          d.provider_name,
          d.retry_count,
          d.max_retries,
          e.event_key,
          e.title AS event_title,
          COALESCE(e.description, '') AS event_description,
          e.event_payload,
          r.rule_name,
          COALESCE(r.message_template, '') AS message_template
        FROM public.alert_delivery_log d
        JOIN public.alert_event e ON e.event_id = d.event_id
        JOIN public.alert_rule r ON r.rule_id = d.rule_id
        WHERE d.delivery_status = 'queued'
          AND (d.next_retry_at IS NULL OR d.next_retry_at <= NOW())
        ORDER BY d.requested_at ASC, d.delivery_id ASC
        LIMIT 25
      `);

      const results: Array<Record<string, unknown>> = [];
      for (const row of rows) {
        const deliveryId = Number(row.delivery_id || 0);
        try {
          const dispatchResult = await this.dispatchAlertDelivery({
            channelType: String(row.channel_type || ''),
            targetValue: String(row.target_value || ''),
            eventKey: String(row.event_key || ''),
            eventTitle: String(row.event_title || ''),
            message:
              String(row.message_template || '').trim() ||
              String(row.event_description || '').trim() ||
              String(row.event_title || '').trim(),
            eventPayload: this.asJson(row.event_payload, {}),
          });

          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              provider_name = '${this.escapeSqlLiteral(dispatchResult.providerName)}',
              provider_message_id = ${dispatchResult.providerMessageId ? `'${this.escapeSqlLiteral(dispatchResult.providerMessageId)}'` : 'NULL'},
              delivery_status = '${this.escapeSqlLiteral(dispatchResult.deliveryStatus)}',
              response_payload = '${this.escapeSqlLiteral(JSON.stringify(dispatchResult.responsePayload))}'::jsonb,
              error_message = NULL,
              last_attempt_at = NOW(),
              next_retry_at = NULL,
              dead_lettered_at = NULL,
              dead_letter_reason = NULL,
              delivered_at = ${dispatchResult.deliveryStatus === 'failed' ? 'NULL' : 'NOW()'}
            WHERE delivery_id = ${deliveryId}
          `);

          let autoClosedTriage = false;
          if (triageRecoveryConfig.enabled && dispatchResult.deliveryStatus !== 'failed') {
            const triageBeforeRows = await this.prisma.$queryRawUnsafe<
              Array<Record<string, unknown>>
            >(`
              SELECT triage_status, acknowledged_at, assigned_to, note
              FROM public.alert_dead_letter_triage
              WHERE delivery_id = ${deliveryId}
              LIMIT 1
            `);
            const resolvedCount = await this.prisma.$executeRawUnsafe(`
              UPDATE public.alert_dead_letter_triage
              SET
                triage_status = 'resolved',
                note = CASE
                  WHEN COALESCE(note, '') = '' THEN 'Auto-resolved after successful delivery recovery.'
                  ELSE note || E'\\nAuto-resolved after successful delivery recovery.'
                END,
                last_action_at = NOW(),
                updated_by = '${this.escapeSqlLiteral(actor)}'
              WHERE delivery_id = ${deliveryId}
                AND triage_status <> 'resolved'
            `);
            autoClosedTriage = Number(resolvedCount || 0) > 0;
            if (autoClosedTriage) {
              const previous = triageBeforeRows[0];
              await this.alertingDeliveryService.createAlertDeadLetterTriageAudit({
                deliveryId,
                actionType: 'auto-resolve',
                previousTriageStatus: previous?.triage_status
                  ? String(previous.triage_status)
                  : null,
                nextTriageStatus: 'resolved',
                previousAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                nextAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                previousAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                nextAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                noteSnapshot: previous?.note
                  ? String(previous.note)
                  : 'Auto-resolved after successful delivery recovery.',
                detailPayload: {
                  trigger: 'delivery-recovery',
                },
                actor,
              });
            }
          }

          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: dispatchResult.deliveryStatus,
            provider_name: dispatchResult.providerName,
            auto_closed_triage: autoClosedTriage,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown delivery worker error.';
          const retryCount = Number(row.retry_count || 0);
          const maxRetries = Math.max(Number(row.max_retries || 3) || 3, 1);
          const nextRetryCount = retryCount + 1;
          const shouldRetry = nextRetryCount < maxRetries;
          const backoffMinutes = Math.min(5 * nextRetryCount, 60);
          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              delivery_status = '${shouldRetry ? 'queued' : 'dead-lettered'}',
              error_message = '${this.escapeSqlLiteral(message)}',
              response_payload = '${this.escapeSqlLiteral(
                JSON.stringify({
                  worker: 'delivery',
                  status: shouldRetry ? 'queued_for_retry' : 'dead_lettered',
                  retry_count: nextRetryCount,
                  max_retries: maxRetries,
                  retry_backoff_minutes: shouldRetry ? backoffMinutes : null,
                }),
              )}'::jsonb,
              retry_count = ${nextRetryCount},
              last_attempt_at = NOW(),
              next_retry_at = ${shouldRetry ? `NOW() + INTERVAL '${backoffMinutes} minutes'` : 'NULL'},
              dead_lettered_at = ${shouldRetry ? 'NULL' : 'NOW()'},
              dead_letter_reason = ${shouldRetry ? 'NULL' : `'${this.escapeSqlLiteral(message)}'`},
              delivered_at = NULL
            WHERE delivery_id = ${deliveryId}
          `);
          this.logger.error(`Alert delivery failed for log ${deliveryId}: ${message}`);
          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: shouldRetry ? 'queued' : 'dead-lettered',
            retry_count: nextRetryCount,
            max_retries: maxRetries,
            error_message: message,
          });
        }
      }

      if (results.length) {
        this.logger.log(`Alert delivery worker processed ${results.length} queued deliveries.`);
      }

      return {
        success: true,
        data: {
          processed_delivery_count: results.length,
          skipped: false,
          actor,
          results,
        },
      };
    } finally {
      this.alertDeliveryRunning = false;
    }
  }

  async createAlertingRule(body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.createAlertingRule(body, actor);
  }

  async updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRule(ruleId, body, actor);
  }

  async updateAlertingRuleState(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRuleState(ruleId, body, actor);
  }

  async deleteAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.deleteAlertingRule(ruleId, actor);
  }

  async runAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.runAlertingRule(ruleId, actor);
  }

  async alertingEvents(moduleKey?: string, eventId?: string) {
    return this.alertingRuleService.alertingEvents(moduleKey, eventId);
  }

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
        response_payload: this.asJson(row.response_payload, {}),
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
        '${this.escapeSqlLiteral(actor)}',
        'Delivery was manually requeued.',
        NOW(),
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = 'requeued',
        acknowledged_at = NULL,
        acknowledged_by = NULL,
        assigned_to = '${this.escapeSqlLiteral(actor)}',
        note = 'Delivery was manually requeued.',
        last_action_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
    `);

    const triageBefore = triageBeforeRows[0];
    await this.alertingDeliveryService.createAlertDeadLetterTriageAudit({
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

    const deliveryRun = await this.runAlertDeliveryCycle(actor);
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
          this.asJson<Record<string, unknown>>(row.response_payload, {})[
            'escalation_stage_index'
          ] || 0,
        ),
        stage_priority: Number(
          this.asJson<Record<string, unknown>>(row.response_payload, {})[
            'escalation_stage_priority'
          ] || 0,
        ),
        routing_source: String(
          this.asJson<Record<string, unknown>>(row.response_payload, {})[
            'escalation_routing_source'
          ] || '',
        ),
        repeating_final_stage: Boolean(
          this.asJson<Record<string, unknown>>(row.response_payload, {})['repeating_final_stage'],
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
        detail_payload: this.asJson(row.detail_payload, {}),
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
        '${this.escapeSqlLiteral(triageStatus)}',
        ${acknowledge ? 'NOW()' : 'NULL'},
        ${acknowledge ? `'${this.escapeSqlLiteral(actor)}'` : 'NULL'},
        ${assignedTo ? `'${this.escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        ${note ? `'${this.escapeSqlLiteral(note)}'` : 'NULL'},
        NOW(),
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = '${this.escapeSqlLiteral(triageStatus)}',
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
            ? `COALESCE(public.alert_dead_letter_triage.acknowledged_by, '${this.escapeSqlLiteral(actor)}')`
            : unacknowledge
              ? 'NULL'
              : triageStatus === 'open' || triageStatus === 'requeued'
                ? 'NULL'
                : 'public.alert_dead_letter_triage.acknowledged_by'
        },
        assigned_to = ${assignedTo ? `'${this.escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        note = ${note ? `'${this.escapeSqlLiteral(note)}'` : 'NULL'},
        last_action_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
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

    await this.alertingDeliveryService.createAlertDeadLetterTriageAudit({
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

  async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
    return this.alertingSchedulerService.runAlertingTriageEscalationCycle(actor);
  }

  async alertingAnalytics() {
    return this.alertingObservabilityService.alertingAnalytics();
  }

  async alertingDeliveryObservability() {
    return this.alertingObservabilityService.alertingDeliveryObservability();
  }

  async alertingOpsOverview() {
    const [analytics, observability, deliveryStatus, providerHealth, triage] = await Promise.all([
      this.alertingAnalytics(),
      this.alertingDeliveryObservability(),
      this.alertingDeliveryStatus(),
      this.alertingProviderHealth(),
      this.alertingDeadLetterTriage(),
    ]);

    const analyticsData = analytics.data as Record<string, unknown>;
    const observabilityData = observability.data as Record<string, unknown>;
    const deliveryStatusData = deliveryStatus.data as Record<string, unknown>;
    const providerHealthData = providerHealth.data as Record<string, unknown>;
    const triageSummary = (triage.summary as Record<string, unknown> | undefined) || {};
    const triagePolicy = (triage.policy as Record<string, unknown> | undefined) || {};
    const summary = (analyticsData.summary as Record<string, unknown> | undefined) || {};
    const observabilitySummary =
      (observabilityData.summary as Record<string, unknown> | undefined) || {};
    const channels = Array.isArray(deliveryStatusData.channels)
      ? (deliveryStatusData.channels as Array<Record<string, unknown>>)
      : [];

    return {
      success: true,
      data: {
        analytics: analyticsData,
        delivery_observability: observabilityData,
        delivery_status: deliveryStatusData,
        provider_health: providerHealthData,
        triage: {
          summary: triageSummary,
          policy: triagePolicy,
          audit_summary: (triage.audit_summary as Record<string, unknown> | undefined) || {},
        },
        highlights: {
          open_events: Number(summary.open_events || 0),
          dead_lettered_logs: Number(observabilitySummary.dead_lettered_logs || 0),
          configured_channels: channels.filter((channel) => Boolean(channel.is_configured)).length,
          dry_run_channels: channels.filter(
            (channel) => String(channel.provider_mode || '') === 'dry-run',
          ).length,
          overdue_triage_items:
            Number(triageSummary.overdue_items || 0) + Number(triageSummary.critical_items || 0),
        },
      },
    };
  }

  async alertingDeliveryStatus() {
    const smtpConfig = this.getSmtpConfig();
    const waGroup = this.getAlertDeliveryWebhookConfig('wa-group');
    const waPersonal = this.getAlertDeliveryWebhookConfig('wa-personal');
    const emailWebhook = this.getAlertDeliveryWebhookConfig('email');
    const baileysConfig = this.getBaileysConfig();

    return {
      success: true,
      data: {
        scheduler_interval_ms: this.alertingSchedulerService.alertSchedulerIntervalMs,
        delivery_interval_ms: this.alertingSchedulerService.alertDeliveryIntervalMs,
        triage_escalation_interval_ms: this.alertingSchedulerService.alertTriageEscalationIntervalMs,
        channels: [
          {
            channel_type: 'wa-group',
            provider_mode: baileysConfig.enabled ? 'baileys' : waGroup.url ? 'webhook' : 'dry-run',
            provider_name: baileysConfig.enabled ? 'baileys' : waGroup.providerName,
            is_configured: Boolean(baileysConfig.enabled || waGroup.url),
          },
          {
            channel_type: 'wa-personal',
            provider_mode: baileysConfig.enabled
              ? 'baileys'
              : waPersonal.url
                ? 'webhook'
                : 'dry-run',
            provider_name: baileysConfig.enabled ? 'baileys' : waPersonal.providerName,
            is_configured: Boolean(baileysConfig.enabled || waPersonal.url),
          },
          {
            channel_type: 'email',
            provider_mode:
              smtpConfig.host && smtpConfig.port && smtpConfig.from
                ? 'smtp'
                : emailWebhook.url
                  ? 'webhook'
                  : 'dry-run',
            provider_name:
              smtpConfig.host && smtpConfig.port && smtpConfig.from
                ? 'smtp'
                : emailWebhook.providerName,
            is_configured: Boolean(
              (smtpConfig.host && smtpConfig.port && smtpConfig.from) || emailWebhook.url,
            ),
          },
        ],
      },
    };
  }

  async alertingProviderHealth() {
    const smtpConfig = this.getSmtpConfig();
    const baileys = await this.getBaileysHealth();
    await this.upsertAlertProviderSessionState({
      providerName: 'baileys',
      channelType: 'wa-group',
      sessionKey: 'baileys-wa-group',
      sessionStatus: this.mapBaileysHealthToSessionStatus(baileys),
      pairingMode: null,
      phoneNumber: null,
      authDir: baileys.auth_dir,
      statusMessage: baileys.status_label,
      detailPayload: baileys,
      lastHealthCheckAt: new Date(),
      lastConnectedAt: baileys.session_ready ? new Date() : null,
      lastDisconnectedAt: !baileys.session_ready ? new Date() : null,
      actor: 'system',
    });
    const recentPairingAttempts = await this.prisma.$queryRawUnsafe<
      Array<Record<string, unknown>>
    >(`
      SELECT
        audit_id,
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
        created_at
      FROM public.alert_provider_session_audit
      WHERE provider_name = 'baileys'
      ORDER BY created_at DESC, audit_id DESC
      LIMIT 10
    `);
    const sessionStates = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        session_state_id,
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
        updated_at
      FROM public.alert_provider_session_state
      WHERE provider_name IN ('baileys', 'smtp')
      ORDER BY updated_at DESC, session_state_id DESC
    `);

    return {
      success: true,
      data: {
        smtp: {
          configured: Boolean(smtpConfig.host && smtpConfig.port && smtpConfig.from),
          host: smtpConfig.host || null,
          port: smtpConfig.port || null,
          secure: smtpConfig.secure,
          from: smtpConfig.from || null,
          has_auth: Boolean(smtpConfig.user && smtpConfig.pass),
        },
        baileys,
        recent_pairing_attempts: recentPairingAttempts.map((row) => ({
          audit_id: Number(row.audit_id || 0),
          provider_name: row.provider_name,
          channel_type: row.channel_type,
          action_type: row.action_type,
          status: row.status,
          pairing_mode: row.pairing_mode || null,
          phone_number: row.phone_number || null,
          auth_dir: row.auth_dir || null,
          detail_payload: this.asJson(row.detail_payload, {}),
          error_message: row.error_message || null,
          created_by: row.created_by || null,
          created_at: row.created_at || null,
        })),
        session_states: sessionStates.map((row) => ({
          session_state_id: Number(row.session_state_id || 0),
          provider_name: row.provider_name,
          channel_type: row.channel_type,
          session_key: row.session_key,
          session_status: row.session_status,
          pairing_mode: row.pairing_mode || null,
          phone_number: row.phone_number || null,
          auth_dir: row.auth_dir || null,
          status_message: row.status_message || null,
          last_health_check_at: row.last_health_check_at || null,
          last_pairing_started_at: row.last_pairing_started_at || null,
          last_pairing_result_at: row.last_pairing_result_at || null,
          last_connected_at: row.last_connected_at || null,
          last_disconnected_at: row.last_disconnected_at || null,
          detail_payload: this.asJson(row.detail_payload, {}),
          is_active: Boolean(row.is_active),
          updated_at: row.updated_at || null,
        })),
      },
    };
  }

  async alertingBaileysPairing(
    body: { phoneNumber?: string; phone_number?: string },
    actor: string,
  ) {
    return this.alertingConfigService.alertingBaileysPairing(body, actor, );
  }

  async alertingChannels(channelType?: string) {
    return this.alertingConfigService.alertingChannels(channelType);
  }

  async alertingTemplates(module?: string) {
    return this.alertingConfigService.alertingTemplates(module);
  }

  async createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTemplate(body, actor);
  }

  async alertingTemplateDetail(templateId: string) {
    return this.alertingConfigService.alertingTemplateDetail(templateId);
  }

  async updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTemplate(templateId, body, actor);
  }

  async updateAlertingTemplateState(
    templateId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTemplateState(templateId, body, actor, );
  }

  async deleteAlertingTemplate(templateId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTemplate(templateId, actor);
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingChannel(body, actor);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingChannel(channelId, body, actor);
  }

  async updateAlertingChannelState(
    channelId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingChannelState(channelId, body, actor, );
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingChannel(channelId, actor);
  }

  async testAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.testAlertingChannel(channelId, actor);
  }

  async alertingSettings() {
    return this.alertingConfigService.alertingSettings();
  }

  async updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingSetting(settingKey, body, actor);
  }

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    return this.alertingConfigService.alertingEscalationPolicies(module, targetType);
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingEscalationPolicy(body, actor);
  }

  async updateAlertingEscalationPolicy(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicy(policyId, body, actor, );
  }

  async updateAlertingEscalationPolicyState(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicyState(policyId, body, actor, );
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingEscalationPolicy(policyId, actor);
  }

  async alertingTriageSavedViews(actor: string) {
    return this.alertingConfigService.alertingTriageSavedViews(actor);
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTriageSavedView(body, actor);
  }

  async updateAlertingTriageSavedView(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTriageSavedView(viewId, body, actor, );
  }

  async updateAlertingTriageSavedViewState(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTriageSavedViewState(viewId, body, actor, );
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTriageSavedView(viewId, actor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    return this.alertingConfigService.updateAlertingEvent(eventId, body, actor);
  }

  async customDbCatalog(dashboardKey: string) {
    const identifier = this.escapeSqlLiteral(dashboardKey);
    const dashboardRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      this.buildCustomDashboardLookupSql(identifier),
    );

    if (!dashboardRows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }

    const dashboard = dashboardRows[0];
    const resolvedDashboardKey = String(dashboard.dashboard_key || dashboardKey);

    const widgets = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        w.widget_id::text,
        w.widget_key,
        w.title,
        w.short_label,
        COALESCE(w.description, '') AS description,
        w.widget_kind,
        COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table,
        w.result_kind,
        w.ui_config,
        w.filter_binding,
        COALESCE(w.empty_state, '') AS empty_state,
        COALESCE(w.span_class_name, '') AS span_class_name,
        w.widget_order
      FROM public.dashboard_widget w
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND w.is_active = true
      ORDER BY w.widget_order, w.widget_key
    `);

    const widgetQueries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        q.widget_id::text,
        q.query_key,
        q.label,
        COALESCE(q.purpose, '') AS purpose,
        q.sql_template,
        COALESCE(q.count_sql, '') AS count_sql,
        q.query_params,
        q.output_columns,
        q.default_limit
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.is_active = true
      ORDER BY q.query_key
    `);

    const filters = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        f.filter_key,
        f.label,
        f.filter_type,
        f.data_type,
        f.source_type,
        COALESCE(f.source_table, '') AS source_table,
        COALESCE(f.source_query, '') AS source_query,
        f.static_options,
        COALESCE(f.placeholder, '') AS placeholder,
        f.query_param_name,
        f.default_value,
        COALESCE(f.depends_on_filter_key, '') AS depends_on_filter_key,
        f.allows_multiple,
        f.is_required,
        f.sort_order
      FROM public.dashboard_filter f
      JOIN public.dashboard d ON d.dashboard_id = f.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND f.is_active = true
      ORDER BY f.sort_order, f.filter_key
    `);

    const widgetsWithQueries = widgets.map((widget) => ({
      ...widget,
      ui_config: this.asJson(widget.ui_config, {}),
      filter_binding: this.asJson(widget.filter_binding, []),
      widget_order: Number(widget.widget_order || 0),
      queries: widgetQueries
        .filter((query) => query.widget_id === widget.widget_id)
        .map((query) => ({
          ...query,
          query_params: this.asJson(query.query_params, []),
          output_columns: this.asJson(query.output_columns, []),
          default_limit:
            typeof query.default_limit === 'number'
              ? query.default_limit
              : query.default_limit
                ? Number(query.default_limit)
                : null,
        })),
    }));

    const filtersWithOptions: Array<Record<string, unknown>> = [];
    for (const filter of filters) {
      let options: unknown[] = this.asJson(filter.static_options, []);
      if (
        filter.source_type === 'query' &&
        typeof filter.source_query === 'string' &&
        filter.source_query.trim()
      ) {
        const optionRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          filter.source_query,
        );
        options = optionRows
          .map((row) => row[Object.keys(row)[0] as keyof typeof row])
          .filter(Boolean);
      }
      filtersWithOptions.push({
        ...filter,
        static_options: this.asJson(filter.static_options, []),
        default_value: this.asJson(filter.default_value, null),
        allows_multiple: Boolean(filter.allows_multiple),
        is_required: Boolean(filter.is_required),
        sort_order: Number(filter.sort_order || 0),
        options,
      });
    }

    return {
      success: true,
      data: {
        ...dashboard,
        layout_config: this.asJson(dashboard.layout_config, {}),
        default_filter_values: this.asJson(dashboard.default_filter_values, {}),
        widgets: widgetsWithQueries,
        filters: filtersWithOptions,
      },
    };
  }

  async updateCustomDbCatalog(
    dashboardKey: string,
    body: { title?: string; description?: string | null },
  ) {
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';

    if (!title && body?.description === undefined) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const dashboardId = await this.findCustomDashboardIdOrThrow(dashboardKey);
    const updates: string[] = [];

    if (title) {
      updates.push(`title = '${this.escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${this.escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(
        description
          ? `description = '${this.escapeSqlLiteral(description)}'`
          : 'description = NULL',
      );
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.dashboard
      SET ${updates.join(', ')}
      WHERE dashboard_id = ${dashboardId}
    `);

    return { success: true };
  }

  async executeCustomDbQuery(
    dashboardKey: string,
    queryKey: string,
    params: Record<string, unknown>,
  ) {
    const resolvedDashboardKey = await this.findResolvedDashboardKeyOrThrow(dashboardKey);
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT q.sql_template, q.label, q.output_columns
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.query_key = '${this.escapeSqlLiteral(queryKey)}'
        AND d.is_active = true
        AND w.is_active = true
        AND q.is_active = true
      LIMIT 1
    `);

    if (!rows.length) {
      throw new NotFoundException('Query metadata not found.');
    }

    const row = rows[0];
    const renderedSql = this.renderSqlTemplate(String(row.sql_template || ''), params);
    const normalizedSql = renderedSql.trim();
    if (!/^(select|with)\b/i.test(normalizedSql)) {
      throw new BadRequestException('Only SELECT query is allowed.');
    }

    const resultRows =
      await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(normalizedSql);
    const declaredColumns = this.asJson(row.output_columns, []);
    const columns = resultRows.length ? Object.keys(resultRows[0]) : declaredColumns;

    return {
      success: true,
      data: {
        label: row.label,
        sql: normalizedSql,
        columns,
        rows: resultRows,
      },
    };
  }

  async pinCustomDbWidget(body: {
    dashboardKey?: string;
    title?: string;
    description?: string | null;
    widgetKind?: string;
    chartType?: string | null;
    spanClassName?: string | null;
    sqlTemplate?: string;
    outputColumns?: string[];
    queryLabel?: string;
  }) {
    const dashboardKey = (body?.dashboardKey || '').trim();
    const title = (body?.title || '').trim();
    const description = (body?.description || '').trim();
    const widgetKind = (body?.widgetKind || 'table').trim();
    const chartType = (body?.chartType || '').trim();
    const spanClassName = (body?.spanClassName || 'lg:col-span-6').trim() || 'lg:col-span-6';
    const sqlTemplate = (body?.sqlTemplate || '').trim();
    const outputColumns = Array.isArray(body?.outputColumns)
      ? body.outputColumns.filter(
          (value): value is string => typeof value === 'string' && value.trim().length > 0,
        )
      : [];
    const queryLabel = (body?.queryLabel || title || 'Pinned Widget Query').trim();

    if (!dashboardKey || !title || !sqlTemplate) {
      throw new BadRequestException('dashboardKey, title, dan sqlTemplate wajib diisi.');
    }
    if (!/^(select|with)\b/i.test(sqlTemplate)) {
      throw new BadRequestException('Hanya query SELECT/WITH yang dapat di-pin.');
    }

    const nowSuffix = Date.now().toString().slice(-8);
    const baseKey = this.slugify(title) || 'pinned-widget';
    const widgetKey = `${baseKey}-${nowSuffix}`;
    const queryKey = `${widgetKey}-main`;
    const normalizedWidgetKind = ['chart', 'table', 'list', 'summary', 'metric'].includes(
      widgetKind,
    )
      ? widgetKind
      : 'table';
    const normalizedChartType =
      normalizedWidgetKind === 'chart' &&
      ['bar', 'vertical_bar', 'line', 'pie', 'donut', 'area', 'horizontal_bar', 'scatter'].includes(
        chartType,
      )
        ? chartType
        : normalizedWidgetKind === 'chart'
          ? 'bar'
          : '';

    const dashboardId = await this.findOrCreateCustomDashboardId(dashboardKey);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const widgetOrder = Number(orderRows[0]?.next_widget_order || 1);
    const uiConfigJson = JSON.stringify({
      component: normalizedWidgetKind === 'chart' ? 'PinnedChartCard' : 'PinnedTableCard',
    });

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      VALUES (
        ${dashboardId},
        '${this.escapeSqlLiteral(widgetKey)}',
        '${this.escapeSqlLiteral(title)}',
        '${this.escapeSqlLiteral(title.slice(0, 48))}',
        ${description ? `'${this.escapeSqlLiteral(description)}'` : 'NULL'},
        '${this.escapeSqlLiteral(normalizedWidgetKind)}',
        ${normalizedChartType ? `'${this.escapeSqlLiteral(normalizedChartType)}'` : 'NULL'},
        NULL,
        '${this.escapeSqlLiteral(normalizedWidgetKind === 'chart' ? 'categorical' : 'table')}',
        '${this.escapeSqlLiteral(uiConfigJson)}'::jsonb,
        '[]'::jsonb,
        'No pinned widget data yet.',
        '${this.escapeSqlLiteral(spanClassName)}',
        ${widgetOrder},
        true
      )
      RETURNING widget_id::text
    `);
    const widgetId = insertedRows[0]?.widget_id;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard_widget_query (
        widget_id,
        query_key,
        label,
        purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit,
        is_active
      )
      VALUES (
        ${widgetId},
        '${this.escapeSqlLiteral(queryKey)}',
        '${this.escapeSqlLiteral(queryLabel)}',
        'Pinned from Senti AI',
        '${this.escapeSqlLiteral(sqlTemplate)}',
        NULL,
        '[]'::jsonb,
        '${this.escapeSqlLiteral(JSON.stringify(outputColumns))}'::jsonb,
        50,
        true
      )
    `);

    return {
      success: true,
      data: {
        dashboard_key: dashboardKey,
        widget_key: widgetKey,
        query_key: queryKey,
      },
    };
  }

  async updateCustomDbWidget(
    widgetId: string,
    body: {
      title?: string;
      description?: string | null;
      spanClassName?: string | null;
      widgetOrder?: number | null;
      chartType?: string | null;
      defaultLimit?: number | null;
    },
  ) {
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';
    const spanClassName =
      typeof body?.spanClassName === 'string' && body.spanClassName.trim()
        ? body.spanClassName.trim()
        : null;
    const widgetOrder =
      typeof body?.widgetOrder === 'number' && Number.isFinite(body.widgetOrder)
        ? Math.max(1, Math.floor(body.widgetOrder))
        : null;
    const chartType =
      typeof body?.chartType === 'string' && body.chartType.trim()
        ? body.chartType.trim().toLowerCase()
        : body?.chartType === null
          ? ''
          : null;
    const defaultLimit =
      typeof body?.defaultLimit === 'number' && Number.isFinite(body.defaultLimit)
        ? Math.max(1, Math.floor(body.defaultLimit))
        : body?.defaultLimit === null
          ? null
          : undefined;

    if (
      !title &&
      !spanClassName &&
      widgetOrder === null &&
      body?.description === undefined &&
      chartType === null &&
      defaultLimit === undefined
    ) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!existingRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    const updates: string[] = [];
    if (title) {
      updates.push(`title = '${this.escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${this.escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(
        description
          ? `description = '${this.escapeSqlLiteral(description)}'`
          : 'description = NULL',
      );
    }
    if (spanClassName) {
      updates.push(`span_class_name = '${this.escapeSqlLiteral(spanClassName)}'`);
    }
    if (widgetOrder !== null) {
      updates.push(`widget_order = ${widgetOrder}`);
    }
    if (chartType !== null) {
      const normalizedChartType = [
        'bar',
        'vertical_bar',
        'line',
        'pie',
        'donut',
        'area',
        'horizontal_bar',
        'scatter',
      ].includes(chartType)
        ? chartType
        : '';
      updates.push(
        normalizedChartType ? `chart_type = '${normalizedChartType}'` : 'chart_type = NULL',
      );
      updates.push(
        normalizedChartType
          ? "widget_kind = CASE WHEN widget_kind IN ('table', 'list', 'summary', 'metric') THEN widget_kind ELSE 'chart' END"
          : 'widget_kind = widget_kind',
      );
    }

    if (updates.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget
        SET ${updates.join(', ')}
        WHERE widget_id::text = '${widgetIdSql}'
      `);
    }

    if (defaultLimit !== undefined) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget_query
        SET default_limit = ${defaultLimit === null ? 'NULL' : defaultLimit}
        WHERE widget_id IN (
          SELECT widget_id
          FROM public.dashboard_widget
          WHERE widget_id::text = '${widgetIdSql}'
        )
      `);
    }

    return { success: true };
  }

  async deleteCustomDbWidget(widgetId: string) {
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const rows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!rows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
    `);

    return { success: true };
  }

  async duplicateCustomDbWidget(widgetId: string) {
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const sourceRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        w.widget_id::text,
        w.dashboard_id::text,
        w.widget_key,
        w.title,
        w.short_label,
        COALESCE(w.description, '') AS description,
        w.widget_kind,
        COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table,
        w.result_kind,
        w.ui_config,
        w.filter_binding,
        COALESCE(w.empty_state, '') AS empty_state
      FROM public.dashboard_widget w
      WHERE w.widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);

    if (!sourceRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    const source = sourceRows[0];
    const dashboardId = String(source.dashboard_id);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const nextOrder = Number(orderRows[0]?.next_widget_order || 1);
    const nowSuffix = Date.now().toString().slice(-8);
    const duplicatedTitle = `${String(source.title || 'Widget')} Copy`;
    const duplicatedWidgetKey = `${this.slugify(duplicatedTitle) || 'widget-copy'}-${nowSuffix}`;

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      SELECT
        dashboard_id,
        '${this.escapeSqlLiteral(duplicatedWidgetKey)}',
        '${this.escapeSqlLiteral(duplicatedTitle)}',
        '${this.escapeSqlLiteral(duplicatedTitle.slice(0, 48))}',
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        ${nextOrder},
        true
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      RETURNING widget_id::text
    `);

    const duplicatedWidgetId = insertedRows[0]?.widget_id;
    const queryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        query_key,
        label,
        COALESCE(purpose, '') AS purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit
      FROM public.dashboard_widget_query
      WHERE widget_id::text = '${widgetIdSql}'
        AND is_active = true
      ORDER BY query_key
    `);

    for (let index = 0; index < queryRows.length; index += 1) {
      const query = queryRows[index];
      const duplicateQueryKey =
        index === 0 ? `${duplicatedWidgetKey}-main` : `${duplicatedWidgetKey}-${index + 1}`;
      const duplicateQueryLabel = `${duplicatedTitle} Query${index > 0 ? ` ${index + 1}` : ''}`;
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.dashboard_widget_query (
          widget_id,
          query_key,
          label,
          purpose,
          sql_template,
          count_sql,
          query_params,
          output_columns,
          default_limit,
          is_active
        )
        VALUES (
          ${duplicatedWidgetId},
          '${this.escapeSqlLiteral(duplicateQueryKey)}',
          '${this.escapeSqlLiteral(duplicateQueryLabel)}',
          ${query.purpose ? `'${this.escapeSqlLiteral(String(query.purpose))}'` : 'NULL'},
          '${this.escapeSqlLiteral(String(query.sql_template || ''))}',
          ${query.count_sql ? `'${this.escapeSqlLiteral(String(query.count_sql))}'` : 'NULL'},
          '${this.escapeSqlLiteral(JSON.stringify(this.asJson(query.query_params, [])))}'::jsonb,
          '${this.escapeSqlLiteral(JSON.stringify(this.asJson(query.output_columns, [])))}'::jsonb,
          ${query.default_limit ?? 'NULL'},
          true
        )
      `);
    }

    return {
      success: true,
      data: {
        widget_id: duplicatedWidgetId,
        widget_key: duplicatedWidgetKey,
      },
    };
  }

  async summary(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'summary.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'summary',
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'summary.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'summary');
    }
  }

  private escapeSqlLiteral(value: string) {
    return value.replaceAll("'", "''");
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  async ensureAlertingTestRule(actor: string) {
    return this.alertingDeliveryService.ensureAlertingTestRule(actor);
  }

  private resolveRouteSegment(value: string) {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) {
      return '';
    }
    const parts = trimmed.split('/');
    return parts[parts.length - 1] || '';
  }

  private buildCustomDashboardLookupSql(identifier: string) {
    return `
      SELECT
        d.dashboard_id::text,
        d.menu_id::text,
        COALESCE(m.key, '') AS menu_key,
        COALESCE(m.path, '') AS route_path,
        d.dashboard_key,
        d.title,
        d.short_label,
        COALESCE(d.description, '') AS description,
        COALESCE(d.icon_name, '') AS icon_name,
        d.status,
        d.layout_config,
        d.default_filter_values
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${identifier}'
        )
      ORDER BY CASE WHEN d.dashboard_key = '${identifier}' THEN 0 ELSE 1 END
      LIMIT 1
    `;
  }

  private async findCustomDashboardIdOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(
      this.buildCustomDashboardLookupSql(this.escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_id;
  }

  private async findResolvedDashboardKeyOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_key: string }>>(
      this.buildCustomDashboardLookupSql(this.escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_key;
  }

  private async findOrCreateCustomDashboardId(dashboardKey: string) {
    const identifier = this.escapeSqlLiteral(dashboardKey);
    const routeSegment = this.escapeSqlLiteral(this.resolveRouteSegment(dashboardKey));

    let rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (rows.length) {
      return rows[0].dashboard_id;
    }

    const menuRows = await this.prisma.$queryRawUnsafe<Array<{ id: string; title: string }>>(`
      SELECT id::text, title
      FROM public.m0_menu
      WHERE is_active = true
        AND (
          key = '${identifier}'
          OR COALESCE(path, '') = '${identifier}'
          OR COALESCE(split_part(path, '/', array_length(string_to_array(path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!menuRows.length) {
      throw new NotFoundException(`Dashboard/menu ${dashboardKey} tidak ditemukan.`);
    }

    const menuId = menuRows[0].id;
    const menuTitle = menuRows[0].title || dashboardKey;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard (
        menu_id,
        dashboard_key,
        title,
        short_label,
        description,
        icon_name,
        status,
        layout_config,
        default_filter_values,
        is_active
      )
      VALUES (
        ${menuId},
        '${identifier}',
        '${this.escapeSqlLiteral(menuTitle)}',
        '${this.escapeSqlLiteral(String(menuTitle).slice(0, 48))}',
        'Dashboard page generated from menu target.',
        'LayoutDashboard',
        'active',
        '{}'::jsonb,
        '{}'::jsonb,
        true
      )
      ON CONFLICT (dashboard_key) DO UPDATE
      SET menu_id = EXCLUDED.menu_id,
          title = EXCLUDED.title,
          short_label = EXCLUDED.short_label,
          is_active = true
    `);

    rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!rows.length) {
      throw new InternalServerErrorException(`Dashboard ${dashboardKey} gagal dibuat.`);
    }

    return rows[0].dashboard_id;
  }

  private renderSqlTemplate(template: string, params: Record<string, unknown>) {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
      const raw = params[key];
      if (raw === 'Semua Warehouse') {
        return "''";
      }
      return this.toSqlLiteral(raw);
    });
  }

  private toSqlLiteral(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return 'NULL';
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : 'NULL';
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    return `'${this.escapeSqlLiteral(String(value))}'`;
  }

  private asJson<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    if (typeof value === 'object') {
      return value as T;
    }
    try {
      return JSON.parse(String(value)) as T;
    } catch {
      return fallback;
    }
  }

  private async dispatchAlertDelivery(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
    if (input.channelType === 'wa-group' || input.channelType === 'wa-personal') {
      const baileysResult = await this.dispatchWhatsAppViaBaileys(input);
      if (baileysResult) {
        return baileysResult;
      }
    }

    if (input.channelType === 'email') {
      const smtpResult = await this.dispatchEmailViaSmtp(input);
      if (smtpResult) {
        return smtpResult;
      }
    }

    const webhookConfig = this.getAlertDeliveryWebhookConfig(input.channelType);
    if (!webhookConfig.url) {
      return {
        providerName: 'dry-run',
        providerMessageId: `dry-${Date.now()}`,
        deliveryStatus: 'delivered',
        responsePayload: {
          dry_run: true,
          channel_type: input.channelType,
          target_value: input.targetValue,
          event_key: input.eventKey,
        },
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (webhookConfig.token) {
      headers.Authorization = `Bearer ${webhookConfig.token}`;
    }

    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channel_type: input.channelType,
        target_value: input.targetValue,
        event_key: input.eventKey,
        event_title: input.eventTitle,
        message: input.message,
        payload: input.eventPayload,
      }),
    });

    const rawText = await response.text();
    let parsedPayload: unknown = rawText;
    try {
      parsedPayload = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsedPayload = rawText;
    }

    if (!response.ok) {
      throw new Error(
        `Delivery provider ${webhookConfig.providerName} rejected request with status ${response.status}.`,
      );
    }

    const providerMessageId =
      parsedPayload && typeof parsedPayload === 'object'
        ? String(
            (parsedPayload as Record<string, unknown>).message_id ||
              (parsedPayload as Record<string, unknown>).id ||
              '',
          ).trim() || null
        : null;

    return {
      providerName: webhookConfig.providerName,
      providerMessageId,
      deliveryStatus: 'delivered',
      responsePayload: parsedPayload,
    };
  }

  private async dispatchWhatsAppViaBaileys(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
    const config = this.getBaileysConfig();
    if (!config.enabled || !config.authDir) {
      return null;
    }

    const jid = this.normalizeWhatsAppJid(input.channelType, input.targetValue);
    const baileys = await import('@whiskeysockets/baileys');
    await mkdir(config.authDir, { recursive: true });
    const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);
    const socket = baileys.makeWASocket({
      auth: state,
      browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      printQRInTerminal: false,
    });

    socket.ev.on('creds.update', saveCreds);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Baileys connection timed out. Pair the WhatsApp session first.'));
      }, 30000);

      socket.ev.on('connection.update', (update: Record<string, unknown>) => {
        const connection = String(update.connection || '');
        if (connection === 'open') {
          clearTimeout(timeout);
          resolve();
          return;
        }
        if (typeof update.qr === 'string' && update.qr.trim()) {
          this.logger.warn(
            'Baileys session requires QR pairing before WhatsApp delivery can be used.',
          );
        }
        if (connection === 'close') {
          clearTimeout(timeout);
          reject(new Error('Baileys connection closed before delivery could be sent.'));
        }
      });
    });

    try {
      const sendResult = await socket.sendMessage(jid, {
        text: [
          input.message,
          '',
          `Event Key: ${input.eventKey}`,
          `Title: ${input.eventTitle}`,
        ].join('\n'),
      });

      return {
        providerName: 'baileys',
        providerMessageId: String(sendResult?.key?.id || '').trim() || null,
        deliveryStatus: 'delivered',
        responsePayload: {
          jid,
          event_key: input.eventKey,
          message_id: sendResult?.key?.id || null,
        },
      };
    } finally {
      try {
        socket.end(undefined);
      } catch {
        // ignore socket shutdown errors
      }
    }
  }

  private async dispatchEmailViaSmtp(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
    const config = this.getSmtpConfig();
    if (!config.host || !config.port || !config.from) {
      return null;
    }

    const transporter = this.getSmtpTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: input.targetValue,
      subject: `[Alert] ${input.eventTitle}`.slice(0, 180),
      text: [
        input.message,
        '',
        `Event Key: ${input.eventKey}`,
        `Target: ${input.targetValue}`,
        `Payload: ${JSON.stringify(input.eventPayload, null, 2)}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
          <h2 style="margin:0 0 12px;">${this.escapeHtml(input.eventTitle)}</h2>
          <p>${this.escapeHtml(input.message)}</p>
          <p><strong>Event Key:</strong> ${this.escapeHtml(input.eventKey)}</p>
          <pre style="background:#f6f8fa;padding:12px;border-radius:8px;overflow:auto;">${this.escapeHtml(
            JSON.stringify(input.eventPayload, null, 2),
          )}</pre>
        </div>
      `,
    });

    return {
      providerName: 'smtp',
      providerMessageId: info.messageId || null,
      deliveryStatus: 'delivered',
      responsePayload: {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
        message_id: info.messageId,
      },
    };
  }

  private getAlertDeliveryWebhookConfig(channelType: string) {
    const normalized = channelType.trim().toLowerCase();
    if (normalized === 'wa-group') {
      return {
        providerName: 'wa-group-webhook',
        url: process.env.ALERTING_WA_GROUP_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_GROUP_WEBHOOK_TOKEN || '',
      };
    }
    if (normalized === 'wa-personal') {
      return {
        providerName: 'wa-personal-webhook',
        url: process.env.ALERTING_WA_PERSONAL_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_PERSONAL_WEBHOOK_TOKEN || '',
      };
    }
    if (normalized === 'email') {
      return {
        providerName: 'email-webhook',
        url: process.env.ALERTING_EMAIL_WEBHOOK_URL || '',
        token: process.env.ALERTING_EMAIL_WEBHOOK_TOKEN || '',
      };
    }
    return {
      providerName: 'unknown-channel',
      url: '',
      token: '',
    };
  }

  private getBaileysConfig() {
    const authDir = (process.env.ALERTING_WA_BAILEYS_AUTH_DIR || '').trim();
    return {
      enabled:
        String(process.env.ALERTING_WA_BAILEYS_ENABLED || '')
          .trim()
          .toLowerCase() === 'true',
      authDir: authDir ? path.resolve(authDir) : '',
    };
  }

  private async getBaileysHealth() {
    const config = this.getBaileysConfig();
    const health = {
      enabled: config.enabled,
      auth_dir: config.authDir || null,
      auth_dir_exists: false,
      auth_file_count: 0,
      creds_present: false,
      session_ready: false,
      last_auth_update_at: null as string | null,
      pairing_required: false,
      status_label: 'disabled',
    };

    if (!config.enabled) {
      return health;
    }

    if (!config.authDir) {
      return {
        ...health,
        pairing_required: true,
        status_label: 'missing-auth-dir',
      };
    }

    try {
      await access(config.authDir);
      health.auth_dir_exists = true;

      const fileNames: string[] = await readdir(config.authDir).catch(() => [] as string[]);
      health.auth_file_count = fileNames.length;
      health.creds_present = fileNames.includes('creds.json');

      const stats: Array<Date | null> = await Promise.all(
        fileNames.map(async (fileName) => {
          try {
            const fileStat = await stat(path.join(config.authDir, fileName));
            return fileStat.mtime;
          } catch {
            return null;
          }
        }),
      );

      const latestMtime = stats
        .filter((fileStat) => fileStat instanceof Date)
        .sort((left, right) => right.getTime() - left.getTime())[0];

      health.last_auth_update_at = latestMtime ? latestMtime.toISOString() : null;
      health.session_ready = health.creds_present && health.auth_file_count > 0;
      health.pairing_required = !health.session_ready;
      health.status_label = health.session_ready ? 'ready' : 'pairing-required';
      return health;
    } catch {
      return {
        ...health,
        pairing_required: true,
        status_label: 'auth-dir-not-found',
      };
    }
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
    return this.alertingDeliveryService.createAlertProviderSessionAudit(input);
  }

  private mapBaileysHealthToSessionStatus(baileys: {
    enabled: boolean;
    session_ready: boolean;
    pairing_required: boolean;
    status_label: string;
  }) {
    if (!baileys.enabled) {
      return 'disabled';
    }
    if (baileys.session_ready) {
      return 'ready';
    }
    if (baileys.pairing_required || baileys.status_label === 'pairing-required') {
      return 'pairing-required';
    }
    return 'disconnected';
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
    return this.alertingDeliveryService.upsertAlertProviderSessionState(input);
  }

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
        value_json: this.asJson(row.value_json, {}),
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

  private normalizeWhatsAppJid(channelType: string, targetValue: string) {
    const normalizedTarget = targetValue.trim();
    if (!normalizedTarget) {
      throw new BadRequestException('WhatsApp target value is required.');
    }

    if (channelType === 'wa-group') {
      if (normalizedTarget.includes('@')) {
        return normalizedTarget;
      }
      if (/^\d+-\d+$/.test(normalizedTarget) || /^\d+$/.test(normalizedTarget)) {
        return `${normalizedTarget}@g.us`;
      }
      throw new BadRequestException(
        'WhatsApp group target must be a valid group JID or numeric group identifier.',
      );
    }

    if (normalizedTarget.includes('@')) {
      return normalizedTarget;
    }
    const digits = normalizedTarget.replace(/\D/g, '');
    if (!digits) {
      throw new BadRequestException(
        'WhatsApp personal target must be a phone number or WhatsApp JID.',
      );
    }
    return `${digits}@s.whatsapp.net`;
  }

  private getSmtpConfig() {
    const port = Number(process.env.ALERTING_EMAIL_SMTP_PORT || process.env.SMTP_PORT || '') || 0;
    return {
      host: (process.env.ALERTING_EMAIL_SMTP_HOST || process.env.SMTP_HOST || '').trim(),
      port,
      user: (process.env.ALERTING_EMAIL_SMTP_USER || process.env.SMTP_USER || '').trim(),
      pass: (process.env.ALERTING_EMAIL_SMTP_PASS || process.env.SMTP_PASS || '').trim(),
      secure:
        String(process.env.ALERTING_EMAIL_SMTP_SECURE || process.env.SMTP_SECURE || '')
          .trim()
          .toLowerCase() === 'true' || port === 465,
      from: (
        process.env.ALERTING_EMAIL_FROM ||
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        ''
      ).trim(),
    };
  }

  private getSmtpTransporter(config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    from: string;
  }) {
    if (this.smtpTransporter) {
      return this.smtpTransporter;
    }

    this.smtpTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user || config.pass ? { user: config.user, pass: config.pass } : undefined,
    });

    return this.smtpTransporter;
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  async trends(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'trends.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'trends',
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'trends.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'trends');
    }
  }

  async breakdown(domainInput: string, query: QueryDashboardBreakdownDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const groupBy = this.resolveAllowedGroupBy(domain, query.groupBy);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'breakdown.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        groupBy,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'breakdown',
          query: {
            ...normalizedRange,
            groupBy,
          },
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'breakdown.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'breakdown');
    }
  }

  async table(domainInput: string, query: QueryDashboardTableDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const offset = (page - 1) * pageSize;
    const sortBy = this.resolveAllowedSortBy(domain, query.sortBy);
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'table.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        limit: pageSize,
        offset,
        orderBy: sortBy,
        orderDir: sortOrder,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'table',
          query: {
            ...normalizedRange,
            page,
            pageSize,
            offset,
            sortBy,
            sortOrder: sortOrder.toLowerCase(),
          },
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'table.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'table');
    }
  }

  async breakdownStatus(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'status', 'breakdown_status.sql', query);
  }

  async breakdownRealisasi(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'realisasi', 'breakdown_realisasi.sql', query);
  }

  async breakdownSalesman(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'salesman', 'breakdown_salesman.sql', query);
  }

  async breakdownCustomer(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'customer', 'breakdown_customer.sql', query);
  }

  async breakdownM2Status(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'status', 'breakdown_status.sql', query);
  }

  async breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'cashflow', 'breakdown_cashflow.sql', query);
  }

  async breakdownM2Branch(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'branch', 'breakdown_branch.sql', query);
  }

  async topContactsM2Sm(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(j.tkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(j.tkredit, 0)), 0) AS total_payment,
        COALESCE(SUM(ABS(COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0))), 0) AS movement_amount
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
      GROUP BY kontak_key
      ORDER BY total_payment DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_top_contacts', query: normalizedRange, rows },
    };
  }

  async contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = Number(query.kontakId);
    if (!Number.isFinite(kontakId) || kontakId <= 0) {
      throw new BadRequestException('kontakId harus berupa angka positif.');
    }

    const sql = `
      SELECT
        j.tid,
        DATE(j.ttgl) AS trx_date,
        j.tcabang AS cabang,
        j.tsumber AS sumber,
        j.tnotransaksi AS no_transaksi,
        j.tkontak AS kontak_id,
        j.tmatauang AS mata_uang,
        COALESCE(j.tdebit, 0) AS debit,
        COALESCE(j.tkredit, 0) AS kredit,
        (COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0)) AS net_amount,
        j.tstatus,
        j.tstatuslunas,
        j.turaian
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
        AND j.tkontak = ${Math.trunc(kontakId)}
      ORDER BY COALESCE(j.tkredit, 0) DESC, j.ttgl DESC
      LIMIT 20;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_contact_drilldown', query: { ...normalizedRange, kontakId }, rows },
    };
  }

  async summaryM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS outstanding,
        COUNT(DISTINCT COALESCE(NULLIF(TRIM(crcabang), ''), 'UNKNOWN')) AS total_cabang,
        COUNT(DISTINCT COALESCE(NULLIF(TRIM(crsumber), ''), 'UNKNOWN')) AS total_sumber,
        COUNT(DISTINCT crkontak) AS total_kontak
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}';
    `;

    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_summary', query: normalizedRange, rows },
    };
  }

  async trendsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        DATE_FORMAT(crtgl, '%Y-%m') AS period_ym,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY DATE_FORMAT(crtgl, '%Y-%m')
      ORDER BY period_ym ASC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_trends', query: normalizedRange, rows },
    };
  }

  async breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(NULLIF(TRIM(crsumber), ''), 'UNKNOWN') AS source_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY source_key
      ORDER BY total_kas_masuk DESC, total_trx DESC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_breakdown_source', query: normalizedRange, rows },
    };
  }

  async breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        CAST(crstatusbayar AS CHAR) AS status_bayar_key,
        CASE crstatusbayar
          WHEN 0 THEN 'unpaid'
          WHEN 1 THEN 'paid'
          ELSE CONCAT('unknown_', COALESCE(CAST(crstatusbayar AS CHAR), 'null'))
        END AS status_bayar_label,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY status_bayar_key, status_bayar_label
      ORDER BY total_trx DESC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_breakdown_status_bayar', query: normalizedRange, rows },
    };
  }

  async topContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(crkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY kontak_key
      ORDER BY total_kas_masuk DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_contacts', query: normalizedRange, rows },
    };
  }

  async topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(crkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS total_outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY kontak_key
      HAVING total_outstanding > 0
      ORDER BY total_outstanding DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_outstanding_contacts', query: normalizedRange, rows },
    };
  }

  async topBranchesM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(NULLIF(TRIM(crcabang), ''), 'UNKNOWN') AS cabang,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS total_outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY cabang
      ORDER BY total_kas_masuk DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_branches', query: normalizedRange, rows },
    };
  }

  async contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = Number(query.kontakId);
    if (!Number.isFinite(kontakId) || kontakId <= 0) {
      throw new BadRequestException('kontakId harus berupa angka positif.');
    }

    const sql = `
      SELECT
        crid,
        DATE(crtgl) AS trx_date,
        crcabang AS cabang,
        crsumber AS sumber,
        crnotransaksi AS no_transaksi,
        crkontak AS kontak_id,
        crnorek AS no_rek,
        crmatauang AS mata_uang,
        COALESCE(crjumlah, 0) AS jumlah,
        COALESCE(crjumlahbayar, 0) AS jumlah_bayar,
        (COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)) AS outstanding,
        crstatus,
        crstatusbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND crkontak = ${Math.trunc(kontakId)}
      ORDER BY outstanding DESC, crtgl DESC
      LIMIT 20;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_contact_drilldown', query: { ...normalizedRange, kontakId }, rows },
    };
  }

  async tableM2Cr(query: QueryDashboardTableDto) {
    const normalizedRange = this.normalizeRange(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const allowedSortColumns = new Set([
      'crtgl',
      'crid',
      'crjumlah',
      'crjumlahbayar',
      'outstanding',
      'crstatus',
      'crstatusbayar',
    ]);
    const sortBy =
      query.sortBy && allowedSortColumns.has(query.sortBy) ? query.sortBy : 'outstanding';
    const orderByExpression =
      sortBy === 'outstanding' ? '(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0))' : sortBy;

    const sql = `
      SELECT
        crid,
        DATE(crtgl) AS trx_date,
        crcabang AS cabang,
        crsumber AS sumber,
        crnotransaksi AS no_transaksi,
        crkontak AS kontak_id,
        crnorek AS no_rek,
        crmatauang AS mata_uang,
        COALESCE(crjumlah, 0) AS jumlah,
        COALESCE(crjumlahbayar, 0) AS jumlah_bayar,
        (COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)) AS outstanding,
        crstatus,
        crstatusbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      ORDER BY ${orderByExpression} ${sortOrder}
      LIMIT ${pageSize} OFFSET ${offset};
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: {
        type: 'm2_cr_table',
        query: {
          ...normalizedRange,
          page,
          pageSize,
          offset,
          sortBy,
          sortOrder: sortOrder.toLowerCase(),
        },
        rows,
      },
    };
  }

  async insightM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const [summaryRows, trendRows, statusRows, topRows] = await Promise.all([
      this.summaryM2Cr(query),
      this.trendsM2Cr(query),
      this.breakdownStatusBayarM2Cr(query),
      this.topContactsM2Cr(query),
    ]);

    const summary = (summaryRows.data.rows[0] ?? {}) as Record<string, unknown>;
    const trends = trendRows.data.rows as Array<Record<string, unknown>>;
    const statuses = statusRows.data.rows as Array<Record<string, unknown>>;
    const tops = topRows.data.rows as Array<Record<string, unknown>>;

    const totalKasMasuk = this.toNumber(summary.total_kas_masuk);
    const totalTerbayar = this.toNumber(summary.total_terbayar);
    const outstanding = this.toNumber(summary.outstanding);
    const totalTrx = this.toNumber(summary.total_trx);
    const outstandingPct = totalKasMasuk > 0 ? (outstanding / totalKasMasuk) * 100 : 0;

    const sortedTrend = [...trends].sort((a, b) =>
      String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')),
    );
    const latest = sortedTrend[sortedTrend.length - 1];
    const prev = sortedTrend[sortedTrend.length - 2];
    const latestKasMasuk = this.toNumber(latest?.total_kas_masuk);
    const prevKasMasuk = this.toNumber(prev?.total_kas_masuk);
    const deltaPct = prevKasMasuk > 0 ? ((latestKasMasuk - prevKasMasuk) / prevKasMasuk) * 100 : 0;

    const topContact = tops[0];
    const topContactKey = String(topContact?.kontak_key ?? 'N/A');
    const topContactValue = this.toNumber(topContact?.total_kas_masuk);

    const paidStatus = statuses.find((row) => String(row.status_bayar_label) === 'paid');
    const unpaidStatus = statuses.find((row) => String(row.status_bayar_label) === 'unpaid');
    const paidPct = totalTrx > 0 ? (this.toNumber(paidStatus?.total_trx) / totalTrx) * 100 : 0;

    const insights = [
      {
        text: `Periode ${normalizedRange.fromDate} s/d ${normalizedRange.toDate} mencatat ${this.formatNumber(totalTrx)} transaksi kas masuk.`,
        confidence: 0.99,
      },
      {
        text: `Total kas masuk ${this.formatMoneyCompact(totalKasMasuk)} dengan total terbayar ${this.formatMoneyCompact(totalTerbayar)}.`,
        confidence: 0.95,
      },
      {
        text: `Outstanding saat ini ${this.formatMoneyCompact(outstanding)} (${this.formatPercent(outstandingPct)} dari total kas masuk).`,
        confidence: 0.9,
      },
      {
        text: `Periode terbaru menunjukkan ${deltaPct >= 0 ? 'kenaikan' : 'penurunan'} kas masuk ${this.formatPercent(Math.abs(deltaPct))} dibanding periode sebelumnya.`,
        confidence: prev ? 0.86 : 0.68,
      },
      {
        text: `Kontak dengan kontribusi terbesar: ${topContactKey} (${this.formatMoneyCompact(topContactValue)}).`,
        confidence: topContact ? 0.82 : 0.55,
      },
    ];

    const anomalies: string[] = [];
    if (outstandingPct > 30) {
      anomalies.push(`Outstanding melebihi ambang 30% (${this.formatPercent(outstandingPct)}).`);
    }
    if (prev && Math.abs(deltaPct) > 40) {
      anomalies.push(
        `Perubahan kas masuk periode terbaru cukup ekstrem (${this.formatPercent(Math.abs(deltaPct))}).`,
      );
    }
    if (!unpaidStatus && totalTrx > 0 && paidPct < 100) {
      anomalies.push('Status bayar tidak konsisten terhadap total transaksi.');
    }

    const recommendations = [
      'Prioritaskan follow-up kontak dengan nominal outstanding terbesar.',
      'Validasi transaksi bernilai tinggi pada periode dengan perubahan ekstrem.',
      'Pantau rasio paid vs unpaid mingguan untuk menjaga kualitas cash conversion.',
    ];

    return {
      success: true,
      data: {
        type: 'm2_cr_insight',
        query: normalizedRange,
        model: { provider: 'rule-based', version: 'm2-cr-insight-v1' },
        insights,
        anomalies,
        recommendations,
      },
    };
  }

  async insightM2(query: QueryDashboardRangeDto & { feature?: string }, actorId?: string | number) {
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(query);
    const feature = query.feature ?? 'm2_aj';

    try {
      const payload = await this.buildM2InsightPayload(normalizedRange, feature);
      await this.saveInsightHistory({
        actorId,
        domain,
        feature,
        action: 'AUTO_SUMMARY',
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        question: null,
        response: payload,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'insight',
          query: normalizedRange,
          model: {
            provider: 'rule-based',
            version: 'm2-insight-v2',
          },
          ...payload,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight');
    }
  }

  async askInsightM2(
    dto: { question: string; fromDate?: string; toDate?: string; feature?: string },
    actorId?: string | number,
  ) {
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(dto);
    const feature = dto.feature ?? 'm2_aj';
    const question = dto.question.trim();
    if (!question) {
      throw new BadRequestException('Question is required');
    }

    try {
      const payload = await this.buildM2InsightPayload(normalizedRange, feature);
      const q = question.toLowerCase();
      let answer = payload.insights[0]?.text ?? 'Insight tidak tersedia.';
      let confidence = 0.64;

      if (q.includes('net') || q.includes('cashflow')) {
        answer = payload.insights[2]?.text ?? payload.insights[3]?.text ?? answer;
        confidence = 0.88;
      } else if (q.includes('debit') || q.includes('kredit')) {
        answer = payload.insights[1]?.text ?? answer;
        confidence = 0.86;
      } else if (q.includes('cabang') || q.includes('branch')) {
        answer = payload.insights[4]?.text ?? answer;
        confidence = 0.8;
      } else if (q.includes('anomali') || q.includes('outlier')) {
        answer =
          payload.anomalies[0] ??
          'Belum terdeteksi anomali signifikan pada periode ini berdasarkan rule current.';
        confidence = payload.anomalies.length > 0 ? 0.78 : 0.62;
      }

      const askPayload = {
        question,
        answer,
        confidence,
        recommendations: payload.recommendations,
        anomalies: payload.anomalies,
      };

      await this.saveInsightHistory({
        actorId,
        domain,
        feature,
        action: 'ASK',
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        question,
        response: askPayload,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'ask',
          query: normalizedRange,
          model: {
            provider: 'rule-based',
            version: 'm2-insight-v2',
          },
          ...askPayload,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight_ask');
    }
  }

  async insightHistoryM2(
    query: QueryDashboardRangeDto & { feature?: string; page?: number; pageSize?: number },
    actorId?: string | number,
  ) {
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const feature = query.feature ?? 'm2_aj';
    const userId = this.toAuditUserId(actorId);

    try {
      await this.ensureInsightHistoryTable();
      const rows = (await this.prisma.$queryRaw`
        SELECT
          id,
          domain,
          feature,
          action,
          user_id AS "userId",
          from_date AS "fromDate",
          to_date AS "toDate",
          question,
          response_json AS "response",
          confidence_avg AS "confidenceAvg",
          created_at AS "createdAt"
        FROM m0_dashboard_insight_history
        WHERE domain = ${domain}
          AND feature = ${feature}
          AND from_date >= ${normalizedRange.fromDate}::date
          AND to_date <= ${normalizedRange.toDate}::date
          AND (${userId}::int IS NULL OR user_id = ${userId}::int)
        ORDER BY created_at DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
      `) as Array<Record<string, unknown>>;

      return {
        success: true,
        data: {
          domain,
          type: 'insight_history',
          query: { ...normalizedRange, feature, page, pageSize, offset },
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight_history');
    }
  }

  listDomains() {
    return {
      success: true,
      data: this.supportedDomains.map((domain) => ({
        domain,
        allowedGroupBy: DOMAIN_FIELD_ALLOWLIST[domain].groupBy,
        allowedSortBy: DOMAIN_FIELD_ALLOWLIST[domain].sortBy,
        specPath: `dashboard-mapping/output/specs`,
        sqlTemplateDir: this.dashboardMysqlService.getTemplatePath(domain, ''),
      })),
    };
  }

  async health() {
    const health = await this.dashboardMysqlService.healthCheck(this.supportedDomains);
    return {
      success: true,
      data: health,
    };
  }

  async managerKpis() {
    const [
      decisionLatencyRow,
      acceptedRow,
      criticalRiskOpen,
      criticalRiskOpenYesterday,
      freshnessSummary,
      freshnessDomainRows,
    ] = await Promise.all([
      this.prisma.$queryRaw<Array<{ avg_minutes: number | null }>>`
        SELECT ROUND(AVG(EXTRACT(EPOCH FROM ("decision_at" - "insight_created_at")) / 60.0)::numeric, 1) AS avg_minutes
        FROM "m0_manager_insight"
        WHERE "decision_at" IS NOT NULL
          AND "insight_created_at" >= date_trunc('day', now())
          AND "insight_created_at" < date_trunc('day', now()) + interval '1 day'
      `,
      this.prisma.$queryRaw<
        Array<{
          accepted_count: bigint;
          total_count: bigint;
          accepted_pct: number | null;
          previous_pct: number | null;
        }>
      >`
        WITH current_window AS (
          SELECT
            SUM(CASE WHEN "status" = 'accepted' THEN 1 ELSE 0 END) AS accepted_count,
            COUNT(*) AS total_count
          FROM "m0_manager_insight"
          WHERE "insight_created_at" >= now() - interval '7 day'
        ),
        previous_window AS (
          SELECT
            ROUND(
              100.0 * SUM(CASE WHEN "status" = 'accepted' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
              1
            ) AS accepted_pct
          FROM "m0_manager_insight"
          WHERE "insight_created_at" >= now() - interval '14 day'
            AND "insight_created_at" < now() - interval '7 day'
        )
        SELECT
          current_window.accepted_count,
          current_window.total_count,
          ROUND(100.0 * current_window.accepted_count / NULLIF(current_window.total_count, 0), 1) AS accepted_pct,
          previous_window.accepted_pct AS previous_pct
        FROM current_window
        CROSS JOIN previous_window
      `,
      this.prisma.managerRisk.count({
        where: {
          severity: 'critical',
          status: { in: ['open', 'in_progress'] },
        },
      }),
      this.prisma.managerRisk.count({
        where: {
          severity: 'critical',
          status: { in: ['open', 'in_progress'] },
          openedAt: { lt: new Date(new Date().toISOString().slice(0, 10)) },
          OR: [
            { resolvedAt: null },
            { resolvedAt: { gte: new Date(new Date().toISOString().slice(0, 10)) } },
          ],
        },
      }),
      this.prisma.$queryRaw<
        Array<{ compliant_count: bigint; total_count: bigint; compliance_pct: number | null }>
      >`
        SELECT
          SUM(
            CASE
              WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
              ELSE 0
            END
          ) AS compliant_count,
          COUNT(*) AS total_count,
          ROUND(
            100.0 * SUM(
              CASE
                WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
                ELSE 0
              END
            ) / NULLIF(COUNT(*), 0),
            1
          ) AS compliance_pct
        FROM "m0_manager_data_freshness"
      `,
      this.prisma.$queryRaw<
        Array<{
          domain: string;
          dataset_count: bigint;
          compliant_count: bigint;
          compliance_pct: number | null;
        }>
      >`
        SELECT
          "domain",
          COUNT(*) AS dataset_count,
          SUM(
            CASE
              WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
              ELSE 0
            END
          ) AS compliant_count,
          ROUND(
            100.0 * SUM(
              CASE
                WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
                ELSE 0
              END
            ) / NULLIF(COUNT(*), 0),
            1
          ) AS compliance_pct
        FROM "m0_manager_data_freshness"
        GROUP BY "domain"
        ORDER BY "domain" ASC
      `,
    ]);

    const avgMinutes = this.toNumber(decisionLatencyRow[0]?.avg_minutes);
    const accepted = acceptedRow[0];
    const acceptedPct = this.toNumber(accepted?.accepted_pct);
    const previousAcceptedPct = this.toNumber(accepted?.previous_pct);
    const freshness = freshnessSummary[0];
    const freshnessPct = this.toNumber(freshness?.compliance_pct);
    const previousRiskOpen = criticalRiskOpenYesterday;

    return {
      success: true,
      data: {
        cards: [
          {
            title: 'Decision Latency',
            subtitle: 'Hari ini',
            value: avgMinutes,
            unit: 'minutes',
            formattedValue: `${this.formatNumber(avgMinutes)} menit`,
            formula: 'AVG(decision_at - insight_created_at)',
          },
          {
            title: 'AI Insight Accepted',
            subtitle: '7 hari',
            value: acceptedPct,
            unit: 'percent',
            formattedValue: this.formatPercent(acceptedPct),
            numerator: this.toNumber(accepted?.accepted_count),
            denominator: this.toNumber(accepted?.total_count),
            delta: Number((acceptedPct - previousAcceptedPct).toFixed(1)),
            deltaLabel: 'vs 7 hari sebelumnya',
            formula: 'accepted_insights / total_insights * 100',
          },
          {
            title: 'Critical Risk Open',
            subtitle: 'Live',
            value: criticalRiskOpen,
            unit: 'count',
            formattedValue: this.formatNumber(criticalRiskOpen),
            delta: criticalRiskOpen - previousRiskOpen,
            deltaLabel: 'vs awal hari',
            formula: 'COUNT(risk WHERE severity=critical AND status IN open,in_progress)',
          },
          {
            title: 'Data Freshness SLA',
            subtitle: 'Lintas domain',
            value: freshnessPct,
            unit: 'percent',
            formattedValue: this.formatPercent(freshnessPct),
            numerator: this.toNumber(freshness?.compliant_count),
            denominator: this.toNumber(freshness?.total_count),
            formula: 'datasets_within_sla / total_datasets * 100',
          },
        ],
        breakdown: {
          dataFreshnessByDomain: freshnessDomainRows.map((row) => ({
            domain: row.domain,
            datasetCount: this.toNumber(row.dataset_count),
            compliantCount: this.toNumber(row.compliant_count),
            compliancePct: this.toNumber(row.compliance_pct),
          })),
        },
      },
    };
  }

  async metadata(domainInput: string) {
    const domain = this.assertDomain(domainInput);
    const metadata = await this.dashboardMysqlService.getDomainMetadata(domain);

    const tableColumns = new Map<string, Set<string>>();
    for (const tableInfo of metadata.columnsByTable) {
      tableColumns.set(tableInfo.tableName, new Set(tableInfo.columns));
    }

    const breakdownTable = metadata.sourceTables.breakdown;
    const tableTable = metadata.sourceTables.table;
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain];

    const allowedGroupByExisting = this.filterExistingColumns(
      allowed.groupBy,
      breakdownTable ? tableColumns.get(breakdownTable) : undefined,
    );
    const allowedSortByExisting = this.filterExistingColumns(
      allowed.sortBy,
      tableTable ? tableColumns.get(tableTable) : undefined,
    );

    return {
      success: true,
      data: {
        domain,
        templates: metadata.templates,
        sourceTables: metadata.sourceTables,
        columnsByTable: metadata.columnsByTable,
        allowlist: {
          groupBy: [...allowed.groupBy],
          sortBy: [...allowed.sortBy],
        },
        effective: {
          groupBy: allowedGroupByExisting,
          sortBy: allowedSortByExisting,
        },
      },
    };
  }

  private assertDomain(domain: string): SupportedDomain {
    if ((this.supportedDomains as readonly string[]).includes(domain)) {
      return domain as SupportedDomain;
    }

    throw new BadRequestException(
      `Unsupported domain '${domain}'. Allowed domains: ${this.supportedDomains.join(', ')}`,
    );
  }

  private normalizeRange(query: QueryDashboardRangeDto): { fromDate: string; toDate: string } {
    const now = new Date();
    const toDate = query.toDate ?? now.toISOString().slice(0, 10);

    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    const fromDate = query.fromDate ?? defaultFrom.toISOString().slice(0, 10);

    if (fromDate > toDate) {
      throw new BadRequestException('fromDate must be less than or equal to toDate');
    }

    return { fromDate, toDate };
  }

  private resolveAllowedGroupBy(domain: SupportedDomain, input?: string): string {
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain].groupBy;
    if (!input) {
      return allowed[0];
    }
    if (!allowed.includes(input)) {
      throw new BadRequestException(
        `groupBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
      );
    }
    return input;
  }

  private resolveAllowedSortBy(domain: SupportedDomain, input?: string): string {
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain].sortBy;
    if (!input) {
      return allowed[0];
    }
    if (!allowed.includes(input)) {
      throw new BadRequestException(
        `sortBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
      );
    }
    return input;
  }

  private resolveM2SourceCode(domain: SupportedDomain, feature?: string): string | null {
    if (domain !== 'm2' || !feature) {
      return null;
    }

    const featureToSource: Record<string, string> = {
      m2_aj: 'AJ',
      m2_bd: 'BD',
      m2_cb: 'CB',
      m2_cr: 'CR',
      m2_cd: 'CD',
      m2_gj: 'GJ',
      m2_jm: 'JM',
      m2_rg: 'RG',
      m2_rgc: 'RGC',
      m2_rm: 'RM',
      m2_sg: 'SG',
      m2_sgc: 'SGC',
      m2_sm: 'SM',
      m2_template: 'TJ',
    };

    const normalized = feature.trim().toLowerCase();
    return featureToSource[normalized] ?? null;
  }

  private wrapExecutionError(error: unknown, domain: string, endpoint: string): Error {
    if (error instanceof BadRequestException) {
      return error;
    }

    if (error instanceof InternalServerErrorException) {
      return error;
    }

    const reason = error instanceof Error ? error.message : 'unknown error';
    return new InternalServerErrorException(
      `Dashboard query failed (${domain}/${endpoint}): ${reason}`,
    );
  }

  private async executePresetBreakdown(
    domain: SupportedDomain,
    type: 'status' | 'realisasi' | 'salesman' | 'customer' | 'cashflow' | 'branch',
    fileName: string,
    query: QueryDashboardRangeDto,
  ) {
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, fileName, {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: `breakdown_${type}`,
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, fileName),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, `breakdown_${type}`);
    }
  }

  private async buildM2InsightPayload(
    normalizedRange: { fromDate: string; toDate: string },
    feature?: string,
  ) {
    const domain: SupportedDomain = 'm2';
    const sourceCode = this.resolveM2SourceCode(domain, feature);
    const [summaryRows, trendRows, cashflowRows, statusRows, branchRows] = await Promise.all([
      this.dashboardMysqlService.executeTemplate(domain, 'summary.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'trends.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_cashflow.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_status.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_branch.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
    ]);

    const summary = (summaryRows[0] ?? {}) as Record<string, unknown>;
    const trend = trendRows as Array<Record<string, unknown>>;
    const cashflow = cashflowRows as Array<Record<string, unknown>>;
    const status = statusRows as Array<Record<string, unknown>>;
    const branch = branchRows as Array<Record<string, unknown>>;

    const sortedTrend = [...trend].sort((a, b) =>
      String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')),
    );
    const latestTrend = sortedTrend[sortedTrend.length - 1];
    const prevTrend = sortedTrend[sortedTrend.length - 2];

    const latestNet = this.toNumber(latestTrend?.net_cashflow);
    const prevNet = this.toNumber(prevTrend?.net_cashflow);
    const netDelta = latestNet - prevNet;
    const netDeltaPct = prevNet === 0 ? 0 : (netDelta / Math.abs(prevNet)) * 100;

    const cashIn = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_in), 0);
    const cashOut = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_out), 0);

    const anomalies: string[] = [];
    const netAbs = sortedTrend.map((row) => Math.abs(this.toNumber(row.net_cashflow)));
    const netAvgAbs =
      netAbs.length === 0 ? 0 : netAbs.reduce((acc, value) => acc + value, 0) / netAbs.length;
    if (netAvgAbs > 0) {
      const outliers = sortedTrend
        .filter((row) => Math.abs(this.toNumber(row.net_cashflow)) > netAvgAbs * 2.5)
        .map((row) => String(row.period_ym ?? 'unknown'));
      if (outliers.length > 0) {
        anomalies.push(`Outlier net cashflow terdeteksi pada periode: ${outliers.join(', ')}`);
      }
    }

    const unknownStatusCount = status.filter((row) =>
      String(row.status_label ?? '').startsWith('unknown_'),
    ).length;
    if (unknownStatusCount > 0) {
      anomalies.push(
        `Terdapat ${unknownStatusCount} kategori status belum terpetakan (unknown_*).`,
      );
    }

    const topBranch = branch[0];
    const topBranchName = String(topBranch?.cabang ?? 'N/A');
    const topBranchMovement = this.toNumber(topBranch?.movement_amount);

    const insightItems = [
      {
        text: `Periode analisis ${normalizedRange.fromDate} s/d ${normalizedRange.toDate}.`,
        confidence: 0.99,
      },
      {
        text: `Total debit ${this.formatMoneyCompact(this.toNumber(summary.total_debit))} dan total kredit ${this.formatMoneyCompact(this.toNumber(summary.total_kredit))}.`,
        confidence: 0.96,
      },
      {
        text: `Net cashflow periode terbaru ${this.formatMoneyCompact(latestNet)} (${netDelta >= 0 ? 'naik' : 'turun'} ${this.formatPercent(Math.abs(netDeltaPct))} dibanding periode sebelumnya).`,
        confidence: prevTrend ? 0.9 : 0.72,
      },
      {
        text: `Arus kas agregat: cash in ${this.formatMoneyCompact(cashIn)} vs cash out ${this.formatMoneyCompact(cashOut)}.`,
        confidence: 0.92,
      },
      {
        text: `Cabang dengan movement terbesar: ${topBranchName} (${this.formatMoneyCompact(topBranchMovement)}).`,
        confidence: topBranchName === 'N/A' ? 0.55 : 0.84,
      },
    ];

    const recommendations: string[] = [];
    if (latestNet < 0) {
      recommendations.push(
        'Prioritaskan review komponen cash out terbesar per sumber transaksi dan cabang.',
      );
    } else {
      recommendations.push(
        'Pertahankan tren positif dengan monitoring periodik pada sumber transaksi berkontribusi tinggi.',
      );
    }
    recommendations.push(
      'Lakukan validasi mapping status unknown_* agar analisis operasional lebih presisi.',
    );
    recommendations.push(
      'Gunakan drill-down detail transaksi untuk 10 transaksi nominal terbesar pada periode outlier.',
    );

    return {
      summary: {
        totalRows: this.toNumber(summary.total_journal_rows),
        totalDebit: this.toNumber(summary.total_debit),
        totalKredit: this.toNumber(summary.total_kredit),
        netCashflow: this.toNumber(summary.net_cashflow),
      },
      insightItems,
      insights: insightItems.map((item) => ({ text: item.text, confidence: item.confidence })),
      anomalies,
      recommendations,
      confidenceAvg:
        insightItems.length > 0
          ? insightItems.reduce((acc, item) => acc + item.confidence, 0) / insightItems.length
          : 0,
    };
  }

  private async ensureInsightHistoryTable(): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS m0_dashboard_insight_history (
        id SERIAL PRIMARY KEY,
        domain TEXT NOT NULL,
        feature TEXT NOT NULL,
        action TEXT NOT NULL,
        user_id INTEGER NULL REFERENCES m0_users(id) ON DELETE SET NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        question TEXT NULL,
        response_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        confidence_avg DOUBLE PRECISION NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await this.prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_lookup ON m0_dashboard_insight_history(domain, feature, created_at DESC);`,
    );
    await this.prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_user ON m0_dashboard_insight_history(user_id, created_at DESC);`,
    );
  }

  private async saveInsightHistory(params: {
    actorId?: string | number;
    domain: string;
    feature: string;
    action: string;
    fromDate: string;
    toDate: string;
    question: string | null;
    response: unknown;
  }) {
    await this.ensureInsightHistoryTable();
    const userId = this.toAuditUserId(params.actorId);
    const responseJson = JSON.stringify(params.response ?? {});
    const confidenceAvg = this.extractConfidenceAverage(params.response);

    await this.prisma.$executeRaw`
      INSERT INTO m0_dashboard_insight_history
      (domain, feature, action, user_id, from_date, to_date, question, response_json, confidence_avg)
      VALUES
      (${params.domain}, ${params.feature}, ${params.action}, ${userId}, ${params.fromDate}::date, ${params.toDate}::date, ${params.question}, ${responseJson}::jsonb, ${confidenceAvg})
    `;
  }

  private extractConfidenceAverage(response: unknown): number | null {
    if (!response || typeof response !== 'object') {
      return null;
    }
    const items = (response as { insightItems?: Array<{ confidence?: number }> }).insightItems;
    if (!Array.isArray(items) || items.length === 0) {
      const direct = (response as { confidence?: number }).confidence;
      return typeof direct === 'number' ? direct : null;
    }
    const nums = items
      .map((item) => (typeof item?.confidence === 'number' ? item.confidence : null))
      .filter((value): value is number => value !== null);
    if (nums.length === 0) {
      return null;
    }
    return nums.reduce((acc, value) => acc + value, 0) / nums.length;
  }

  private filterExistingColumns(candidates: readonly string[], columns?: Set<string>): string[] {
    if (!columns || columns.size === 0) {
      return [...candidates];
    }
    return candidates.filter((candidate) => columns.has(candidate));
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private formatNumber(value: number): string {
    return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  }

  private formatMoneyCompact(value: number): string {
    return `Rp ${value.toLocaleString('id-ID', {
      notation: 'compact',
      maximumFractionDigits: 2,
    })}`;
  }

  private formatPercent(value: number): string {
    return `${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
  }

  private toAuditUserId(actorId?: string | number): number | null {
    if (typeof actorId === 'number' && Number.isInteger(actorId) && actorId > 0) {
      return actorId;
    }
    const parsed = Number(String(actorId ?? '').trim());
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
    return null;
  }
}
