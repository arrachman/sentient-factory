import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingTriageEscalationService } from './alerting-triage-escalation.service';

/**
 * AlertingSchedulerService
 *
 * Owns the lifecycle timers AND cycle bodies for the alerting workers:
 *  - rule scheduler (`runAlertingSchedulerCycle`)
 *  - delivery worker (delegates to AlertingDeliveryService.runAlertDeliveryCycle)
 *  - triage escalation worker (delegates to AlertingTriageEscalationService)
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
    private readonly alertingDeliveryService: AlertingDeliveryService,
    private readonly alertingRuleService: AlertingRuleService,
    private readonly alertingTriageEscalationService: AlertingTriageEscalationService,
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
      void this.alertingDeliveryService.runAlertDeliveryCycle().catch((error) => {
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
          const result = await this.alertingRuleService.runAlertingRule(String(rule.rule_id), actor);
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
      return await this.alertingTriageEscalationService.runAlertingTriageEscalationCycle(actor);
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
}
