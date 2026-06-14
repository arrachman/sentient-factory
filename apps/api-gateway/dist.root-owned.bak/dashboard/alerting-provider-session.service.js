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
exports.AlertingProviderSessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
let AlertingProviderSessionService = class AlertingProviderSessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureAlertingTestRule(actor) {
        const existing = await this.prisma.$queryRawUnsafe(`
      SELECT rule_id, rule_key
      FROM public.alert_rule
      WHERE rule_key = 'system-test-send-rule'
        AND deleted_at IS NULL
      LIMIT 1
    `);
        if (existing[0]?.rule_id) {
            return {
                rule_id: Number(existing[0].rule_id),
                rule_key: String(existing[0].rule_key || 'system-test-send-rule'),
            };
        }
        const inserted = await this.prisma.$queryRawUnsafe(`
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
        'system-test-send-rule',
        'System Test Send Rule',
        'Internal rule used to validate alert notification channels.',
        'alerting',
        'manual-rule-source',
        'test-send',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        'threshold',
        'text',
        'preset',
        'daily',
        'low',
        'email',
        'Internal test-send rule',
        '{}'::jsonb,
        '{"system":true,"purpose":"test-send"}'::jsonb,
        'This is a test notification from the alerting module.',
        'active',
        TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
      RETURNING rule_id, rule_key
    `);
        return {
            rule_id: Number(inserted[0]?.rule_id || 0),
            rule_key: String(inserted[0]?.rule_key || 'system-test-send-rule'),
        };
    }
    async createAlertProviderSessionAudit(input) {
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_provider_session_audit (
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
        updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.providerName)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.channelType)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actionType)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.status)}',
        ${input.pairingMode ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.authDir)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        ${input.errorMessage ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.errorMessage)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actor)}'
      )
    `);
    }
    async upsertAlertProviderSessionState(input) {
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_provider_session_state (
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
        created_by,
        updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.providerName)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.channelType)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.sessionKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.sessionStatus)}',
        ${input.pairingMode ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.pairingMode)}'` : 'NULL'},
        ${input.phoneNumber ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.phoneNumber)}'` : 'NULL'},
        ${input.authDir ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.authDir)}'` : 'NULL'},
        ${input.statusMessage ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(input.statusMessage)}'` : 'NULL'},
        ${input.lastHealthCheckAt ? `'${input.lastHealthCheckAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingStartedAt ? `'${input.lastPairingStartedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastPairingResultAt ? `'${input.lastPairingResultAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastConnectedAt ? `'${input.lastConnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        ${input.lastDisconnectedAt ? `'${input.lastDisconnectedAt.toISOString()}'::timestamptz` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(input.detailPayload || {}))}'::jsonb,
        TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(input.actor)}'
      )
      ON CONFLICT (session_key) DO UPDATE SET
        session_status = EXCLUDED.session_status,
        pairing_mode = EXCLUDED.pairing_mode,
        phone_number = EXCLUDED.phone_number,
        auth_dir = EXCLUDED.auth_dir,
        status_message = EXCLUDED.status_message,
        last_health_check_at = COALESCE(EXCLUDED.last_health_check_at, public.alert_provider_session_state.last_health_check_at),
        last_pairing_started_at = COALESCE(EXCLUDED.last_pairing_started_at, public.alert_provider_session_state.last_pairing_started_at),
        last_pairing_result_at = COALESCE(EXCLUDED.last_pairing_result_at, public.alert_provider_session_state.last_pairing_result_at),
        last_connected_at = COALESCE(EXCLUDED.last_connected_at, public.alert_provider_session_state.last_connected_at),
        last_disconnected_at = COALESCE(EXCLUDED.last_disconnected_at, public.alert_provider_session_state.last_disconnected_at),
        detail_payload = EXCLUDED.detail_payload,
        is_active = TRUE,
        updated_by = EXCLUDED.updated_by
    `);
    }
};
exports.AlertingProviderSessionService = AlertingProviderSessionService;
exports.AlertingProviderSessionService = AlertingProviderSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertingProviderSessionService);
//# sourceMappingURL=alerting-provider-session.service.js.map