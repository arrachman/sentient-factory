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
exports.AlertingTriageEscalationResolverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
let AlertingTriageEscalationResolverService = class AlertingTriageEscalationResolverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveAlertingTriageEscalationTargets(escalationChannelKey, moduleKey, escalationLevel, assignedTo, escalationCount, severityChanged) {
        const [channels, policies, roles, teams, roleChannels, teamChannels] = await Promise.all([
            this.prisma.$queryRawUnsafe(`
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
            this.prisma.$queryRawUnsafe(`
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
        AND escalation_level = '${(0, dashboard_utils_1.escapeSqlLiteral)(escalationLevel)}'
        AND module_key IN (
          '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey || 'all')}',
          'all'
        )
      ORDER BY priority ASC, policy_id ASC
    `),
            this.prisma.$queryRawUnsafe(`
      SELECT
        role_key,
        label
      FROM public.alert_routing_role
      WHERE is_active = TRUE
    `),
            this.prisma.$queryRawUnsafe(`
      SELECT
        team_key,
        label
      FROM public.alert_routing_team
      WHERE is_active = TRUE
    `),
            this.prisma.$queryRawUnsafe(`
      SELECT
        rc.role_key,
        rc.channel_key
      FROM public.alert_routing_role_channel rc
      JOIN public.alert_routing_role r ON r.role_key = rc.role_key
      WHERE rc.is_active = TRUE
        AND r.is_active = TRUE
    `),
            this.prisma.$queryRawUnsafe(`
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
        const stagePriorities = Array.from(new Set(matchingPolicies.map((policy) => policy.priority))).sort((a, b) => a - b);
        const requestedStageIndex = severityChanged ? 0 : Math.max(0, escalationCount);
        const repeatingFinalStage = stagePriorities.length > 0 && requestedStageIndex >= stagePriorities.length;
        const stageIndex = repeatingFinalStage ? stagePriorities.length - 1 : requestedStageIndex;
        const currentStagePriority = stagePriorities[stageIndex] ?? null;
        const includeBaselineTargets = stageIndex === 0;
        const resolved = new Map();
        const pushTarget = (target, routingSource, stagePriority) => {
            const key = `${String(target.channel_type || '')}:${String(target.target_value || '')}`;
            if (!resolved.has(key)) {
                resolved.set(key, {
                    ...target,
                    routing_source: routingSource,
                    stage_priority: stagePriority,
                });
            }
        };
        const resolveRoleChannels = (roleRef) => {
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
                .flatMap((mapping) => channels.filter((channel) => String(channel.channel_key || '') === String(mapping.channel_key || '')));
            if (directRegistryChannels.length) {
                return directRegistryChannels;
            }
            return channels.filter((channel) => String(channel.ownership_type || '') === 'internal_user' &&
                String(channel.owner_label || '')
                    .trim()
                    .toLowerCase() === normalizedRoleRef);
        };
        const resolveTeamChannels = (teamRef) => {
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
                .flatMap((mapping) => channels.filter((channel) => String(channel.channel_key || '') === String(mapping.channel_key || '')));
            if (directRegistryChannels.length) {
                return directRegistryChannels;
            }
            return channels.filter((channel) => {
                const metadata = (0, dashboard_utils_1.asJson)(channel.metadata, {});
                return (String(metadata['team'] || '')
                    .trim()
                    .toLowerCase() === normalizedTeamRef);
            });
        };
        if (includeBaselineTargets) {
            const fallbackChannel = channels.find((channel) => String(channel.channel_key || '') === escalationChannelKey);
            if (fallbackChannel) {
                pushTarget(fallbackChannel, 'fallback-channel', null);
            }
            if (normalizedAssignedTo) {
                resolveRoleChannels(normalizedAssignedTo).forEach((channel) => pushTarget(channel, 'assigned-owner', null));
            }
        }
        if (currentStagePriority !== null) {
            const currentStagePolicies = matchingPolicies.filter((policy) => policy.priority === currentStagePriority);
            for (const policy of currentStagePolicies) {
                if (policy.target_type === 'channel') {
                    channels
                        .filter((channel) => String(channel.channel_key || '') === policy.target_ref)
                        .forEach((channel) => pushTarget(channel, 'policy-channel', currentStagePriority));
                }
                else if (policy.target_type === 'role') {
                    resolveRoleChannels(policy.target_ref).forEach((channel) => pushTarget(channel, 'policy-role', currentStagePriority));
                }
                else if (policy.target_type === 'team') {
                    resolveTeamChannels(policy.target_ref).forEach((channel) => pushTarget(channel, 'policy-team', currentStagePriority));
                }
            }
        }
        const orderedTargets = Array.from(resolved.values()).sort((left, right) => {
            const leftStage = typeof left.stage_priority === 'number' ? left.stage_priority : -1;
            const rightStage = typeof right.stage_priority === 'number' ? right.stage_priority : -1;
            if (leftStage !== rightStage)
                return leftStage - rightStage;
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
};
exports.AlertingTriageEscalationResolverService = AlertingTriageEscalationResolverService;
exports.AlertingTriageEscalationResolverService = AlertingTriageEscalationResolverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertingTriageEscalationResolverService);
//# sourceMappingURL=alerting-triage-escalation-resolver.service.js.map