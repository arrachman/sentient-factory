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
exports.AlertingTriageViewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_rule_service_1 = require("./alerting-rule.service");
let AlertingTriageViewService = class AlertingTriageViewService {
    prisma;
    alertingRuleService;
    constructor(prisma, alertingRuleService) {
        this.prisma = prisma;
        this.alertingRuleService = alertingRuleService;
    }
    async alertingTriageSavedViews(actor) {
        const normalizedActor = String(actor || 'system').trim() || 'system';
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT
        view_id, view_key, name, owner_actor, is_shared, is_default,
        filters_json, sort_by, sort_order, metadata, is_active, created_at
      FROM public.alert_triage_saved_view
      WHERE deleted_at IS NULL
        AND (
          owner_actor = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
          OR is_shared = TRUE OR owner_actor IS NULL
        )
      ORDER BY is_default DESC, is_shared DESC, created_at DESC, view_id DESC
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
                filters_json: (0, dashboard_utils_1.asJson)(row.filters_json, {}),
                sort_by: String(row.sort_by || 'dead_lettered_at'),
                sort_order: String(row.sort_order || 'desc'),
                metadata: (0, dashboard_utils_1.asJson)(row.metadata, {}),
                is_active: Boolean(row.is_active),
                created_at: row.created_at || null,
                is_owned_by_current_user: String(row.owner_actor || '') === normalizedActor,
            })),
        };
    }
    normalizeAlertingTriageSavedViewPayload(body) {
        const name = String(body.name || '').trim();
        const isShared = Boolean(body.isShared ?? body.is_shared ?? false);
        const isDefault = Boolean(body.isDefault ?? body.is_default ?? false);
        const filtersJson = (0, dashboard_utils_1.asJson)(body.filtersJson ?? body.filters_json, {});
        const sortBy = String(body.sortBy || body.sort_by || 'dead_lettered_at').trim() || 'dead_lettered_at';
        const sortOrder = String(body.sortOrder || body.sort_order || 'desc').trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
        if (!name) {
            throw new common_1.BadRequestException('name is required.');
        }
        if (!['dead_lettered_at', 'age_minutes', 'sla_due_at', 'triage_updated_at', 'escalation_count', 'event_title'].includes(sortBy)) {
            throw new common_1.BadRequestException('sortBy is invalid.');
        }
        return { name, isShared, isDefault, filtersJson, sortBy, sortOrder };
    }
    async createAlertingTriageSavedView(body, actor) {
        const normalizedActor = String(actor || 'system').trim() || 'system';
        const payload = this.normalizeAlertingTriageSavedViewPayload(body);
        const viewKey = `triage-view-${Date.now()}`;
        if (payload.isDefault) {
            await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      `);
        }
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_saved_view (
        view_key, name, owner_actor, is_shared, is_default, filters_json,
        sort_by, sort_order, metadata, is_active, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(viewKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.name)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}',
        ${payload.isShared ? 'TRUE' : 'FALSE'},
        ${payload.isDefault ? 'TRUE' : 'FALSE'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(payload.filtersJson))}'::jsonb,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.sortBy)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.sortOrder)}',
        '{}'::jsonb, TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      )
    `);
        return this.alertingTriageSavedViews(normalizedActor);
    }
    async updateAlertingTriageSavedView(viewId, body, actor) {
        const normalizedViewId = Number(viewId);
        if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
            throw new common_1.BadRequestException('Invalid saved view id.');
        }
        const normalizedActor = String(actor || 'system').trim() || 'system';
        const payload = this.normalizeAlertingTriageSavedViewPayload(body);
        const existingRows = await this.prisma.$queryRawUnsafe(`
      SELECT owner_actor FROM public.alert_triage_saved_view
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL LIMIT 1
    `);
        const existing = existingRows[0];
        if (!existing) {
            throw new common_1.NotFoundException('Saved view not found.');
        }
        const ownerActor = String(existing.owner_actor || '');
        if (ownerActor && ownerActor !== normalizedActor) {
            throw new common_1.BadRequestException('You can only update your own saved view.');
        }
        if (payload.isDefault) {
            await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      `);
        }
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        name = '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.name)}',
        is_shared = ${payload.isShared ? 'TRUE' : 'FALSE'},
        is_default = ${payload.isDefault ? 'TRUE' : 'FALSE'},
        filters_json = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(payload.filtersJson))}'::jsonb,
        sort_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.sortBy)}',
        sort_order = '${(0, dashboard_utils_1.escapeSqlLiteral)(payload.sortOrder)}',
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
    `);
        return this.alertingTriageSavedViews(normalizedActor);
    }
    async updateAlertingTriageSavedViewState(viewId, body, actor) {
        const normalizedViewId = Number(viewId);
        if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
            throw new common_1.BadRequestException('Invalid saved view id.');
        }
        const normalizedActor = String(actor || 'system').trim() || 'system';
        const isActive = Boolean(body.isActive ?? body.is_active);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND (owner_actor = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}' OR owner_actor IS NULL)
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Saved view not found.');
        }
        return this.alertingTriageSavedViews(normalizedActor);
    }
    async deleteAlertingTriageSavedView(viewId, actor) {
        const normalizedViewId = Number(viewId);
        if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
            throw new common_1.BadRequestException('Invalid saved view id.');
        }
        const normalizedActor = String(actor || 'system').trim() || 'system';
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = FALSE, deleted_at = NOW(),
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND owner_actor = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedActor)}'
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Saved view not found or not owned by current user.');
        }
        return this.alertingTriageSavedViews(normalizedActor);
    }
    async updateAlertingEvent(eventId, body, actor) {
        const normalizedEventId = Number(eventId);
        if (!Number.isFinite(normalizedEventId) || normalizedEventId <= 0) {
            throw new common_1.BadRequestException('Invalid event id.');
        }
        const status = String(body?.status || '').trim().toLowerCase();
        if (!['acknowledged', 'resolved', 'open', 'muted'].includes(status)) {
            throw new common_1.BadRequestException('Invalid event status.');
        }
        const existingRows = await this.prisma.$queryRawUnsafe(`
      SELECT status FROM public.alert_event
      WHERE deleted_at IS NULL AND event_id = ${normalizedEventId} LIMIT 1
    `);
        if (!existingRows[0]) {
            throw new common_1.NotFoundException('Alert event not found.');
        }
        const currentStatus = String(existingRows[0].status || '').trim().toLowerCase();
        const allowedTransitions = {
            open: ['acknowledged', 'resolved', 'muted'],
            acknowledged: ['resolved', 'muted', 'open'],
            muted: ['open', 'resolved'],
            resolved: [],
        };
        if (currentStatus !== status && !(allowedTransitions[currentStatus] || []).includes(status)) {
            throw new common_1.BadRequestException(`Invalid event transition from "${currentStatus}" to "${status}".`);
        }
        const updates = [
            `status = '${(0, dashboard_utils_1.escapeSqlLiteral)(status)}'`,
            `updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'`,
        ];
        if (status === 'acknowledged')
            updates.push('acknowledged_at = NOW()');
        if (status === 'resolved')
            updates.push('resolved_at = NOW()');
        if (status === 'open') {
            updates.push('acknowledged_at = NULL');
            updates.push('resolved_at = NULL');
        }
        const affected = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_event
      SET ${updates.join(', ')}
      WHERE deleted_at IS NULL AND event_id = ${normalizedEventId}
    `);
        if (!affected) {
            throw new common_1.NotFoundException('Alert event not found.');
        }
        const result = await this.alertingRuleService.alertingEvents(undefined, String(normalizedEventId));
        return { success: true, data: result.data[0] || null };
    }
};
exports.AlertingTriageViewService = AlertingTriageViewService;
exports.AlertingTriageViewService = AlertingTriageViewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_rule_service_1.AlertingRuleService])
], AlertingTriageViewService);
//# sourceMappingURL=alerting-triage-view.service.js.map