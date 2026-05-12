import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingMetricService } from './alerting-metric.service';
import { AlertingInsightQueryService } from './alerting-insight-query.service';

@Injectable()
export class AlertingRuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingMetricService: AlertingMetricService,
    private readonly alertingInsightQueryService: AlertingInsightQueryService,
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
    const ruleName = String(body.ruleName || '').trim();
    const moduleKey = String(body.moduleKey || '').trim();
    const sourceType = String(body.sourceType || '').trim();
    if (!ruleName || !moduleKey || !sourceType) {
      throw new BadRequestException('ruleName, moduleKey, and sourceType are required.');
    }

    const metricId = body.metricId ? Number(body.metricId) : null;
    const conditionMappingId = body.conditionMappingId ? Number(body.conditionMappingId) : null;
    const recipients = Array.isArray(body.recipients) ? body.recipients : [];
    const ruleKey = `rule-${this.slugify(ruleName)}-${Date.now()}`;
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const sourceRef = typeof body.sourceRef === 'string' ? body.sourceRef.trim() : '';
    const systemMetricRef = typeof body.systemMetricRef === 'string' ? body.systemMetricRef.trim() : '';
    const semanticRef = typeof body.semanticRef === 'string' ? body.semanticRef.trim() : '';
    const conditionMappingKey = typeof body.conditionMappingKey === 'string' ? body.conditionMappingKey.trim() : '';
    const conditionOperatorKey = typeof body.conditionOperatorKey === 'string' ? body.conditionOperatorKey.trim() : '';
    const comparisonType = typeof body.comparisonType === 'string' ? body.comparisonType.trim() : '';
    const valueType = typeof body.valueType === 'string' ? body.valueType.trim() : '';
    const scheduleType = typeof body.scheduleType === 'string' ? body.scheduleType.trim() : 'preset';
    const scheduleValue = typeof body.scheduleValue === 'string' ? body.scheduleValue.trim() : '15m';
    const severity = typeof body.severity === 'string' ? body.severity.trim() : 'critical';
    const primaryChannel = typeof body.primaryChannel === 'string' ? body.primaryChannel.trim() : 'wa-group';
    const conditionSummary = typeof body.conditionSummary === 'string' ? body.conditionSummary.trim() : '';
    const messageTemplate = typeof body.messageTemplate === 'string' ? body.messageTemplate.trim() : '';
    const conditionConfig = asJson(body.conditionConfig, {});
    const sourceContext = asJson(body.sourceContext, {});

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_rule (
        rule_key, rule_name, description, module_key, source_type, source_ref, metric_id,
        system_metric_ref, semantic_ref, condition_mapping_id, condition_mapping_key,
        condition_operator_key, comparison_type, value_type, schedule_type, schedule_value,
        severity, primary_channel, condition_summary, condition_config, source_context,
        message_template, status, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(ruleKey)}',
        '${escapeSqlLiteral(ruleName)}',
        ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        '${escapeSqlLiteral(moduleKey)}',
        '${escapeSqlLiteral(sourceType)}',
        ${sourceRef ? `'${escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        ${metricId && Number.isFinite(metricId) ? metricId : 'NULL'},
        ${systemMetricRef ? `'${escapeSqlLiteral(systemMetricRef)}'` : 'NULL'},
        ${semanticRef ? `'${escapeSqlLiteral(semanticRef)}'` : 'NULL'},
        ${conditionMappingId && Number.isFinite(conditionMappingId) ? conditionMappingId : 'NULL'},
        ${conditionMappingKey ? `'${escapeSqlLiteral(conditionMappingKey)}'` : 'NULL'},
        ${conditionOperatorKey ? `'${escapeSqlLiteral(conditionOperatorKey)}'` : 'NULL'},
        ${comparisonType ? `'${escapeSqlLiteral(comparisonType)}'` : 'NULL'},
        ${valueType ? `'${escapeSqlLiteral(valueType)}'` : 'NULL'},
        '${escapeSqlLiteral(scheduleType)}',
        '${escapeSqlLiteral(scheduleValue)}',
        '${escapeSqlLiteral(severity)}',
        '${escapeSqlLiteral(primaryChannel)}',
        ${conditionSummary ? `'${escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        '${escapeSqlLiteral(JSON.stringify(conditionConfig))}'::jsonb,
        '${escapeSqlLiteral(JSON.stringify(sourceContext))}'::jsonb,
        ${messageTemplate ? `'${escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        'active', TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      RETURNING rule_id
    `);

    const ruleId = Number(insertedRows[0]?.rule_id || 0);
    await this.replaceAlertRuleRecipients(ruleId, recipients, actor);
    return this.alertingRuleDetail(String(ruleId));
  }

  async updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string) {
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT rule_id FROM public.alert_rule
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL LIMIT 1
    `);
    if (!existingRows.length) {
      throw new NotFoundException('Alert rule not found.');
    }

    const ruleName = String(body.ruleName || '').trim();
    const moduleKey = String(body.moduleKey || '').trim();
    const sourceType = String(body.sourceType || '').trim();
    if (!ruleName || !moduleKey || !sourceType) {
      throw new BadRequestException('ruleName, moduleKey, and sourceType are required.');
    }

    const metricId = body.metricId ? Number(body.metricId) : null;
    const conditionMappingId = body.conditionMappingId ? Number(body.conditionMappingId) : null;
    const recipients = Array.isArray(body.recipients) ? body.recipients : [];
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const sourceRef = typeof body.sourceRef === 'string' ? body.sourceRef.trim() : '';
    const systemMetricRef = typeof body.systemMetricRef === 'string' ? body.systemMetricRef.trim() : '';
    const semanticRef = typeof body.semanticRef === 'string' ? body.semanticRef.trim() : '';
    const conditionMappingKey = typeof body.conditionMappingKey === 'string' ? body.conditionMappingKey.trim() : '';
    const conditionOperatorKey = typeof body.conditionOperatorKey === 'string' ? body.conditionOperatorKey.trim() : '';
    const comparisonType = typeof body.comparisonType === 'string' ? body.comparisonType.trim() : '';
    const valueType = typeof body.valueType === 'string' ? body.valueType.trim() : '';
    const scheduleType = typeof body.scheduleType === 'string' ? body.scheduleType.trim() : 'preset';
    const scheduleValue = typeof body.scheduleValue === 'string' ? body.scheduleValue.trim() : '15m';
    const severity = typeof body.severity === 'string' ? body.severity.trim() : 'critical';
    const primaryChannel = typeof body.primaryChannel === 'string' ? body.primaryChannel.trim() : 'wa-group';
    const conditionSummary = typeof body.conditionSummary === 'string' ? body.conditionSummary.trim() : '';
    const messageTemplate = typeof body.messageTemplate === 'string' ? body.messageTemplate.trim() : '';
    const conditionConfig = asJson(body.conditionConfig, {});
    const sourceContext = asJson(body.sourceContext, {});

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule SET
        rule_name = '${escapeSqlLiteral(ruleName)}',
        description = ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        module_key = '${escapeSqlLiteral(moduleKey)}',
        source_type = '${escapeSqlLiteral(sourceType)}',
        source_ref = ${sourceRef ? `'${escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        metric_id = ${metricId && Number.isFinite(metricId) ? metricId : 'NULL'},
        system_metric_ref = ${systemMetricRef ? `'${escapeSqlLiteral(systemMetricRef)}'` : 'NULL'},
        semantic_ref = ${semanticRef ? `'${escapeSqlLiteral(semanticRef)}'` : 'NULL'},
        condition_mapping_id = ${conditionMappingId && Number.isFinite(conditionMappingId) ? conditionMappingId : 'NULL'},
        condition_mapping_key = ${conditionMappingKey ? `'${escapeSqlLiteral(conditionMappingKey)}'` : 'NULL'},
        condition_operator_key = ${conditionOperatorKey ? `'${escapeSqlLiteral(conditionOperatorKey)}'` : 'NULL'},
        comparison_type = ${comparisonType ? `'${escapeSqlLiteral(comparisonType)}'` : 'NULL'},
        value_type = ${valueType ? `'${escapeSqlLiteral(valueType)}'` : 'NULL'},
        schedule_type = '${escapeSqlLiteral(scheduleType)}',
        schedule_value = '${escapeSqlLiteral(scheduleValue)}',
        severity = '${escapeSqlLiteral(severity)}',
        primary_channel = '${escapeSqlLiteral(primaryChannel)}',
        condition_summary = ${conditionSummary ? `'${escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        condition_config = '${escapeSqlLiteral(JSON.stringify(conditionConfig))}'::jsonb,
        source_context = '${escapeSqlLiteral(JSON.stringify(sourceContext))}'::jsonb,
        message_template = ${messageTemplate ? `'${escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL
    `);

    await this.replaceAlertRuleRecipients(normalizedRuleId, recipients, actor);
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
    const normalizedRuleId = Number(ruleId);
    if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
      throw new BadRequestException('Invalid rule id.');
    }

    const rules = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT r.rule_id, r.rule_key, r.rule_name, r.metric_id, r.source_ref, r.severity, r.module_key
      FROM public.alert_rule r
      WHERE r.deleted_at IS NULL AND r.rule_id = ${normalizedRuleId}
      LIMIT 1
    `);

    if (!rules.length) {
      throw new NotFoundException('Alert rule not found.');
    }

    const rule = rules[0];
    const metricId = rule.metric_id ? Number(rule.metric_id) : null;
    const sourceRef = String(rule.source_ref || '').trim();

    const snapshots = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        s.snapshot_id, s.source_ref, s.insight_text, s.recommendation_preview,
        s.anomaly_level, s.status, s.is_alert_candidate, s.dimensions, s.evidence_payload,
        s.snapshot_at, b.label AS metric_label
      FROM public.metric_insight_snapshot s
      LEFT JOIN public.metric_business_registry b ON b.metric_id = s.metric_id
      WHERE s.deleted_at IS NULL
        AND s.is_alert_candidate = TRUE
        AND (
          ${metricId ? `s.metric_id = ${metricId}` : 'FALSE'}
          OR ${sourceRef ? `s.source_ref = '${escapeSqlLiteral(sourceRef)}'` : 'FALSE'}
        )
      ORDER BY s.snapshot_at DESC, s.snapshot_id DESC
      LIMIT 1
    `);

    const snapshot = snapshots[0] || null;
    const runStatus = snapshot ? 'success' : 'captured';
    let eventPayload: Record<string, unknown> | null = null;

    if (snapshot) {
      const eventKey = `evt-rule-${normalizedRuleId}-snapshot-${snapshot.snapshot_id}`;
      const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT event_id FROM public.alert_event
        WHERE event_key = '${escapeSqlLiteral(eventKey)}' LIMIT 1
      `);

      let eventId = Number(existing[0]?.event_id || 0);
      if (!eventId) {
        const inserted = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
          INSERT INTO public.alert_event (
            event_key, rule_id, metric_id, snapshot_id, title, description, severity,
            status, source_ref, event_payload, detected_at, created_by, updated_by
          ) VALUES (
            '${escapeSqlLiteral(eventKey)}',
            ${normalizedRuleId},
            ${metricId || 'NULL'},
            ${Number(snapshot.snapshot_id)},
            '${escapeSqlLiteral(String(snapshot.insight_text || rule.rule_name || 'Alert event').slice(0, 220))}',
            ${snapshot.insight_text ? `'${escapeSqlLiteral(String(snapshot.insight_text))}'` : 'NULL'},
            '${escapeSqlLiteral(String(rule.severity || snapshot.anomaly_level || 'critical'))}',
            'open',
            ${sourceRef ? `'${escapeSqlLiteral(sourceRef)}'` : 'NULL'},
            '${escapeSqlLiteral(JSON.stringify(asJson(snapshot.dimensions, {})))}'::jsonb,
            NOW(),
            '${escapeSqlLiteral(actor)}',
            '${escapeSqlLiteral(actor)}'
          )
          RETURNING event_id
        `);
        eventId = Number(inserted[0]?.event_id || 0);

        const recipients = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
          SELECT recipient_id, channel_type, target_value
          FROM public.alert_rule_recipient
          WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL AND is_active = TRUE
        `);

        for (const recipient of recipients) {
          await this.prisma.$executeRawUnsafe(`
            INSERT INTO public.alert_delivery_log (
              event_id, rule_id, recipient_id, channel_type, target_value, provider_name,
              delivery_status, response_payload, requested_at, delivered_at
            ) VALUES (
              ${eventId}, ${normalizedRuleId}, ${Number(recipient.recipient_id)},
              '${escapeSqlLiteral(String(recipient.channel_type || ''))}',
              '${escapeSqlLiteral(String(recipient.target_value || ''))}',
              'manual-run', 'queued', '{"trigger":"manual-run"}'::jsonb, NOW(), NULL
            )
          `);
        }
      }

      const eventsResult = await this.alertingEvents(undefined, String(eventId));
      eventPayload = eventsResult.data[0] || null;
    }

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_rule_run_log (
        rule_id, run_status, matched_count, triggered_event_count, execution_context,
        result_payload, started_at, finished_at
      ) VALUES (
        ${normalizedRuleId}, '${runStatus}',
        ${snapshot ? 1 : 0}, ${eventPayload ? 1 : 0},
        '{"trigger":"manual-run","actor":"${escapeSqlLiteral(actor)}"}'::jsonb,
        '${escapeSqlLiteral(JSON.stringify({
          snapshot_id: snapshot ? Number(snapshot.snapshot_id) : null,
          event_id: eventPayload
            ? Number((eventPayload as Record<string, unknown>).event_id || 0)
            : null,
        }))}'::jsonb,
        NOW(), NOW()
      )
    `);

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule
      SET last_run_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${normalizedRuleId}
    `);

    return {
      success: true,
      data: {
        rule_id: normalizedRuleId,
        matched_snapshot_id: snapshot ? Number(snapshot.snapshot_id) : null,
        event: eventPayload,
      },
    };
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
    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule_recipient SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE rule_id = ${ruleId} AND deleted_at IS NULL
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
          rule_id, recipient_type, channel_type, target_label, target_value,
          sort_order, metadata, is_active, created_by, updated_by
        ) VALUES (
          ${ruleId}, 'channel',
          '${escapeSqlLiteral(channelType)}',
          '${escapeSqlLiteral(targetLabel)}',
          '${escapeSqlLiteral(targetValue)}',
          ${index + 1}, '{}'::jsonb, TRUE,
          '${escapeSqlLiteral(actor)}',
          '${escapeSqlLiteral(actor)}'
        )
      `);
    }
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
