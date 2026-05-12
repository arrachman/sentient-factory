import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { access, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingRuleService } from './alerting-rule.service';
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
export class DashboardService implements OnModuleInit, OnModuleDestroy {
  private readonly supportedDomains: readonly SupportedDomain[] = SUPPORTED_DOMAINS;
  private readonly logger = new Logger(DashboardService.name);
  private readonly alertSchedulerIntervalMs = Math.max(
    Number(process.env.ALERTING_SCHEDULER_INTERVAL_MS || '60000') || 60000,
    15000,
  );
  private readonly alertDeliveryIntervalMs = Math.max(
    Number(process.env.ALERTING_DELIVERY_INTERVAL_MS || '30000') || 30000,
    10000,
  );
  private readonly alertTriageEscalationIntervalMs = Math.max(
    Number(process.env.ALERTING_TRIAGE_ESCALATION_INTERVAL_MS || '60000') || 60000,
    15000,
  );
  private alertSchedulerTimer: NodeJS.Timeout | null = null;
  private alertSchedulerRunning = false;
  private alertDeliveryTimer: NodeJS.Timeout | null = null;
  private alertDeliveryRunning = false;
  private alertTriageEscalationTimer: NodeJS.Timeout | null = null;
  private alertTriageEscalationRunning = false;
  private smtpTransporter: Transporter | null = null;

  constructor(
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
  ) {}

  onModuleInit() {
    this.startAlertingScheduler();
    this.startAlertDeliveryWorker();
    this.startAlertTriageEscalationWorker();
  }

  onModuleDestroy() {
    if (this.alertSchedulerTimer) {
      clearInterval(this.alertSchedulerTimer);
      this.alertSchedulerTimer = null;
    }
    if (this.alertDeliveryTimer) {
      clearInterval(this.alertDeliveryTimer);
      this.alertDeliveryTimer = null;
    }
    if (this.alertTriageEscalationTimer) {
      clearInterval(this.alertTriageEscalationTimer);
      this.alertTriageEscalationTimer = null;
    }
  }

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
    if (this.alertSchedulerRunning) {
      return { success: true, data: { processed_rule_count: 0, skipped: true } };
    }

