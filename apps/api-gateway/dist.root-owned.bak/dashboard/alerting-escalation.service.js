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
exports.AlertingEscalationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_triage_view_service_1 = require("./alerting-triage-view.service");
let AlertingEscalationService = class AlertingEscalationService {
    prisma;
    alertingTriageViewService;
    constructor(prisma, alertingTriageViewService) {
        this.prisma = prisma;
        this.alertingTriageViewService = alertingTriageViewService;
    }
    async alertingEscalationPolicies(module, targetType) {
        const where = ['deleted_at IS NULL'];
        if (module && module !== 'all') {
            where.push(`module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(module)}'`);
        }
        if (targetType && targetType !== 'all') {
            where.push(`target_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetType)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT policy_id, module_key, escalation_level, target_type, target_ref,
        priority, is_active, metadata, created_at
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
                metadata: (0, dashboard_utils_1.asJson)(row.metadata, {}),
                created_at: row.created_at,
            })),
        };
    }
    async validateAlertingEscalationTarget(targetType, targetRef) {
        if (!targetType || !targetRef) {
            throw new common_1.BadRequestException('targetType and targetRef are required.');
        }
        if (targetType === 'channel') {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT channel_id FROM public.alert_notification_channel
        WHERE channel_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetRef)}' AND deleted_at IS NULL LIMIT 1
      `);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Escalation target_ref "${targetRef}" was not found in alert_notification_channel.`);
            }
        }
        else if (targetType === 'role') {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT role_id FROM public.alert_routing_role
        WHERE role_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Escalation target_ref "${targetRef}" was not found in alert_routing_role.`);
            }
        }
        else if (targetType === 'team') {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT team_id FROM public.alert_routing_team
        WHERE team_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Escalation target_ref "${targetRef}" was not found in alert_routing_team.`);
            }
        }
    }
    async createAlertingEscalationPolicy(body, actor) {
        const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
        const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
        const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
        const targetRef = String(body.targetRef || body.target_ref || '').trim();
        const priority = Number.parseInt(String(body.priority ?? 10), 10);
        if (!moduleKey || !escalationLevel || !targetRef) {
            throw new common_1.BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
        }
        if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
            throw new common_1.BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
        }
        if (!['warning', 'critical'].includes(escalationLevel)) {
            throw new common_1.BadRequestException('escalationLevel must be warning or critical.');
        }
        if (!['channel', 'role', 'team'].includes(targetType)) {
            throw new common_1.BadRequestException('targetType must be channel, role, or team.');
        }
        if (!Number.isFinite(priority)) {
            throw new common_1.BadRequestException('priority must be a valid integer.');
        }
        await this.validateAlertingEscalationTarget(targetType, targetRef);
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_escalation_policy (
        module_key, escalation_level, target_type, target_ref, priority,
        metadata, is_active, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}', '${(0, dashboard_utils_1.escapeSqlLiteral)(escalationLevel)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(targetType)}', '${(0, dashboard_utils_1.escapeSqlLiteral)(targetRef)}',
        ${priority}, '{}'::jsonb, TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}', '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
    `);
        return this.alertingEscalationPolicies('all', 'all');
    }
    async updateAlertingEscalationPolicy(policyId, body, actor) {
        const normalizedPolicyId = Number(policyId);
        if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
            throw new common_1.BadRequestException('Invalid escalation policy id.');
        }
        const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
        const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
        const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
        const targetRef = String(body.targetRef || body.target_ref || '').trim();
        const priority = Number.parseInt(String(body.priority ?? 10), 10);
        if (!moduleKey || !escalationLevel || !targetRef) {
            throw new common_1.BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
        }
        if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
            throw new common_1.BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
        }
        if (!['warning', 'critical'].includes(escalationLevel)) {
            throw new common_1.BadRequestException('escalationLevel must be warning or critical.');
        }
        if (!['channel', 'role', 'team'].includes(targetType)) {
            throw new common_1.BadRequestException('targetType must be channel, role, or team.');
        }
        if (!Number.isFinite(priority)) {
            throw new common_1.BadRequestException('priority must be a valid integer.');
        }
        await this.validateAlertingEscalationTarget(targetType, targetRef);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}',
        escalation_level = '${(0, dashboard_utils_1.escapeSqlLiteral)(escalationLevel)}',
        target_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetType)}',
        target_ref = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetRef)}',
        priority = ${priority},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Escalation policy not found.');
        }
        return this.alertingEscalationPolicies('all', 'all');
    }
    async updateAlertingEscalationPolicyState(policyId, body, actor) {
        const normalizedPolicyId = Number(policyId);
        if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
            throw new common_1.BadRequestException('Invalid escalation policy id.');
        }
        const isActive = Boolean(body.isActive ?? body.is_active);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Escalation policy not found.');
        }
        return this.alertingEscalationPolicies('all', 'all');
    }
    async deleteAlertingEscalationPolicy(policyId, actor) {
        const normalizedPolicyId = Number(policyId);
        if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
            throw new common_1.BadRequestException('Invalid escalation policy id.');
        }
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Escalation policy not found.');
        }
        return this.alertingEscalationPolicies('all', 'all');
    }
    async alertingTriageSavedViews(actor) {
        return this.alertingTriageViewService.alertingTriageSavedViews(actor);
    }
    async createAlertingTriageSavedView(body, actor) {
        return this.alertingTriageViewService.createAlertingTriageSavedView(body, actor);
    }
    async updateAlertingTriageSavedView(viewId, body, actor) {
        return this.alertingTriageViewService.updateAlertingTriageSavedView(viewId, body, actor);
    }
    async updateAlertingTriageSavedViewState(viewId, body, actor) {
        return this.alertingTriageViewService.updateAlertingTriageSavedViewState(viewId, body, actor);
    }
    async deleteAlertingTriageSavedView(viewId, actor) {
        return this.alertingTriageViewService.deleteAlertingTriageSavedView(viewId, actor);
    }
    async updateAlertingEvent(eventId, body, actor) {
        return this.alertingTriageViewService.updateAlertingEvent(eventId, body, actor);
    }
};
exports.AlertingEscalationService = AlertingEscalationService;
exports.AlertingEscalationService = AlertingEscalationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_triage_view_service_1.AlertingTriageViewService])
], AlertingEscalationService);
//# sourceMappingURL=alerting-escalation.service.js.map