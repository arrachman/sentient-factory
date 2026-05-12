import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingAnalyticsService } from './alerting-analytics.service';
import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { AlertingTriageService } from './alerting-triage.service';
import { asJson } from './dashboard.utils';

@Injectable()
export class AlertingObservabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingAnalyticsService: AlertingAnalyticsService,
    private readonly alertingDeliveryDispatchService: AlertingDeliveryDispatchService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
    private readonly alertingTriageService: AlertingTriageService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
  ) {}

  async alertingAnalytics() {
    return this.alertingAnalyticsService.alertingAnalytics();
  }

  async alertingDeliveryObservability() {
    return this.alertingAnalyticsService.alertingDeliveryObservability();
  }

  async alertingDeliveryStatus() {
    const smtpConfig = this.alertingDeliveryDispatchService.getSmtpConfig();
    const waGroup = this.alertingDeliveryDispatchService.getAlertDeliveryWebhookConfig('wa-group');
    const waPersonal = this.alertingDeliveryDispatchService.getAlertDeliveryWebhookConfig('wa-personal');
    const emailWebhook = this.alertingDeliveryDispatchService.getAlertDeliveryWebhookConfig('email');
    const baileysConfig = this.alertingDeliveryDispatchService.getBaileysConfig();

    return {
      success: true,
      data: {
        scheduler_interval_ms: this.alertingSchedulerService.alertSchedulerIntervalMs,
        delivery_interval_ms: this.alertingSchedulerService.alertDeliveryIntervalMs,
        triage_escalation_interval_ms: this.alertingSchedulerService.alertTriageEscalationIntervalMs,
        channels: [
          {
            channel_type: 'wa-group',
            provider_mode: baileysConfig.enabled ? 'baileys' : waGroup.url ? 'webhook' : 'dry-run',
            provider_name: baileysConfig.enabled ? 'baileys' : waGroup.providerName,
            is_configured: Boolean(baileysConfig.enabled || waGroup.url),
          },
          {
            channel_type: 'wa-personal',
            provider_mode: baileysConfig.enabled
              ? 'baileys'
              : waPersonal.url
                ? 'webhook'
                : 'dry-run',
            provider_name: baileysConfig.enabled ? 'baileys' : waPersonal.providerName,
            is_configured: Boolean(baileysConfig.enabled || waPersonal.url),
          },
          {
            channel_type: 'email',
            provider_mode:
              smtpConfig.host && smtpConfig.port && smtpConfig.from
                ? 'smtp'
                : emailWebhook.url
                  ? 'webhook'
                  : 'dry-run',
            provider_name:
              smtpConfig.host && smtpConfig.port && smtpConfig.from
                ? 'smtp'
                : emailWebhook.providerName,
            is_configured: Boolean(
              (smtpConfig.host && smtpConfig.port && smtpConfig.from) || emailWebhook.url,
            ),
          },
        ],
      },
    };
  }

  async alertingProviderHealth() {
    const smtpConfig = this.alertingDeliveryDispatchService.getSmtpConfig();
    const baileys = await this.alertingDeliveryDispatchService.getBaileysHealth();
    await this.alertingProviderSessionService.upsertAlertProviderSessionState({
      providerName: 'baileys',
      channelType: 'wa-group',
      sessionKey: 'baileys-wa-group',
      sessionStatus: this.alertingDeliveryDispatchService.mapBaileysHealthToSessionStatus(baileys),
      pairingMode: null,
      phoneNumber: null,
      authDir: baileys.auth_dir,
      statusMessage: baileys.status_label,
      detailPayload: baileys,
      lastHealthCheckAt: new Date(),
      lastConnectedAt: baileys.session_ready ? new Date() : null,
      lastDisconnectedAt: !baileys.session_ready ? new Date() : null,
      actor: 'system',
    });
    const recentPairingAttempts = await this.prisma.$queryRawUnsafe<
      Array<Record<string, unknown>>
    >(`
      SELECT
        audit_id,
        provider_name,
        channel_type,
        action_type,
        status,
        pairing_mode,
        phone_number,
        auth_dir,
        detail_payload,
        error_message,
        created_by,
        created_at
      FROM public.alert_provider_session_audit
      WHERE provider_name = 'baileys'
      ORDER BY created_at DESC, audit_id DESC
      LIMIT 10
    `);
    const sessionStates = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        session_state_id,
        provider_name,
        channel_type,
        session_key,
        session_status,
        pairing_mode,
        phone_number,
        auth_dir,
        status_message,
        last_health_check_at,
        last_pairing_started_at,
        last_pairing_result_at,
        last_connected_at,
        last_disconnected_at,
        detail_payload,
        is_active,
        updated_at
      FROM public.alert_provider_session_state
      WHERE provider_name IN ('baileys', 'smtp')
      ORDER BY updated_at DESC, session_state_id DESC
    `);

    return {
      success: true,
      data: {
        smtp: {
          configured: Boolean(smtpConfig.host && smtpConfig.port && smtpConfig.from),
          host: smtpConfig.host || null,
          port: smtpConfig.port || null,
          secure: smtpConfig.secure,
          from: smtpConfig.from || null,
          has_auth: Boolean(smtpConfig.user && smtpConfig.pass),
        },
        baileys,
        recent_pairing_attempts: recentPairingAttempts.map((row) => ({
          audit_id: Number(row.audit_id || 0),
          provider_name: row.provider_name,
          channel_type: row.channel_type,
          action_type: row.action_type,
          status: row.status,
          pairing_mode: row.pairing_mode || null,
          phone_number: row.phone_number || null,
          auth_dir: row.auth_dir || null,
          detail_payload: asJson(row.detail_payload, {}),
          error_message: row.error_message || null,
          created_by: row.created_by || null,
          created_at: row.created_at || null,
        })),
        session_states: sessionStates.map((row) => ({
          session_state_id: Number(row.session_state_id || 0),
          provider_name: row.provider_name,
          channel_type: row.channel_type,
          session_key: row.session_key,
          session_status: row.session_status,
          pairing_mode: row.pairing_mode || null,
          phone_number: row.phone_number || null,
          auth_dir: row.auth_dir || null,
          status_message: row.status_message || null,
          last_health_check_at: row.last_health_check_at || null,
          last_pairing_started_at: row.last_pairing_started_at || null,
          last_pairing_result_at: row.last_pairing_result_at || null,
          last_connected_at: row.last_connected_at || null,
          last_disconnected_at: row.last_disconnected_at || null,
          detail_payload: asJson(row.detail_payload, {}),
          is_active: Boolean(row.is_active),
          updated_at: row.updated_at || null,
        })),
      },
    };
  }

  async alertingOpsOverview() {
    const [analytics, observability, deliveryStatus, providerHealth, triage] = await Promise.all([
      this.alertingAnalyticsService.alertingAnalytics(),
      this.alertingAnalyticsService.alertingDeliveryObservability(),
      this.alertingDeliveryStatus(),
      this.alertingProviderHealth(),
      this.alertingTriageService.alertingDeadLetterTriage(),
    ]);

    const analyticsData = analytics.data as Record<string, unknown>;
    const observabilityData = observability.data as Record<string, unknown>;
    const deliveryStatusData = deliveryStatus.data as Record<string, unknown>;
    const providerHealthData = providerHealth.data as Record<string, unknown>;
    const triageSummary = (triage.summary as Record<string, unknown> | undefined) || {};
    const triagePolicy = (triage.policy as Record<string, unknown> | undefined) || {};
    const summary = (analyticsData.summary as Record<string, unknown> | undefined) || {};
    const observabilitySummary =
      (observabilityData.summary as Record<string, unknown> | undefined) || {};
    const channels = Array.isArray(deliveryStatusData.channels)
      ? (deliveryStatusData.channels as Array<Record<string, unknown>>)
      : [];

    return {
      success: true,
      data: {
        analytics: analyticsData,
        delivery_observability: observabilityData,
        delivery_status: deliveryStatusData,
        provider_health: providerHealthData,
        triage: {
          summary: triageSummary,
          policy: triagePolicy,
          audit_summary: (triage.audit_summary as Record<string, unknown> | undefined) || {},
        },
        highlights: {
          open_events: Number(summary.open_events || 0),
          dead_lettered_logs: Number(observabilitySummary.dead_lettered_logs || 0),
          configured_channels: channels.filter((channel) => Boolean(channel.is_configured)).length,
          dry_run_channels: channels.filter(
            (channel) => String(channel.provider_mode || '') === 'dry-run',
          ).length,
          overdue_triage_items:
            Number(triageSummary.overdue_items || 0) + Number(triageSummary.critical_items || 0),
        },
      },
    };
  }
}
