import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';
import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingTriageService } from './alerting-triage.service';

/**
 * AlertingDeliveryService
 *
 * Owns the delivery pipeline orchestration: run cycle, delivery log queries,
 * requeue, and Baileys health inspection.
 *
 * Channel dispatch + config accessors → AlertingDeliveryDispatchService
 * Dead-letter triage state → AlertingTriageService
 * Provider session audit/state + test-rule → AlertingProviderSessionService
 */
@Injectable()
export class AlertingDeliveryService {
  private readonly logger = new Logger(AlertingDeliveryService.name);
  private alertDeliveryRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingTriageService: AlertingTriageService,
    private readonly alertingDeliveryDispatchService: AlertingDeliveryDispatchService,
  ) {}

  // ── Delivery cycle ───────────────────────────────────────────────────

  async runAlertDeliveryCycle(actor = 'system-delivery') {
    if (this.alertDeliveryRunning) {
      return { success: true, data: { processed_delivery_count: 0, skipped: true, results: [] } };
    }

    this.alertDeliveryRunning = true;
    try {
      const triageRecoveryConfig = await this.alertingTriageService.getAlertingTriageRecoveryConfig();
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          d.delivery_id,
          d.event_id,
          d.rule_id,
          d.channel_type,
          d.target_value,
          d.provider_name,
          d.retry_count,
          d.max_retries,
          e.event_key,
          e.title AS event_title,
          COALESCE(e.description, '') AS event_description,
          e.event_payload,
          r.rule_name,
          COALESCE(r.message_template, '') AS message_template
        FROM public.alert_delivery_log d
        JOIN public.alert_event e ON e.event_id = d.event_id
        JOIN public.alert_rule r ON r.rule_id = d.rule_id
        WHERE d.delivery_status = 'queued'
          AND (d.next_retry_at IS NULL OR d.next_retry_at <= NOW())
        ORDER BY d.requested_at ASC, d.delivery_id ASC
        LIMIT 25
      `);

      const results: Array<Record<string, unknown>> = [];
      for (const row of rows) {
        const deliveryId = Number(row.delivery_id || 0);
        try {
          const dispatchResult = await this.alertingDeliveryDispatchService.dispatchAlertDelivery({
            channelType: String(row.channel_type || ''),
            targetValue: String(row.target_value || ''),
            eventKey: String(row.event_key || ''),
            eventTitle: String(row.event_title || ''),
            message:
              String(row.message_template || '').trim() ||
              String(row.event_description || '').trim() ||
              String(row.event_title || '').trim(),
            eventPayload: asJson(row.event_payload, {}),
          });

          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              provider_name = '${escapeSqlLiteral(dispatchResult.providerName)}',
              provider_message_id = ${dispatchResult.providerMessageId ? `'${escapeSqlLiteral(dispatchResult.providerMessageId)}'` : 'NULL'},
              delivery_status = '${escapeSqlLiteral(dispatchResult.deliveryStatus)}',
              response_payload = '${escapeSqlLiteral(JSON.stringify(dispatchResult.responsePayload))}'::jsonb,
              error_message = NULL,
              last_attempt_at = NOW(),
              next_retry_at = NULL,
              dead_lettered_at = NULL,
              dead_letter_reason = NULL,
              delivered_at = ${dispatchResult.deliveryStatus === 'failed' ? 'NULL' : 'NOW()'}
            WHERE delivery_id = ${deliveryId}
          `);

          let autoClosedTriage = false;
          if (triageRecoveryConfig.enabled && dispatchResult.deliveryStatus !== 'failed') {
            const triageBeforeRows = await this.prisma.$queryRawUnsafe<
              Array<Record<string, unknown>>
            >(`
              SELECT triage_status, acknowledged_at, assigned_to, note
              FROM public.alert_dead_letter_triage
              WHERE delivery_id = ${deliveryId}
              LIMIT 1
            `);
            const resolvedCount = await this.prisma.$executeRawUnsafe(`
              UPDATE public.alert_dead_letter_triage
              SET
                triage_status = 'resolved',
                note = CASE
                  WHEN COALESCE(note, '') = '' THEN 'Auto-resolved after successful delivery recovery.'
                  ELSE note || E'\\nAuto-resolved after successful delivery recovery.'
                END,
                last_action_at = NOW(),
                updated_by = '${escapeSqlLiteral(actor)}'
              WHERE delivery_id = ${deliveryId}
                AND triage_status <> 'resolved'
            `);
            autoClosedTriage = Number(resolvedCount || 0) > 0;
            if (autoClosedTriage) {
              const previous = triageBeforeRows[0];
              await this.alertingTriageService.createAlertDeadLetterTriageAudit({
                deliveryId,
                actionType: 'auto-resolve',
                previousTriageStatus: previous?.triage_status
                  ? String(previous.triage_status)
                  : null,
                nextTriageStatus: 'resolved',
                previousAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                nextAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                previousAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                nextAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                noteSnapshot: previous?.note
                  ? String(previous.note)
                  : 'Auto-resolved after successful delivery recovery.',
                detailPayload: {
                  trigger: 'delivery-recovery',
                },
                actor,
              });
            }
          }

          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: dispatchResult.deliveryStatus,
            provider_name: dispatchResult.providerName,
            auto_closed_triage: autoClosedTriage,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown delivery worker error.';
          const retryCount = Number(row.retry_count || 0);
          const maxRetries = Math.max(Number(row.max_retries || 3) || 3, 1);
          const nextRetryCount = retryCount + 1;
          const shouldRetry = nextRetryCount < maxRetries;
          const backoffMinutes = Math.min(5 * nextRetryCount, 60);
          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              delivery_status = '${shouldRetry ? 'queued' : 'dead-lettered'}',
              error_message = '${escapeSqlLiteral(message)}',
              response_payload = '${escapeSqlLiteral(
                JSON.stringify({
                  worker: 'delivery',
                  status: shouldRetry ? 'queued_for_retry' : 'dead_lettered',
                  retry_count: nextRetryCount,
                  max_retries: maxRetries,
                  retry_backoff_minutes: shouldRetry ? backoffMinutes : null,
                }),
              )}'::jsonb,
              retry_count = ${nextRetryCount},
              last_attempt_at = NOW(),
              next_retry_at = ${shouldRetry ? `NOW() + INTERVAL '${backoffMinutes} minutes'` : 'NULL'},
              dead_lettered_at = ${shouldRetry ? 'NULL' : 'NOW()'},
              dead_letter_reason = ${shouldRetry ? 'NULL' : `'${escapeSqlLiteral(message)}'`},
              delivered_at = NULL
            WHERE delivery_id = ${deliveryId}
          `);
          this.logger.error(`Alert delivery failed for log ${deliveryId}: ${message}`);
          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: shouldRetry ? 'queued' : 'dead-lettered',
            retry_count: nextRetryCount,
            max_retries: maxRetries,
            error_message: message,
          });
        }
      }

      if (results.length) {
        this.logger.log(`Alert delivery worker processed ${results.length} queued deliveries.`);
      }

      return {
        success: true,
        data: {
          processed_delivery_count: results.length,
          skipped: false,
          actor,
          results,
        },
      };
    } finally {
      this.alertDeliveryRunning = false;
    }
  }

  // ── Baileys health (delegates to dispatch service) ───────────────────

  getBaileysHealth() {
    return this.alertingDeliveryDispatchService.getBaileysHealth();
  }

  // ── Delivery logs ────────────────────────────────────────────────────

  async alertingDeliveryLogs(eventId?: string) {
    const where = ['1 = 1'];
    if (eventId) {
      where.push(`d.event_id = ${Number(eventId) || 0}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        d.delivery_id,
        d.event_id,
        e.event_key,
        e.title AS event_title,
        COALESCE(rr.target_label, '') AS target_label,
        d.channel_type,
        d.target_value,
        d.provider_name,
        d.provider_message_id,
        d.delivery_status,
        d.response_payload,
        d.error_message,
        d.retry_count,
        d.max_retries,
        d.next_retry_at,
        d.last_attempt_at,
        d.dead_lettered_at,
        d.dead_letter_reason,
        d.requested_at,
        d.delivered_at
      FROM public.alert_delivery_log d
      LEFT JOIN public.alert_event e ON e.event_id = d.event_id
      LEFT JOIN public.alert_rule_recipient rr ON rr.recipient_id = d.recipient_id
      WHERE ${where.join(' AND ')}
      ORDER BY d.requested_at DESC, d.delivery_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        delivery_log_id: Number(row.delivery_id || 0),
        event_id: Number(row.event_id || 0),
        event_key: row.event_key || null,
        event_title: row.event_title || null,
        target_label: row.target_label || null,
        channel_type: row.channel_type,
        target_value: row.target_value,
        provider_key: row.provider_name || null,
        external_message_id: row.provider_message_id || null,
        delivery_status: row.delivery_status,
        error_message: row.error_message || null,
        retry_count: Number(row.retry_count || 0),
        max_retries: Number(row.max_retries || 0),
        next_retry_at: row.next_retry_at || null,
        last_attempt_at: row.last_attempt_at || null,
        dead_lettered_at: row.dead_lettered_at || null,
        dead_letter_reason: row.dead_letter_reason || null,
        queued_at: row.requested_at,
        sent_at: row.requested_at,
        delivered_at: row.delivered_at,
        response_payload: asJson(row.response_payload, {}),
      })),
    };
  }

  async requeueAlertingDeliveryLog(deliveryId: string, actor: string) {
    const normalizedDeliveryId = Number(deliveryId);
    if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
      throw new BadRequestException('Invalid delivery id.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT delivery_status
      FROM public.alert_delivery_log
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert delivery log not found.');
    }

    const currentStatus = String(existingRows[0].delivery_status || '')
      .trim()
      .toLowerCase();
    if (!['failed', 'dead-lettered'].includes(currentStatus)) {
      throw new BadRequestException('Only failed or dead-lettered deliveries can be requeued.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_delivery_log
      SET
        delivery_status = 'queued',
        retry_count = 0,
        next_retry_at = NOW(),
        last_attempt_at = NULL,
        error_message = NULL,
        dead_lettered_at = NULL,
        dead_letter_reason = NULL
      WHERE delivery_id = ${normalizedDeliveryId}
    `);

    const triageBeforeRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT triage_status, acknowledged_at, assigned_to, note
      FROM public.alert_dead_letter_triage
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

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
        'requeued',
        NULL,
        NULL,
        '${escapeSqlLiteral(actor)}',
        'Delivery was manually requeued.',
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = 'requeued',
        acknowledged_at = NULL,
        acknowledged_by = NULL,
        assigned_to = '${escapeSqlLiteral(actor)}',
        note = 'Delivery was manually requeued.',
        last_action_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
    `);

    const triageBefore = triageBeforeRows[0];
    await this.alertingTriageService.createAlertDeadLetterTriageAudit({
      deliveryId: normalizedDeliveryId,
      actionType: 'requeue',
      previousTriageStatus: triageBefore?.triage_status ? String(triageBefore.triage_status) : null,
      nextTriageStatus: 'requeued',
      previousAcknowledgedAt: triageBefore?.acknowledged_at
        ? String(triageBefore.acknowledged_at)
        : null,
      nextAcknowledgedAt: null,
      previousAssignedTo: triageBefore?.assigned_to ? String(triageBefore.assigned_to) : null,
      nextAssignedTo: actor,
      noteSnapshot: 'Delivery was manually requeued.',
      detailPayload: {
        trigger: 'manual-requeue',
      },
      actor,
    });

    const deliveryRun = await this.runAlertDeliveryCycle(actor);
    const result = await this.alertingDeliveryLogs();
    return {
      success: true,
      data: {
        requeued_delivery_id: normalizedDeliveryId,
        delivery_run: deliveryRun.data,
        logs: result.data,
      },
    };
  }
}
