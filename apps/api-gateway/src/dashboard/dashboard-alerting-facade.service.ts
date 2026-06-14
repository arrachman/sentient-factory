import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { AlertingTriageService } from './alerting-triage.service';

/**
 * DashboardAlertingFacadeService
 *
 * Thin facade for all alerting-related operations.
 * Alerting controllers inject this instead of DashboardService.
 */
@Injectable()
export class DashboardAlertingFacadeService {
  constructor(
    private readonly alertingRuleService: AlertingRuleService,
    @Inject(forwardRef(() => AlertingConfigService))
    private readonly alertingConfigService: AlertingConfigService,
    private readonly alertingObservabilityService: AlertingObservabilityService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
    private readonly alertingTriageService: AlertingTriageService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
  ) {}

  // ── Rules ──────────────────────────────────────────────────────────────────

  alertingBusinessMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingBusinessMetrics(moduleKey);
  }

  alertingSystemMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingSystemMetrics(moduleKey);
  }

  alertingMetricBuilderContext(moduleKey?: string, metricKey?: string) {
    return this.alertingRuleService.alertingMetricBuilderContext(moduleKey, metricKey);
  }

  alertingInsights(moduleKey?: string, snapshotId?: string) {
    return this.alertingRuleService.alertingInsights(moduleKey, snapshotId);
  }

  alertingSavedQueries(channel?: string, limit?: string) {
    return this.alertingRuleService.alertingSavedQueries(channel, limit);
  }

  alertingRules(moduleKey?: string) {
    return this.alertingRuleService.alertingRules(moduleKey);
  }

  alertingRuleDetail(ruleId: string) {
    return this.alertingRuleService.alertingRuleDetail(ruleId);
  }

  createAlertingRule(body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.createAlertingRule(body, actor);
  }

  updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRule(ruleId, body, actor);
  }

  updateAlertingRuleState(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRuleState(ruleId, body, actor);
  }

  deleteAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.deleteAlertingRule(ruleId, actor);
  }

  runAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.runAlertingRule(ruleId, actor);
  }

  alertingEvents(moduleKey?: string, eventId?: string) {
    return this.alertingRuleService.alertingEvents(moduleKey, eventId);
  }

  updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    return this.alertingConfigService.updateAlertingEvent(eventId, body, actor);
  }

  // ── Scheduler cycles ───────────────────────────────────────────────────────

  runAlertingSchedulerCycle(actor = 'system-scheduler') {
    return this.alertingSchedulerService.runAlertingSchedulerCycle(actor);
  }

  runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
    return this.alertingSchedulerService.runAlertingTriageEscalationCycle(actor);
  }

  // ── Delivery ───────────────────────────────────────────────────────────────

  runAlertDeliveryCycle(actor = 'system-delivery') {
    return this.alertingDeliveryService.runAlertDeliveryCycle(actor);
  }

  alertingDeliveryLogs(eventId?: string) {
    return this.alertingDeliveryService.alertingDeliveryLogs(eventId);
  }

  requeueAlertingDeliveryLog(deliveryId: string, actor: string) {
    return this.alertingDeliveryService.requeueAlertingDeliveryLog(deliveryId, actor);
  }

  // ── Triage ─────────────────────────────────────────────────────────────────

  alertingDeadLetterTriage(query: Record<string, unknown> = {}) {
    return this.alertingTriageService.alertingDeadLetterTriage(query);
  }

  updateAlertingDeadLetterTriage(
    deliveryId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingTriageService.updateAlertingDeadLetterTriage(deliveryId, body, actor);
  }

  // ── Observability ──────────────────────────────────────────────────────────

  alertingAnalytics() {
    return this.alertingObservabilityService.alertingAnalytics();
  }

  alertingDeliveryObservability() {
    return this.alertingObservabilityService.alertingDeliveryObservability();
  }

  alertingOpsOverview() {
    return this.alertingObservabilityService.alertingOpsOverview();
  }

  alertingDeliveryStatus() {
    return this.alertingObservabilityService.alertingDeliveryStatus();
  }

  alertingProviderHealth() {
    return this.alertingObservabilityService.alertingProviderHealth();
  }

  // ── Config ─────────────────────────────────────────────────────────────────

  alertingBaileysPairing(body: { phoneNumber?: string; phone_number?: string }, actor: string) {
    return this.alertingConfigService.alertingBaileysPairing(body, actor);
  }

  alertingChannels(channelType?: string) {
    return this.alertingConfigService.alertingChannels(channelType);
  }

  alertingTemplates(module?: string) {
    return this.alertingConfigService.alertingTemplates(module);
  }

  createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTemplate(body, actor);
  }

  alertingTemplateDetail(templateId: string) {
    return this.alertingConfigService.alertingTemplateDetail(templateId);
  }

  updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTemplate(templateId, body, actor);
  }

  updateAlertingTemplateState(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTemplateState(templateId, body, actor);
  }

  deleteAlertingTemplate(templateId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTemplate(templateId, actor);
  }

  createAlertingChannel(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingChannel(body, actor);
  }

  updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingChannel(channelId, body, actor);
  }

  updateAlertingChannelState(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingChannelState(channelId, body, actor);
  }

  deleteAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingChannel(channelId, actor);
  }

  testAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.testAlertingChannel(channelId, actor);
  }

  alertingSettings() {
    return this.alertingConfigService.alertingSettings();
  }

  updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingSetting(settingKey, body, actor);
  }

  alertingEscalationPolicies(module?: string, targetType?: string) {
    return this.alertingConfigService.alertingEscalationPolicies(module, targetType);
  }

  createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingEscalationPolicy(body, actor);
  }

  updateAlertingEscalationPolicy(policyId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingEscalationPolicy(policyId, body, actor);
  }

  updateAlertingEscalationPolicyState(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicyState(policyId, body, actor);
  }

  deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingEscalationPolicy(policyId, actor);
  }

  alertingTriageSavedViews(actor: string) {
    return this.alertingConfigService.alertingTriageSavedViews(actor);
  }

  createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTriageSavedView(body, actor);
  }

  updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTriageSavedView(viewId, body, actor);
  }

  updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTriageSavedViewState(viewId, body, actor);
  }

  deleteAlertingTriageSavedView(viewId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTriageSavedView(viewId, actor);
  }

  // ── Provider session ───────────────────────────────────────────────────────

  ensureAlertingTestRule(actor: string) {
    return this.alertingProviderSessionService.ensureAlertingTestRule(actor);
  }

  createAlertProviderSessionAudit(input: {
    providerName: string;
    channelType: 'wa-group' | 'wa-personal' | 'email';
    actionType: 'health-check' | 'pairing-start' | 'pairing-result' | 'session-refresh';
    status: 'captured' | 'success' | 'failed' | 'warning';
    pairingMode?: string | null;
    phoneNumber?: string | null;
    authDir?: string | null;
    detailPayload?: Record<string, unknown>;
    errorMessage?: string | null;
    actor: string;
  }) {
    return this.alertingProviderSessionService.createAlertProviderSessionAudit(input);
  }

  upsertAlertProviderSessionState(input: {
    providerName: string;
    channelType: 'wa-group' | 'wa-personal' | 'email';
    sessionKey: string;
    sessionStatus:
      | 'disabled'
      | 'disconnected'
      | 'pairing-required'
      | 'pairing-in-progress'
      | 'ready'
      | 'connected'
      | 'error';
    pairingMode?: string | null;
    phoneNumber?: string | null;
    authDir?: string | null;
    statusMessage?: string | null;
    detailPayload?: Record<string, unknown>;
    lastHealthCheckAt?: Date | null;
    lastPairingStartedAt?: Date | null;
    lastPairingResultAt?: Date | null;
    lastConnectedAt?: Date | null;
    lastDisconnectedAt?: Date | null;
    actor: string;
  }) {
    return this.alertingProviderSessionService.upsertAlertProviderSessionState(input);
  }
}
