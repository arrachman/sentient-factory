import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingMetricService } from './alerting-metric.service';
import { AlertingInsightQueryService } from './alerting-insight-query.service';
import { AlertingRuleRunnerService } from './alerting-rule-runner.service';

@Injectable()
export class AlertingRuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingMetricService: AlertingMetricService,
    private readonly alertingInsightQueryService: AlertingInsightQueryService,
    private readonly alertingRuleRunnerService: AlertingRuleRunnerService,
  ) {}

  // ── Metrics delegation ───────────────────────────────────────────────────────

  async alertingBusinessMetrics(moduleKey?: string) {
    return this.alertingMetricService.alertingBusinessMetrics(moduleKey);
  }

  async alertingSystemMetrics(moduleKey?: string) {
    return this.alertingMetricService.alertingSystemMetrics(moduleKey);
  }

  async alertingMetricBuilderContext(moduleKey?: string, metricKey?: string) {
    return this.alertingMetricService.alertingMetricBuilderContext(moduleKey, metricKey);
  }

  // ── Insights & saved queries delegation ──────────────────────────────────────

  async alertingInsights(moduleKey?: string, snapshotId?: string) {
    return this.alertingInsightQueryService.alertingInsights(moduleKey, snapshotId);
  }

  async alertingSavedQueries(channel?: string, limit?: string) {
    return this.alertingInsightQueryService.alertingSavedQueries(channel, limit);
  }

  async alertingEvents(moduleKey?: string, eventId?: string) {
    return this.alertingInsightQueryService.alertingEvents(moduleKey, eventId);
  }

  // ── Rule CRUD ────────────────────────────────────────────────────────────────

  async alertingRules(moduleKey?: string) {
    const where = ['r.deleted_at IS NULL'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`r.module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id, r.rule_key, r.rule_name,
        COALESCE(r.description, '') AS description,
        r.module_key, r.severity, r.schedule_value, r.primary_channel,
        r.status, r.is_active, r.last_run_at, r.created_at,
        COALESCE(b.label, '') AS metric_label,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'recipient_id', rr.recipient_id, 'channel_type', rr.channel_type,
              'target_label', rr.target_label, 'target_value', rr.target_value
            )
            ORDER BY rr.sort_order, rr.recipient_id
          ) FILTER (WHERE rr.recipient_id IS NOT NULL),
          '[]'::jsonb
        ) AS recipients
      FROM public.alert_rule r
      LEFT JOIN public.metric_business_registry b ON b.metric_id = r.metric_id
      LEFT JOIN public.alert_rule_recipient rr
        ON rr.rule_id = r.rule_id AND rr.deleted_at IS NULL AND rr.is_active = true
      WHERE ${where.join(' AND ')}
      GROUP BY
        r.rule_id, r.rule_key, r.rule_name, r.description, r.module_key, r.severity,
        r.schedule_value, r.primary_channel, r.status, r.is_active, r.last_run_at,
        r.created_at, b.label
      ORDER BY r.created_at DESC, r.rule_id DESC
    `);

    return { success: true, data: rows.map((row) => this.mapAlertRuleRow(row)) };
  }

  async alertingRuleDetail(ruleId: string) {
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id, r.rule_key, r.rule_name,
        COALESCE(r.description, '') AS description,
        r.module_key, r.source_type,
        COALESCE(r.source_ref, '') AS source_ref,
        r.metric_id,
        COALESCE(r.system_metric_ref, '') AS system_metric_ref,
        COALESCE(r.semantic_ref, '') AS semantic_ref,
        r.condition_mapping_id,
        COALESCE(r.condition_mapping_key, '') AS condition_mapping_key,
        COALESCE(r.condition_operator_key, '') AS condition_operator_key,
        COALESCE(r.comparison_type, '') AS comparison_type,
        COALESCE(r.value_type, '') AS value_type,
        r.schedule_type, r.schedule_value, r.severity, r.primary_channel,
        COALESCE(r.condition_summary, '') AS condition_summary,
        r.condition_config, r.source_context,
        COALESCE(r.message_template, '') AS message_template,
        r.status, r.is_active, r.last_run_at,
        COALESCE(b.label, '') AS metric_label,
        COALESCE((
          SELECT jsonb_agg(
            jsonb_build_object(
              'event_id', recent_events.event_id, 'event_key', recent_events.event_key,
              'title', recent_events.title, 'severity', recent_events.severity,
              'status', recent_events.status, 'detected_at', recent_events.detected_at
            )
            ORDER BY recent_events.detected_at DESC
          )
          FROM (
            SELECT e.event_id, e.event_key, e.title, e.severity, e.status, e.detected_at
            FROM public.alert_event e
            WHERE e.rule_id = r.rule_id AND e.deleted_at IS NULL
            ORDER BY e.detected_at DESC, e.event_id DESC
            LIMIT 5
          ) recent_events
        ), '[]'::jsonb) AS recent_events,
        COALESCE((
          SELECT jsonb_agg(
            jsonb_build_object(
              'run_log_id', recent_runs.run_log_id, 'run_status', recent_runs.run_status,
              'matched_count', recent_runs.matched_count,
              'triggered_event_count', recent_runs.triggered_event_count,
              'started_at', recent_runs.started_at, 'finished_at', recent_runs.finished_at,
              'error_message', recent_runs.error_message
            )
            ORDER BY recent_runs.started_at DESC
          )
          FROM (
            SELECT rl.run_log_id, rl.run_status, rl.matched_count, rl.triggered_event_count,
              rl.started_at, rl.finished_at, rl.error_message
            FROM public.alert_rule_run_log rl
            WHERE rl.rule_id = r.rule_id
            ORDER BY rl.started_at DESC, rl.run_log_id DESC
            LIMIT 5
          ) recent_runs
        ), '[]'::jsonb) AS run_history,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'recipient_id', rr.recipient_id, 'channel_type', rr.channel_type,
              'target_label', rr.target_label, 'target_value', rr.target_value
            )
            ORDER BY rr.sort_order, rr.recipient_id
          ) FILTER (WHERE rr.recipient_id IS NOT NULL),
          '[]'::jsonb
        ) AS recipients
      FROM public.alert_rule r
      LEFT JOIN public.metric_business_registry b ON b.metric_id = r.metric_id
      LEFT JOIN public.alert_rule_recipient rr
        ON rr.rule_id = r.rule_id AND rr.deleted_at IS NULL AND rr.is_active = true
      WHERE r.deleted_at IS NULL AND r.rule_id = ${normalizedRuleId}
      GROUP BY
        r.rule_id, r.rule_key, r.rule_name, r.description, r.module_key, r.source_type,
        r.source_ref, r.metric_id, r.system_metric_ref, r.semantic_ref, r.condition_mapping_id,
        r.condition_mapping_key, r.condition_operator_key, r.comparison_type, r.value_type,
        r.schedule_type, r.schedule_value, r.severity, r.primary_channel, r.condition_summary,
        r.condition_config, r.source_context, r.message_template, r.status, r.is_active,
        r.last_run_at, b.label
      LIMIT 1
    `);

    if (!rows.length) {
      throw new NotFoundException('Alert rule not found.');
    }

    return { success: true, data: this.mapAlertRuleDetailRow(rows[0]) };
  }

  async createAlertingRule(body: Record<string, unknown>, actor: string) {
    const ruleId = await this.alertingRuleRunnerService.insertAlertingRule(body, actor);
    return this.alertingRuleDetail(String(ruleId));
  }

  async updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string) {
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }
    await this.alertingRuleRunnerService.applyAlertingRuleUpdate(normalizedRuleId, body, actor);
    return this.alertingRuleDetail(String(normalizedRuleId));
  }

  async updateAlertingRuleState(ruleId: string, body: Record<string, unknown>, actor: string) {
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const status = isActive ? 'active' : 'paused';
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        status = '${status}',
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert rule not found.');
    }

    return this.alertingRules('all');
  }

  async deleteAlertingRule(ruleId: string, actor: string) {
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule SET
        is_active = FALSE, status = 'archived', deleted_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert rule not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule_recipient SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL
    `);

    return this.alertingRules('all');
  }

  async runAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleRunnerService.runAlertingRule(ruleId, actor);
  }

  // ── Shared helpers (used by other services) ──────────────────────────────────

  mapAlertRuleRow(row: Record<string, unknown>) {
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
      recipients: asJson(row.recipients, []),
    };
  }

  mapAlertRuleDetailRow(row: Record<string, unknown>) {
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
      condition_config: asJson(row.condition_config, {}),
      source_context: asJson(row.source_context, {}),
      message_template: row.message_template || null,
      status: row.status,
      is_active: Boolean(row.is_active),
      last_run_at: row.last_run_at,
      metric_label: row.metric_label || null,
      recent_events: asJson(row.recent_events, []),
      run_history: asJson(row.run_history, []),
      recipients: asJson(row.recipients, []),
    };
  }

  async replaceAlertRuleRecipients(ruleId: number, recipients: unknown[], actor: string) {
    return this.alertingRuleRunnerService.replaceAlertRuleRecipients(ruleId, recipients, actor);
  }

  parseAlertScheduleToMs(scheduleValue: string): number {
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

  slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }
}
