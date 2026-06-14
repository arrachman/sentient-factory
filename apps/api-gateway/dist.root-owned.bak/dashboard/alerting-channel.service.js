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
exports.AlertingChannelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_rule_service_1 = require("./alerting-rule.service");
const alerting_delivery_service_1 = require("./alerting-delivery.service");
const alerting_provider_session_service_1 = require("./alerting-provider-session.service");
let AlertingChannelService = class AlertingChannelService {
    prisma;
    alertingRuleService;
    alertingDeliveryService;
    alertingProviderSessionService;
    constructor(prisma, alertingRuleService, alertingDeliveryService, alertingProviderSessionService) {
        this.prisma = prisma;
        this.alertingRuleService = alertingRuleService;
        this.alertingDeliveryService = alertingDeliveryService;
        this.alertingProviderSessionService = alertingProviderSessionService;
    }
    async alertingChannels(channelType) {
        const where = ['deleted_at IS NULL'];
        if (channelType && channelType !== 'all') {
            where.push(`channel_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(channelType)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT
        channel_id, channel_key, channel_type, label, target_value,
        ownership_type, owner_label, status, is_active, metadata, created_at
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
                metadata: (0, dashboard_utils_1.asJson)(row.metadata, {}),
                created_at: row.created_at,
            })),
        };
    }
    validateAlertChannelTarget(channelType, targetValue) {
        const normalizedType = channelType.trim().toLowerCase();
        const normalizedTarget = targetValue.trim();
        if (!normalizedType || !normalizedTarget) {
            return;
        }
        if (normalizedType === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(normalizedTarget)) {
                throw new common_1.BadRequestException('Email channel target must be a valid email address.');
            }
            return;
        }
        if (normalizedType === 'wa-personal') {
            const digits = normalizedTarget.replace(/\D/g, '');
            if (!normalizedTarget.includes('@') && digits.length < 8) {
                throw new common_1.BadRequestException('WhatsApp personal target must be a phone number or WhatsApp JID.');
            }
            return;
        }
        if (normalizedType === 'wa-group') {
            if (normalizedTarget.includes('@g.us') ||
                /^\d+-\d+$/.test(normalizedTarget) ||
                /^\d+$/.test(normalizedTarget)) {
                return;
            }
            throw new common_1.BadRequestException('WhatsApp group target must be a valid group JID or numeric group identifier.');
        }
    }
    async createAlertingChannel(body, actor) {
        const channelType = String(body.channelType || body.channel_type || '').trim();
        const label = String(body.label || '').trim();
        const targetValue = String(body.targetValue || body.target_value || '').trim();
        if (!channelType || !label || !targetValue) {
            throw new common_1.BadRequestException('channelType, label, and targetValue are required.');
        }
        const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
        const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
        const teamKey = String(body.teamKey || body.team_key || '').trim();
        const status = String(body.status || 'draft').trim();
        const channelKey = `channel-${this.alertingRuleService.slugify(label)}-${Date.now()}`;
        const metadata = teamKey ? { team: teamKey } : {};
        this.validateAlertChannelTarget(channelType, targetValue);
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_notification_channel (
        channel_key, channel_type, label, target_value, ownership_type, owner_label,
        status, metadata, is_active, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(channelKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(channelType)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(label)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(targetValue)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(ownershipType || 'standalone')}',
        ${ownerLabel ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(ownerLabel)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(status || 'draft')}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(metadata))}'::jsonb,
        TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
    `);
        return this.alertingChannels(channelType);
    }
    async updateAlertingChannel(channelId, body, actor) {
        const normalizedChannelId = Number(channelId);
        if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
            throw new common_1.BadRequestException('Invalid channel id.');
        }
        const channelType = String(body.channelType || body.channel_type || '').trim();
        const label = String(body.label || '').trim();
        const targetValue = String(body.targetValue || body.target_value || '').trim();
        if (!channelType || !label || !targetValue) {
            throw new common_1.BadRequestException('channelType, label, and targetValue are required.');
        }
        const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
        const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
        const teamKey = String(body.teamKey || body.team_key || '').trim();
        const status = String(body.status || 'draft').trim();
        const metadata = teamKey ? { team: teamKey } : {};
        this.validateAlertChannelTarget(channelType, targetValue);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        channel_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(channelType)}',
        label = '${(0, dashboard_utils_1.escapeSqlLiteral)(label)}',
        target_value = '${(0, dashboard_utils_1.escapeSqlLiteral)(targetValue)}',
        ownership_type = '${(0, dashboard_utils_1.escapeSqlLiteral)(ownershipType || 'standalone')}',
        owner_label = ${ownerLabel ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(ownerLabel)}'` : 'NULL'},
        status = '${(0, dashboard_utils_1.escapeSqlLiteral)(status || 'draft')}',
        metadata = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(metadata))}'::jsonb,
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Alert notification channel not found.');
        }
        return this.alertingChannels(channelType);
    }
    async updateAlertingChannelState(channelId, body, actor) {
        const normalizedChannelId = Number(channelId);
        if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
            throw new common_1.BadRequestException('Invalid channel id.');
        }
        const isActive = Boolean(body.isActive ?? body.is_active);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Alert notification channel not found.');
        }
        return this.alertingChannels('all');
    }
    async deleteAlertingChannel(channelId, actor) {
        const normalizedChannelId = Number(channelId);
        if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
            throw new common_1.BadRequestException('Invalid channel id.');
        }
        const existing = await this.prisma.$queryRawUnsafe(`
      SELECT channel_type FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL LIMIT 1
    `);
        if (!existing[0]) {
            throw new common_1.NotFoundException('Alert notification channel not found.');
        }
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);
        return this.alertingChannels(String(existing[0].channel_type || 'all'));
    }
    async testAlertingChannel(channelId, actor) {
        const normalizedChannelId = Number(channelId);
        if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
            throw new common_1.BadRequestException('Invalid channel id.');
        }
        const channels = await this.prisma.$queryRawUnsafe(`
      SELECT channel_id, channel_key, channel_type, label, target_value
      FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL AND is_active = TRUE
      LIMIT 1
    `);
        const channel = channels[0];
        if (!channel) {
            throw new common_1.NotFoundException('Alert notification channel not found.');
        }
        const testRule = await this.alertingProviderSessionService.ensureAlertingTestRule(actor);
        const eventKey = `evt-test-channel-${normalizedChannelId}-${Date.now()}`;
        const title = `Test send for ${String(channel.label || 'channel')}`;
        const message = `Test notification for ${String(channel.label || 'channel')} via ${String(channel.channel_type || '')}.`;
        const insertedEvents = await this.prisma.$queryRawUnsafe(`
      INSERT INTO public.alert_event (
        event_key, rule_id, metric_id, snapshot_id, title, description, severity,
        status, source_ref, event_payload, detected_at, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(eventKey)}',
        ${testRule.rule_id}, NULL, NULL,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(title)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(message)}',
        'low', 'open',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(String(channel.channel_key || 'manual-test'))}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify({
            test_send: true,
            channel_id: normalizedChannelId,
            channel_type: String(channel.channel_type || ''),
            target_value: String(channel.target_value || ''),
        }))}'::jsonb,
        NOW(),
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
      RETURNING event_id
    `);
        const eventId = Number(insertedEvents[0]?.event_id || 0);
        const insertedDeliveries = await this.prisma.$queryRawUnsafe(`
      INSERT INTO public.alert_delivery_log (
        event_id, rule_id, recipient_id, channel_type, target_value, provider_name,
        delivery_status, response_payload, requested_at, delivered_at
      ) VALUES (
        ${eventId}, ${testRule.rule_id}, NULL,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(String(channel.channel_type || ''))}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(String(channel.target_value || ''))}',
        'test-send', 'queued', '{"trigger":"test-send"}'::jsonb, NOW(), NULL
      )
      RETURNING delivery_id
    `);
        const deliveryRun = await this.alertingDeliveryService.runAlertDeliveryCycle(actor);
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
};
exports.AlertingChannelService = AlertingChannelService;
exports.AlertingChannelService = AlertingChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_rule_service_1.AlertingRuleService,
        alerting_delivery_service_1.AlertingDeliveryService,
        alerting_provider_session_service_1.AlertingProviderSessionService])
], AlertingChannelService);
//# sourceMappingURL=alerting-channel.service.js.map