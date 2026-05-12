import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';

@Injectable()
export class AlertingChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
  ) {}

  async alertingChannels(channelType?: string) {
    const where = ['deleted_at IS NULL'];
    if (channelType && channelType !== 'all') {
      where.push(`channel_type = '${escapeSqlLiteral(channelType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
        metadata: asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  validateAlertChannelTarget(channelType: string, targetValue: string) {
    const normalizedType = channelType.trim().toLowerCase();
    const normalizedTarget = targetValue.trim();
    if (!normalizedType || !normalizedTarget) {
      return;
    }

    if (normalizedType === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedTarget)) {
        throw new BadRequestException('Email channel target must be a valid email address.');
      }
      return;
    }

    if (normalizedType === 'wa-personal') {
      const digits = normalizedTarget.replace(/\D/g, '');
      if (!normalizedTarget.includes('@') && digits.length < 8) {
        throw new BadRequestException(
          'WhatsApp personal target must be a phone number or WhatsApp JID.',
        );
      }
      return;
    }

    if (normalizedType === 'wa-group') {
      if (
        normalizedTarget.includes('@g.us') ||
        /^\d+-\d+$/.test(normalizedTarget) ||
        /^\d+$/.test(normalizedTarget)
      ) {
        return;
      }
      throw new BadRequestException(
        'WhatsApp group target must be a valid group JID or numeric group identifier.',
      );
    }
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
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
        '${escapeSqlLiteral(channelKey)}',
        '${escapeSqlLiteral(channelType)}',
        '${escapeSqlLiteral(label)}',
        '${escapeSqlLiteral(targetValue)}',
        '${escapeSqlLiteral(ownershipType || 'standalone')}',
        ${ownerLabel ? `'${escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        '${escapeSqlLiteral(status || 'draft')}',
        '${escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
    }

    const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
    const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
    const teamKey = String(body.teamKey || body.team_key || '').trim();
    const status = String(body.status || 'draft').trim();
    const metadata = teamKey ? { team: teamKey } : {};

    this.validateAlertChannelTarget(channelType, targetValue);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        channel_type = '${escapeSqlLiteral(channelType)}',
        label = '${escapeSqlLiteral(label)}',
        target_value = '${escapeSqlLiteral(targetValue)}',
        ownership_type = '${escapeSqlLiteral(ownershipType || 'standalone')}',
        owner_label = ${ownerLabel ? `'${escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        status = '${escapeSqlLiteral(status || 'draft')}',
        metadata = '${escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannelState(channelId: string, body: Record<string, unknown>, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels('all');
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT channel_type FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL LIMIT 1
    `);

    if (!existing[0]) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    return this.alertingChannels(String(existing[0].channel_type || 'all'));
  }

  async testAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channels = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT channel_id, channel_key, channel_type, label, target_value
      FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL AND is_active = TRUE
      LIMIT 1
    `);

    const channel = channels[0];
    if (!channel) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    const testRule = await this.alertingProviderSessionService.ensureAlertingTestRule(actor);
    const eventKey = `evt-test-channel-${normalizedChannelId}-${Date.now()}`;
    const title = `Test send for ${String(channel.label || 'channel')}`;
    const message = `Test notification for ${String(channel.label || 'channel')} via ${String(channel.channel_type || '')}.`;

    const insertedEvents = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_event (
        event_key, rule_id, metric_id, snapshot_id, title, description, severity,
        status, source_ref, event_payload, detected_at, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(eventKey)}',
        ${testRule.rule_id}, NULL, NULL,
        '${escapeSqlLiteral(title)}',
        '${escapeSqlLiteral(message)}',
        'low', 'open',
        '${escapeSqlLiteral(String(channel.channel_key || 'manual-test'))}',
        '${escapeSqlLiteral(JSON.stringify({
          test_send: true,
          channel_id: normalizedChannelId,
          channel_type: String(channel.channel_type || ''),
          target_value: String(channel.target_value || ''),
        }))}'::jsonb,
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      RETURNING event_id
    `);

    const eventId = Number(insertedEvents[0]?.event_id || 0);
    const insertedDeliveries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_delivery_log (
        event_id, rule_id, recipient_id, channel_type, target_value, provider_name,
        delivery_status, response_payload, requested_at, delivered_at
      ) VALUES (
        ${eventId}, ${testRule.rule_id}, NULL,
        '${escapeSqlLiteral(String(channel.channel_type || ''))}',
        '${escapeSqlLiteral(String(channel.target_value || ''))}',
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
}
