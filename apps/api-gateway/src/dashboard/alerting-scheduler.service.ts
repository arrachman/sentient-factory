import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';
import { DashboardService } from './dashboard.service';

/**
 * AlertingSchedulerService
 *
 * Owns the lifecycle timers AND cycle bodies for the alerting workers:
 *  - rule scheduler (`runAlertingSchedulerCycle`)
 *  - delivery worker (delegates to DashboardService.runAlertDeliveryCycle)
 *  - triage escalation worker (`runAlertingTriageEscalationCycle`)
 */
@Injectable()
export class AlertingSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AlertingSchedulerService.name);

  readonly alertSchedulerIntervalMs = Math.max(
    Number(process.env.ALERTING_SCHEDULER_INTERVAL_MS || '60000') || 60000,
    15000,
  );
  readonly alertDeliveryIntervalMs = Math.max(
    Number(process.env.ALERTING_DELIVERY_INTERVAL_MS || '30000') || 30000,
    10000,
  );
  readonly alertTriageEscalationIntervalMs = Math.max(
    Number(process.env.ALERTING_TRIAGE_ESCALATION_INTERVAL_MS || '60000') || 60000,
    15000,
  );

  private alertSchedulerTimer: NodeJS.Timeout | null = null;
  private alertDeliveryTimer: NodeJS.Timeout | null = null;
  private alertTriageEscalationTimer: NodeJS.Timeout | null = null;

  private alertSchedulerRunning = false;
  private alertTriageEscalationRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => DashboardService))
    private readonly dashboardService: DashboardService,
  ) {}

  onModuleInit() {
    this.startAlertingScheduler();
    this.startAlertDeliveryWorker();
    this.startAlertTriageEscalationWorker();
  }

  onModuleDestroy() {
    if (this.alertSchedulerTimer) {
      clearInterval(this.alertSchedulerTimer);
      this.alertSchedulerTimer = null;
    }
    if (this.alertDeliveryTimer) {
      clearInterval(this.alertDeliveryTimer);
      this.alertDeliveryTimer = null;
    }
    if (this.alertTriageEscalationTimer) {
      clearInterval(this.alertTriageEscalationTimer);
      this.alertTriageEscalationTimer = null;
    }
  }

  private startAlertingScheduler() {
    if (this.alertSchedulerTimer) {
      return;
    }

    this.alertSchedulerTimer = setInterval(() => {
      void this.runAlertingSchedulerCycle().catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown alert scheduler error.';
        this.logger.error(`Alert scheduler cycle failed: ${message}`);
      });
    }, this.alertSchedulerIntervalMs);

    this.logger.log(`Alert scheduler started with interval ${this.alertSchedulerIntervalMs}ms`);
  }

  private startAlertDeliveryWorker() {
    if (this.alertDeliveryTimer) {
      return;
    }

    this.alertDeliveryTimer = setInterval(() => {
      void this.dashboardService.runAlertDeliveryCycle().catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Unknown alert delivery worker error.';
        this.logger.error(`Alert delivery cycle failed: ${message}`);
      });
    }, this.alertDeliveryIntervalMs);

    this.logger.log(
      `Alert delivery worker started with interval ${this.alertDeliveryIntervalMs}ms`,
    );
  }

  private startAlertTriageEscalationWorker() {
    if (this.alertTriageEscalationTimer) {
      return;
    }

    this.alertTriageEscalationTimer = setInterval(() => {
      void this.runAlertingTriageEscalationCycle().catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown triage escalation error.';
        this.logger.error(`Alert triage escalation cycle failed: ${message}`);
      });
    }, this.alertTriageEscalationIntervalMs);

    this.logger.log(
      `Alert triage escalation worker started with interval ${this.alertTriageEscalationIntervalMs}ms`,
    );
  }

  // ── Scheduler cycle ─────────────────────────────────────────────────

  async runAlertingSchedulerCycle(actor = 'system-scheduler') {
    if (this.alertSchedulerRunning) {
      return { success: true, data: { processed_rule_count: 0, skipped: true } };
    }

    this.alertSchedulerRunning = true;
    try {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          rule_id,
          rule_name,
          schedule_value,
          last_run_at
        FROM public.alert_rule
        WHERE deleted_at IS NULL
          AND is_active = TRUE
          AND status = 'active'
        ORDER BY rule_id ASC
      `);

      const now = Date.now();
      const dueRules = rows.filter((row) => {
        const intervalMs = this.parseAlertScheduleToMs(String(row.schedule_value || '').trim());
        const lastRunAt = row.last_run_at ? new Date(String(row.last_run_at)).getTime() : 0;
        if (!intervalMs) return false;
        if (!lastRunAt) return true;
        return now - lastRunAt >= intervalMs;
      });

      const results: Array<Record<string, unknown>> = [];
      for (const rule of dueRules) {
        try {
          const result = await this.dashboardService.runAlertingRule(String(rule.rule_id), actor);
          results.push({
            rule_id: Number(rule.rule_id || 0),
            rule_name: String(rule.rule_name || ''),
            success: true,
            matched_snapshot_id: result?.data?.matched_snapshot_id ?? null,
            event_id:
              result?.data?.event && typeof result.data.event === 'object'
                ? Number((result.data.event as Record<string, unknown>).event_id || 0) || null
                : null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown scheduler error.';
          this.logger.error(`Alert scheduler failed for rule ${String(rule.rule_id)}: ${message}`);
          results.push({
            rule_id: Number(rule.rule_id || 0),
            rule_name: String(rule.rule_name || ''),
            success: false,
            error_message: message,
          });
        }
      }

      return {
        success: true,
        data: {
          processed_rule_count: results.length,
          skipped: false,
          results,
        },
      };
    } finally {
      this.alertSchedulerRunning = false;
    }
  }

  // ── Triage escalation cycle ─────────────────────────────────────────

  async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
    if (this.alertTriageEscalationRunning) {
      return {
        success: true,
        data: { processed_item_count: 0, escalated_count: 0, skipped: true, results: [] },
      };
    }

    this.alertTriageEscalationRunning = true;
    try {
      const [triagePayload, escalationConfig] = await Promise.all([
        this.dashboardService.alertingDeadLetterTriage(),
        this.getAlertingTriageEscalationConfig(),
      ]);

      const items = Array.isArray(triagePayload.data)
        ? (triagePayload.data as Array<Record<string, unknown>>)
        : [];

      const escalationRule = await this.ensureAlertingTriageEscalationRule(actor);
      const nowMs = Date.now();
      const cooldownMs = escalationConfig.cooldown_minutes * 60000;
      const results: Array<Record<string, unknown>> = [];

      for (const item of items) {
        const triageStatus = String(item.triage_status || '');
        const slaStatus = String(item.sla_status || '');
        if (item.acknowledged_at) {
          results.push({
            delivery_id: Number(item.delivery_id || 0),
            escalated: false,
            reason: 'acknowledged-by-operator',
            escalation_level: String(item.escalation_level || 'none'),
          });
          continue;
        }

        if (triageStatus === 'resolved' || !['overdue', 'critical'].includes(slaStatus)) {
          continue;
        }

        const escalationLevel = slaStatus === 'critical' ? 'critical' : 'warning';
        const lastEscalatedAt = item.last_escalated_at
          ? new Date(String(item.last_escalated_at)).getTime()
          : 0;
        const lastEscalationLevel = String(item.last_escalation_level || '');
        const cooldownElapsed = !lastEscalatedAt || nowMs - lastEscalatedAt >= cooldownMs;
        const severityChanged = lastEscalationLevel !== escalationLevel;
        if (!cooldownElapsed && !severityChanged) {
          results.push({
            delivery_id: Number(item.delivery_id || 0),
            escalated: false,
            reason: 'cooldown-active',
            escalation_level: escalationLevel,
          });
          continue;
        }

        const deliveryId = Number(item.delivery_id || 0);
        const eventKey = `evt-triage-escalation-${deliveryId}-${Date.now()}`;
        const severity = escalationLevel === 'critical' ? 'critical' : 'high';
        const title = `[${escalationLevel.toUpperCase()}] Dead-letter triage requires action`;
        const description = [
          item.event_title ? `Event: ${String(item.event_title)}` : null,
          item.rule_name ? `Rule: ${String(item.rule_name)}` : null,
          `Delivery #${deliveryId}`,
          item.assigned_to ? `Assignee: ${String(item.assigned_to)}` : 'Assignee: unassigned',
          `Channel: ${String(item.channel_type || '-')}`,
          `Target: ${String(item.target_value || '-')}`,
          `SLA status: ${slaStatus}`,
          `Age: ${Number(item.age_minutes || 0)} minutes`,
          item.dead_letter_reason ? `Reason: ${String(item.dead_letter_reason)}` : null,
        ]
          .filter(Boolean)
          .join(' | ');

        const escalationTargetResult = await this.resolveAlertingTriageEscalationTargets(
          escalationConfig.channel_key,
          item.module_key ? String(item.module_key) : null,
          escalationLevel,
          item.assigned_to ? String(item.assigned_to) : null,
          Number(item.escalation_count || 0),
          severityChanged,
        );
        const targets = escalationTargetResult.targets;

        if (!targets.length) {
          results.push({
            delivery_id: deliveryId,
            escalated: false,
            reason:
              escalationTargetResult.stage_priority === null
                ? 'no-target-channel'
                : 'stage-target-not-found',
            escalation_level: escalationLevel,
            escalation_stage_index: escalationTargetResult.stage_index,
            escalation_stage_priority: escalationTargetResult.stage_priority,
            repeating_final_stage: escalationTargetResult.repeating_final_stage,
          });
          continue;
        }

        const insertedEvents = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
          INSERT INTO public.alert_event (
            event_key,
            rule_id,
            metric_id,
            snapshot_id,
            title,
            description,
            severity,
            status,
            source_ref,
            event_payload,
            detected_at,
            created_by,
            updated_by
          ) VALUES (
            '${escapeSqlLiteral(eventKey)}',
            ${escalationRule.rule_id},
            NULL,
            NULL,
            '${escapeSqlLiteral(title)}',
            '${escapeSqlLiteral(description)}',
            '${escapeSqlLiteral(severity)}',
            'open',
            'dead-letter-triage',
            '${escapeSqlLiteral(
              JSON.stringify({
                triage_delivery_id: deliveryId,
                triage_status: triageStatus,
                escalation_level: escalationLevel,
                source_event_id: Number(item.event_id || 0),
                source_event_key: item.event_key || null,
              }),
            )}'::jsonb,
            NOW(),
            '${escapeSqlLiteral(actor)}',
            '${escapeSqlLiteral(actor)}'
          )
          RETURNING event_id
        `);

        const escalationEventId = Number(insertedEvents[0]?.event_id || 0);
        const insertedDeliveries: number[] = [];
        for (const target of targets) {
          const deliveryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
            INSERT INTO public.alert_delivery_log (
              event_id,
              rule_id,
              recipient_id,
              channel_type,
              target_value,
              provider_name,
              delivery_status,
              response_payload,
              requested_at,
              delivered_at
            ) VALUES (
              ${escalationEventId},
              ${escalationRule.rule_id},
              NULL,
              '${escapeSqlLiteral(String(target.channel_type || ''))}',
              '${escapeSqlLiteral(String(target.target_value || ''))}',
              'triage-escalation',
              'queued',
              '${escapeSqlLiteral(
                JSON.stringify({
                  trigger: 'triage-escalation',
                  source_delivery_id: deliveryId,
                  escalation_level: escalationLevel,
                  escalation_channel_key: String(target.channel_key || ''),
                  escalation_owner_label: target.owner_label || null,
                  escalation_stage_index: escalationTargetResult.stage_index,
                  escalation_stage_priority: escalationTargetResult.stage_priority,
                  escalation_routing_source: target.routing_source || null,
                  repeating_final_stage: escalationTargetResult.repeating_final_stage,
                }),
              )}'::jsonb,
              NOW(),
              NULL
            )
            RETURNING delivery_id
          `);
          insertedDeliveries.push(Number(deliveryRows[0]?.delivery_id || 0));
        }

        await this.prisma.$executeRawUnsafe(`
          INSERT INTO public.alert_dead_letter_triage (
            delivery_id,
            triage_status,
            assigned_to,
            note,
            escalation_count,
            last_escalated_at,
            last_escalation_level,
            last_action_at,
            created_by,
            updated_by
          ) VALUES (
            ${deliveryId},
            '${escapeSqlLiteral(triageStatus)}',
            ${item.assigned_to ? `'${escapeSqlLiteral(String(item.assigned_to))}'` : 'NULL'},
            ${item.note ? `'${escapeSqlLiteral(String(item.note))}'` : 'NULL'},
            1,
            NOW(),
            '${escapeSqlLiteral(escalationLevel)}',
            NOW(),
            '${escapeSqlLiteral(actor)}',
            '${escapeSqlLiteral(actor)}'
          )
          ON CONFLICT (delivery_id) DO UPDATE SET
            escalation_count = COALESCE(public.alert_dead_letter_triage.escalation_count, 0) + 1,
            last_escalated_at = NOW(),
            last_escalation_level = '${escapeSqlLiteral(escalationLevel)}',
            last_action_at = NOW(),
            updated_by = '${escapeSqlLiteral(actor)}'
        `);

        results.push({
          delivery_id: deliveryId,
          escalated: true,
          escalation_level: escalationLevel,
          escalation_stage_index: escalationTargetResult.stage_index,
          escalation_stage_priority: escalationTargetResult.stage_priority,
          has_more_stages: escalationTargetResult.has_more_stages,
          repeating_final_stage: escalationTargetResult.repeating_final_stage,
          escalation_event_id: escalationEventId,
          escalation_delivery_ids: insertedDeliveries,
          channel_keys: targets.map((target) => String(target.channel_key || '')),
          routed_to_owner: targets.some(
            (target) => String(target.routing_source || '') === 'assigned-owner',
          ),
        });
      }

      const escalatedCount = results.filter((item) => item.escalated).length;
      const deliveryRun = escalatedCount
        ? await this.dashboardService.runAlertDeliveryCycle(actor)
        : null;

      return {
        success: true,
        data: {
          processed_item_count: items.length,
          escalated_count: escalatedCount,
          skipped: false,
          escalation_channel_key: escalationConfig.channel_key,
          cooldown_minutes: escalationConfig.cooldown_minutes,
          delivery_run: deliveryRun?.data || null,
          results,
        },
      };
    } finally {
      this.alertTriageEscalationRunning = false;
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────

  private parseAlertScheduleToMs(scheduleValue: string) {
    const normalized = scheduleValue.trim().toLowerCase();
    if (!normalized) return 0;

    const presetMap: Record<string, number> = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
    };
    if (presetMap[normalized]) {
      return presetMap[normalized];
    }

    const match = normalized.match(/^(\d+)(m|h|d)$/);
    if (!match) {
      return 0;
    }

    const value = Number(match[1] || 0);
    const unit = match[2];
    if (!value) return 0;
    if (unit === 'm') return value * 60 * 1000;
    if (unit === 'h') return value * 60 * 60 * 1000;
    if (unit === 'd') return value * 24 * 60 * 60 * 1000;
    return 0;
  }

  private async getAlertingTriageEscalationConfig() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT setting_key, value_text, value_json
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
        AND setting_key IN ('triage_escalation_channel_key', 'triage_escalation_cooldown_minutes')
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

    const channelSetting = settings.get('triage_escalation_channel_key');
    const cooldownSetting = settings.get('triage_escalation_cooldown_minutes');
    const channelKey =
      String(
        channelSetting?.value_json?.channel_key ||
          channelSetting?.value_text ||
          'channel-ops-alert-group',
      ).trim() || 'channel-ops-alert-group';
    const cooldownMinutes = Number(
      (cooldownSetting?.value_json?.minutes as number | string | undefined) ||
        (cooldownSetting?.value_text ? Number.parseInt(cooldownSetting.value_text, 10) : NaN),
    );

    return {
      channel_key: channelKey,
      cooldown_minutes:
        Number.isFinite(cooldownMinutes) && cooldownMinutes > 0 ? cooldownMinutes : 60,
    };
  }

  private async ensureAlertingTriageEscalationRule(actor: string) {
    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT rule_id, rule_key
      FROM public.alert_rule
      WHERE rule_key = 'system-dead-letter-triage-escalation'
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing[0]?.rule_id) {
      return {
        rule_id: Number(existing[0].rule_id),
        rule_key: String(existing[0].rule_key || 'system-dead-letter-triage-escalation'),
      };
    }

    const inserted = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_rule (
        rule_key,
        rule_name,
        description,
        module_key,
        source_type,
        source_ref,
        metric_id,
        system_metric_ref,
        semantic_ref,
        condition_mapping_id,
        condition_mapping_key,
        condition_operator_key,
        comparison_type,
        value_type,
        schedule_type,
        schedule_value,
        severity,
        primary_channel,
        condition_summary,
        condition_config,
        source_context,
        message_template,
        status,
        is_active,
        created_by,
        updated_by
      ) VALUES (
        'system-dead-letter-triage-escalation',
        'System Dead-Letter Triage Escalation',
        'Internal rule used to escalate overdue or critical dead-letter triage items.',
        'alerting',
        'manual-rule-source',
        'dead-letter-triage',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'threshold',
        'text',
        'preset',
        '15m',
        'high',
        'wa-group',
        'Internal dead-letter triage escalation',
        '{}'::jsonb,
        '{"system":true,"purpose":"triage-escalation"}'::jsonb,
        'Dead-letter triage escalation triggered.',
        'active',
        TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      RETURNING rule_id, rule_key
    `);

    return {
      rule_id: Number(inserted[0]?.rule_id || 0),
      rule_key: String(inserted[0]?.rule_key || 'system-dead-letter-triage-escalation'),
    };
  }

  private async resolveAlertingTriageEscalationTargets(
    escalationChannelKey: string,
    moduleKey: string | null,
    escalationLevel: string,
    assignedTo: string | null,
    escalationCount: number,
    severityChanged: boolean,
  ) {
    const [channels, policies, roles, teams, roleChannels, teamChannels] = await Promise.all([
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_id,
        channel_key,
        channel_type,
        label,
        target_value,
        ownership_type,
        owner_label,
        metadata
      FROM public.alert_notification_channel
      WHERE deleted_at IS NULL
        AND is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        policy_id,
        module_key,
        escalation_level,
        target_type,
        target_ref,
        priority
      FROM public.alert_triage_escalation_policy
      WHERE is_active = TRUE
        AND deleted_at IS NULL
        AND escalation_level = '${escapeSqlLiteral(escalationLevel)}'
        AND module_key IN (
          '${escapeSqlLiteral(moduleKey || 'all')}',
          'all'
        )
      ORDER BY priority ASC, policy_id ASC
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        role_key,
        label
      FROM public.alert_routing_role
      WHERE is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        team_key,
        label
      FROM public.alert_routing_team
      WHERE is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        rc.role_key,
        rc.channel_key
      FROM public.alert_routing_role_channel rc
      JOIN public.alert_routing_role r ON r.role_key = rc.role_key
      WHERE rc.is_active = TRUE
        AND r.is_active = TRUE
    `),
      this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        tc.team_key,
        tc.channel_key
      FROM public.alert_routing_team_channel tc
      JOIN public.alert_routing_team t ON t.team_key = tc.team_key
      WHERE tc.is_active = TRUE
        AND t.is_active = TRUE
    `),
    ]);

    const normalizedAssignedTo = (assignedTo || '').trim().toLowerCase();
    const matchingPolicies = policies.map((policy) => ({
      policy_id: Number(policy.policy_id || 0),
      module_key: String(policy.module_key || ''),
      escalation_level: String(policy.escalation_level || ''),
      target_type: String(policy.target_type || ''),
      target_ref: String(policy.target_ref || ''),
      priority: Number(policy.priority || 0),
    }));

    const stagePriorities = Array.from(
      new Set(matchingPolicies.map((policy) => policy.priority)),
    ).sort((a, b) => a - b);
    const requestedStageIndex = severityChanged ? 0 : Math.max(0, escalationCount);
    const repeatingFinalStage =
      stagePriorities.length > 0 && requestedStageIndex >= stagePriorities.length;
    const stageIndex = repeatingFinalStage ? stagePriorities.length - 1 : requestedStageIndex;
    const currentStagePriority = stagePriorities[stageIndex] ?? null;
    const includeBaselineTargets = stageIndex === 0;

    const resolved = new Map<
      string,
      Record<string, unknown> & { routing_source?: string; stage_priority?: number | null }
    >();

    const pushTarget = (
      target: Record<string, unknown>,
      routingSource: string,
      stagePriority: number | null,
    ) => {
      const key = `${String(target.channel_type || '')}:${String(target.target_value || '')}`;
      if (!resolved.has(key)) {
        resolved.set(key, {
          ...target,
          routing_source: routingSource,
          stage_priority: stagePriority,
        });
      }
    };

    const resolveRoleChannels = (roleRef: string) => {
      const normalizedRoleRef = roleRef.trim().toLowerCase();
      const matchingRoleKeys = roles
        .filter((role) => {
          const roleKey = String(role.role_key || '')
            .trim()
            .toLowerCase();
          const roleLabel = String(role.label || '')
            .trim()
            .toLowerCase();
          return roleKey === normalizedRoleRef || roleLabel === normalizedRoleRef;
        })
        .map((role) => String(role.role_key || ''));

      const directRegistryChannels = roleChannels
        .filter((mapping) => matchingRoleKeys.includes(String(mapping.role_key || '')))
        .flatMap((mapping) =>
          channels.filter(
            (channel) => String(channel.channel_key || '') === String(mapping.channel_key || ''),
          ),
        );

      if (directRegistryChannels.length) {
        return directRegistryChannels;
      }

      return channels.filter(
        (channel) =>
          String(channel.ownership_type || '') === 'internal_user' &&
          String(channel.owner_label || '')
            .trim()
            .toLowerCase() === normalizedRoleRef,
      );
    };

    const resolveTeamChannels = (teamRef: string) => {
      const normalizedTeamRef = teamRef.trim().toLowerCase();
      const matchingTeamKeys = teams
        .filter((team) => {
          const teamKey = String(team.team_key || '')
            .trim()
            .toLowerCase();
          const teamLabel = String(team.label || '')
            .trim()
            .toLowerCase();
          return teamKey === normalizedTeamRef || teamLabel === normalizedTeamRef;
        })
        .map((team) => String(team.team_key || ''));

      const directRegistryChannels = teamChannels
        .filter((mapping) => matchingTeamKeys.includes(String(mapping.team_key || '')))
        .flatMap((mapping) =>
          channels.filter(
            (channel) => String(channel.channel_key || '') === String(mapping.channel_key || ''),
          ),
        );

      if (directRegistryChannels.length) {
        return directRegistryChannels;
      }

      return channels.filter((channel) => {
        const metadata = asJson<Record<string, unknown>>(channel.metadata, {});
        return (
          String(metadata['team'] || '')
            .trim()
            .toLowerCase() === normalizedTeamRef
        );
      });
    };

    if (includeBaselineTargets) {
      const fallbackChannel = channels.find(
        (channel) => String(channel.channel_key || '') === escalationChannelKey,
      );
      if (fallbackChannel) {
        pushTarget(fallbackChannel, 'fallback-channel', null);
      }

      if (normalizedAssignedTo) {
        resolveRoleChannels(normalizedAssignedTo).forEach((channel) =>
          pushTarget(channel, 'assigned-owner', null),
        );
      }
    }

    if (currentStagePriority !== null) {
      const currentStagePolicies = matchingPolicies.filter(
        (policy) => policy.priority === currentStagePriority,
      );
      for (const policy of currentStagePolicies) {
        if (policy.target_type === 'channel') {
          channels
            .filter((channel) => String(channel.channel_key || '') === policy.target_ref)
            .forEach((channel) => pushTarget(channel, 'policy-channel', currentStagePriority));
        } else if (policy.target_type === 'role') {
          resolveRoleChannels(policy.target_ref).forEach((channel) =>
            pushTarget(channel, 'policy-role', currentStagePriority),
          );
        } else if (policy.target_type === 'team') {
          resolveTeamChannels(policy.target_ref).forEach((channel) =>
            pushTarget(channel, 'policy-team', currentStagePriority),
          );
        }
      }
    }

    const orderedTargets = Array.from(resolved.values()).sort((left, right) => {
      const leftStage = typeof left.stage_priority === 'number' ? left.stage_priority : -1;
      const rightStage = typeof right.stage_priority === 'number' ? right.stage_priority : -1;
      if (leftStage !== rightStage) return leftStage - rightStage;
      return Number(left.channel_id || 0) - Number(right.channel_id || 0);
    });

    return {
      targets: orderedTargets,
      stage_index: stageIndex,
      stage_priority: currentStagePriority,
      has_more_stages: currentStagePriority !== null && stageIndex < stagePriorities.length - 1,
      stage_count: stagePriorities.length,
      baseline_included: includeBaselineTargets,
      repeating_final_stage: repeatingFinalStage,
    };
  }
}
