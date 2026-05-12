import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';

/**
 * AlertingSchedulerService
 *
 * Owns the lifecycle and interval timers for the alerting workers:
 *  - rule scheduler (drives `runAlertingSchedulerCycle`)
 *  - delivery worker (drives `runAlertDeliveryCycle`)
 *  - triage escalation worker (drives `runAlertingTriageEscalationCycle`)
 *
 * The cycle method bodies still live on DashboardService; this service only
 * owns timer scheduling + lifecycle. Cycle bodies will be migrated to
 * dedicated services (delivery/triage) in subsequent commits.
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

  constructor(
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
      void this.dashboardService.runAlertingSchedulerCycle().catch((error) => {
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
      void this.dashboardService.runAlertingTriageEscalationCycle().catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown triage escalation error.';
        this.logger.error(`Alert triage escalation cycle failed: ${message}`);
      });
    }, this.alertTriageEscalationIntervalMs);

    this.logger.log(
      `Alert triage escalation worker started with interval ${this.alertTriageEscalationIntervalMs}ms`,
    );
  }
}
