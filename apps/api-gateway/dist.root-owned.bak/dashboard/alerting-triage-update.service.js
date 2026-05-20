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
exports.AlertingTriageUpdateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
let AlertingTriageUpdateService = class AlertingTriageUpdateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAlertingTriageRecoveryConfig() {
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key = 'triage_auto_close_on_recovery'
      LIMIT 1
    `);
        const row = rows[0];
        const valueJson = (0, dashboard_utils_1.asJson)(row?.value_json, {});
        const valueText = typeof row?.value_text === 'string' ? row.value_text.trim().toLowerCase() : '';
        const enabled = typeof valueJson['enabled'] === 'boolean'
            ? Boolean(valueJson['enabled'])
            : ['enabled', 'true', 'yes', '1', 'on'].includes(valueText);
        return { enabled };
    }
    async createAlertDeadLetterTriageAudit(input) {
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
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actionType)}',
        ${input.previousTriageStatus ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.previousTriageStatus)}'` : 'NULL'},
        ${input.nextTriageStatus ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.nextTriageStatus)}'` : 'NULL'},
        ${input.previousAcknowledgedAt ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.previousAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.nextAcknowledgedAt ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.nextAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.previousAssignedTo ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.previousAssignedTo)}'` : 'NULL'},
        ${input.nextAssignedTo ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.nextAssignedTo)}'` : 'NULL'},
        ${input.noteSnapshot ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.noteSnapshot)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actor)}'
      )
    `);
    }
    async updateAlertingDeadLetterTriage(deliveryId, body, actor, listingFn) {
        const normalizedDeliveryId = Number(deliveryId);
        if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
            throw new common_1.BadRequestException('Invalid delivery id.');
        }
        const triageStatus = String(body.triageStatus || body.triage_status || '')
            .trim()
            .toLowerCase();
        const assignedTo = typeof body.assignedTo === 'string'
            ? body.assignedTo.trim()
            : typeof body.assigned_to === 'string'
                ? body.assigned_to.trim()
                : '';
        const note = typeof body.note === 'string' ? body.note.trim() : '';
        const acknowledge = Boolean(body.acknowledge ?? body.acknowledged ?? false);
        const unacknowledge = Boolean(body.unacknowledge ?? false);
        if (acknowledge && unacknowledge) {
            throw new common_1.BadRequestException('acknowledge and unacknowledge cannot both be true.');
        }
        if (!['open', 'investigating', 'requeued', 'resolved'].includes(triageStatus)) {
            throw new common_1.BadRequestException('Invalid triage status.');
        }
        const deliveryRows = await this.prisma.$queryRawUnsafe(`
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
            throw new common_1.NotFoundException('Alert delivery log not found.');
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
        '${(0, dashboard_utils_1.escapeSqlLiteral)(triageStatus)}',
        ${acknowledge ? 'NOW()' : 'NULL'},
        ${acknowledge ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'` : 'NULL'},
        ${assignedTo ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(assignedTo)}'` : 'NULL'},
        ${note ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(note)}'` : 'NULL'},
        NOW(),
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = '${(0, dashboard_utils_1.escapeSqlLiteral)(triageStatus)}',
        acknowledged_at = ${acknowledge
            ? 'COALESCE(public.alert_dead_letter_triage.acknowledged_at, NOW())'
            : unacknowledge
                ? 'NULL'
                : triageStatus === 'open' || triageStatus === 'requeued'
                    ? 'NULL'
                    : 'public.alert_dead_letter_triage.acknowledged_at'},
        acknowledged_by = ${acknowledge
            ? `COALESCE(public.alert_dead_letter_triage.acknowledged_by, '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}')`
            : unacknowledge
                ? 'NULL'
                : triageStatus === 'open' || triageStatus === 'requeued'
                    ? 'NULL'
                    : 'public.alert_dead_letter_triage.acknowledged_by'},
        assigned_to = ${assignedTo ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(assignedTo)}'` : 'NULL'},
        note = ${note ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(note)}'` : 'NULL'},
        last_action_at = NOW(),
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
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
            detailPayload: { acknowledge, unacknowledge },
            actor,
        });
        return listingFn();
    }
    async getAlertingTriagePolicy() {
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_sla_minutes', 'triage_escalation_policy')
    `);
        const settings = new Map();
        for (const row of rows) {
            settings.set(String(row.setting_key || ''), {
                value_text: typeof row.value_text === 'string' ? row.value_text : null,
                value_json: (0, dashboard_utils_1.asJson)(row.value_json, {}),
            });
        }
        const slaSetting = settings.get('triage_sla_minutes');
        const escalationSetting = settings.get('triage_escalation_policy');
        const configuredSla = Number(slaSetting?.value_json?.minutes ||
            (slaSetting?.value_text ? Number.parseInt(slaSetting.value_text, 10) : NaN));
        const warningAfterMinutes = Number(escalationSetting?.value_json?.warning_after_minutes ||
            configuredSla);
        const criticalAfterMinutes = Number(escalationSetting?.value_json?.critical_after_minutes ||
            (Number.isFinite(warningAfterMinutes) ? warningAfterMinutes * 2 : NaN));
        return {
            sla_minutes: Number.isFinite(configuredSla) && configuredSla > 0 ? configuredSla : 60,
            warning_after_minutes: Number.isFinite(warningAfterMinutes) && warningAfterMinutes > 0 ? warningAfterMinutes : 60,
            critical_after_minutes: Number.isFinite(criticalAfterMinutes) && criticalAfterMinutes > 0
                ? criticalAfterMinutes
                : 120,
        };
    }
};
exports.AlertingTriageUpdateService = AlertingTriageUpdateService;
exports.AlertingTriageUpdateService = AlertingTriageUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertingTriageUpdateService);
//# sourceMappingURL=alerting-triage-update.service.js.map