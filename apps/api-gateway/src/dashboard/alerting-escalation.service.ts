import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingRuleService } from './alerting-rule.service';

@Injectable()
export class AlertingEscalationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
  ) {}

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    const where = ['deleted_at IS NULL'];
    if (module && module !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(module)}'`);
    }
    if (targetType && targetType !== 'all') {
      where.push(`target_type = '${escapeSqlLiteral(targetType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
        metadata: asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  async validateAlertingEscalationTarget(targetType: string, targetRef: string) {
    if (!targetType || !targetRef) {
      throw new BadRequestException('targetType and targetRef are required.');
    }

    if (targetType === 'channel') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT channel_id FROM public.alert_notification_channel
        WHERE channel_key = '${escapeSqlLiteral(targetRef)}' AND deleted_at IS NULL LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_notification_channel.`,
        );
      }
    } else if (targetType === 'role') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT role_id FROM public.alert_routing_role
        WHERE role_key = '${escapeSqlLiteral(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_role.`,
        );
      }
    } else if (targetType === 'team') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT team_id FROM public.alert_routing_team
        WHERE team_key = '${escapeSqlLiteral(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_team.`,
        );
      }
    }
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_escalation_policy (
        module_key, escalation_level, target_type, target_ref, priority,
        metadata, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(moduleKey)}', '${escapeSqlLiteral(escalationLevel)}',
        '${escapeSqlLiteral(targetType)}', '${escapeSqlLiteral(targetRef)}',
        ${priority}, '{}'::jsonb, TRUE,
        '${escapeSqlLiteral(actor)}', '${escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicy(policyId: string, body: Record<string, unknown>, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        module_key = '${escapeSqlLiteral(moduleKey)}',
        escalation_level = '${escapeSqlLiteral(escalationLevel)}',
        target_type = '${escapeSqlLiteral(targetType)}',
        target_ref = '${escapeSqlLiteral(targetRef)}',
        priority = ${priority},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicyState(policyId: string, body: Record<string, unknown>, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async alertingTriageSavedViews(actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        view_id, view_key, name, owner_actor, is_shared, is_default,
        filters_json, sort_by, sort_order, metadata, is_active, created_at
      FROM public.alert_triage_saved_view
      WHERE deleted_at IS NULL
        AND (
          owner_actor = '${escapeSqlLiteral(normalizedActor)}'
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
        filters_json: asJson(row.filters_json, {}),
        sort_by: String(row.sort_by || 'dead_lettered_at'),
        sort_order: String(row.sort_order || 'desc'),
        metadata: asJson(row.metadata, {}),
        is_active: Boolean(row.is_active),
        created_at: row.created_at || null,
        is_owned_by_current_user: String(row.owner_actor || '') === normalizedActor,
      })),
    };
  }

  private normalizeAlertingTriageSavedViewPayload(body: Record<string, unknown>) {
    const name = String(body.name || '').trim();
    const isShared = Boolean(body.isShared ?? body.is_shared ?? false);
    const isDefault = Boolean(body.isDefault ?? body.is_default ?? false);
    const filtersJson = asJson(body.filtersJson ?? body.filters_json, {});
    const sortBy = String(body.sortBy || body.sort_by || 'dead_lettered_at').trim() || 'dead_lettered_at';
    const sortOrder = String(body.sortOrder || body.sort_order || 'desc').trim().toLowerCase() === 'asc' ? 'asc' : 'desc';

    if (!name) {
      throw new BadRequestException('name is required.');
    }
    if (!['dead_lettered_at', 'age_minutes', 'sla_due_at', 'triage_updated_at', 'escalation_count', 'event_title'].includes(sortBy)) {
      throw new BadRequestException('sortBy is invalid.');
    }

    return { name, isShared, isDefault, filtersJson, sortBy, sortOrder };
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);
    const viewKey = `triage-view-${Date.now()}`;

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_saved_view (
        view_key, name, owner_actor, is_shared, is_default, filters_json,
        sort_by, sort_order, metadata, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(viewKey)}',
        '${escapeSqlLiteral(payload.name)}',
        '${escapeSqlLiteral(normalizedActor)}',
        ${payload.isShared ? 'TRUE' : 'FALSE'},
        ${payload.isDefault ? 'TRUE' : 'FALSE'},
        '${escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        '${escapeSqlLiteral(payload.sortBy)}',
        '${escapeSqlLiteral(payload.sortOrder)}',
        '{}'::jsonb, TRUE,
        '${escapeSqlLiteral(normalizedActor)}',
        '${escapeSqlLiteral(normalizedActor)}'
      )
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT owner_actor FROM public.alert_triage_saved_view
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL LIMIT 1
    `);
    const existing = existingRows[0];
    if (!existing) {
      throw new NotFoundException('Saved view not found.');
    }
    const ownerActor = String(existing.owner_actor || '');
    if (ownerActor && ownerActor !== normalizedActor) {
      throw new BadRequestException('You can only update your own saved view.');
    }

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        name = '${escapeSqlLiteral(payload.name)}',
        is_shared = ${payload.isShared ? 'TRUE' : 'FALSE'},
        is_default = ${payload.isDefault ? 'TRUE' : 'FALSE'},
        filters_json = '${escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        sort_by = '${escapeSqlLiteral(payload.sortBy)}',
        sort_order = '${escapeSqlLiteral(payload.sortOrder)}',
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND (owner_actor = '${escapeSqlLiteral(normalizedActor)}' OR owner_actor IS NULL)
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = FALSE, deleted_at = NOW(),
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found or not owned by current user.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    const normalizedEventId = Number(eventId);
    if (!Number.isFinite(normalizedEventId) || normalizedEventId <= 0) {
      throw new BadRequestException('Invalid event id.');
    }

    const status = String(body?.status || '').trim().toLowerCase();
    if (!['acknowledged', 'resolved', 'open', 'muted'].includes(status)) {
      throw new BadRequestException('Invalid event status.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT status FROM public.alert_event
      WHERE deleted_at IS NULL AND event_id = ${normalizedEventId} LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert event not found.');
    }

    const currentStatus = String(existingRows[0].status || '').trim().toLowerCase();
    const allowedTransitions: Record<string, string[]> = {
      open: ['acknowledged', 'resolved', 'muted'],
      acknowledged: ['resolved', 'muted', 'open'],
      muted: ['open', 'resolved'],
      resolved: [],
    };

    if (currentStatus !== status && !(allowedTransitions[currentStatus] || []).includes(status)) {
      throw new BadRequestException(
        `Invalid event transition from "${currentStatus}" to "${status}".`,
      );
    }

    const updates = [
      `status = '${escapeSqlLiteral(status)}'`,
      `updated_by = '${escapeSqlLiteral(actor)}'`,
    ];
    if (status === 'acknowledged') updates.push('acknowledged_at = NOW()');
    if (status === 'resolved') updates.push('resolved_at = NOW()');
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
      throw new NotFoundException('Alert event not found.');
    }

    const result = await this.alertingRuleService.alertingEvents(undefined, String(normalizedEventId));
    return { success: true, data: result.data[0] || null };
  }
}
