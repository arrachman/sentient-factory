import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingInsightQueryService } from './alerting-insight-query.service';

@Injectable()
export class AlertingRuleRunnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingInsightQueryService: AlertingInsightQueryService,
  ) {}

  // ── Rule write helpers (insert/update + recipients) ──────────────────────────

  async insertAlertingRule(body: Record<string, unknown>, actor: string): Promise<number> {
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
    return ruleId;
  }

  async applyAlertingRuleUpdate(
    normalizedRuleId: number,
    body: Record<string, unknown>,
    actor: string,
  ): Promise<void> {
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
  }

  // ── Rule execution ────────────────────────────────────────────────────────────

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

      const eventsResult = await this.alertingInsightQueryService.alertingEvents(
        undefined,
        String(eventId),
      );
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

  // ── Recipient management ──────────────────────────────────────────────────────

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

  // ── Private helpers ───────────────────────────────────────────────────────────

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }
}
