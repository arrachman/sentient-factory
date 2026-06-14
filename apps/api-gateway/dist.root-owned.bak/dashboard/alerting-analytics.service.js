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
exports.AlertingAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AlertingAnalyticsService = class AlertingAnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async alertingAnalytics() {
        const summaryRows = await this.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL) AS total_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'open') AS open_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'acknowledged') AS acknowledged_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.status = 'resolved') AS resolved_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.severity = 'critical') AS critical_events,
        COUNT(*) FILTER (WHERE e.deleted_at IS NULL AND e.detected_at >= NOW() - INTERVAL '24 hours') AS last_24h_events
      FROM public.alert_event e
    `);
        const noisyRuleRows = await this.prisma.$queryRawUnsafe(`
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
        const unresolvedRows = await this.prisma.$queryRawUnsafe(`
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
        const effectivenessRows = await this.prisma.$queryRawUnsafe(`
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
        const summaryRows = await this.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'delivered') AS delivered_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'queued') AS queued_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'dead-lettered') AS dead_lettered_logs,
        COUNT(*) FILTER (WHERE retry_count > 0) AS retried_logs
      FROM public.alert_delivery_log
    `);
        const channelRows = await this.prisma.$queryRawUnsafe(`
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
        const providerRows = await this.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(provider_name, 'unassigned') AS provider_name,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE delivery_status = 'failed') AS failed_logs
      FROM public.alert_delivery_log
      GROUP BY COALESCE(provider_name, 'unassigned')
      ORDER BY COUNT(*) DESC, provider_name ASC
      LIMIT 5
    `);
        const pendingRetryRows = await this.prisma.$queryRawUnsafe(`
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
        const deadLetterRows = await this.prisma.$queryRawUnsafe(`
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
};
exports.AlertingAnalyticsService = AlertingAnalyticsService;
exports.AlertingAnalyticsService = AlertingAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertingAnalyticsService);
//# sourceMappingURL=alerting-analytics.service.js.map