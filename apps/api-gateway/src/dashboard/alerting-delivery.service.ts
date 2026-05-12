import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

/**
 * AlertingDeliveryService
 *
 * Thin facade over DashboardService for delivery-related operations.
 * Exists as a stepping stone in the dashboard.service.ts (8252-line)
 * refactor: alerting-config.service.ts depends on this surface, and
 * the actual method bodies will be migrated here in a follow-up commit
 * (P0-1 step 2).
 *
 * Do NOT add new business logic here. Either:
 *   - add it to DashboardService and call through, or
 *   - wait for the migration commit and add it directly here.
 */
@Injectable()
export class AlertingDeliveryService {
  constructor(
    @Inject(forwardRef(() => DashboardService))
    private readonly dashboardService: DashboardService,
  ) {}

  ensureAlertingTestRule(actor: string) {
    return this.dashboardService.ensureAlertingTestRule(actor);
  }

  runAlertDeliveryCycle(actor: string) {
    return this.dashboardService.runAlertDeliveryCycle(actor);
  }

  createAlertProviderSessionAudit(input: Parameters<DashboardService['createAlertProviderSessionAudit']>[0]) {
    return this.dashboardService.createAlertProviderSessionAudit(input);
  }

  upsertAlertProviderSessionState(input: Parameters<DashboardService['upsertAlertProviderSessionState']>[0]) {
    return this.dashboardService.upsertAlertProviderSessionState(input);
  }
}
