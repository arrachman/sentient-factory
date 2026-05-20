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
exports.AlertingTriageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const alerting_triage_update_service_1 = require("./alerting-triage-update.service");
const alerting_triage_utils_1 = require("./alerting-triage.utils");
let AlertingTriageService = class AlertingTriageService {
    prisma;
    triageUpdate;
    constructor(prisma, triageUpdate) {
        this.prisma = prisma;
        this.triageUpdate = triageUpdate;
    }
    async getAlertingTriageRecoveryConfig() {
        return this.triageUpdate.getAlertingTriageRecoveryConfig();
    }
    async createAlertDeadLetterTriageAudit(input) {
        return this.triageUpdate.createAlertDeadLetterTriageAudit(input);
    }
    async updateAlertingDeadLetterTriage(deliveryId, body, actor) {
        return this.triageUpdate.updateAlertingDeadLetterTriage(deliveryId, body, actor, () => this.alertingDeadLetterTriage());
    }
    async alertingDeadLetterTriage(query = {}) {
        const params = (0, alerting_triage_utils_1.parseTriageQueryParams)(query);
        const [policy, escalationPolicies] = await Promise.all([
            this.triageUpdate.getAlertingTriagePolicy(),
            this.prisma.$queryRawUnsafe(`
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
        const rows = await this.prisma.$queryRawUnsafe(`
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
        const [timelineRows, auditRows] = await Promise.all([
            deliveryIds.length
                ? this.prisma.$queryRawUnsafe(`
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
                : Promise.resolve([]),
            deliveryIds.length
                ? this.prisma.$queryRawUnsafe(`
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
                : Promise.resolve([]),
        ]);
        const timelineByDeliveryId = (0, alerting_triage_utils_1.buildTimelineByDeliveryId)(timelineRows);
        const auditByDeliveryId = (0, alerting_triage_utils_1.buildAuditByDeliveryId)(auditRows);
        const items = rows.map((row) => {
            const baseItem = (0, alerting_triage_utils_1.mapTriageRow)(row);
            const triageMetrics = (0, alerting_triage_utils_1.buildAlertingTriageMetrics)(baseItem, policy);
            const stageMetrics = (0, alerting_triage_utils_1.buildAlertingTriageStageMetrics)({ ...baseItem, ...triageMetrics }, escalationPolicies);
            return {
                ...baseItem,
                ...triageMetrics,
                ...stageMetrics,
                escalation_timeline: timelineByDeliveryId.get(baseItem.delivery_id) || [],
                triage_audit_timeline: auditByDeliveryId.get(baseItem.delivery_id) || [],
            };
        });
        const filteredItems = (0, alerting_triage_utils_1.filterAndSortTriageItems)(items, params);
        const summary = (0, alerting_triage_utils_1.buildTriageSummary)(filteredItems);
        const auditSummary = (0, alerting_triage_utils_1.buildTriageAuditSummary)(filteredItems);
        return {
            success: true,
            data: filteredItems,
            policy,
            summary,
            audit_summary: auditSummary,
            filter_context: {
                delivery_id: params.deliveryIdFilter,
                triage_status: params.triageStatusFilter,
                acknowledged: params.acknowledgedFilter,
                sla_status: params.slaStatusFilter,
                module_key: params.moduleFilter,
                stage: params.stageFilter,
                search: params.searchFilter,
                sort_by: params.sortBy,
                sort_order: params.sortOrder,
            },
        };
    }
};
exports.AlertingTriageService = AlertingTriageService;
exports.AlertingTriageService = AlertingTriageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_triage_update_service_1.AlertingTriageUpdateService])
], AlertingTriageService);
//# sourceMappingURL=alerting-triage.service.js.map