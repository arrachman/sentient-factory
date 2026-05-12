import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingTriageViewService } from './alerting-triage-view.service';

@Injectable()
export class AlertingEscalationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingTriageViewService: AlertingTriageViewService,
  ) {}

  // ---------------------------------------------------------------------------
  // Escalation policy CRUD
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Triage saved view + event delegation → AlertingTriageViewService
  // ---------------------------------------------------------------------------

  async alertingTriageSavedViews(actor: string) {
    return this.alertingTriageViewService.alertingTriageSavedViews(actor);
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    return this.alertingTriageViewService.createAlertingTriageSavedView(body, actor);
  }

  async updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingTriageViewService.updateAlertingTriageSavedView(viewId, body, actor);
  }

  async updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingTriageViewService.updateAlertingTriageSavedViewState(viewId, body, actor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    return this.alertingTriageViewService.deleteAlertingTriageSavedView(viewId, actor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    return this.alertingTriageViewService.updateAlertingEvent(eventId, body, actor);
  }
}
