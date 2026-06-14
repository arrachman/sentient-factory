"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingRuleRunnerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_insight_query_service_1 = require("./alerting-insight-query.service");
let AlertingRuleRunnerService = class AlertingRuleRunnerService {
    prisma;
    alertingInsightQueryService;
    constructor(prisma, alertingInsightQueryService) {
        this.prisma = prisma;
        this.alertingInsightQueryService = alertingInsightQueryService;
    }
    async insertAlertingRule(body, actor) {
        const ruleName = String(body.ruleName || '').trim();
        const moduleKey = String(body.moduleKey || '').trim();
        const sourceType = String(body.sourceType || '').trim();
        if (!ruleName || !moduleKey || !sourceType) {
            throw new common_1.BadRequestException('ruleName, moduleKey, and sourceType are required.');
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
        const conditionConfig = (0, dashboard_utils_1.asJson)(body.conditionConfig, {});
        const sourceContext = (0, dashboard_utils_1.asJson)(body.sourceContext, {});
        const insertedRows = await this.prisma.$queryRawUnsafe(`
      INSERT INTO public.alert_rule (
        rule_key, rule_name, description, module_key, source_type, source_ref, metric_id,
        system_metric_ref, semantic_ref, condition_mapping_id, condition_mapping_key,
        condition_operator_key, comparison_type, value_type, schedule_type, schedule_value,
        severity, primary_channel, condition_summary, condition_config, source_context,
        message_template, status, is_active, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(ruleKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(ruleName)}',
        ${description ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(description)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(sourceType)}',
        ${sourceRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'NULL'},
        ${metricId && Number.isFinite(metricId) ? metricId : 'NULL'},
        ${systemMetricRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(systemMetricRef)}'` : 'NULL'},
        ${semanticRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(semanticRef)}'` : 'NULL'},
        ${conditionMappingId && Number.isFinite(conditionMappingId) ? conditionMappingId : 'NULL'},
        ${conditionMappingKey ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionMappingKey)}'` : 'NULL'},
        ${conditionOperatorKey ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionOperatorKey)}'` : 'NULL'},
        ${comparisonType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(comparisonType)}'` : 'NULL'},
        ${valueType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(valueType)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleType)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleValue)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(severity)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(primaryChannel)}',
        ${conditionSummary ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionSummary)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(conditionConfig))}'::jsonb,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(sourceContext))}'::jsonb,
        ${messageTemplate ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(messageTemplate)}'` : 'NULL'},
        'active', TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
      RETURNING rule_id
    `);
        const ruleId = Number(insertedRows[0]?.rule_id || 0);
        await this.replaceAlertRuleRecipients(ruleId, recipients, actor);
        return ruleId;
    }
    async applyAlertingRuleUpdate(normalizedRuleId, body, actor) {
        const existingRows = await this.prisma.$queryRawUnsafe(`
      SELECT rule_id FROM public.alert_rule
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL LIMIT 1
    `);
        if (!existingRows.length) {
            throw new common_1.NotFoundException('Alert rule not found.');
        }
        const ruleName = String(body.ruleName || '').trim();
        const moduleKey = String(body.moduleKey || '').trim();
        const sourceType = String(body.sourceType || '').trim();
        if (!ruleName || !moduleKey || !sourceType) {
            throw new common_1.BadRequestException('ruleName, moduleKey, and sourceType are required.');
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
        const conditionConfig = (0, dashboard_utils_1.asJson)(body.conditionConfig, {});
        const sourceContext = (0, dashboard_utils_1.asJson)(body.sourceContext, {});
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule SET
        rule_name = '${(0, dashboard_utils_1.escapeSqlLiteral)(ruleName)}',
        description = ${description ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(description)}'` : 'NULL'},
        module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}',
        source_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(sourceType)}',
        source_ref = ${sourceRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'NULL'},
        metric_id = ${metricId && Number.isFinite(metricId) ? metricId : 'NULL'},
        system_metric_ref = ${systemMetricRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(systemMetricRef)}'` : 'NULL'},
        semantic_ref = ${semanticRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(semanticRef)}'` : 'NULL'},
        condition_mapping_id = ${conditionMappingId && Number.isFinite(conditionMappingId) ? conditionMappingId : 'NULL'},
        condition_mapping_key = ${conditionMappingKey ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionMappingKey)}'` : 'NULL'},
        condition_operator_key = ${conditionOperatorKey ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionOperatorKey)}'` : 'NULL'},
        comparison_type = ${comparisonType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(comparisonType)}'` : 'NULL'},
        value_type = ${valueType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(valueType)}'` : 'NULL'},
        schedule_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleType)}',
        schedule_value = '${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleValue)}',
        severity = '${(0, dashboard_utils_1.escapeSqlLiteral)(severity)}',
        primary_channel = '${(0, dashboard_utils_1.escapeSqlLiteral)(primaryChannel)}',
        condition_summary = ${conditionSummary ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionSummary)}'` : 'NULL'},
        condition_config = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(conditionConfig))}'::jsonb,
        source_context = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(sourceContext))}'::jsonb,
        message_template = ${messageTemplate ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(messageTemplate)}'` : 'NULL'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE rule_id = ${normalizedRuleId} AND deleted_at IS NULL
    `);
        await this.replaceAlertRuleRecipients(normalizedRuleId, recipients, actor);
    }
    async runAlertingRule(ruleId, actor) {
        const normalizedRuleId = Number(ruleId);
        if (!Number.isFinite(normalizedRuleId) || normalizedRuleId <= 0) {
            throw new common_1.BadRequestException('Invalid rule id.');
        }
        const rules = await this.prisma.$queryRawUnsafe(`
      SELECT r.rule_id, r.rule_key, r.rule_name, r.metric_id, r.source_ref, r.severity, r.module_key
      FROM public.alert_rule r
      WHERE r.deleted_at IS NULL AND r.rule_id = ${normalizedRuleId}
      LIMIT 1
    `);
        if (!rules.length) {
            throw new common_1.NotFoundException('Alert rule not found.');
        }
        const rule = rules[0];
        const metricId = rule.metric_id ? Number(rule.metric_id) : null;
        const sourceRef = String(rule.source_ref || '').trim();
        const snapshots = await this.prisma.$queryRawUnsafe(`
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
          OR ${sourceRef ? `s.source_ref = '${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'FALSE'}
        )
      ORDER BY s.snapshot_at DESC, s.snapshot_id DESC
      LIMIT 1
    `);
        const snapshot = snapshots[0] || null;
        const runStatus = snapshot ? 'success' : 'captured';
        let eventPayload = null;
        if (snapshot) {
            const eventKey = `evt-rule-${normalizedRuleId}-snapshot-${snapshot.snapshot_id}`;
            const existing = await this.prisma.$queryRawUnsafe(`
        SELECT event_id FROM public.alert_event
        WHERE event_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(eventKey)}' LIMIT 1
      `);
            let eventId = Number(existing[0]?.event_id || 0);
            if (!eventId) {
                const inserted = await this.prisma.$queryRawUnsafe(`
          INSERT INTO public.alert_event (
            event_key, rule_id, metric_id, snapshot_id, title, description, severity,
            status, source_ref, event_payload, detected_at, created_by, updated_by
          ) VALUES (
            '${(0, dashboard_utils_1.escapeSqlLiteral)(eventKey)}',
            ${normalizedRuleId},
            ${metricId || 'NULL'},
            ${Number(snapshot.snapshot_id)},
            '${(0, dashboard_utils_1.escapeSqlLiteral)(String(snapshot.insight_text || rule.rule_name || 'Alert event').slice(0, 220))}',
            ${snapshot.insight_text ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(String(snapshot.insight_text))}'` : 'NULL'},
            '${(0, dashboard_utils_1.escapeSqlLiteral)(String(rule.severity || snapshot.anomaly_level || 'critical'))}',
            'open',
            ${sourceRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'NULL'},
            '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify((0, dashboard_utils_1.asJson)(snapshot.dimensions, {})))}'::jsonb,
            NOW(),
            '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
            '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
          )
          RETURNING event_id
        `);
                eventId = Number(inserted[0]?.event_id || 0);
                const recipients = await this.prisma.$queryRawUnsafe(`
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
              '${(0, dashboard_utils_1.escapeSqlLiteral)(String(recipient.channel_type || ''))}',
              '${(0, dashboard_utils_1.escapeSqlLiteral)(String(recipient.target_value || ''))}',
              'manual-run', 'queued', '{"trigger":"manual-run"}'::jsonb, NOW(), NULL
            )
          `);
                }
            }
            const eventsResult = await this.alertingInsightQueryService.alertingEvents(undefined, String(eventId));
            eventPayload = eventsResult.data[0] || null;
        }
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_rule_run_log (
        rule_id, run_status, matched_count, triggered_event_count, execution_context,
        result_payload, started_at, finished_at
      ) VALUES (
        ${normalizedRuleId}, '${runStatus}',
        ${snapshot ? 1 : 0}, ${eventPayload ? 1 : 0},
        '{"trigger":"manual-run","actor":"${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}"}'::jsonb,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify({
            snapshot_id: snapshot ? Number(snapshot.snapshot_id) : null,
            event_id: eventPayload
                ? Number(eventPayload.event_id || 0)
                : null,
        }))}'::jsonb,
        NOW(), NOW()
      )
    `);
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule
      SET last_run_at = NOW(), updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
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
    async replaceAlertRuleRecipients(ruleId, recipients, actor) {
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_rule_recipient SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE rule_id = ${ruleId} AND deleted_at IS NULL
    `);
        for (let index = 0; index < recipients.length; index += 1) {
            const item = recipients[index];
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
          '${(0, dashboard_utils_1.escapeSqlLiteral)(channelType)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(targetLabel)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(targetValue)}',
          ${index + 1}, '{}'::jsonb, TRUE,
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
        )
      `);
        }
    }
    slugify(value) {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 48);
    }
};
exports.AlertingRuleRunnerService = AlertingRuleRunnerService;
exports.AlertingRuleRunnerService = AlertingRuleRunnerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_insight_query_service_1.AlertingInsightQueryService])
], AlertingRuleRunnerService);
//# sourceMappingURL=alerting-rule-runner.service.js.map