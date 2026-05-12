import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';

@Injectable()
export class AlertingInsightQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async alertingInsights(moduleKey?: string, snapshotId?: string) {
    const where = ['s.deleted_at IS NULL'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`b.module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }
    if (snapshotId) {
      where.push(`s.snapshot_id = ${Number(snapshotId) || 0}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        s.snapshot_id, b.metric_key, b.label AS metric_label, b.module_key,
        s.snapshot_at, s.insight_text, s.recommendation_preview, s.anomaly_level,
        s.status, s.is_alert_candidate, s.current_value, s.comparison_value,
        s.change_pct, s.trend_label, s.source_ref, s.dimensions, s.evidence_payload
      FROM public.metric_insight_snapshot s
      JOIN public.metric_business_registry b ON b.metric_id = s.metric_id
      WHERE ${where.join(' AND ')}
      ORDER BY s.snapshot_at DESC, s.snapshot_id DESC
    `);

    return { success: true, data: rows.map((row) => this.mapAlertingInsightRow(row)) };
  }

  async alertingSavedQueries(channel?: string, limit?: string) {
    const normalizedChannel = (channel || 'manager_dashboard').trim() || 'manager_dashboard';
    const normalizedLimit = Math.max(Number(limit || '10') || 10, 1);
    const requestId = crypto.randomUUID();
    const sessions =
      (await this.fetchAlertingSavedQueryJson<Array<Record<string, unknown>>>(
        `${this.getAiBaseUrl()}/api/chat/history/sessions?channel=${encodeURIComponent(normalizedChannel)}&limit=${Math.max(normalizedLimit * 3, 30)}`,
        requestId,
      )) || [];

    const savedQueries: Array<Record<string, unknown>> = [];
    for (const session of sessions) {
      const sessionId = String(session.id || '').trim();
      if (!sessionId) {
        continue;
      }

      const prompts =
        (await this.fetchAlertingSavedQueryJson<Array<Record<string, unknown>>>(
          `${this.getAiBaseUrl()}/api/chat/history/sessions/${sessionId}/prompts`,
          requestId,
        )) || [];

      let matchedDetail: Record<string, unknown> | null = null;
      for (const prompt of [...prompts].reverse()) {
        const promptId = String(prompt.id || '').trim();
        if (!promptId) {
          continue;
        }

        const detail = await this.fetchAlertingSavedQueryJson<Record<string, unknown>>(
          `${this.getAiBaseUrl()}/api/chat/history/prompts/${promptId}`,
          requestId,
        );

        if (typeof detail?.query_sql === 'string' && detail.query_sql.trim()) {
          matchedDetail = detail;
          break;
        }
      }

      if (!matchedDetail) {
        continue;
      }

      savedQueries.push({
        session_id: sessionId,
        prompt_id: String(matchedDetail.id || ''),
        title: String(session.title || matchedDetail.prompt || 'Untitled query').trim(),
        prompt: String(matchedDetail.prompt || '').trim(),
        query_sql: String(matchedDetail.query_sql || ''),
        channel: session.channel || null,
        mode: session.mode || null,
        last_prompt_at: session.last_prompt_at || null,
        created_at: matchedDetail.created_at || null,
      });

      if (savedQueries.length >= normalizedLimit) {
        break;
      }
    }

    return { success: true, data: savedQueries };
  }

  async alertingEvents(moduleKey?: string, eventId?: string) {
    const where = ['e.deleted_at IS NULL'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`r.module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }
    if (eventId) {
      where.push(`e.event_id = ${Number(eventId) || 0}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        e.event_id, e.event_key, e.rule_id, r.rule_name, r.module_key,
        COALESCE(b.label, '') AS metric_label, e.title,
        COALESCE(e.description, '') AS description,
        e.severity, e.status, e.source_ref, e.event_payload, e.detected_at,
        e.acknowledged_at, e.resolved_at,
        COALESCE(
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'channel_type', d.channel_type, 'target_value', d.target_value,
              'delivery_status', d.delivery_status
            )
          ) FILTER (WHERE d.delivery_id IS NOT NULL),
          '[]'::jsonb
        ) AS deliveries
      FROM public.alert_event e
      JOIN public.alert_rule r ON r.rule_id = e.rule_id
      LEFT JOIN public.metric_business_registry b ON b.metric_id = e.metric_id
      LEFT JOIN public.alert_delivery_log d ON d.event_id = e.event_id
      WHERE ${where.join(' AND ')}
      GROUP BY
        e.event_id, e.event_key, e.rule_id, r.rule_name, r.module_key, b.label,
        e.title, e.description, e.severity, e.status, e.source_ref, e.event_payload,
        e.detected_at, e.acknowledged_at, e.resolved_at
      ORDER BY e.detected_at DESC, e.event_id DESC
    `);

    return { success: true, data: rows.map((row) => this.mapAlertEventRow(row)) };
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private mapAlertingInsightRow(row: Record<string, unknown>) {
    return {
      snapshot_id: Number(row.snapshot_id || 0),
      metric_key: row.metric_key,
      metric_label: row.metric_label,
      module_key: row.module_key,
      snapshot_at: row.snapshot_at,
      insight_text: row.insight_text,
      recommendation_preview: row.recommendation_preview,
      anomaly_level: row.anomaly_level,
      status: row.status,
      is_alert_candidate: Boolean(row.is_alert_candidate),
      current_value: row.current_value,
      comparison_value: row.comparison_value,
      change_pct: row.change_pct,
      trend_label: row.trend_label,
      source_ref: row.source_ref,
      dimensions: asJson(row.dimensions, {}),
      evidence_payload: asJson(row.evidence_payload, {}),
    };
  }

  mapAlertEventRow(row: Record<string, unknown>) {
    return {
      event_id: Number(row.event_id || 0),
      event_key: row.event_key,
      rule_id: Number(row.rule_id || 0),
      rule_name: row.rule_name,
      module_key: row.module_key,
      metric_label: row.metric_label || null,
      title: row.title,
      description: row.description,
      severity: row.severity,
      status: row.status,
      source_ref: row.source_ref || null,
      event_payload: asJson(row.event_payload, {}),
      detected_at: row.detected_at,
      acknowledged_at: row.acknowledged_at,
      resolved_at: row.resolved_at,
      deliveries: asJson(row.deliveries, []),
    };
  }

  private getAiBaseUrl(): string {
    const candidates = [
      process.env.AI_ENGINE_URL,
      process.env.AI_ENGINE_BASE_URL,
      'http://ai-engine:8001',
    ];
    const configuredUrl = candidates.find(
      (value) => typeof value === 'string' && value.trim().length > 0,
    );
    return configuredUrl?.trim().replace(/\/$/, '') || 'http://ai-engine:8001';
  }

  private async fetchAlertingSavedQueryJson<T>(input: string, requestId: string) {
    const response = await fetch(input, {
      method: 'GET',
      headers: { 'x-request-id': requestId },
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as {
      success?: boolean;
      data?: T;
      message?: string;
    } | null;

    if (!response.ok || !payload?.success) {
      throw new InternalServerErrorException(payload?.message || 'Failed to fetch saved queries.');
    }

    return payload.data;
  }
}
