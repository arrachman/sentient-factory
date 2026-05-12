import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { asJson } from './dashboard.utils';

@Injectable()
export class AlertingObservabilityService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AlertingDeliveryService))
    private readonly alertingDeliveryService: AlertingDeliveryService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
  ) {}

  async alertingAnalytics() {
    const summaryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL) AS total_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'open') AS open_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'acknowledged') AS acknowledged_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'resolved') AS resolved_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.severity = 'critical') AS critical_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.detected_at >= NOW() - INTERVAL '24 hours') AS last_24h_events
      FROM public.alert_event e
    `);

    const noisyRuleRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id,
        r.rule_name,
        r.module_key,
        COUNT(e.event_id) AS event_count_24h,
        COUNT(*) FILTER (WHERE e.status = 'open') AS open_count_24h,
        MAX(e.detected_at) AS last_detected_at
      FROM public.alert_rule r
      JOIN public.alert_event e ON e.rule_id = r.rule_id
      WHERE r.deleted_at IS NULL
        AND e.deleted_at IS NULL
        AND e.detected_at >= NOW() - INTERVAL '24 hours'
      GROUP BY r.rule_id, r.rule_name, r.module_key
      ORDER BY COUNT(e.event_id) DESC, MAX(e.detected_at) DESC
      LIMIT 5
    `);

    const unresolvedRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.module_key,
        COUNT(*) AS unresolved_count
      FROM public.alert_event e
      JOIN public.alert_rule r ON r.rule_id = e.rule_id
      WHERE e.deleted_at IS NULL
        AND e.status IN ('open', 'acknowledged', 'muted')
      GROUP BY r.module_key
      ORDER BY COUNT(*) DESC, r.module_key ASC
    `);

    const effectivenessRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        r.rule_id,
        r.rule_name,
        r.module_key,
        COALESCE(run_stats.total_runs, 0) AS total_runs,
        COALESCE(run_stats.successful_runs, 0) AS successful_runs,
        COALESCE(run_stats.triggered_events, 0) AS triggered_events,
        COALESCE(run_stats.avg_events_per_run, 0) AS avg_events_per_run,
        run_stats.last_run_at,
        COALESCE(event_stats.total_events, 0) AS total_events,
        COALESCE(event_stats.open_events, 0) AS open_events,
        COALESCE(event_stats.acknowledged_events, 0) AS acknowledged_events,
        COALESCE(event_stats.resolved_events, 0) AS resolved_events,
        COALESCE(delivery_stats.total_deliveries, 0) AS total_deliveries,
        COALESCE(delivery_stats.delivered_deliveries, 0) AS delivered_deliveries,
        COALESCE(delivery_stats.failed_deliveries, 0) AS failed_deliveries,
        COALESCE(delivery_stats.dead_lettered_deliveries, 0) AS dead_lettered_deliveries,
        CASE
          WHEN COALESCE(event_stats.total_events, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(event_stats.acknowledged_events, 0)::numeric / event_stats.total_events::numeric) * 100, 2)
        END AS acknowledgement_rate,
        CASE
          WHEN COALESCE(event_stats.total_events, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(event_stats.resolved_events, 0)::numeric / event_stats.total_events::numeric) * 100, 2)
        END AS resolution_rate,
        CASE
          WHEN COALESCE(delivery_stats.total_deliveries, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(delivery_stats.delivered_deliveries, 0)::numeric / delivery_stats.total_deliveries::numeric) * 100, 2)
        END AS delivery_success_rate
      FROM public.alert_rule r
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_runs,
          COUNT(*) FILTER (WHERE rl.run_status = 'success') AS successful_runs,
          COALESCE(SUM(rl.triggered_event_count), 0) AS triggered_events,
          COALESCE(AVG(rl.triggered_event_count::numeric), 0) AS avg_events_per_run,
          MAX(rl.started_at) AS last_run_at
        FROM public.alert_rule_run_log rl
        WHERE rl.rule_id = r.rule_id
      ) run_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_events,
          COUNT(*) FILTER (WHERE e.status = 'open') AS open_events,
          COUNT(*) FILTER (WHERE e.status = 'acknowledged') AS acknowledged_events,
          COUNT(*) FILTER (WHERE e.status = 'resolved') AS resolved_events
        FROM public.alert_event e
        WHERE e.rule_id = r.rule_id
          AND e.deleted_at IS NULL
      ) event_stats ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) AS total_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'delivered') AS delivered_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'failed') AS failed_deliveries,
          COUNT(*) FILTER (WHERE d.delivery_status = 'dead-lettered') AS dead_lettered_deliveries
        FROM public.alert_delivery_log d
        WHERE d.rule_id = r.rule_id
      ) delivery_stats ON TRUE
      WHERE r.deleted_at IS NULL
      ORDER BY
        COALESCE(run_stats.total_runs, 0) DESC,
        COALESCE(run_stats.triggered_events, 0) DESC,
        r.rule_id ASC
      LIMIT 5
    `);

    return {
      success: true,
      data: {
        summary: {
          total_events: Number(summaryRows[0]?.total_events || 0),
          open_events: Number(summaryRows[0]?.open_events || 0),
          acknowledged_events: Number(summaryRows[0]?.acknowledged_events || 0),
          resolved_events: Number(summaryRows[0]?.resolved_events || 0),
          critical_events: Number(summaryRows[0]?.critical_events || 0),
          last_24h_events: Number(summaryRows[0]?.last_24h_events || 0),
        },
        noisy_rules: noisyRuleRows.map((row) => ({
          rule_id: Number(row.rule_id || 0),
          rule_name: row.rule_name,
          module_key: row.module_key,
          event_count_24h: Number(row.event_count_24h || 0),
          open_count_24h: Number(row.open_count_24h || 0),
          last_detected_at: row.last_detected_at || null,
        })),
        unresolved_by_module: unresolvedRows.map((row) => ({
          module_key: row.module_key,
          unresolved_count: Number(row.unresolved_count || 0),
        })),
        rule_effectiveness: effectivenessRows.map((row) => ({
          rule_id: Number(row.rule_id || 0),
          rule_name: row.rule_name,
          module_key: row.module_key,
          total_runs: Number(row.total_runs || 0),
          successful_runs: Number(row.successful_runs || 0),
          triggered_events: Number(row.triggered_events || 0),
          avg_events_per_run: Number(row.avg_events_per_run || 0),
          total_events: Number(row.total_events || 0),
          open_events: Number(row.open_events || 0),
          acknowledged_events: Number(row.acknowledged_events || 0),
          resolved_events: Number(row.resolved_events || 0),
          total_deliveries: Number(row.total_deliveries || 0),
          delivered_deliveries: Number(row.delivered_deliveries || 0),
          failed_deliveries: Number(row.failed_deliveries || 0),
          dead_lettered_deliveries: Number(row.dead_lettered_deliveries || 0),
          acknowledgement_rate: Number(row.acknowledgement_rate || 0),
          resolution_rate: Number(row.resolution_rate || 0),
          delivery_success_rate: Number(row.delivery_success_rate || 0),
          last_run_at: row.last_run_at || null,
        })),
      },
    };
  }

  async alertingDeliveryObservability() {
    const summaryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'delivered') AS delivered_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'queued') AS queued_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'dead-lettered') AS dead_lettered_logs,
        COUNT(*) FILTER (WHERE retry_count > 0) AS retried_logs
      FROM public.alert_delivery_log
    `);

    const channelRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_type,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'delivered') AS delivered_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'queued') AS queued_logs
      FROM public.alert_delivery_log
      GROUP BY channel_type
      ORDER BY channel_type ASC
    `);

    const providerRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COALESCE(provider_name, 'unassigned') AS provider_name,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs
      FROM public.alert_delivery_log
      GROUP BY COALESCE(provider_name, 'unassigned')
      ORDER BY COUNT(*) DESC, provider_name ASC
      LIMIT 5
    `);

    const pendingRetryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        delivery_id,
        channel_type,
        target_value,
        retry_count,
        max_retries,
        next_retry_at
      FROM public.alert_delivery_log
      WHERE delivery_status = 'queued'
        AND next_retry_at IS NOT NULL
      ORDER BY next_retry_at ASC, delivery_id ASC
      LIMIT 5
    `);

    const deadLetterRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        delivery_id,
        channel_type,
        target_value,
        retry_count,
        max_retries,
        dead_lettered_at,
        dead_letter_reason
      FROM public.alert_delivery_log
      WHERE delivery_status = 'dead-lettered'
      ORDER BY dead_lettered_at DESC NULLS LAST, delivery_id DESC
      LIMIT 5
    `);

    return {
      success: true,
      data: {
        summary: {
          total_logs: Number(summaryRows[0]?.total_logs || 0),
          delivered_logs: Number(summaryRows[0]?.delivered_logs || 0),
          queued_logs: Number(summaryRows[0]?.queued_logs || 0),
          failed_logs: Number(summaryRows[0]?.failed_logs || 0),
          dead_lettered_logs: Number(summaryRows[0]?.dead_lettered_logs || 0),
          retried_logs: Number(summaryRows[0]?.retried_logs || 0),
        },
        by_channel: channelRows.map((row) => ({
          channel_type: row.channel_type,
          total_logs: Number(row.total_logs || 0),
          delivered_logs: Number(row.delivered_logs || 0),
          failed_logs: Number(row.failed_logs || 0),
          queued_logs: Number(row.queued_logs || 0),
        })),
        top_providers: providerRows.map((row) => ({
          provider_name: row.provider_name,
          total_logs: Number(row.total_logs || 0),
          failed_logs: Number(row.failed_logs || 0),
        })),
        pending_retries: pendingRetryRows.map((row) => ({
          delivery_id: Number(row.delivery_id || 0),
          channel_type: row.channel_type,
          target_value: row.target_value,
          retry_count: Number(row.retry_count || 0),
          max_retries: Number(row.max_retries || 0),
          next_retry_at: row.next_retry_at || null,
        })),
        dead_letters: deadLetterRows.map((row) => ({
          delivery_id: Number(row.delivery_id || 0),
          channel_type: row.channel_type,
          target_value: row.target_value,
          retry_count: Number(row.retry_count || 0),
          max_retries: Number(row.max_retries || 0),
          dead_lettered_at: row.dead_lettered_at || null,
          dead_letter_reason: row.dead_letter_reason || null,
        })),
      },
    };
  }

  async alertingDeliveryStatus() {
    const smtpConfig = this.alertingDeliveryService.getSmtpConfig();
    const waGroup = this.alertingDeliveryService.getAlertDeliveryWebhookConfig('wa-group');
    const waPersonal = this.alertingDeliveryService.getAlertDeliveryWebhookConfig('wa-personal');
    const emailWebhook = this.alertingDeliveryService.getAlertDeliveryWebhookConfig('email');
    const baileysConfig = this.alertingDeliveryService.getBaileysConfig();

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
    const smtpConfig = this.alertingDeliveryService.getSmtpConfig();
    const baileys = await this.alertingDeliveryService.getBaileysHealth();
    await this.alertingDeliveryService.upsertAlertProviderSessionState({
      providerName: 'baileys',
      channelType: 'wa-group',
      sessionKey: 'baileys-wa-group',
      sessionStatus: this.alertingDeliveryService.mapBaileysHealthToSessionStatus(baileys),
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
      this.alertingAnalytics(),
      this.alertingDeliveryObservability(),
      this.alertingDeliveryStatus(),
      this.alertingProviderHealth(),
      this.alertingDeliveryService.alertingDeadLetterTriage(),
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