    this.alertSchedulerRunning = true;
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          rule_id,
          rule_name,
          schedule_value,
          last_run_at
        FROM public.alert_rule
        WHERE deleted_at IS NULL
          AND is_active = TRUE
          AND status = 'active'
        ORDER BY rule_id ASC
      `);

      const now = Date.now();
      const dueRules = rows.filter((row) => {
        const intervalMs = this.parseAlertScheduleToMs(String(row.schedule_value || '').trim());
        const lastRunAt = row.last_run_at ? new Date(String(row.last_run_at)).getTime() : 0;
        if (!intervalMs) return false;
        if (!lastRunAt) return true;
        return now - lastRunAt >= intervalMs;
      });

      const results: Array<Record<string, unknown>> = [];
      for (const rule of dueRules) {
        try {
          const result = await this.runAlertingRule(String(rule.rule_id), actor);
          results.push({
            rule_id: Number(rule.rule_id || 0),
            rule_name: String(rule.rule_name || ''),
            success: true,
            matched_snapshot_id: result?.data?.matched_snapshot_id ?? null,
            event_id:
              result?.data?.event && typeof result.data.event === 'object'
                ? Number((result.data.event as Record<string, unknown>).event_id || 0) || null
                : null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown scheduler error.';
          this.logger.error(`Alert scheduler failed for rule ${String(rule.rule_id)}: ${message}`);
          results.push({
            rule_id: Number(rule.rule_id || 0),
            rule_name: String(rule.rule_name || ''),
            success: false,
            error_message: message,
          });
        }
      }

      return {
        success: true,
        data: {
          processed_rule_count: results.length,
          skipped: false,
          results,
        },
      };
    } finally {
      this.alertSchedulerRunning = false;
    }
  }

  async runAlertDeliveryCycle(actor = 'system-delivery') {
    if (this.alertDeliveryRunning) {
      return { success: true, data: { processed_delivery_count: 0, skipped: true, results: [] } };
    }

    this.alertDeliveryRunning = true;
    try {
      const triageRecoveryConfig = await this.getAlertingTriageRecoveryConfig();
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
              await this.createAlertDeadLetterTriageAudit({
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

  private async createAlertDeadLetterTriageAudit(input: {
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
        '${this.escapeSqlLiteral(input.actionType)}',
        ${input.previousTriageStatus ? `'${this.escapeSqlLiteral(input.previousTriageStatus)}'` : 'NULL'},
        ${input.nextTriageStatus ? `'${this.escapeSqlLiteral(input.nextTriageStatus)}'` : 'NULL'},
        ${input.previousAcknowledgedAt ? `'${this.escapeSqlLiteral(input.previousAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.nextAcknowledgedAt ? `'${this.escapeSqlLiteral(input.nextAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.previousAssignedTo ? `'${this.escapeSqlLiteral(input.previousAssignedTo)}'` : 'NULL'},
        ${input.nextAssignedTo ? `'${this.escapeSqlLiteral(input.nextAssignedTo)}'` : 'NULL'},
        ${input.noteSnapshot ? `'${this.escapeSqlLiteral(input.noteSnapshot)}'` : 'NULL'},
        '${this.escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        '${this.escapeSqlLiteral(input.actor)}'
      )
    `);
  }

  async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
    if (this.alertTriageEscalationRunning) {
      return {
        success: true,
        data: { processed_item_count: 0, escalated_count: 0, skipped: true, results: [] },
      };
    }

    this.alertTriageEscalationRunning = true;
    try {
      const [triagePayload, escalationConfig] = await Promise.all([
        this.alertingDeadLetterTriage(),
        this.getAlertingTriageEscalationConfig(),
      ]);

      const items = Array.isArray(triagePayload.data)
        ? (triagePayload.data as Array<Record<string, unknown>>)
        : [];

      const escalationRule = await this.ensureAlertingTriageEscalationRule(actor);
      const nowMs = Date.now();
      const cooldownMs = escalationConfig.cooldown_minutes * 60000;
      const results: Array<Record<string, unknown>> = [];

      for (const item of items) {
        const triageStatus = String(item.triage_status || '');
        const slaStatus = String(item.sla_status || '');
        if (item.acknowledged_at) {
          results.push({
            delivery_id: Number(item.delivery_id || 0),
            escalated: false,
            reason: 'acknowledged-by-operator',
            escalation_level: String(item.escalation_level || 'none'),
          });
          continue;
        }

        if (triageStatus === 'resolved' || !['overdue', 'critical'].includes(slaStatus)) {
          continue;
        }

        const escalationLevel = slaStatus === 'critical' ? 'critical' : 'warning';
        const lastEscalatedAt = item.last_escalated_at
          ? new Date(String(item.last_escalated_at)).getTime()
          : 0;
        const lastEscalationLevel = String(item.last_escalation_level || '');
        const cooldownElapsed = !lastEscalatedAt || nowMs - lastEscalatedAt >= cooldownMs;
        const severityChanged = lastEscalationLevel !== escalationLevel;
        if (!cooldownElapsed && !severityChanged) {
          results.push({
            delivery_id: Number(item.delivery_id || 0),
            escalated: false,
            reason: 'cooldown-active',
            escalation_level: escalationLevel,
          });
          continue;
        }

        const deliveryId = Number(item.delivery_id || 0);
        const eventKey = `evt-triage-escalation-${deliveryId}-${Date.now()}`;
        const severity = escalationLevel === 'critical' ? 'critical' : 'high';
        const title = `[${escalationLevel.toUpperCase()}] Dead-letter triage requires action`;
        const description = [
          item.event_title ? `Event: ${String(item.event_title)}` : null,
          item.rule_name ? `Rule: ${String(item.rule_name)}` : null,
          `Delivery #${deliveryId}`,
          item.assigned_to ? `Assignee: ${String(item.assigned_to)}` : 'Assignee: unassigned',
          `Channel: ${String(item.channel_type || '-')}`,
          `Target: ${String(item.target_value || '-')}`,
          `SLA status: ${slaStatus}`,
          `Age: ${Number(item.age_minutes || 0)} minutes`,
          item.dead_letter_reason ? `Reason: ${String(item.dead_letter_reason)}` : null,
        ]
          .filter(Boolean)
          .join(' | ');

        const escalationTargetResult = await this.resolveAlertingTriageEscalationTargets(
          escalationConfig.channel_key,
          item.module_key ? String(item.module_key) : null,
          escalationLevel,
          item.assigned_to ? String(item.assigned_to) : null,
          Number(item.escalation_count || 0),
          severityChanged,
        );
        const targets = escalationTargetResult.targets;

        if (!targets.length) {
          results.push({
            delivery_id: deliveryId,
            escalated: false,
            reason:
              escalationTargetResult.stage_priority === null
                ? 'no-target-channel'
                : 'stage-target-not-found',
            escalation_level: escalationLevel,
            escalation_stage_index: escalationTargetResult.stage_index,
            escalation_stage_priority: escalationTargetResult.stage_priority,
            repeating_final_stage: escalationTargetResult.repeating_final_stage,
          });
          continue;
        }

        const insertedEvents = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
          INSERT INTO public.alert_event (
            event_key,
            rule_id,
            metric_id,
            snapshot_id,
            title,
            description,
            severity,
            status,
            source_ref,
            event_payload,
            detected_at,
            created_by,
            updated_by
          ) VALUES (
            '${this.escapeSqlLiteral(eventKey)}',
            ${escalationRule.rule_id},
            NULL,
            NULL,
            '${this.escapeSqlLiteral(title)}',
            '${this.escapeSqlLiteral(description)}',
            '${this.escapeSqlLiteral(severity)}',
            'open',
            'dead-letter-triage',
            '${this.escapeSqlLiteral(
              JSON.stringify({
                triage_delivery_id: deliveryId,
                triage_status: triageStatus,
                escalation_level: escalationLevel,
                source_event_id: Number(item.event_id || 0),
                source_event_key: item.event_key || null,
              }),
            )}'::jsonb,
            NOW(),
            '${this.escapeSqlLiteral(actor)}',
            '${this.escapeSqlLiteral(actor)}'
          )
          RETURNING event_id
        `);

        const escalationEventId = Number(insertedEvents[0]?.event_id || 0);
        const insertedDeliveries: number[] = [];
        for (const target of targets) {
          const deliveryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
            INSERT INTO public.alert_delivery_log (
              event_id,
              rule_id,
              recipient_id,
              channel_type,
              target_value,
              provider_name,
              delivery_status,
              response_payload,
              requested_at,
              delivered_at
            ) VALUES (
              ${escalationEventId},
              ${escalationRule.rule_id},
              NULL,
              '${this.escapeSqlLiteral(String(target.channel_type || ''))}',
              '${this.escapeSqlLiteral(String(target.target_value || ''))}',
              'triage-escalation',
              'queued',
              '${this.escapeSqlLiteral(
                JSON.stringify({
                  trigger: 'triage-escalation',
                  source_delivery_id: deliveryId,
                  escalation_level: escalationLevel,
                  escalation_channel_key: String(target.channel_key || ''),
                  escalation_owner_label: target.owner_label || null,
                  escalation_stage_index: escalationTargetResult.stage_index,
                  escalation_stage_priority: escalationTargetResult.stage_priority,
                  escalation_routing_source: target.routing_source || null,
                  repeating_final_stage: escalationTargetResult.repeating_final_stage,
                }),
              )}'::jsonb,
              NOW(),
              NULL
            )
            RETURNING delivery_id
          `);
          insertedDeliveries.push(Number(deliveryRows[0]?.delivery_id || 0));
        }

        await this.prisma.$executeRawUnsafe(`
          INSERT INTO public.alert_dead_letter_triage (
            delivery_id,
            triage_status,
            assigned_to,
            note,
            escalation_count,
            last_escalated_at,
            last_escalation_level,
            last_action_at,
            created_by,
            updated_by
          ) VALUES (
            ${deliveryId},
            '${this.escapeSqlLiteral(triageStatus)}',
            ${item.assigned_to ? `'${this.escapeSqlLiteral(String(item.assigned_to))}'` : 'NULL'},
            ${item.note ? `'${this.escapeSqlLiteral(String(item.note))}'` : 'NULL'},
            1,
            NOW(),
            '${this.escapeSqlLiteral(escalationLevel)}',
            NOW(),
            '${this.escapeSqlLiteral(actor)}',
            '${this.escapeSqlLiteral(actor)}'
          )
          ON CONFLICT (delivery_id) DO UPDATE SET
            escalation_count = COALESCE(public.alert_dead_letter_triage.escalation_count, 0) + 1,
            last_escalated_at = NOW(),
            last_escalation_level = '${this.escapeSqlLiteral(escalationLevel)}',
            last_action_at = NOW(),
            updated_by = '${this.escapeSqlLiteral(actor)}'
        `);

        results.push({
          delivery_id: deliveryId,
          escalated: true,
          escalation_level: escalationLevel,
          escalation_stage_index: escalationTargetResult.stage_index,
          escalation_stage_priority: escalationTargetResult.stage_priority,
          has_more_stages: escalationTargetResult.has_more_stages,
          repeating_final_stage: escalationTargetResult.repeating_final_stage,
          escalation_event_id: escalationEventId,
          escalation_delivery_ids: insertedDeliveries,
          channel_keys: targets.map((target) => String(target.channel_key || '')),
          routed_to_owner: targets.some(
            (target) => String(target.routing_source || '') === 'assigned-owner',
          ),
        });
      }

      const escalatedCount = results.filter((item) => item.escalated).length;
      const deliveryRun = escalatedCount ? await this.runAlertDeliveryCycle(actor) : null;

      return {
        success: true,
        data: {
          processed_item_count: items.length,
          escalated_count: escalatedCount,
          skipped: false,
          escalation_channel_key: escalationConfig.channel_key,
          cooldown_minutes: escalationConfig.cooldown_minutes,
          delivery_run: deliveryRun?.data || null,
          results,
        },
      };
    } finally {
      this.alertTriageEscalationRunning = false;
    }
  }

  async alertingAnalytics() {
    const summaryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL) AS total_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'open') AS open_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'acknowledged') AS acknowledged_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'resolved') AS resolved_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.severity = 'critical') AS critical_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.detected_at >= NOW() - INTERVAL '24 hours') AS last_24h_events
      FROM public.alert_event e
    `);

    const noisyRuleRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id,
        r.rule_name,
        r.module_key,
        COUNT(e.event_id) AS event_count_24h,
        COUNT(*) FILTER (WHERE e.status = 'open') AS open_count_24h,
        MAX(e.detected_at) AS last_detected_at
      FROM public.alert_rule r
      JOIN public.alert_event e ON e.rule_id = r.rule_id
      WHERE r.deleted_at IS NULL
        AND e.deleted_at IS NULL
        AND e.detected_at >= NOW() - INTERVAL '24 hours'
      GROUP BY r.rule_id, r.rule_name, r.module_key
      ORDER BY COUNT(e.event_id) DESC, MAX(e.detected_at) DESC
      LIMIT 5
    `);

    const unresolvedRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.module_key,
        COUNT(*) AS unresolved_count
      FROM public.alert_event e
      JOIN public.alert_rule r ON r.rule_id = e.rule_id
      WHERE e.deleted_at IS NULL
        AND e.status IN ('open', 'acknowledged', 'muted')
      GROUP BY r.module_key
      ORDER BY COUNT(*) DESC, r.module_key ASC
    `);

    const effectivenessRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id,
        r.rule_name,
        r.module_key,
        COALESCE(run_stats.total_runs, 0) AS total_runs,
        COALESCE(run_stats.successful_runs, 0) AS successful_runs,
        COALESCE(run_stats.triggered_events, 0) AS triggered_events,
        COALESCE(run_stats.avg_events_per_run, 0) AS avg_events_per_run,
        run_stats.last_run_at,
        COALESCE(event_stats.total_events, 0) AS total_events,
        COALESCE(event_stats.open_events, 0) AS open_events,
        COALESCE(event_stats.acknowledged_events, 0) AS acknowledged_events,
        COALESCE(event_stats.resolved_events, 0) AS resolved_events,
        COALESCE(delivery_stats.total_deliveries, 0) AS total_deliveries,
        COALESCE(delivery_stats.delivered_deliveries, 0) AS delivered_deliveries,
        COALESCE(delivery_stats.failed_deliveries, 0) AS failed_deliveries,
        COALESCE(delivery_stats.dead_lettered_deliveries, 0) AS dead_lettered_deliveries,
        CASE
          WHEN COALESCE(event_stats.total_events, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(event_stats.acknowledged_events, 0)::numeric / event_stats.total_events::numeric) * 100, 2)
        END AS acknowledgement_rate,
        CASE
          WHEN COALESCE(event_stats.total_events, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(event_stats.resolved_events, 0)::numeric / event_stats.total_events::numeric) * 100, 2)
        END AS resolution_rate,
        CASE
          WHEN COALESCE(delivery_stats.total_deliveries, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(delivery_stats.delivered_deliveries, 0)::numeric / delivery_stats.total_deliveries::numeric) * 100, 2)
        END AS delivery_success_rate
      FROM public.alert_rule r
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_runs,
          COUNT(*) FILTER (WHERE rl.run_status = 'success') AS successful_runs,
          COALESCE(SUM(rl.triggered_event_count), 0) AS triggered_events,
          COALESCE(AVG(rl.triggered_event_count::numeric), 0) AS avg_events_per_run,
          MAX(rl.started_at) AS last_run_at
        FROM public.alert_rule_run_log rl
        WHERE rl.rule_id = r.rule_id
      ) run_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_events,
          COUNT(*) FILTER (WHERE e.status = 'open') AS open_events,
          COUNT(*) FILTER (WHERE e.status = 'acknowledged') AS acknowledged_events,
          COUNT(*) FILTER (WHERE e.status = 'resolved') AS resolved_events
        FROM public.alert_event e
        WHERE e.rule_id = r.rule_id
          AND e.deleted_at IS NULL
      ) event_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'delivered') AS delivered_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'failed') AS failed_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'dead-lettered') AS dead_lettered_deliveries
        FROM public.alert_delivery_log d
        WHERE d.rule_id = r.rule_id
      ) delivery_stats ON TRUE
      WHERE r.deleted_at IS NULL
      ORDER BY
        COALESCE(run_stats.total_runs, 0) DESC,
        COALESCE(run_stats.triggered_events, 0) DESC,
        r.rule_id ASC
      LIMIT 5
    `);

    return {
      success: true,
      data: {
        summary: {
          total_events: Number(summaryRows[0]?.total_events || 0),
          open_events: Number(summaryRows[0]?.open_events || 0),
          acknowledged_events: Number(summaryRows[0]?.acknowledged_events || 0),
          resolved_events: Number(summaryRows[0]?.resolved_events || 0),
          critical_events: Number(summaryRows[0]?.critical_events || 0),
          last_24h_events: Number(summaryRows[0]?.last_24h_events || 0),
        },
        noisy_rules: noisyRuleRows.map((row) => ({
          rule_id: Number(row.rule_id || 0),
          rule_name: row.rule_name,
          module_key: row.module_key,
          event_count_24h: Number(row.event_count_24h || 0),
          open_count_24h: Number(row.open_count_24h || 0),
          last_detected_at: row.last_detected_at || null,
        })),
        unresolved_by_module: unresolvedRows.map((row) => ({
          module_key: row.module_key,
          unresolved_count: Number(row.unresolved_count || 0),
        })),
        rule_effectiveness: effectivenessRows.map((row) => ({
          rule_id: Number(row.rule_id || 0),
          rule_name: row.rule_name,
          module_key: row.module_key,
          total_runs: Number(row.total_runs || 0),
          successful_runs: Number(row.successful_runs || 0),
          triggered_events: Number(row.triggered_events || 0),
          avg_events_per_run: Number(row.avg_events_per_run || 0),
          total_events: Number(row.total_events || 0),
          open_events: Number(row.open_events || 0),
          acknowledged_events: Number(row.acknowledged_events || 0),
          resolved_events: Number(row.resolved_events || 0),
          total_deliveries: Number(row.total_deliveries || 0),
          delivered_deliveries: Number(row.delivered_deliveries || 0),
          failed_deliveries: Number(row.failed_deliveries || 0),
          dead_lettered_deliveries: Number(row.dead_lettered_deliveries || 0),
          acknowledgement_rate: Number(row.acknowledgement_rate || 0),
          resolution_rate: Number(row.resolution_rate || 0),
          delivery_success_rate: Number(row.delivery_success_rate || 0),
          last_run_at: row.last_run_at || null,
        })),
      },
    };
  }

  async alertingDeliveryObservability() {
    const summaryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'delivered') AS delivered_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'queued') AS queued_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'dead-lettered') AS dead_lettered_logs,
        COUNT(*) FILTER (WHERE retry_count > 0) AS retried_logs
      FROM public.alert_delivery_log
    `);

    const channelRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_type,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'delivered') AS delivered_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'queued') AS queued_logs
      FROM public.alert_delivery_log
      GROUP BY channel_type
      ORDER BY channel_type ASC
    `);

    const providerRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COALESCE(provider_name, 'unassigned') AS provider_name,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs
      FROM public.alert_delivery_log
      GROUP BY COALESCE(provider_name, 'unassigned')
      ORDER BY COUNT(*) DESC, provider_name ASC
      LIMIT 5
    `);

    const pendingRetryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        delivery_id,
        channel_type,
        target_value,
        retry_count,
        max_retries,
        next_retry_at
      FROM public.alert_delivery_log
      WHERE delivery_status = 'queued'
        AND next_retry_at IS NOT NULL
      ORDER BY next_retry_at ASC, delivery_id ASC
      LIMIT 5
    `);

    const deadLetterRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        delivery_id,
        channel_type,
        target_value,
        retry_count,
        max_retries,
        dead_lettered_at,
        dead_letter_reason
      FROM public.alert_delivery_log
      WHERE delivery_status = 'dead-lettered'
      ORDER BY dead_lettered_at DESC NULLS LAST, delivery_id DESC
      LIMIT 5
    `);

    return {
      success: true,
      data: {
        summary: {
          total_logs: Number(summaryRows[0]?.total_logs || 0),
          delivered_logs: Number(summaryRows[0]?.delivered_logs || 0),
          queued_logs: Number(summaryRows[0]?.queued_logs || 0),
          failed_logs: Number(summaryRows[0]?.failed_logs || 0),
          dead_lettered_logs: Number(summaryRows[0]?.dead_lettered_logs || 0),
          retried_logs: Number(summaryRows[0]?.retried_logs || 0),
        },
        by_channel: channelRows.map((row) => ({
          channel_type: row.channel_type,
          total_logs: Number(row.total_logs || 0),
          delivered_logs: Number(row.delivered_logs || 0),
          failed_logs: Number(row.failed_logs || 0),
          queued_logs: Number(row.queued_logs || 0),
        })),
        top_providers: providerRows.map((row) => ({
          provider_name: row.provider_name,
          total_logs: Number(row.total_logs || 0),
          failed_logs: Number(row.failed_logs || 0),
        })),
        pending_retries: pendingRetryRows.map((row) => ({
          delivery_id: Number(row.delivery_id || 0),
          channel_type: row.channel_type,
          target_value: row.target_value,
          retry_count: Number(row.retry_count || 0),
          max_retries: Number(row.max_retries || 0),
          next_retry_at: row.next_retry_at || null,
        })),
        dead_letters: deadLetterRows.map((row) => ({
          delivery_id: Number(row.delivery_id || 0),
          channel_type: row.channel_type,
          target_value: row.target_value,
          retry_count: Number(row.retry_count || 0),
          max_retries: Number(row.max_retries || 0),
          dead_lettered_at: row.dead_lettered_at || null,
          dead_letter_reason: row.dead_letter_reason || null,
        })),
      },
    };
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
        scheduler_interval_ms: this.alertSchedulerIntervalMs,
        delivery_interval_ms: this.alertDeliveryIntervalMs,
        triage_escalation_interval_ms: this.alertTriageEscalationIntervalMs,
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
    const config = this.getBaileysConfig();
    const requestedPhoneNumber = String(body.phoneNumber || body.phone_number || '')
      .replace(/\D/g, '')
      .trim();
    const pairingMode = requestedPhoneNumber ? 'pairing-code' : 'qr';

    if (!config.enabled || !config.authDir) {
      await this.createAlertProviderSessionAudit({
        providerName: 'baileys',
        channelType: 'wa-group',
        actionType: 'pairing-start',
        status: 'failed',
        pairingMode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: {
          requested_phone_number: requestedPhoneNumber || null,
          enabled: config.enabled,
        },
        errorMessage: 'Baileys is not enabled or auth dir is not configured.',
        actor,
      });
      await this.upsertAlertProviderSessionState({
        providerName: 'baileys',
        channelType: 'wa-group',
        sessionKey: 'baileys-wa-group',
        sessionStatus: 'disabled',
        pairingMode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        statusMessage: 'Baileys is not enabled or auth dir is not configured.',
        detailPayload: {
          requested_phone_number: requestedPhoneNumber || null,
          enabled: config.enabled,
        },
        lastPairingStartedAt: new Date(),
        lastPairingResultAt: new Date(),
        lastDisconnectedAt: new Date(),
        actor,
      });
      throw new BadRequestException('Baileys is not enabled or auth dir is not configured.');
    }

    await this.createAlertProviderSessionAudit({
      providerName: 'baileys',
      channelType: 'wa-group',
      actionType: 'pairing-start',
      status: 'captured',
      pairingMode,
      phoneNumber: requestedPhoneNumber || null,
      authDir: config.authDir || null,
      detailPayload: {
        requested_phone_number: requestedPhoneNumber || null,
        enabled: config.enabled,
      },
      actor,
    });
    await this.upsertAlertProviderSessionState({
      providerName: 'baileys',
      channelType: 'wa-group',
      sessionKey: 'baileys-wa-group',
      sessionStatus: 'pairing-in-progress',
      pairingMode,
      phoneNumber: requestedPhoneNumber || null,
      authDir: config.authDir || null,
      statusMessage: 'Baileys pairing flow started.',
      detailPayload: {
        requested_phone_number: requestedPhoneNumber || null,
      },
      lastPairingStartedAt: new Date(),
      actor,
    });

    const baileys = await import('@whiskeysockets/baileys');
    await mkdir(config.authDir, { recursive: true });
    const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);

    if (state.creds?.registered) {
      return {
        success: true,
        data: {
          mode: 'already-registered',
          pairing_required: false,
          message: 'Baileys session is already registered.',
        },
      };
    }

    const socket = baileys.makeWASocket({
      auth: state,
      browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      printQRInTerminal: false,
    });

    socket.ev.on('creds.update', saveCreds);

    try {
      const result = await new Promise<{
        mode: 'pairing-code' | 'qr' | 'connected';
        pairing_required: boolean;
        pairing_code?: string;
        qr?: string;
        message: string;
      }>((resolve, reject) => {
        let settled = false;
        const finish = (handler: () => void) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          handler();
        };

        const timeout = setTimeout(() => {
          finish(() =>
            reject(new Error('Baileys pairing timed out before QR or pairing code was generated.')),
          );
        }, 30000);

        socket.ev.on('connection.update', (update: Record<string, unknown>) => {
          const qr = typeof update.qr === 'string' ? update.qr.trim() : '';
          const connection = String(update.connection || '');
          if (qr) {
            finish(() =>
              resolve({
                mode: 'qr',
                pairing_required: true,
                qr,
                message: 'Scan the QR token with WhatsApp to complete pairing.',
              }),
            );
            return;
          }

          if (connection === 'open') {
            finish(() =>
              resolve({
                mode: 'connected',
                pairing_required: false,
                message: 'Baileys session connected successfully.',
              }),
            );
            return;
          }

          if (connection === 'close') {
            finish(() =>
              reject(new Error('Baileys connection closed before pairing data was generated.')),
            );
          }
        });

        if (requestedPhoneNumber) {
          void socket
            .requestPairingCode(requestedPhoneNumber)
            .then((code: string) => {
              const normalizedCode = String(code || '').trim();
              if (!normalizedCode) {
                throw new Error('Baileys returned an empty pairing code.');
              }
              finish(() =>
                resolve({
                  mode: 'pairing-code',
                  pairing_required: true,
                  pairing_code: normalizedCode,
                  message: `Use this pairing code for ${requestedPhoneNumber}.`,
                }),
              );
            })
            .catch((error: unknown) => {
              finish(() =>
                reject(
                  error instanceof Error
                    ? error
                    : new Error('Failed to request Baileys pairing code.'),
                ),
              );
            });
        }
      });

      this.logger.log(`Baileys pairing initiated by ${actor} using mode ${result.mode}.`);
      await this.createAlertProviderSessionAudit({
        providerName: 'baileys',
        channelType: 'wa-group',
        actionType: 'pairing-result',
        status: result.pairing_required ? 'warning' : 'success',
        pairingMode: result.mode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: result,
        actor,
      });
      await this.upsertAlertProviderSessionState({
        providerName: 'baileys',
        channelType: 'wa-group',
        sessionKey: 'baileys-wa-group',
        sessionStatus: result.pairing_required ? 'pairing-required' : 'ready',
        pairingMode: result.mode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        statusMessage: result.message,
        detailPayload: result as unknown as Record<string, unknown>,
        lastPairingResultAt: new Date(),
        lastConnectedAt: result.pairing_required ? null : new Date(),
        lastDisconnectedAt: result.pairing_required ? new Date() : null,
        actor,
      });
      return { success: true, data: result };
    } catch (error) {
      await this.createAlertProviderSessionAudit({
        providerName: 'baileys',
        channelType: 'wa-group',
        actionType: 'pairing-result',
        status: 'failed',
        pairingMode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: {
          requested_phone_number: requestedPhoneNumber || null,
        },
        errorMessage: error instanceof Error ? error.message : 'Unknown pairing error.',
        actor,
      });
      await this.upsertAlertProviderSessionState({
        providerName: 'baileys',
        channelType: 'wa-group',
        sessionKey: 'baileys-wa-group',
        sessionStatus: 'error',
        pairingMode,
        phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        statusMessage: error instanceof Error ? error.message : 'Unknown pairing error.',
        detailPayload: {
          requested_phone_number: requestedPhoneNumber || null,
        },
        lastPairingResultAt: new Date(),
        lastDisconnectedAt: new Date(),
        actor,
      });
      throw error;
    } finally {
      try {
        socket.end(undefined);
      } catch {
        // ignore socket shutdown errors
      }
    }
  }

  async alertingChannels(channelType?: string) {
    const where = ['deleted_at IS NULL'];
    if (channelType && channelType !== 'all') {
      where.push(`channel_type = '${this.escapeSqlLiteral(channelType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_id,
        channel_key,
        channel_type,
        label,
        target_value,
        ownership_type,
        owner_label,
        status,
        is_active,
        metadata,
        created_at
      FROM public.alert_notification_channel
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC, channel_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        channel_id: Number(row.channel_id || 0),
        channel_key: row.channel_key,
        channel_type: row.channel_type,
        label: row.label,
        target_value: row.target_value,
        ownership_type: row.ownership_type,
        owner_label: row.owner_label || null,
        status: row.status,
        is_active: Boolean(row.is_active),
        metadata: this.asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  private async validateAlertTemplateSource(sourceType: string, sourceRef: string) {
    if (!sourceType || !sourceRef) {
      return;
    }

    if (sourceType === 'business-metric') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT metric_id
        FROM public.metric_business_registry
        WHERE metric_key = '${this.escapeSqlLiteral(sourceRef)}'
          AND deleted_at IS NULL
          AND is_active = TRUE
        LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Template source_ref "${sourceRef}" was not found in metric_business_registry.`,
        );
      }
    }

    if (sourceType === 'system-metric') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT system_metric_id
        FROM public.metric_system_registry
        WHERE metric_key = '${this.escapeSqlLiteral(sourceRef)}'
          AND deleted_at IS NULL
          AND is_active = TRUE
        LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Template source_ref "${sourceRef}" was not found in metric_system_registry.`,
        );
      }
    }
  }

  private validateAlertChannelTarget(channelType: string, targetValue: string) {
    const normalizedType = channelType.trim().toLowerCase();
    const normalizedTarget = targetValue.trim();
    if (!normalizedType || !normalizedTarget) {
      return;
    }

    if (normalizedType === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedTarget)) {
        throw new BadRequestException('Email channel target must be a valid email address.');
      }
      return;
    }

    if (normalizedType === 'wa-personal') {
      const digits = normalizedTarget.replace(/\D/g, '');
      if (!normalizedTarget.includes('@') && digits.length < 8) {
        throw new BadRequestException(
          'WhatsApp personal target must be a phone number or WhatsApp JID.',
        );
      }
      return;
    }

    if (normalizedType === 'wa-group') {
      if (
        normalizedTarget.includes('@g.us') ||
        /^\d+-\d+$/.test(normalizedTarget) ||
        /^\d+$/.test(normalizedTarget)
      ) {
        return;
      }
      throw new BadRequestException(
        'WhatsApp group target must be a valid group JID or numeric group identifier.',
      );
    }
  }

  async alertingTemplates(module?: string) {
    const where = ['deleted_at IS NULL'];
    if (module && module !== 'all') {
      where.push(`module_key = '${this.escapeSqlLiteral(module)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        template_id,
        template_key,
        name,
        description,
        module_key,
        severity,
        recommended_channels,
        default_recipients,
        source_type,
        source_ref,
        schedule_value,
        condition_summary,
        message_template,
        metadata,
        is_default,
        is_active,
        sort_order,
        created_at
      FROM public.alert_template
      WHERE ${where.join(' AND ')}
      ORDER BY is_default DESC, sort_order, created_at DESC, template_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        template_id: Number(row.template_id || 0),
        template_key: row.template_key,
        name: row.name,
        description: row.description || null,
        module_key: row.module_key,
        severity: row.severity,
        recommended_channels: this.asJson(row.recommended_channels, []),
        default_recipients: this.asJson(row.default_recipients, []),
        source_type: row.source_type || null,
        source_ref: row.source_ref || null,
        schedule_value: row.schedule_value || null,
        condition_summary: row.condition_summary || null,
        message_template: row.message_template || null,
        metadata: this.asJson(row.metadata, {}),
        is_default: Boolean(row.is_default),
        is_active: Boolean(row.is_active),
        sort_order: Number(row.sort_order || 0),
        created_at: row.created_at,
      })),
    };
  }

  async createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    const name = String(body.name || '').trim();
    const moduleKey = String(body.moduleKey || body.module_key || '').trim();
    const severity = String(body.severity || 'medium')
      .trim()
      .toLowerCase();
    if (!name || !moduleKey) {
      throw new BadRequestException('name and moduleKey are required.');
    }

    const description = String(body.description || '').trim();
    const sourceType = String(body.sourceType || body.source_type || '').trim();
    const sourceRef = String(body.sourceRef || body.source_ref || '').trim();
    const scheduleValue = String(body.scheduleValue || body.schedule_value || '').trim();
    const conditionSummary = String(body.conditionSummary || body.condition_summary || '').trim();
    const messageTemplate = String(body.messageTemplate || body.message_template || '').trim();
    const recommendedChannels = Array.isArray(body.recommendedChannels)
      ? body.recommendedChannels
      : Array.isArray(body.recommended_channels)
        ? body.recommended_channels
        : [];
    const defaultRecipients = Array.isArray(body.defaultRecipients)
      ? body.defaultRecipients
      : Array.isArray(body.default_recipients)
        ? body.default_recipients
        : [];
    const isDefault = Boolean(body.isDefault ?? body.is_default);
    const templateKey = `template-${this.slugify(name)}-${Date.now()}`;

    await this.validateAlertTemplateSource(sourceType, sourceRef);

    if (isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_template
        SET
          is_default = FALSE,
          updated_by = '${this.escapeSqlLiteral(actor)}'
        WHERE module_key = '${this.escapeSqlLiteral(moduleKey)}'
          AND deleted_at IS NULL
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_template (
        template_key,
        name,
        description,
        module_key,
        severity,
        recommended_channels,
        default_recipients,
        source_type,
        source_ref,
        schedule_value,
        condition_summary,
        message_template,
        metadata,
        is_default,
        is_active,
        created_by,
        updated_by
      ) VALUES (
        '${this.escapeSqlLiteral(templateKey)}',
        '${this.escapeSqlLiteral(name)}',
        ${description ? `'${this.escapeSqlLiteral(description)}'` : 'NULL'},
        '${this.escapeSqlLiteral(moduleKey)}',
        '${this.escapeSqlLiteral(severity || 'medium')}',
        '${this.escapeSqlLiteral(JSON.stringify(recommendedChannels))}'::jsonb,
        '${this.escapeSqlLiteral(JSON.stringify(defaultRecipients))}'::jsonb,
        ${sourceType ? `'${this.escapeSqlLiteral(sourceType)}'` : 'NULL'},
        ${sourceRef ? `'${this.escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        ${scheduleValue ? `'${this.escapeSqlLiteral(scheduleValue)}'` : 'NULL'},
        ${conditionSummary ? `'${this.escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        ${messageTemplate ? `'${this.escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        '{}'::jsonb,
        ${isDefault ? 'TRUE' : 'FALSE'},
        TRUE,
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingTemplates(moduleKey);
  }

  async alertingTemplateDetail(templateId: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        template_id,
        template_key,
        name,
        description,
        module_key,
        severity,
        recommended_channels,
        default_recipients,
        source_type,
        source_ref,
        schedule_value,
        condition_summary,
        message_template,
        metadata,
        is_default,
        is_active,
        sort_order,
        created_at
      FROM public.alert_template
      WHERE deleted_at IS NULL
        AND template_id = ${normalizedTemplateId}
      LIMIT 1
    `);

    if (!rows[0]) {
      throw new NotFoundException('Alert template not found.');
    }

    return {
      success: true,
      data: {
        template_id: Number(rows[0].template_id || 0),
        template_key: rows[0].template_key,
        name: rows[0].name,
        description: rows[0].description || null,
        module_key: rows[0].module_key,
        severity: rows[0].severity,
        recommended_channels: this.asJson(rows[0].recommended_channels, []),
        default_recipients: this.asJson(rows[0].default_recipients, []),
        source_type: rows[0].source_type || null,
        source_ref: rows[0].source_ref || null,
        schedule_value: rows[0].schedule_value || null,
        condition_summary: rows[0].condition_summary || null,
        message_template: rows[0].message_template || null,
        metadata: this.asJson(rows[0].metadata, {}),
        is_default: Boolean(rows[0].is_default),
        is_active: Boolean(rows[0].is_active),
        sort_order: Number(rows[0].sort_order || 0),
        created_at: rows[0].created_at,
      },
    };
  }

  async updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const name = String(body.name || '').trim();
    const moduleKey = String(body.moduleKey || body.module_key || '').trim();
    const severity = String(body.severity || 'medium')
      .trim()
      .toLowerCase();
    if (!name || !moduleKey) {
      throw new BadRequestException('name and moduleKey are required.');
    }

    const description = String(body.description || '').trim();
    const sourceType = String(body.sourceType || body.source_type || '').trim();
    const sourceRef = String(body.sourceRef || body.source_ref || '').trim();
    const scheduleValue = String(body.scheduleValue || body.schedule_value || '').trim();
    const conditionSummary = String(body.conditionSummary || body.condition_summary || '').trim();
    const messageTemplate = String(body.messageTemplate || body.message_template || '').trim();
    const recommendedChannels = Array.isArray(body.recommendedChannels)
      ? body.recommendedChannels
      : Array.isArray(body.recommended_channels)
        ? body.recommended_channels
        : [];
    const defaultRecipients = Array.isArray(body.defaultRecipients)
      ? body.defaultRecipients
      : Array.isArray(body.default_recipients)
        ? body.default_recipients
        : [];
    const isDefault = Boolean(body.isDefault ?? body.is_default);

    await this.validateAlertTemplateSource(sourceType, sourceRef);

    if (isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_template
        SET
          is_default = FALSE,
          updated_by = '${this.escapeSqlLiteral(actor)}'
        WHERE module_key = '${this.escapeSqlLiteral(moduleKey)}'
          AND template_id <> ${normalizedTemplateId}
          AND deleted_at IS NULL
      `);
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template
      SET
        name = '${this.escapeSqlLiteral(name)}',
        description = ${description ? `'${this.escapeSqlLiteral(description)}'` : 'NULL'},
        module_key = '${this.escapeSqlLiteral(moduleKey)}',
        severity = '${this.escapeSqlLiteral(severity || 'medium')}',
        recommended_channels = '${this.escapeSqlLiteral(JSON.stringify(recommendedChannels))}'::jsonb,
        default_recipients = '${this.escapeSqlLiteral(JSON.stringify(defaultRecipients))}'::jsonb,
        source_type = ${sourceType ? `'${this.escapeSqlLiteral(sourceType)}'` : 'NULL'},
        source_ref = ${sourceRef ? `'${this.escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        schedule_value = ${scheduleValue ? `'${this.escapeSqlLiteral(scheduleValue)}'` : 'NULL'},
        condition_summary = ${conditionSummary ? `'${this.escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        message_template = ${messageTemplate ? `'${this.escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        is_default = ${isDefault ? 'TRUE' : 'FALSE'},
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert template not found.');
    }

    return this.alertingTemplates(moduleKey);
  }

  async updateAlertingTemplateState(
    templateId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template
      SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert template not found.');
    }

    return this.alertingTemplates('all');
  }

  async deleteAlertingTemplate(templateId: string, actor: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT module_key
      FROM public.alert_template
      WHERE template_id = ${normalizedTemplateId}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (!existing[0]) {
      throw new NotFoundException('Alert template not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template
      SET
        is_active = FALSE,
        deleted_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId}
        AND deleted_at IS NULL
    `);

    return this.alertingTemplates(String(existing[0].module_key || 'all'));
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
    }

    const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
    const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
    const teamKey = String(body.teamKey || body.team_key || '').trim();
    const status = String(body.status || 'draft').trim();
    const channelKey = `channel-${this.slugify(label)}-${Date.now()}`;
    const metadata = teamKey ? { team: teamKey } : {};

    this.validateAlertChannelTarget(channelType, targetValue);

    await this.prisma.$executeRawUnsafe(`
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
      ) VALUES (
        '${this.escapeSqlLiteral(channelKey)}',
        '${this.escapeSqlLiteral(channelType)}',
        '${this.escapeSqlLiteral(label)}',
        '${this.escapeSqlLiteral(targetValue)}',
        '${this.escapeSqlLiteral(ownershipType || 'standalone')}',
        ${ownerLabel ? `'${this.escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        '${this.escapeSqlLiteral(status || 'draft')}',
        '${this.escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        TRUE,
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
    }

    const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
    const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
    const teamKey = String(body.teamKey || body.team_key || '').trim();
    const status = String(body.status || 'draft').trim();
    const metadata = teamKey ? { team: teamKey } : {};

    this.validateAlertChannelTarget(channelType, targetValue);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel
      SET
        channel_type = '${this.escapeSqlLiteral(channelType)}',
        label = '${this.escapeSqlLiteral(label)}',
        target_value = '${this.escapeSqlLiteral(targetValue)}',
        ownership_type = '${this.escapeSqlLiteral(ownershipType || 'standalone')}',
        owner_label = ${ownerLabel ? `'${this.escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        status = '${this.escapeSqlLiteral(status || 'draft')}',
        metadata = '${this.escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannelState(
    channelId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel
      SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels('all');
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT channel_type
      FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (!existing[0]) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel
      SET
        is_active = FALSE,
        deleted_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId}
        AND deleted_at IS NULL
    `);

    return this.alertingChannels(String(existing[0].channel_type || 'all'));
  }

  async testAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channels = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_id,
        channel_key,
        channel_type,
        label,
        target_value
      FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId}
        AND deleted_at IS NULL
        AND is_active = TRUE
      LIMIT 1
    `);

    const channel = channels[0];
    if (!channel) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    const testRule = await this.ensureAlertingTestRule(actor);
    const eventKey = `evt-test-channel-${normalizedChannelId}-${Date.now()}`;
    const title = `Test send for ${String(channel.label || 'channel')}`;
    const message = `Test notification for ${String(channel.label || 'channel')} via ${String(channel.channel_type || '')}.`;

    const insertedEvents = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_event (
        event_key,
        rule_id,
        metric_id,
        snapshot_id,
        title,
        description,
        severity,
        status,
        source_ref,
        event_payload,
        detected_at,
        created_by,
        updated_by
      ) VALUES (
        '${this.escapeSqlLiteral(eventKey)}',
        ${testRule.rule_id},
        NULL,
        NULL,
        '${this.escapeSqlLiteral(title)}',
        '${this.escapeSqlLiteral(message)}',
        'low',
        'open',
        '${this.escapeSqlLiteral(String(channel.channel_key || 'manual-test'))}',
        '${this.escapeSqlLiteral(
          JSON.stringify({
            test_send: true,
            channel_id: normalizedChannelId,
            channel_type: String(channel.channel_type || ''),
            target_value: String(channel.target_value || ''),
          }),
        )}'::jsonb,
        NOW(),
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
      RETURNING event_id
    `);

    const eventId = Number(insertedEvents[0]?.event_id || 0);
    const insertedDeliveries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_delivery_log (
        event_id,
        rule_id,
        recipient_id,
        channel_type,
        target_value,
        provider_name,
        delivery_status,
        response_payload,
        requested_at,
        delivered_at
      ) VALUES (
        ${eventId},
        ${testRule.rule_id},
        NULL,
        '${this.escapeSqlLiteral(String(channel.channel_type || ''))}',
        '${this.escapeSqlLiteral(String(channel.target_value || ''))}',
        'test-send',
        'queued',
        '{"trigger":"test-send"}'::jsonb,
        NOW(),
        NULL
      )
      RETURNING delivery_id
    `);

    const deliveryRun = await this.runAlertDeliveryCycle(actor);

    return {
      success: true,
      data: {
        channel_id: normalizedChannelId,
        event_id: eventId,
        delivery_id: Number(insertedDeliveries[0]?.delivery_id || 0),
        delivery_run: deliveryRun.data,
      },
    };
  }

  async alertingSettings() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        setting_id,
        setting_key,
        setting_group,
        label,
        value_text,
        value_json,
        description,
        is_active
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
      ORDER BY setting_group, setting_key
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        setting_id: Number(row.setting_id || 0),
        setting_key: row.setting_key,
        setting_group: row.setting_group,
        label: row.label,
        value_text: row.value_text || null,
        value_json: this.asJson(row.value_json, {}),
        description: row.description || null,
        is_active: Boolean(row.is_active),
      })),
    };
  }

  async updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string) {
    const normalizedSettingKey = String(settingKey || '').trim();
    if (!normalizedSettingKey) {
      throw new BadRequestException('Invalid setting key.');
    }

    const valueText =
      typeof body.valueText === 'string'
        ? body.valueText.trim()
        : typeof body.value_text === 'string'
          ? body.value_text.trim()
          : '';
    const valueJson =
      body.valueJson && typeof body.valueJson === 'object'
        ? body.valueJson
        : body.value_json && typeof body.value_json === 'object'
          ? body.value_json
          : {};

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_runtime_setting
      SET
        value_text = ${valueText ? `'${this.escapeSqlLiteral(valueText)}'` : 'NULL'},
        value_json = '${this.escapeSqlLiteral(JSON.stringify(valueJson))}'::jsonb,
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE setting_key = '${this.escapeSqlLiteral(normalizedSettingKey)}'
        AND is_active = TRUE
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert runtime setting not found.');
    }

    return this.alertingSettings();
  }

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    const where = ['deleted_at IS NULL'];
    if (module && module !== 'all') {
      where.push(`module_key = '${this.escapeSqlLiteral(module)}'`);
    }
    if (targetType && targetType !== 'all') {
      where.push(`target_type = '${this.escapeSqlLiteral(targetType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        policy_id,
        module_key,
        escalation_level,
        target_type,
        target_ref,
        priority,
        is_active,
        metadata,
        created_at
      FROM public.alert_triage_escalation_policy
      WHERE ${where.join(' AND ')}
      ORDER BY module_key, escalation_level, priority, created_at DESC, policy_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        policy_id: Number(row.policy_id || 0),
        module_key: String(row.module_key || ''),
        escalation_level: String(row.escalation_level || ''),
        target_type: String(row.target_type || ''),
        target_ref: String(row.target_ref || ''),
        priority: Number(row.priority || 0),
        is_active: Boolean(row.is_active),
        metadata: this.asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  private async validateAlertingEscalationTarget(targetType: string, targetRef: string) {
    if (!targetType || !targetRef) {
      throw new BadRequestException('targetType and targetRef are required.');
    }

    if (targetType === 'channel') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT channel_id
        FROM public.alert_notification_channel
        WHERE channel_key = '${this.escapeSqlLiteral(targetRef)}'
          AND deleted_at IS NULL
        LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_notification_channel.`,
        );
      }
    } else if (targetType === 'role') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT role_id
        FROM public.alert_routing_role
        WHERE role_key = '${this.escapeSqlLiteral(targetRef)}'
          AND is_active = TRUE
        LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_role.`,
        );
      }
    } else if (targetType === 'team') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT team_id
        FROM public.alert_routing_team
        WHERE team_key = '${this.escapeSqlLiteral(targetRef)}'
          AND is_active = TRUE
        LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_team.`,
        );
      }
    }
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    const moduleKey = String(body.moduleKey || body.module_key || '')
      .trim()
      .toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '')
      .trim()
      .toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel')
      .trim()
      .toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException(
        'moduleKey must be all, sales, finance, warehouse, or purchasing.',
      );
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_escalation_policy (
        module_key,
        escalation_level,
        target_type,
        target_ref,
        priority,
        metadata,
        is_active,
        created_by,
        updated_by
      ) VALUES (
        '${this.escapeSqlLiteral(moduleKey)}',
        '${this.escapeSqlLiteral(escalationLevel)}',
        '${this.escapeSqlLiteral(targetType)}',
        '${this.escapeSqlLiteral(targetRef)}',
        ${priority},
        '{}'::jsonb,
        TRUE,
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicy(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const moduleKey = String(body.moduleKey || body.module_key || '')
      .trim()
      .toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '')
      .trim()
      .toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel')
      .trim()
      .toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException(
        'moduleKey must be all, sales, finance, warehouse, or purchasing.',
      );
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy
      SET
        module_key = '${this.escapeSqlLiteral(moduleKey)}',
        escalation_level = '${this.escapeSqlLiteral(escalationLevel)}',
        target_type = '${this.escapeSqlLiteral(targetType)}',
        target_ref = '${this.escapeSqlLiteral(targetRef)}',
        priority = ${priority},
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicyState(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy
      SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy
      SET
        is_active = FALSE,
        deleted_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId}
        AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async alertingTriageSavedViews(actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        view_id,
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
        created_at
      FROM public.alert_triage_saved_view
      WHERE deleted_at IS NULL
        AND (
          owner_actor = '${this.escapeSqlLiteral(normalizedActor)}'
          OR is_shared = TRUE
          OR owner_actor IS NULL
        )
      ORDER BY
        is_default DESC,
        is_shared DESC,
        created_at DESC,
        view_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        view_id: Number(row.view_id || 0),
        view_key: String(row.view_key || ''),
        name: String(row.name || ''),
        owner_actor: row.owner_actor ? String(row.owner_actor) : null,
        is_shared: Boolean(row.is_shared),
        is_default: Boolean(row.is_default),
        filters_json: this.asJson(row.filters_json, {}),
        sort_by: String(row.sort_by || 'dead_lettered_at'),
        sort_order: String(row.sort_order || 'desc'),
        metadata: this.asJson(row.metadata, {}),
        is_active: Boolean(row.is_active),
        created_at: row.created_at || null,
        is_owned_by_current_user: String(row.owner_actor || '') === normalizedActor,
      })),
    };
  }

  private normalizeAlertingTriageSavedViewPayload(body: Record<string, unknown>) {
    const name = String(body.name || '').trim();
    const isShared = Boolean(body.isShared ?? body.is_shared ?? false);
    const isDefault = Boolean(body.isDefault ?? body.is_default ?? false);
    const filtersJson = this.asJson(body.filtersJson ?? body.filters_json, {});
    const sortBy =
      String(body.sortBy || body.sort_by || 'dead_lettered_at').trim() || 'dead_lettered_at';
    const sortOrder =
      String(body.sortOrder || body.sort_order || 'desc')
        .trim()
        .toLowerCase() === 'asc'
        ? 'asc'
        : 'desc';

    if (!name) {
      throw new BadRequestException('name is required.');
    }
    if (
      ![
        'dead_lettered_at',
        'age_minutes',
        'sla_due_at',
        'triage_updated_at',
        'escalation_count',
        'event_title',
      ].includes(sortBy)
    ) {
      throw new BadRequestException('sortBy is invalid.');
    }

    return {
      name,
      isShared,
      isDefault,
      filtersJson,
      sortBy,
      sortOrder,
    };
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);
    const viewKey = `triage-view-${Date.now()}`;

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view
        SET
          is_default = FALSE,
          updated_by = '${this.escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL
          AND owner_actor = '${this.escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
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
      ) VALUES (
        '${this.escapeSqlLiteral(viewKey)}',
        '${this.escapeSqlLiteral(payload.name)}',
        '${this.escapeSqlLiteral(normalizedActor)}',
        ${payload.isShared ? 'TRUE' : 'FALSE'},
        ${payload.isDefault ? 'TRUE' : 'FALSE'},
        '${this.escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        '${this.escapeSqlLiteral(payload.sortBy)}',
        '${this.escapeSqlLiteral(payload.sortOrder)}',
        '{}'::jsonb,
        TRUE,
        '${this.escapeSqlLiteral(normalizedActor)}',
        '${this.escapeSqlLiteral(normalizedActor)}'
      )
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedView(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT owner_actor
      FROM public.alert_triage_saved_view
      WHERE view_id = ${normalizedViewId}
        AND deleted_at IS NULL
      LIMIT 1
    `);
    const existing = existingRows[0];
    if (!existing) {
      throw new NotFoundException('Saved view not found.');
    }
    const ownerActor = String(existing.owner_actor || '');
    if (ownerActor && ownerActor !== normalizedActor) {
      throw new BadRequestException('You can only update your own saved view.');
    }

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view
        SET
          is_default = FALSE,
          updated_by = '${this.escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL
          AND owner_actor = '${this.escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view
      SET
        name = '${this.escapeSqlLiteral(payload.name)}',
        is_shared = ${payload.isShared ? 'TRUE' : 'FALSE'},
        is_default = ${payload.isDefault ? 'TRUE' : 'FALSE'},
        filters_json = '${this.escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        sort_by = '${this.escapeSqlLiteral(payload.sortBy)}',
        sort_order = '${this.escapeSqlLiteral(payload.sortOrder)}',
        updated_by = '${this.escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId}
        AND deleted_at IS NULL
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedViewState(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view
      SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${this.escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId}
        AND deleted_at IS NULL
        AND (owner_actor = '${this.escapeSqlLiteral(normalizedActor)}' OR owner_actor IS NULL)
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view
      SET
        is_active = FALSE,
        deleted_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId}
        AND deleted_at IS NULL
        AND owner_actor = '${this.escapeSqlLiteral(normalizedActor)}'
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found or not owned by current user.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    const normalizedEventId = Number(eventId);
    if (!Number.isFinite(normalizedEventId) || normalizedEventId <= 0) {
      throw new BadRequestException('Invalid event id.');
    }

    const status = String(body?.status || '')
      .trim()
      .toLowerCase();
    if (!['acknowledged', 'resolved', 'open', 'muted'].includes(status)) {
      throw new BadRequestException('Invalid event status.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT status
      FROM public.alert_event
      WHERE deleted_at IS NULL
        AND event_id = ${normalizedEventId}
      LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert event not found.');
    }

    const currentStatus = String(existingRows[0].status || '')
      .trim()
      .toLowerCase();
    const allowedTransitions: Record<string, string[]> = {
      open: ['acknowledged', 'resolved', 'muted'],
      acknowledged: ['resolved', 'muted', 'open'],
      muted: ['open', 'resolved'],
      resolved: [],
    };

    if (currentStatus !== status && !(allowedTransitions[currentStatus] || []).includes(status)) {
      throw new BadRequestException(
        `Invalid event transition from "${currentStatus}" to "${status}".`,
      );
    }

    const updates = [
      `status = '${this.escapeSqlLiteral(status)}'`,
      `updated_by = '${this.escapeSqlLiteral(actor)}'`,
    ];
    if (status === 'acknowledged') {
      updates.push('acknowledged_at = NOW()');
    }
    if (status === 'resolved') {
      updates.push('resolved_at = NOW()');
    }
    if (status === 'open') {
      updates.push('acknowledged_at = NULL');
      updates.push('resolved_at = NULL');
    }

    const affected = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_event
      SET ${updates.join(', ')}
      WHERE deleted_at IS NULL
        AND event_id = ${normalizedEventId}
    `);

    if (!affected) {
      throw new NotFoundException('Alert event not found.');
    }

    const result = await this.alertingEvents(undefined, String(normalizedEventId));
    return { success: true, data: result.data[0] || null };
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

  private mapAlertingBusinessMetricRow(row: Record<string, unknown>) {
    return {
      metric_id: Number(row.metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      short_label: row.short_label,
      module_key: row.module_key,
      description: row.description,
      business_definition: row.business_definition,
      unit: row.unit,
      value_type: row.value_type,
      comparison_type: row.comparison_type,
      source_type: row.source_type,
      source_ref: row.source_ref,
      semantic_ref: row.semantic_ref,
      system_metric_ref: row.system_metric_ref,
      supported_dimensions: this.asJson(row.supported_dimensions, []),
      default_filters: this.asJson(row.default_filters, {}),
      tags: this.asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
    };
  }

  private mapAlertingSystemMetricRow(row: Record<string, unknown>) {
    return {
      system_metric_id: Number(row.system_metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      module_key: row.module_key,
      description: row.description,
      source_table: row.source_table,
      source_type: row.source_type,
      resolver_key: row.resolver_key,
      aggregation_type: row.aggregation_type,
      value_type: row.value_type,
      supported_dimensions: this.asJson(row.supported_dimensions, []),
      supported_filters: this.asJson(row.supported_filters, []),
      default_filters: this.asJson(row.default_filters, {}),
      tags: this.asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
    };
  }

  private mapAlertingMetricBuilderContextRow(row: Record<string, unknown>) {
    return {
      metric_id: Number(row.metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      short_label: row.short_label,
      module_key: row.module_key,
      description: row.description,
      business_definition: row.business_definition,
      unit: row.unit,
      value_type: row.value_type,
      comparison_type: row.comparison_type,
      semantic_ref: row.semantic_ref,
      canonical_semantic_key: row.canonical_semantic_key,
      semantic_label: row.semantic_label,
      semantic_entity_key: row.semantic_entity_key,
      semantic_measure_key: row.semantic_measure_key,
      semantic_definition: row.semantic_definition,
      semantic_calculation_summary: row.semantic_calculation_summary,
      system_metric_ref: row.system_metric_ref,
      system_metric_label: row.system_metric_label,
      system_source_table: row.system_source_table,
      system_aggregation_type: row.system_aggregation_type,
      source_type: row.source_type,
      source_ref: row.source_ref,
      supported_dimensions: this.asJson(row.supported_dimensions, []),
      default_filters: this.asJson(row.default_filters, {}),
      tags: this.asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
      goal_count: Number(row.goal_count || 0),
      goals: this.asJson(row.goals, []),
      condition_mapping_count: Number(row.condition_mapping_count || 0),
      condition_mappings: this.asJson(row.condition_mappings, []),
    };
  }

  private mapAlertingInsightRow(row: Record<string, unknown>) {
    return {
      snapshot_id: Number(row.snapshot_id || 0),
      metric_key: row.metric_key,
      metric_label: row.metric_label,
      module_key: row.module_key,
      snapshot_at: row.snapshot_at,
      insight_text: row.insight_text,
      recommendation_preview: row.recommendation_preview,
      anomaly_level: row.anomaly_level,
      status: row.status,
      is_alert_candidate: Boolean(row.is_alert_candidate),
      current_value: row.current_value,
      comparison_value: row.comparison_value,
      change_pct: row.change_pct,
      trend_label: row.trend_label,
      source_ref: row.source_ref,
      dimensions: this.asJson(row.dimensions, {}),
      evidence_payload: this.asJson(row.evidence_payload, {}),
    };
  }

  private async replaceAlertRuleRecipients(ruleId: number, recipients: unknown[], actor: string) {
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule_recipient
      SET
        is_active = FALSE,
        deleted_at = NOW(),
        updated_by = '${this.escapeSqlLiteral(actor)}'
      WHERE rule_id = ${ruleId}
        AND deleted_at IS NULL
    `);

    for (let index = 0; index < recipients.length; index += 1) {
      const item = recipients[index] as Record<string, unknown>;
      const channelType = String(item.channel_type || item.channelType || '').trim();
      const targetLabel = String(item.target_label || item.targetLabel || '').trim();
      const targetValue = String(item.target_value || item.targetValue || '').trim();
      if (!channelType || !targetLabel || !targetValue) {
        continue;
      }

      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.alert_rule_recipient (
          rule_id,
          recipient_type,
          channel_type,
          target_label,
          target_value,
          sort_order,
          metadata,
          is_active,
          created_by,
          updated_by
        ) VALUES (
          ${ruleId},
          'channel',
          '${this.escapeSqlLiteral(channelType)}',
          '${this.escapeSqlLiteral(targetLabel)}',
          '${this.escapeSqlLiteral(targetValue)}',
          ${index + 1},
          '{}'::jsonb,
          TRUE,
          '${this.escapeSqlLiteral(actor)}',
          '${this.escapeSqlLiteral(actor)}'
        )
      `);
    }
  }

  private mapAlertRuleRow(row: Record<string, unknown>) {
    return {
      rule_id: Number(row.rule_id || 0),
      rule_key: row.rule_key,
      rule_name: row.rule_name,
      description: row.description,
      module_key: row.module_key,
      severity: row.severity,
      schedule_value: row.schedule_value,
      primary_channel: row.primary_channel,
      status: row.status,
      is_active: Boolean(row.is_active),
      last_run_at: row.last_run_at,
      created_at: row.created_at,
      metric_label: row.metric_label,
      recipients: this.asJson(row.recipients, []),
    };
  }

  private mapAlertRuleDetailRow(row: Record<string, unknown>) {
    return {
      rule_id: Number(row.rule_id || 0),
      rule_key: row.rule_key,
      rule_name: row.rule_name,
      description: row.description,
      module_key: row.module_key,
      source_type: row.source_type,
      source_ref: row.source_ref,
      metric_id: row.metric_id ? Number(row.metric_id) : null,
      system_metric_ref: row.system_metric_ref || null,
      semantic_ref: row.semantic_ref || null,
      condition_mapping_id: row.condition_mapping_id ? Number(row.condition_mapping_id) : null,
      condition_mapping_key: row.condition_mapping_key || null,
      condition_operator_key: row.condition_operator_key || null,
      comparison_type: row.comparison_type || null,
      value_type: row.value_type || null,
      schedule_type: row.schedule_type,
      schedule_value: row.schedule_value,
      severity: row.severity,
      primary_channel: row.primary_channel,
      condition_summary: row.condition_summary || null,
      condition_config: this.asJson(row.condition_config, {}),
      source_context: this.asJson(row.source_context, {}),
      message_template: row.message_template || null,
      status: row.status,
      is_active: Boolean(row.is_active),
      last_run_at: row.last_run_at,
      metric_label: row.metric_label || null,
      recent_events: this.asJson(row.recent_events, []),
      run_history: this.asJson(row.run_history, []),
      recipients: this.asJson(row.recipients, []),
    };
  }

  private mapAlertEventRow(row: Record<string, unknown>) {
    return {
      event_id: Number(row.event_id || 0),
      event_key: row.event_key,
      rule_id: Number(row.rule_id || 0),
      rule_name: row.rule_name,
      module_key: row.module_key,
      metric_label: row.metric_label || null,
      title: row.title,
      description: row.description,
      severity: row.severity,
      status: row.status,
      source_ref: row.source_ref || null,
      event_payload: this.asJson(row.event_payload, {}),
      detected_at: row.detected_at,
      acknowledged_at: row.acknowledged_at,
      resolved_at: row.resolved_at,
      deliveries: this.asJson(row.deliveries, []),
    };
  }

  private getAiBaseUrl() {
    const candidates = [
      process.env.AI_ENGINE_URL,
      process.env.AI_ENGINE_BASE_URL,
      'http://ai-engine:8001',
    ];
    const configuredUrl = candidates.find(
      (value) => typeof value === 'string' && value.trim().length > 0,
    );
    return configuredUrl?.trim().replace(/\/$/, '') || 'http://ai-engine:8001';
  }

  private async fetchAlertingSavedQueryJson<T>(input: string, requestId: string) {
    const response = await fetch(input, {
      method: 'GET',
      headers: { 'x-request-id': requestId },
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as {
      success?: boolean;
      data?: T;
      message?: string;
    } | null;

    if (!response.ok || !payload?.success) {
      throw new InternalServerErrorException(payload?.message || 'Failed to fetch saved queries.');
    }

    return payload.data;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

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
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
      RETURNING rule_id, rule_key
    `);

    return {
      rule_id: Number(inserted[0]?.rule_id || 0),
      rule_key: String(inserted[0]?.rule_key || 'system-test-send-rule'),
    };
  }

  private async ensureAlertingTriageEscalationRule(actor: string) {
    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT rule_id, rule_key
      FROM public.alert_rule
      WHERE rule_key = 'system-dead-letter-triage-escalation'
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing[0]?.rule_id) {
      return {
        rule_id: Number(existing[0].rule_id),
        rule_key: String(existing[0].rule_key || 'system-dead-letter-triage-escalation'),
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
        'system-dead-letter-triage-escalation',
        'System Dead-Letter Triage Escalation',
        'Internal rule used to escalate overdue or critical dead-letter triage items.',
        'alerting',
        'manual-rule-source',
        'dead-letter-triage',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'threshold',
        'text',
        'preset',
        '15m',
        'high',
        'wa-group',
        'Internal dead-letter triage escalation',
        '{}'::jsonb,
        '{"system":true,"purpose":"triage-escalation"}'::jsonb,
        'Dead-letter triage escalation triggered.',
        'active',
        TRUE,
        '${this.escapeSqlLiteral(actor)}',
        '${this.escapeSqlLiteral(actor)}'
      )
      RETURNING rule_id, rule_key
    `);

    return {
      rule_id: Number(inserted[0]?.rule_id || 0),
      rule_key: String(inserted[0]?.rule_key || 'system-dead-letter-triage-escalation'),
    };
  }

  private async resolveAlertingTriageEscalationTargets(
    escalationChannelKey: string,
    moduleKey: string | null,
    escalationLevel: string,
    assignedTo: string | null,
    escalationCount: number,
    severityChanged: boolean,
  ) {
    const [channels, policies, roles, teams, roleChannels, teamChannels] = await Promise.all([
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_id,
        channel_key,
        channel_type,
        label,
        target_value,
        ownership_type,
        owner_label,
        metadata
      FROM public.alert_notification_channel
      WHERE deleted_at IS NULL
        AND is_active = TRUE
    `),
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
        AND escalation_level = '${this.escapeSqlLiteral(escalationLevel)}'
        AND module_key IN (
          '${this.escapeSqlLiteral(moduleKey || 'all')}',
          'all'
        )
      ORDER BY priority ASC, policy_id ASC
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        role_key,
        label
      FROM public.alert_routing_role
      WHERE is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        team_key,
        label
      FROM public.alert_routing_team
      WHERE is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        rc.role_key,
        rc.channel_key
      FROM public.alert_routing_role_channel rc
      JOIN public.alert_routing_role r ON r.role_key = rc.role_key
      WHERE rc.is_active = TRUE
        AND r.is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        tc.team_key,
        tc.channel_key
      FROM public.alert_routing_team_channel tc
      JOIN public.alert_routing_team t ON t.team_key = tc.team_key
      WHERE tc.is_active = TRUE
        AND t.is_active = TRUE
    `),
    ]);

    const normalizedAssignedTo = (assignedTo || '').trim().toLowerCase();
    const matchingPolicies = policies.map((policy) => ({
      policy_id: Number(policy.policy_id || 0),
      module_key: String(policy.module_key || ''),
      escalation_level: String(policy.escalation_level || ''),
      target_type: String(policy.target_type || ''),
      target_ref: String(policy.target_ref || ''),
      priority: Number(policy.priority || 0),
    }));

    const stagePriorities = Array.from(
      new Set(matchingPolicies.map((policy) => policy.priority)),
    ).sort((a, b) => a - b);
    const requestedStageIndex = severityChanged ? 0 : Math.max(0, escalationCount);
    const repeatingFinalStage =
      stagePriorities.length > 0 && requestedStageIndex >= stagePriorities.length;
    const stageIndex = repeatingFinalStage ? stagePriorities.length - 1 : requestedStageIndex;
    const currentStagePriority = stagePriorities[stageIndex] ?? null;
    const includeBaselineTargets = stageIndex === 0;

    const resolved = new Map<
      string,
      Record<string, unknown> & { routing_source?: string; stage_priority?: number | null }
    >();

    const pushTarget = (
      target: Record<string, unknown>,
      routingSource: string,
      stagePriority: number | null,
    ) => {
      const key = `${String(target.channel_type || '')}:${String(target.target_value || '')}`;
      if (!resolved.has(key)) {
        resolved.set(key, {
          ...target,
          routing_source: routingSource,
          stage_priority: stagePriority,
        });
      }
    };

    const resolveRoleChannels = (roleRef: string) => {
      const normalizedRoleRef = roleRef.trim().toLowerCase();
      const matchingRoleKeys = roles
        .filter((role) => {
          const roleKey = String(role.role_key || '')
            .trim()
            .toLowerCase();
          const roleLabel = String(role.label || '')
            .trim()
            .toLowerCase();
          return roleKey === normalizedRoleRef || roleLabel === normalizedRoleRef;
        })
        .map((role) => String(role.role_key || ''));

      const directRegistryChannels = roleChannels
        .filter((mapping) => matchingRoleKeys.includes(String(mapping.role_key || '')))
        .flatMap((mapping) =>
          channels.filter(
            (channel) => String(channel.channel_key || '') === String(mapping.channel_key || ''),
          ),
        );

      if (directRegistryChannels.length) {
        return directRegistryChannels;
      }

      return channels.filter(
        (channel) =>
          String(channel.ownership_type || '') === 'internal_user' &&
          String(channel.owner_label || '')
            .trim()
            .toLowerCase() === normalizedRoleRef,
      );
    };

    const resolveTeamChannels = (teamRef: string) => {
      const normalizedTeamRef = teamRef.trim().toLowerCase();
      const matchingTeamKeys = teams
        .filter((team) => {
          const teamKey = String(team.team_key || '')
            .trim()
            .toLowerCase();
          const teamLabel = String(team.label || '')
            .trim()
            .toLowerCase();
          return teamKey === normalizedTeamRef || teamLabel === normalizedTeamRef;
        })
        .map((team) => String(team.team_key || ''));

      const directRegistryChannels = teamChannels
        .filter((mapping) => matchingTeamKeys.includes(String(mapping.team_key || '')))
        .flatMap((mapping) =>
          channels.filter(
            (channel) => String(channel.channel_key || '') === String(mapping.channel_key || ''),
          ),
        );

      if (directRegistryChannels.length) {
        return directRegistryChannels;
      }

      return channels.filter((channel) => {
        const metadata = this.asJson(channel.metadata, {}) as Record<string, unknown>;
        return (
          String(metadata['team'] || '')
            .trim()
            .toLowerCase() === normalizedTeamRef
        );
      });
    };

    if (includeBaselineTargets) {
      const fallbackChannel = channels.find(
        (channel) => String(channel.channel_key || '') === escalationChannelKey,
      );
      if (fallbackChannel) {
        pushTarget(fallbackChannel, 'fallback-channel', null);
      }

      if (normalizedAssignedTo) {
        resolveRoleChannels(normalizedAssignedTo).forEach((channel) =>
          pushTarget(channel, 'assigned-owner', null),
        );
      }
    }

    if (currentStagePriority !== null) {
      const currentStagePolicies = matchingPolicies.filter(
        (policy) => policy.priority === currentStagePriority,
      );
      for (const policy of currentStagePolicies) {
        if (policy.target_type === 'channel') {
          channels
            .filter((channel) => String(channel.channel_key || '') === policy.target_ref)
            .forEach((channel) => pushTarget(channel, 'policy-channel', currentStagePriority));
        } else if (policy.target_type === 'role') {
          resolveRoleChannels(policy.target_ref).forEach((channel) =>
            pushTarget(channel, 'policy-role', currentStagePriority),
          );
        } else if (policy.target_type === 'team') {
          resolveTeamChannels(policy.target_ref).forEach((channel) =>
            pushTarget(channel, 'policy-team', currentStagePriority),
          );
        }
      }
    }

    const orderedTargets = Array.from(resolved.values()).sort((left, right) => {
      const leftStage = typeof left.stage_priority === 'number' ? left.stage_priority : -1;
      const rightStage = typeof right.stage_priority === 'number' ? right.stage_priority : -1;
      if (leftStage !== rightStage) return leftStage - rightStage;
      return Number(left.channel_id || 0) - Number(right.channel_id || 0);
    });

    return {
      targets: orderedTargets,
      stage_index: stageIndex,
      stage_priority: currentStagePriority,
      has_more_stages: currentStagePriority !== null && stageIndex < stagePriorities.length - 1,
      stage_count: stagePriorities.length,
      baseline_included: includeBaselineTargets,
      repeating_final_stage: repeatingFinalStage,
    };
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

  private startAlertingScheduler() {
    if (this.alertSchedulerTimer) {
      return;
    }

    this.alertSchedulerTimer = setInterval(() => {
      void this.runAlertingSchedulerCycle().catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown alert scheduler error.';
        this.logger.error(`Alert scheduler cycle failed: ${message}`);
      });
    }, this.alertSchedulerIntervalMs);

    this.logger.log(`Alert scheduler started with interval ${this.alertSchedulerIntervalMs}ms`);
  }

  private startAlertDeliveryWorker() {
    if (this.alertDeliveryTimer) {
      return;
    }

    this.alertDeliveryTimer = setInterval(() => {
      void this.runAlertDeliveryCycle().catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Unknown alert delivery worker error.';
        this.logger.error(`Alert delivery cycle failed: ${message}`);
      });
    }, this.alertDeliveryIntervalMs);

    this.logger.log(
      `Alert delivery worker started with interval ${this.alertDeliveryIntervalMs}ms`,
    );
  }

  private startAlertTriageEscalationWorker() {
    if (this.alertTriageEscalationTimer) {
      return;
    }

    this.alertTriageEscalationTimer = setInterval(() => {
      void this.runAlertingTriageEscalationCycle().catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown triage escalation error.';
        this.logger.error(`Alert triage escalation cycle failed: ${message}`);
      });
    }, this.alertTriageEscalationIntervalMs);

    this.logger.log(
      `Alert triage escalation worker started with interval ${this.alertTriageEscalationIntervalMs}ms`,
    );
  }

  private parseAlertScheduleToMs(scheduleValue: string) {
    const normalized = scheduleValue.trim().toLowerCase();
    if (!normalized) return 0;

    const presetMap: Record<string, number> = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
    };
    if (presetMap[normalized]) {
      return presetMap[normalized];
    }

    const match = normalized.match(/^(\d+)(m|h|d)$/);
    if (!match) {
      return 0;
    }

    const value = Number(match[1] || 0);
    const unit = match[2];
    if (!value) return 0;
    if (unit === 'm') return value * 60 * 1000;
    if (unit === 'h') return value * 60 * 60 * 1000;
    if (unit === 'd') return value * 24 * 60 * 60 * 1000;
    return 0;
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
        '${this.escapeSqlLiteral(input.providerName)}',
        '${this.escapeSqlLiteral(input.channelType)}',
        '${this.escapeSqlLiteral(input.actionType)}',
        '${this.escapeSqlLiteral(input.status)}',
        ${input.pairingMode ? `'${this.escapeSqlLiteral(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${this.escapeSqlLiteral(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${this.escapeSqlLiteral(input.authDir)}'` : 'NULL'},
        '${this.escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        ${input.errorMessage ? `'${this.escapeSqlLiteral(input.errorMessage)}'` : 'NULL'},
        '${this.escapeSqlLiteral(input.actor)}',
        '${this.escapeSqlLiteral(input.actor)}'
      )
    `);
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
        '${this.escapeSqlLiteral(input.providerName)}',
        '${this.escapeSqlLiteral(input.channelType)}',
        '${this.escapeSqlLiteral(input.sessionKey)}',
        '${this.escapeSqlLiteral(input.sessionStatus)}',
        ${input.pairingMode ? `'${this.escapeSqlLiteral(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${this.escapeSqlLiteral(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${this.escapeSqlLiteral(input.authDir)}'` : 'NULL'},
        ${input.statusMessage ? `'${this.escapeSqlLiteral(input.statusMessage)}'` : 'NULL'},
        ${input.lastHealthCheckAt ? `'${input.lastHealthCheckAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingStartedAt ? `'${input.lastPairingStartedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingResultAt ? `'${input.lastPairingResultAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastConnectedAt ? `'${input.lastConnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastDisconnectedAt ? `'${input.lastDisconnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        '${this.escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        TRUE,
        '${this.escapeSqlLiteral(input.actor)}',
        '${this.escapeSqlLiteral(input.actor)}'
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

  private async getAlertingTriageEscalationConfig() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_escalation_channel_key', 'triage_escalation_cooldown_minutes')
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

    const channelSetting = settings.get('triage_escalation_channel_key');
    const cooldownSetting = settings.get('triage_escalation_cooldown_minutes');
    const channelKey =
      String(
        channelSetting?.value_json?.channel_key ||
          channelSetting?.value_text ||
          'channel-ops-alert-group',
      ).trim() || 'channel-ops-alert-group';
    const cooldownMinutes = Number(
      (cooldownSetting?.value_json?.minutes as number | string | undefined) ||
        (cooldownSetting?.value_text ? Number.parseInt(cooldownSetting.value_text, 10) : NaN),
    );

    return {
      channel_key: channelKey,
      cooldown_minutes:
        Number.isFinite(cooldownMinutes) && cooldownMinutes > 0 ? cooldownMinutes : 60,
    };
  }

  private async getAlertingTriageRecoveryConfig() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key = 'triage_auto_close_on_recovery'
      LIMIT 1
    `);

    const row = rows[0];
    const valueJson = this.asJson<Record<string, unknown>>(row?.value_json, {});
    const valueText =
      typeof row?.value_text === 'string' ? row.value_text.trim().toLowerCase() : '';
    const enabled =
      typeof valueJson['enabled'] === 'boolean'
        ? Boolean(valueJson['enabled'])
        : ['enabled', 'true', 'yes', '1', 'on'].includes(valueText);

    return { enabled };
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
