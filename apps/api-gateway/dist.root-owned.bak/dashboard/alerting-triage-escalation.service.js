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
var AlertingTriageEscalationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingTriageEscalationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_delivery_service_1 = require("./alerting-delivery.service");
const alerting_triage_service_1 = require("./alerting-triage.service");
const alerting_triage_escalation_resolver_service_1 = require("./alerting-triage-escalation-resolver.service");
let AlertingTriageEscalationService = AlertingTriageEscalationService_1 = class AlertingTriageEscalationService {
    prisma;
    alertingTriageService;
    alertingDeliveryService;
    resolver;
    logger = new common_1.Logger(AlertingTriageEscalationService_1.name);
    constructor(prisma, alertingTriageService, alertingDeliveryService, resolver) {
        this.prisma = prisma;
        this.alertingTriageService = alertingTriageService;
        this.alertingDeliveryService = alertingDeliveryService;
        this.resolver = resolver;
    }
    async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
        const [triagePayload, escalationConfig] = await Promise.all([
            this.alertingTriageService.alertingDeadLetterTriage(),
            this.getAlertingTriageEscalationConfig(),
        ]);
        const items = Array.isArray(triagePayload.data)
            ? triagePayload.data
            : [];
        const escalationRule = await this.ensureAlertingTriageEscalationRule(actor);
        const nowMs = Date.now();
        const cooldownMs = escalationConfig.cooldown_minutes * 60000;
        const results = [];
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
            const escalationTargetResult = await this.resolver.resolveAlertingTriageEscalationTargets(escalationConfig.channel_key, item.module_key ? String(item.module_key) : null, escalationLevel, item.assigned_to ? String(item.assigned_to) : null, Number(item.escalation_count || 0), severityChanged);
            const targets = escalationTargetResult.targets;
            if (!targets.length) {
                results.push({
                    delivery_id: deliveryId,
                    escalated: false,
                    reason: escalationTargetResult.stage_priority === null
                        ? 'no-target-channel'
                        : 'stage-target-not-found',
                    escalation_level: escalationLevel,
                    escalation_stage_index: escalationTargetResult.stage_index,
                    escalation_stage_priority: escalationTargetResult.stage_priority,
                    repeating_final_stage: escalationTargetResult.repeating_final_stage,
                });
                continue;
            }
            const insertedEvents = await this.prisma.$queryRawUnsafe(`
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
          '${(0, dashboard_utils_1.escapeSqlLiteral)(eventKey)}',
          ${escalationRule.rule_id},
          NULL,
          NULL,
          '${(0, dashboard_utils_1.escapeSqlLiteral)(title)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(description)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(severity)}',
          'open',
          'dead-letter-triage',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify({
                triage_delivery_id: deliveryId,
                triage_status: triageStatus,
                escalation_level: escalationLevel,
                source_event_id: Number(item.event_id || 0),
                source_event_key: item.event_key || null,
            }))}'::jsonb,
          NOW(),
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
        )
        RETURNING event_id
      `);
            const escalationEventId = Number(insertedEvents[0]?.event_id || 0);
            const insertedDeliveries = [];
            for (const target of targets) {
                const deliveryRows = await this.prisma.$queryRawUnsafe(`
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
            '${(0, dashboard_utils_1.escapeSqlLiteral)(String(target.channel_type || ''))}',
            '${(0, dashboard_utils_1.escapeSqlLiteral)(String(target.target_value || ''))}',
            'triage-escalation',
            'queued',
            '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify({
                    trigger: 'triage-escalation',
                    source_delivery_id: deliveryId,
                    escalation_level: escalationLevel,
                    escalation_channel_key: String(target.channel_key || ''),
                    escalation_owner_label: target.owner_label || null,
                    escalation_stage_index: escalationTargetResult.stage_index,
                    escalation_stage_priority: escalationTargetResult.stage_priority,
                    escalation_routing_source: target.routing_source || null,
                    repeating_final_stage: escalationTargetResult.repeating_final_stage,
                }))}'::jsonb,
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
          '${(0, dashboard_utils_1.escapeSqlLiteral)(triageStatus)}',
          ${item.assigned_to ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(String(item.assigned_to))}'` : 'NULL'},
          ${item.note ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(String(item.note))}'` : 'NULL'},
          1,
          NOW(),
          '${(0, dashboard_utils_1.escapeSqlLiteral)(escalationLevel)}',
          NOW(),
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
          '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
        )
        ON CONFLICT (delivery_id) DO UPDATE SET
          escalation_count = COALESCE(public.alert_dead_letter_triage.escalation_count, 0) + 1,
          last_escalated_at = NOW(),
          last_escalation_level = '${(0, dashboard_utils_1.escapeSqlLiteral)(escalationLevel)}',
          last_action_at = NOW(),
          updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
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
                routed_to_owner: targets.some((target) => String(target.routing_source || '') === 'assigned-owner'),
            });
        }
        const escalatedCount = results.filter((item) => item.escalated).length;
        const deliveryRun = escalatedCount
            ? await this.alertingDeliveryService.runAlertDeliveryCycle(actor)
            : null;
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
    }
    async getAlertingTriageEscalationConfig() {
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_escalation_channel_key', 'triage_escalation_cooldown_minutes')
    `);
        const settings = new Map();
        for (const row of rows) {
            settings.set(String(row.setting_key || ''), {
                value_text: typeof row.value_text === 'string' ? row.value_text : null,
                value_json: (row.value_json && typeof row.value_json === 'object'
                    ? row.value_json
                    : {}),
            });
        }
        const channelSetting = settings.get('triage_escalation_channel_key');
        const cooldownSetting = settings.get('triage_escalation_cooldown_minutes');
        const channelKey = String(channelSetting?.value_json?.channel_key ||
            channelSetting?.value_text ||
            'channel-ops-alert-group').trim() || 'channel-ops-alert-group';
        const cooldownMinutes = Number(cooldownSetting?.value_json?.minutes ||
            (cooldownSetting?.value_text ? Number.parseInt(cooldownSetting.value_text, 10) : NaN));
        return {
            channel_key: channelKey,
            cooldown_minutes: Number.isFinite(cooldownMinutes) && cooldownMinutes > 0 ? cooldownMinutes : 60,
        };
    }
    async ensureAlertingTriageEscalationRule(actor) {
        const existing = await this.prisma.$queryRawUnsafe(`
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
        const inserted = await this.prisma.$queryRawUnsafe(`
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
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
      RETURNING rule_id, rule_key
    `);
        return {
            rule_id: Number(inserted[0]?.rule_id || 0),
            rule_key: String(inserted[0]?.rule_key || 'system-dead-letter-triage-escalation'),
        };
    }
};
exports.AlertingTriageEscalationService = AlertingTriageEscalationService;
exports.AlertingTriageEscalationService = AlertingTriageEscalationService = AlertingTriageEscalationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_triage_service_1.AlertingTriageService,
        alerting_delivery_service_1.AlertingDeliveryService,
        alerting_triage_escalation_resolver_service_1.AlertingTriageEscalationResolverService])
], AlertingTriageEscalationService);
//# sourceMappingURL=alerting-triage-escalation.service.js.map