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
var AlertingSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const alerting_delivery_service_1 = require("./alerting-delivery.service");
const alerting_rule_service_1 = require("./alerting-rule.service");
const alerting_triage_escalation_service_1 = require("./alerting-triage-escalation.service");
let AlertingSchedulerService = AlertingSchedulerService_1 = class AlertingSchedulerService {
    prisma;
    alertingDeliveryService;
    alertingRuleService;
    alertingTriageEscalationService;
    logger = new common_1.Logger(AlertingSchedulerService_1.name);
    alertSchedulerIntervalMs = Math.max(Number(process.env.ALERTING_SCHEDULER_INTERVAL_MS || '60000') || 60000, 15000);
    alertDeliveryIntervalMs = Math.max(Number(process.env.ALERTING_DELIVERY_INTERVAL_MS || '30000') || 30000, 10000);
    alertTriageEscalationIntervalMs = Math.max(Number(process.env.ALERTING_TRIAGE_ESCALATION_INTERVAL_MS || '60000') || 60000, 15000);
    alertSchedulerTimer = null;
    alertDeliveryTimer = null;
    alertTriageEscalationTimer = null;
    alertSchedulerRunning = false;
    alertTriageEscalationRunning = false;
    constructor(prisma, alertingDeliveryService, alertingRuleService, alertingTriageEscalationService) {
        this.prisma = prisma;
        this.alertingDeliveryService = alertingDeliveryService;
        this.alertingRuleService = alertingRuleService;
        this.alertingTriageEscalationService = alertingTriageEscalationService;
    }
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
    startAlertingScheduler() {
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
    startAlertDeliveryWorker() {
        if (this.alertDeliveryTimer) {
            return;
        }
        this.alertDeliveryTimer = setInterval(() => {
            void this.alertingDeliveryService.runAlertDeliveryCycle().catch((error) => {
                const message = error instanceof Error ? error.message : 'Unknown alert delivery worker error.';
                this.logger.error(`Alert delivery cycle failed: ${message}`);
            });
        }, this.alertDeliveryIntervalMs);
        this.logger.log(`Alert delivery worker started with interval ${this.alertDeliveryIntervalMs}ms`);
    }
    startAlertTriageEscalationWorker() {
        if (this.alertTriageEscalationTimer) {
            return;
        }
        this.alertTriageEscalationTimer = setInterval(() => {
            void this.runAlertingTriageEscalationCycle().catch((error) => {
                const message = error instanceof Error ? error.message : 'Unknown triage escalation error.';
                this.logger.error(`Alert triage escalation cycle failed: ${message}`);
            });
        }, this.alertTriageEscalationIntervalMs);
        this.logger.log(`Alert triage escalation worker started with interval ${this.alertTriageEscalationIntervalMs}ms`);
    }
    async runAlertingSchedulerCycle(actor = 'system-scheduler') {
        if (this.alertSchedulerRunning) {
            return { success: true, data: { processed_rule_count: 0, skipped: true } };
        }
        this.alertSchedulerRunning = true;
        try {
            const rows = await this.prisma.$queryRawUnsafe(`
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
                if (!intervalMs)
                    return false;
                if (!lastRunAt)
                    return true;
                return now - lastRunAt >= intervalMs;
            });
            const results = [];
            for (const rule of dueRules) {
                try {
                    const result = await this.alertingRuleService.runAlertingRule(String(rule.rule_id), actor);
                    results.push({
                        rule_id: Number(rule.rule_id || 0),
                        rule_name: String(rule.rule_name || ''),
                        success: true,
                        matched_snapshot_id: result?.data?.matched_snapshot_id ?? null,
                        event_id: result?.data?.event && typeof result.data.event === 'object'
                            ? Number(result.data.event.event_id || 0) || null
                            : null,
                    });
                }
                catch (error) {
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
        }
        finally {
            this.alertSchedulerRunning = false;
        }
    }
    async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
        if (this.alertTriageEscalationRunning) {
            return {
                success: true,
                data: { processed_item_count: 0, escalated_count: 0, skipped: true, results: [] },
            };
        }
        this.alertTriageEscalationRunning = true;
        try {
            return await this.alertingTriageEscalationService.runAlertingTriageEscalationCycle(actor);
        }
        finally {
            this.alertTriageEscalationRunning = false;
        }
    }
    parseAlertScheduleToMs(scheduleValue) {
        const normalized = scheduleValue.trim().toLowerCase();
        if (!normalized)
            return 0;
        const presetMap = {
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
        if (!value)
            return 0;
        if (unit === 'm')
            return value * 60 * 1000;
        if (unit === 'h')
            return value * 60 * 60 * 1000;
        if (unit === 'd')
            return value * 24 * 60 * 60 * 1000;
        return 0;
    }
};
exports.AlertingSchedulerService = AlertingSchedulerService;
exports.AlertingSchedulerService = AlertingSchedulerService = AlertingSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_delivery_service_1.AlertingDeliveryService,
        alerting_rule_service_1.AlertingRuleService,
        alerting_triage_escalation_service_1.AlertingTriageEscalationService])
], AlertingSchedulerService);
//# sourceMappingURL=alerting-scheduler.service.js.map