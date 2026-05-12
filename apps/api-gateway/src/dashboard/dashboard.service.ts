import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingTriageService } from './alerting-triage.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardQueryService } from './dashboard-query.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly prisma: PrismaService,
    private readonly dashboardCustomDbService: DashboardCustomDbService,
    private readonly alertingRuleService: AlertingRuleService,
    @Inject(forwardRef(() => AlertingConfigService))
    private readonly alertingConfigService: AlertingConfigService,
    private readonly alertingObservabilityService: AlertingObservabilityService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
    private readonly alertingTriageService: AlertingTriageService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
    private readonly dashboardInsightService: DashboardInsightService,
    private readonly dashboardQueryService: DashboardQueryService,
  ) {}

  async customDbPinTargets() {
    return this.dashboardCustomDbService.customDbPinTargets();
  }

  async alertingBusinessMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingBusinessMetrics(moduleKey);
  }

  async alertingSystemMetrics(moduleKey?: string) {
    return this.alertingRuleService.alertingSystemMetrics(moduleKey);
  }

  async alertingMetricBuilderContext(moduleKey?: string, metricKey?: string) {
    return this.alertingRuleService.alertingMetricBuilderContext(moduleKey, metricKey);
  }

  async alertingInsights(moduleKey?: string, snapshotId?: string) {
    return this.alertingRuleService.alertingInsights(moduleKey, snapshotId);
  }

  async alertingSavedQueries(channel?: string, limit?: string) {
    return this.alertingRuleService.alertingSavedQueries(channel, limit);
  }

  async alertingRules(moduleKey?: string) {
    return this.alertingRuleService.alertingRules(moduleKey);
  }

  async alertingRuleDetail(ruleId: string) {
    return this.alertingRuleService.alertingRuleDetail(ruleId);
  }

  async runAlertingSchedulerCycle(actor = 'system-scheduler') {
    return this.alertingSchedulerService.runAlertingSchedulerCycle(actor);
  }

  async runAlertDeliveryCycle(actor = 'system-delivery') {
    return this.alertingDeliveryService.runAlertDeliveryCycle(actor);
  }

  async createAlertingRule(body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.createAlertingRule(body, actor);
  }

  async updateAlertingRule(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRule(ruleId, body, actor);
  }

  async updateAlertingRuleState(ruleId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingRuleService.updateAlertingRuleState(ruleId, body, actor);
  }

  async deleteAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.deleteAlertingRule(ruleId, actor);
  }

  async runAlertingRule(ruleId: string, actor: string) {
    return this.alertingRuleService.runAlertingRule(ruleId, actor);
  }

  async alertingEvents(moduleKey?: string, eventId?: string) {
    return this.alertingRuleService.alertingEvents(moduleKey, eventId);
  }

  async runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
    return this.alertingSchedulerService.runAlertingTriageEscalationCycle(actor);
  }

  async alertingAnalytics() {
    return this.alertingObservabilityService.alertingAnalytics();
  }

  async alertingDeliveryObservability() {
    return this.alertingObservabilityService.alertingDeliveryObservability();
  }

  async alertingDeliveryLogs(eventId?: string) {
    return this.alertingDeliveryService.alertingDeliveryLogs(eventId);
  }

  async requeueAlertingDeliveryLog(deliveryId: string, actor: string) {
    return this.alertingDeliveryService.requeueAlertingDeliveryLog(deliveryId, actor);
  }

  async alertingDeadLetterTriage(query: Record<string, unknown> = {}) {
    return this.alertingTriageService.alertingDeadLetterTriage(query);
  }

  async updateAlertingDeadLetterTriage(
    deliveryId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingTriageService.updateAlertingDeadLetterTriage(deliveryId, body, actor);
  }

  async alertingOpsOverview() {
    return this.alertingObservabilityService.alertingOpsOverview();
  }

  async alertingDeliveryStatus() {
    return this.alertingObservabilityService.alertingDeliveryStatus();
  }

  async alertingProviderHealth() {
    return this.alertingObservabilityService.alertingProviderHealth();
  }

  async alertingBaileysPairing(
    body: { phoneNumber?: string; phone_number?: string },
    actor: string,
  ) {
    return this.alertingConfigService.alertingBaileysPairing(body, actor);
  }

  async alertingChannels(channelType?: string) {
    return this.alertingConfigService.alertingChannels(channelType);
  }

  async alertingTemplates(module?: string) {
    return this.alertingConfigService.alertingTemplates(module);
  }

  async createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTemplate(body, actor);
  }

  async alertingTemplateDetail(templateId: string) {
    return this.alertingConfigService.alertingTemplateDetail(templateId);
  }

  async updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingTemplate(templateId, body, actor);
  }

  async updateAlertingTemplateState(
    templateId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTemplateState(templateId, body, actor);
  }

  async deleteAlertingTemplate(templateId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTemplate(templateId, actor);
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingChannel(body, actor);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingChannel(channelId, body, actor);
  }

  async updateAlertingChannelState(
    channelId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingChannelState(channelId, body, actor);
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingChannel(channelId, actor);
  }

  async testAlertingChannel(channelId: string, actor: string) {
    return this.alertingConfigService.testAlertingChannel(channelId, actor);
  }

  async alertingSettings() {
    return this.alertingConfigService.alertingSettings();
  }

  async updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.updateAlertingSetting(settingKey, body, actor);
  }

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    return this.alertingConfigService.alertingEscalationPolicies(module, targetType);
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingEscalationPolicy(body, actor);
  }

  async updateAlertingEscalationPolicy(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicy(policyId, body, actor);
  }

  async updateAlertingEscalationPolicyState(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicyState(policyId, body, actor);
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingEscalationPolicy(policyId, actor);
  }

  async alertingTriageSavedViews(actor: string) {
    return this.alertingConfigService.alertingTriageSavedViews(actor);
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    return this.alertingConfigService.createAlertingTriageSavedView(body, actor);
  }

  async updateAlertingTriageSavedView(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTriageSavedView(viewId, body, actor);
  }

  async updateAlertingTriageSavedViewState(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTriageSavedViewState(viewId, body, actor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    return this.alertingConfigService.deleteAlertingTriageSavedView(viewId, actor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    return this.alertingConfigService.updateAlertingEvent(eventId, body, actor);
  }

  async customDbCatalog(dashboardKey: string) {
    return this.dashboardCustomDbService.customDbCatalog(dashboardKey);
  }

  async updateCustomDbCatalog(
    dashboardKey: string,
    body: { title?: string; description?: string | null },
  ) {
    return this.dashboardCustomDbService.updateCustomDbCatalog(dashboardKey, body);
  }

  async executeCustomDbQuery(
    dashboardKey: string,
    queryKey: string,
    params: Record<string, unknown>,
  ) {
    return this.dashboardCustomDbService.executeCustomDbQuery(dashboardKey, queryKey, params);
  }

  async pinCustomDbWidget(body: {
    dashboardKey?: string;
    title?: string;
    description?: string | null;
    widgetKind?: string;
    chartType?: string | null;
    spanClassName?: string | null;
    sqlTemplate?: string;
    outputColumns?: string[];
    queryLabel?: string;
  }) {
    return this.dashboardCustomDbService.pinCustomDbWidget(body);
  }

  async updateCustomDbWidget(
    widgetId: string,
    body: {
      title?: string;
      description?: string | null;
      spanClassName?: string | null;
      widgetOrder?: number | null;
      chartType?: string | null;
      defaultLimit?: number | null;
    },
  ) {
    return this.dashboardCustomDbService.updateCustomDbWidget(widgetId, body);
  }

  async deleteCustomDbWidget(widgetId: string) {
    return this.dashboardCustomDbService.deleteCustomDbWidget(widgetId);
  }

  async duplicateCustomDbWidget(widgetId: string) {
    return this.dashboardCustomDbService.duplicateCustomDbWidget(widgetId);
  }

  async summary(domainInput: string, query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.summary(domainInput, query);
  }

  async ensureAlertingTestRule(actor: string) {
    return this.alertingProviderSessionService.ensureAlertingTestRule(actor);
  }

  async createAlertProviderSessionAudit(input: {
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

  async upsertAlertProviderSessionState(input: {
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

  async trends(domainInput: string, query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.trends(domainInput, query);
  }

  async breakdown(domainInput: string, query: QueryDashboardBreakdownDto) {
    return this.dashboardQueryService.breakdown(domainInput, query);
  }

  async table(domainInput: string, query: QueryDashboardTableDto) {
    return this.dashboardQueryService.table(domainInput, query);
  }

  async breakdownStatus(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownStatus(query);
  }

  async breakdownRealisasi(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownRealisasi(query);
  }

  async breakdownSalesman(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownSalesman(query);
  }

  async breakdownCustomer(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownCustomer(query);
  }

  async breakdownM2Status(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Status(query);
  }

  async breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Cashflow(query);
  }

  async breakdownM2Branch(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Branch(query);
  }

  async topContactsM2Sm(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topContactsM2Sm(query);
  }

  async contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardQueryService.contactDrilldownM2Sm(query);
  }

  async summaryM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.summaryM2Cr(query);
  }

  async trendsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.trendsM2Cr(query);
  }

  async breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownSourceM2Cr(query);
  }

  async breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownStatusBayarM2Cr(query);
  }

  async topContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topContactsM2Cr(query);
  }

  async topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topOutstandingContactsM2Cr(query);
  }

  async topBranchesM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topBranchesM2Cr(query);
  }

  async contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardQueryService.contactDrilldownM2Cr(query);
  }

  async tableM2Cr(query: QueryDashboardTableDto) {
    return this.dashboardQueryService.tableM2Cr(query);
  }

  async insightM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.insightM2Cr(query);
  }

  async insightM2(query: QueryDashboardRangeDto & { feature?: string }, actorId?: string | number) {
    return this.dashboardQueryService.insightM2(query, actorId);
  }

  async askInsightM2(
    dto: { question: string; fromDate?: string; toDate?: string; feature?: string },
    actorId?: string | number,
  ) {
    return this.dashboardQueryService.askInsightM2(dto, actorId);
  }

  async insightHistoryM2(
    query: QueryDashboardRangeDto & { feature?: string; page?: number; pageSize?: number },
    actorId?: string | number,
  ) {
    return this.dashboardQueryService.insightHistoryM2(query, actorId);
  }

  listDomains() {
    return this.dashboardQueryService.listDomains();
  }

  async health() {
    return this.dashboardQueryService.health();
  }

  async managerKpis() {
    return this.dashboardQueryService.managerKpis();
  }

  async metadata(domainInput: string) {
    return this.dashboardQueryService.metadata(domainInput);
  }
}
