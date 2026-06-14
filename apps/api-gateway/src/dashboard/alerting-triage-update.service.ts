import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';

/**
 * AlertingTriageUpdateService
 *
 * Owns write-side triage operations: upsert triage state, audit trail,
 * recovery config, and runtime triage policy reads.
 *
 * Read-side listing → AlertingTriageService
 */
@Injectable()
export class AlertingTriageUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Recovery config (called by AlertingDeliveryService) ─────────────

  async getAlertingTriageRecoveryConfig() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key = 'triage_auto_close_on_recovery'
      LIMIT 1
    `);

    const row = rows[0];
    const valueJson = asJson<Record<string, unknown>>(row?.value_json, {});
    const valueText =
      typeof row?.value_text === 'string' ? row.value_text.trim().toLowerCase() : '';
    const enabled =
      typeof valueJson['enabled'] === 'boolean'
        ? Boolean(valueJson['enabled'])
        : ['enabled', 'true', 'yes', '1', 'on'].includes(valueText);

    return { enabled };
  }

  // ── Triage audit ──────────────────────────────────────────────────────

  async createAlertDeadLetterTriageAudit(input: {
    deliveryId: number;
    actionType: string;
    previousTriageStatus: string | null;
    nextTriageStatus: string | null;
    previousAcknowledgedAt: string | null;
    nextAcknowledgedAt: string | null;
    previousAssignedTo: string | null;
    nextAssignedTo: string | null;
    noteSnapshot: string | null;
    detailPayload: Record<string, unknown>;
    actor: string;
  }) {
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
        '${escapeSqlLiteral(input.actionType)}',
        ${input.previousTriageStatus ? `'${escapeSqlLiteral(input.previousTriageStatus)}'` : 'NULL'},
        ${input.nextTriageStatus ? `'${escapeSqlLiteral(input.nextTriageStatus)}'` : 'NULL'},
        ${input.previousAcknowledgedAt ? `'${escapeSqlLiteral(input.previousAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.nextAcknowledgedAt ? `'${escapeSqlLiteral(input.nextAcknowledgedAt)}'::timestamptz` : 'NULL'},
        ${input.previousAssignedTo ? `'${escapeSqlLiteral(input.previousAssignedTo)}'` : 'NULL'},
        ${input.nextAssignedTo ? `'${escapeSqlLiteral(input.nextAssignedTo)}'` : 'NULL'},
        ${input.noteSnapshot ? `'${escapeSqlLiteral(input.noteSnapshot)}'` : 'NULL'},
        '${escapeSqlLiteral(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        '${escapeSqlLiteral(input.actor)}'
      )
    `);
  }

  // ── Triage upsert ─────────────────────────────────────────────────────

  async updateAlertingDeadLetterTriage(
    deliveryId: string,
    body: Record<string, unknown>,
    actor: string,
    listingFn: () => Promise<unknown>,
  ) {
    const normalizedDeliveryId = Number(deliveryId);
    if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
      throw new BadRequestException('Invalid delivery id.');
    }

    const triageStatus = String(body.triageStatus || body.triage_status || '')
      .trim()
      .toLowerCase();
    const assignedTo =
      typeof body.assignedTo === 'string'
        ? body.assignedTo.trim()
        : typeof body.assigned_to === 'string'
          ? body.assigned_to.trim()
          : '';
    const note = typeof body.note === 'string' ? body.note.trim() : '';
    const acknowledge = Boolean(body.acknowledge ?? body.acknowledged ?? false);
    const unacknowledge = Boolean(body.unacknowledge ?? false);

    if (acknowledge && unacknowledge) {
      throw new BadRequestException('acknowledge and unacknowledge cannot both be true.');
    }

    if (!['open', 'investigating', 'requeued', 'resolved'].includes(triageStatus)) {
      throw new BadRequestException('Invalid triage status.');
    }

    const deliveryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
      throw new NotFoundException('Alert delivery log not found.');
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
        '${escapeSqlLiteral(triageStatus)}',
        ${acknowledge ? 'NOW()' : 'NULL'},
        ${acknowledge ? `'${escapeSqlLiteral(actor)}'` : 'NULL'},
        ${assignedTo ? `'${escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        ${note ? `'${escapeSqlLiteral(note)}'` : 'NULL'},
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = '${escapeSqlLiteral(triageStatus)}',
        acknowledged_at = ${
          acknowledge
            ? 'COALESCE(public.alert_dead_letter_triage.acknowledged_at, NOW())'
            : unacknowledge
              ? 'NULL'
              : triageStatus === 'open' || triageStatus === 'requeued'
                ? 'NULL'
                : 'public.alert_dead_letter_triage.acknowledged_at'
        },
        acknowledged_by = ${
          acknowledge
            ? `COALESCE(public.alert_dead_letter_triage.acknowledged_by, '${escapeSqlLiteral(actor)}')`
            : unacknowledge
              ? 'NULL'
              : triageStatus === 'open' || triageStatus === 'requeued'
                ? 'NULL'
                : 'public.alert_dead_letter_triage.acknowledged_by'
        },
        assigned_to = ${assignedTo ? `'${escapeSqlLiteral(assignedTo)}'` : 'NULL'},
        note = ${note ? `'${escapeSqlLiteral(note)}'` : 'NULL'},
        last_action_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
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

  // ── Runtime policy ────────────────────────────────────────────────────

  async getAlertingTriagePolicy() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_sla_minutes', 'triage_escalation_policy')
    `);

    const settings = new Map<
      string,
      { value_text: string | null; value_json: Record<string, unknown> }
    >();
    for (const row of rows) {
      settings.set(String(row.setting_key || ''), {
        value_text: typeof row.value_text === 'string' ? row.value_text : null,
        value_json: asJson<Record<string, unknown>>(row.value_json, {}),
      });
    }

    const slaSetting = settings.get('triage_sla_minutes');
    const escalationSetting = settings.get('triage_escalation_policy');
    const configuredSla = Number(
      (slaSetting?.value_json?.minutes as number | string | undefined) ||
        (slaSetting?.value_text ? Number.parseInt(slaSetting.value_text, 10) : NaN),
    );
    const warningAfterMinutes = Number(
      (escalationSetting?.value_json?.warning_after_minutes as number | string | undefined) ||
        configuredSla,
    );
    const criticalAfterMinutes = Number(
      (escalationSetting?.value_json?.critical_after_minutes as number | string | undefined) ||
        (Number.isFinite(warningAfterMinutes) ? warningAfterMinutes * 2 : NaN),
    );

    return {
      sla_minutes: Number.isFinite(configuredSla) && configuredSla > 0 ? configuredSla : 60,
      warning_after_minutes:
        Number.isFinite(warningAfterMinutes) && warningAfterMinutes > 0 ? warningAfterMinutes : 60,
      critical_after_minutes:
        Number.isFinite(criticalAfterMinutes) && criticalAfterMinutes > 0
          ? criticalAfterMinutes
          : 120,
    };
  }
}
