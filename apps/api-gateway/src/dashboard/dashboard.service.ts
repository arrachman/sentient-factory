import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
import { DashboardInsightService } from './dashboard-insight.service';

const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'] as const;
type SupportedDomain = (typeof SUPPORTED_DOMAINS)[number];

const DOMAIN_FIELD_ALLOWLIST: Record<
  SupportedDomain,
  {
    groupBy: readonly string[];
    sortBy: readonly string[];
  }
> = {
  m1: {
    groupBy: [
      'sumber',
      'cabang',
      'lokasi',
      'gudang',
      'tipebarang',
      'tipehpp',
      'matauang',
      'divisi',
      'subdivisi',
    ],
    sortBy: ['id', 'tgl', 'inputtgl', 'postingtgl', 'saldojml', 'saldonilai', 'saldohpp'],
  },
  m: {
    groupBy: ['abstatus', 'abshift', 'abkaryawan', 'abtgl'],
    sortBy: ['adid', 'adtgl', 'adinputtgl', 'admodifikasitgl', 'adtotalpotongan', 'adkurs'],
  },
  m2r: {
    groupBy: ['apstatuslunas', 'apkontaknama', 'apsumber', 'apmatauang', 'aptgl'],
    sortBy: ['nmtahun', 'nmbulan', 'nmsaldo', 'nmdebit', 'nmkredit', 'nmanggaran'],
  },
  m2: {
    groupBy: ['tsumber', 'tcabang', 'tmatauang', 'tstatus', 'tstatuslunas'],
    sortBy: [
      'tid',
      'ttgl',
      'tinputtgl',
      'tpostingtgl',
      'tcabang',
      'tsumber',
      'tdebit',
      'tkredit',
      'tstatus',
      'tstatuslunas',
    ],
  },
  so: {
    groupBy: ['sostatus', 'sostatusrealisasi', 'socustomer', 'sobagianpenjualan'],
    sortBy: [
      'soid',
      'sotgl',
      'socustomer',
      'sobagianpenjualan',
      'sostatus',
      'sostatusrealisasi',
      'total_lines',
      'total_qty',
      'grand_total',
      'total_paid',
    ],
  },
};

@Injectable()
export class DashboardService {
  private readonly supportedDomains: readonly SupportedDomain[] = SUPPORTED_DOMAINS;
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
    private readonly dashboardInsightService: DashboardInsightService,
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
    return this.alertingDeliveryService.alertingDeadLetterTriage(query);
  }

  async updateAlertingDeadLetterTriage(
    deliveryId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingDeliveryService.updateAlertingDeadLetterTriage(deliveryId, body, actor);
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
    return this.alertingConfigService.alertingBaileysPairing(body, actor, );
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
    return this.alertingConfigService.updateAlertingTemplateState(templateId, body, actor, );
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
    return this.alertingConfigService.updateAlertingChannelState(channelId, body, actor, );
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
    return this.alertingConfigService.updateAlertingEscalationPolicy(policyId, body, actor, );
  }

  async updateAlertingEscalationPolicyState(
    policyId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingEscalationPolicyState(policyId, body, actor, );
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
    return this.alertingConfigService.updateAlertingTriageSavedView(viewId, body, actor, );
  }

  async updateAlertingTriageSavedViewState(
    viewId: string,
    body: Record<string, unknown>,
    actor: string,
  ) {
    return this.alertingConfigService.updateAlertingTriageSavedViewState(viewId, body, actor, );
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
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'summary.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'summary',
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'summary.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'summary');
    }
  }

  private escapeSqlLiteral(value: string) {
    return value.replaceAll("'", "''");
  }

  async ensureAlertingTestRule(actor: string) {
    return this.alertingDeliveryService.ensureAlertingTestRule(actor);
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
    return this.alertingDeliveryService.createAlertProviderSessionAudit(input);
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
    return this.alertingDeliveryService.upsertAlertProviderSessionState(input);
  }

  async trends(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'trends.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'trends',
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'trends.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'trends');
    }
  }

  async breakdown(domainInput: string, query: QueryDashboardBreakdownDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const groupBy = this.resolveAllowedGroupBy(domain, query.groupBy);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'breakdown.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        groupBy,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'breakdown',
          query: {
            ...normalizedRange,
            groupBy,
          },
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'breakdown.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'breakdown');
    }
  }

  async table(domainInput: string, query: QueryDashboardTableDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const offset = (page - 1) * pageSize;
    const sortBy = this.resolveAllowedSortBy(domain, query.sortBy);
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'table.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        limit: pageSize,
        offset,
        orderBy: sortBy,
        orderDir: sortOrder,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'table',
          query: {
            ...normalizedRange,
            page,
            pageSize,
            offset,
            sortBy,
            sortOrder: sortOrder.toLowerCase(),
          },
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'table.sql'),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'table');
    }
  }

  async breakdownStatus(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'status', 'breakdown_status.sql', query);
  }

  async breakdownRealisasi(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'realisasi', 'breakdown_realisasi.sql', query);
  }

  async breakdownSalesman(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'salesman', 'breakdown_salesman.sql', query);
  }

  async breakdownCustomer(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('so', 'customer', 'breakdown_customer.sql', query);
  }

  async breakdownM2Status(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'status', 'breakdown_status.sql', query);
  }

  async breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'cashflow', 'breakdown_cashflow.sql', query);
  }

  async breakdownM2Branch(query: QueryDashboardRangeDto) {
    return this.executePresetBreakdown('m2', 'branch', 'breakdown_branch.sql', query);
  }

  async topContactsM2Sm(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(j.tkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(j.tkredit, 0)), 0) AS total_payment,
        COALESCE(SUM(ABS(COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0))), 0) AS movement_amount
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
      GROUP BY kontak_key
      ORDER BY total_payment DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_top_contacts', query: normalizedRange, rows },
    };
  }

  async contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = Number(query.kontakId);
    if (!Number.isFinite(kontakId) || kontakId <= 0) {
      throw new BadRequestException('kontakId harus berupa angka positif.');
    }

    const sql = `
      SELECT
        j.tid,
        DATE(j.ttgl) AS trx_date,
        j.tcabang AS cabang,
        j.tsumber AS sumber,
        j.tnotransaksi AS no_transaksi,
        j.tkontak AS kontak_id,
        j.tmatauang AS mata_uang,
        COALESCE(j.tdebit, 0) AS debit,
        COALESCE(j.tkredit, 0) AS kredit,
        (COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0)) AS net_amount,
        j.tstatus,
        j.tstatuslunas,
        j.turaian
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
        AND j.tkontak = ${Math.trunc(kontakId)}
      ORDER BY COALESCE(j.tkredit, 0) DESC, j.ttgl DESC
      LIMIT 20;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_contact_drilldown', query: { ...normalizedRange, kontakId }, rows },
    };
  }

  async summaryM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS outstanding,
        COUNT(DISTINCT COALESCE(NULLIF(TRIM(crcabang), ''), 'UNKNOWN')) AS total_cabang,
        COUNT(DISTINCT COALESCE(NULLIF(TRIM(crsumber), ''), 'UNKNOWN')) AS total_sumber,
        COUNT(DISTINCT crkontak) AS total_kontak
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}';
    `;

    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_summary', query: normalizedRange, rows },
    };
  }

  async trendsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        DATE_FORMAT(crtgl, '%Y-%m') AS period_ym,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY DATE_FORMAT(crtgl, '%Y-%m')
      ORDER BY period_ym ASC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_trends', query: normalizedRange, rows },
    };
  }

  async breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(NULLIF(TRIM(crsumber), ''), 'UNKNOWN') AS source_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY source_key
      ORDER BY total_kas_masuk DESC, total_trx DESC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_breakdown_source', query: normalizedRange, rows },
    };
  }

  async breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        CAST(crstatusbayar AS CHAR) AS status_bayar_key,
        CASE crstatusbayar
          WHEN 0 THEN 'unpaid'
          WHEN 1 THEN 'paid'
          ELSE CONCAT('unknown_', COALESCE(CAST(crstatusbayar AS CHAR), 'null'))
        END AS status_bayar_label,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlahbayar, 0)), 0) AS total_terbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY status_bayar_key, status_bayar_label
      ORDER BY total_trx DESC;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_breakdown_status_bayar', query: normalizedRange, rows },
    };
  }

  async topContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(crkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY kontak_key
      ORDER BY total_kas_masuk DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_contacts', query: normalizedRange, rows },
    };
  }

  async topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(CAST(crkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS total_outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY kontak_key
      HAVING total_outstanding > 0
      ORDER BY total_outstanding DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_outstanding_contacts', query: normalizedRange, rows },
    };
  }

  async topBranchesM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sql = `
      SELECT
        COALESCE(NULLIF(TRIM(crcabang), ''), 'UNKNOWN') AS cabang,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(crjumlah, 0)), 0) AS total_kas_masuk,
        COALESCE(SUM(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)), 0) AS total_outstanding
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      GROUP BY cabang
      ORDER BY total_kas_masuk DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_top_branches', query: normalizedRange, rows },
    };
  }

  async contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = Number(query.kontakId);
    if (!Number.isFinite(kontakId) || kontakId <= 0) {
      throw new BadRequestException('kontakId harus berupa angka positif.');
    }

    const sql = `
      SELECT
        crid,
        DATE(crtgl) AS trx_date,
        crcabang AS cabang,
        crsumber AS sumber,
        crnotransaksi AS no_transaksi,
        crkontak AS kontak_id,
        crnorek AS no_rek,
        crmatauang AS mata_uang,
        COALESCE(crjumlah, 0) AS jumlah,
        COALESCE(crjumlahbayar, 0) AS jumlah_bayar,
        (COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)) AS outstanding,
        crstatus,
        crstatusbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND crkontak = ${Math.trunc(kontakId)}
      ORDER BY outstanding DESC, crtgl DESC
      LIMIT 20;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_cr_contact_drilldown', query: { ...normalizedRange, kontakId }, rows },
    };
  }

  async tableM2Cr(query: QueryDashboardTableDto) {
    const normalizedRange = this.normalizeRange(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const allowedSortColumns = new Set([
      'crtgl',
      'crid',
      'crjumlah',
      'crjumlahbayar',
      'outstanding',
      'crstatus',
      'crstatusbayar',
    ]);
    const sortBy =
      query.sortBy && allowedSortColumns.has(query.sortBy) ? query.sortBy : 'outstanding';
    const orderByExpression =
      sortBy === 'outstanding' ? '(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0))' : sortBy;

    const sql = `
      SELECT
        crid,
        DATE(crtgl) AS trx_date,
        crcabang AS cabang,
        crsumber AS sumber,
        crnotransaksi AS no_transaksi,
        crkontak AS kontak_id,
        crnorek AS no_rek,
        crmatauang AS mata_uang,
        COALESCE(crjumlah, 0) AS jumlah,
        COALESCE(crjumlahbayar, 0) AS jumlah_bayar,
        (COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0)) AS outstanding,
        crstatus,
        crstatusbayar
      FROM m2_cr
      WHERE DATE(crtgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
      ORDER BY ${orderByExpression} ${sortOrder}
      LIMIT ${pageSize} OFFSET ${offset};
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: {
        type: 'm2_cr_table',
        query: {
          ...normalizedRange,
          page,
          pageSize,
          offset,
          sortBy,
          sortOrder: sortOrder.toLowerCase(),
        },
        rows,
      },
    };
  }

  async insightM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const [summaryRows, trendRows, statusRows, topRows] = await Promise.all([
      this.summaryM2Cr(query),
      this.trendsM2Cr(query),
      this.breakdownStatusBayarM2Cr(query),
      this.topContactsM2Cr(query),
    ]);

    const summary = (summaryRows.data.rows[0] ?? {}) as Record<string, unknown>;
    const trends = trendRows.data.rows as Array<Record<string, unknown>>;
    const statuses = statusRows.data.rows as Array<Record<string, unknown>>;
    const tops = topRows.data.rows as Array<Record<string, unknown>>;

    const totalKasMasuk = this.toNumber(summary.total_kas_masuk);
    const totalTerbayar = this.toNumber(summary.total_terbayar);
    const outstanding = this.toNumber(summary.outstanding);
    const totalTrx = this.toNumber(summary.total_trx);
    const outstandingPct = totalKasMasuk > 0 ? (outstanding / totalKasMasuk) * 100 : 0;

    const sortedTrend = [...trends].sort((a, b) =>
      String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')),
    );
    const latest = sortedTrend[sortedTrend.length - 1];
    const prev = sortedTrend[sortedTrend.length - 2];
    const latestKasMasuk = this.toNumber(latest?.total_kas_masuk);
    const prevKasMasuk = this.toNumber(prev?.total_kas_masuk);
    const deltaPct = prevKasMasuk > 0 ? ((latestKasMasuk - prevKasMasuk) / prevKasMasuk) * 100 : 0;

    const topContact = tops[0];
    const topContactKey = String(topContact?.kontak_key ?? 'N/A');
    const topContactValue = this.toNumber(topContact?.total_kas_masuk);

    const paidStatus = statuses.find((row) => String(row.status_bayar_label) === 'paid');
    const unpaidStatus = statuses.find((row) => String(row.status_bayar_label) === 'unpaid');
    const paidPct = totalTrx > 0 ? (this.toNumber(paidStatus?.total_trx) / totalTrx) * 100 : 0;

    const insights = [
      {
        text: `Periode ${normalizedRange.fromDate} s/d ${normalizedRange.toDate} mencatat ${this.formatNumber(totalTrx)} transaksi kas masuk.`,
        confidence: 0.99,
      },
      {
        text: `Total kas masuk ${this.formatMoneyCompact(totalKasMasuk)} dengan total terbayar ${this.formatMoneyCompact(totalTerbayar)}.`,
        confidence: 0.95,
      },
      {
        text: `Outstanding saat ini ${this.formatMoneyCompact(outstanding)} (${this.formatPercent(outstandingPct)} dari total kas masuk).`,
        confidence: 0.9,
      },
      {
        text: `Periode terbaru menunjukkan ${deltaPct >= 0 ? 'kenaikan' : 'penurunan'} kas masuk ${this.formatPercent(Math.abs(deltaPct))} dibanding periode sebelumnya.`,
        confidence: prev ? 0.86 : 0.68,
      },
      {
        text: `Kontak dengan kontribusi terbesar: ${topContactKey} (${this.formatMoneyCompact(topContactValue)}).`,
        confidence: topContact ? 0.82 : 0.55,
      },
    ];

    const anomalies: string[] = [];
    if (outstandingPct > 30) {
      anomalies.push(`Outstanding melebihi ambang 30% (${this.formatPercent(outstandingPct)}).`);
    }
    if (prev && Math.abs(deltaPct) > 40) {
      anomalies.push(
        `Perubahan kas masuk periode terbaru cukup ekstrem (${this.formatPercent(Math.abs(deltaPct))}).`,
      );
    }
    if (!unpaidStatus && totalTrx > 0 && paidPct < 100) {
      anomalies.push('Status bayar tidak konsisten terhadap total transaksi.');
    }

    const recommendations = [
      'Prioritaskan follow-up kontak dengan nominal outstanding terbesar.',
      'Validasi transaksi bernilai tinggi pada periode dengan perubahan ekstrem.',
      'Pantau rasio paid vs unpaid mingguan untuk menjaga kualitas cash conversion.',
    ];

    return {
      success: true,
      data: {
        type: 'm2_cr_insight',
        query: normalizedRange,
        model: { provider: 'rule-based', version: 'm2-cr-insight-v1' },
        insights,
        anomalies,
        recommendations,
      },
    };
  }

  async insightM2(query: QueryDashboardRangeDto & { feature?: string }, actorId?: string | number) {
    return this.dashboardInsightService.insightM2(query, actorId);
  }

  async askInsightM2(
    dto: { question: string; fromDate?: string; toDate?: string; feature?: string },
    actorId?: string | number,
  ) {
    return this.dashboardInsightService.askInsightM2(dto, actorId);
  }

  async insightHistoryM2(
    query: QueryDashboardRangeDto & { feature?: string; page?: number; pageSize?: number },
    actorId?: string | number,
  ) {
    return this.dashboardInsightService.insightHistoryM2(query, actorId);
  }

  listDomains() {
    return {
      success: true,
      data: this.supportedDomains.map((domain) => ({
        domain,
        allowedGroupBy: DOMAIN_FIELD_ALLOWLIST[domain].groupBy,
        allowedSortBy: DOMAIN_FIELD_ALLOWLIST[domain].sortBy,
        specPath: `dashboard-mapping/output/specs`,
        sqlTemplateDir: this.dashboardMysqlService.getTemplatePath(domain, ''),
      })),
    };
  }

  async health() {
    const health = await this.dashboardMysqlService.healthCheck(this.supportedDomains);
    return {
      success: true,
      data: health,
    };
  }

  async managerKpis() {
    const [
      decisionLatencyRow,
      acceptedRow,
      criticalRiskOpen,
      criticalRiskOpenYesterday,
      freshnessSummary,
      freshnessDomainRows,
    ] = await Promise.all([
      this.prisma.$queryRaw<Array<{ avg_minutes: number | null }>>`
        SELECT ROUND(AVG(EXTRACT(EPOCH FROM ("decision_at" - "insight_created_at")) / 60.0)::numeric, 1) AS avg_minutes
        FROM "m0_manager_insight"
        WHERE "decision_at" IS NOT NULL
          AND "insight_created_at" >= date_trunc('day', now())
          AND "insight_created_at" < date_trunc('day', now()) + interval '1 day'
      `,
      this.prisma.$queryRaw<
        Array<{
          accepted_count: bigint;
          total_count: bigint;
          accepted_pct: number | null;
          previous_pct: number | null;
        }>
      >`
        WITH current_window AS (
          SELECT
            SUM(CASE WHEN "status" = 'accepted' THEN 1 ELSE 0 END) AS accepted_count,
            COUNT(*) AS total_count
          FROM "m0_manager_insight"
          WHERE "insight_created_at" >= now() - interval '7 day'
        ),
        previous_window AS (
          SELECT
            ROUND(
              100.0 * SUM(CASE WHEN "status" = 'accepted' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
              1
            ) AS accepted_pct
          FROM "m0_manager_insight"
          WHERE "insight_created_at" >= now() - interval '14 day'
            AND "insight_created_at" < now() - interval '7 day'
        )
        SELECT
          current_window.accepted_count,
          current_window.total_count,
          ROUND(100.0 * current_window.accepted_count / NULLIF(current_window.total_count, 0), 1) AS accepted_pct,
          previous_window.accepted_pct AS previous_pct
        FROM current_window
        CROSS JOIN previous_window
      `,
      this.prisma.managerRisk.count({
        where: {
          severity: 'critical',
          status: { in: ['open', 'in_progress'] },
        },
      }),
      this.prisma.managerRisk.count({
        where: {
          severity: 'critical',
          status: { in: ['open', 'in_progress'] },
          openedAt: { lt: new Date(new Date().toISOString().slice(0, 10)) },
          OR: [
            { resolvedAt: null },
            { resolvedAt: { gte: new Date(new Date().toISOString().slice(0, 10)) } },
          ],
        },
      }),
      this.prisma.$queryRaw<
        Array<{ compliant_count: bigint; total_count: bigint; compliance_pct: number | null }>
      >`
        SELECT
          SUM(
            CASE
              WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
              ELSE 0
            END
          ) AS compliant_count,
          COUNT(*) AS total_count,
          ROUND(
            100.0 * SUM(
              CASE
                WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
                ELSE 0
              END
            ) / NULLIF(COUNT(*), 0),
            1
          ) AS compliance_pct
        FROM "m0_manager_data_freshness"
      `,
      this.prisma.$queryRaw<
        Array<{
          domain: string;
          dataset_count: bigint;
          compliant_count: bigint;
          compliance_pct: number | null;
        }>
      >`
        SELECT
          "domain",
          COUNT(*) AS dataset_count,
          SUM(
            CASE
              WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
              ELSE 0
            END
          ) AS compliant_count,
          ROUND(
            100.0 * SUM(
              CASE
                WHEN EXTRACT(EPOCH FROM (now() - "last_refresh_at")) / 60.0 <= "sla_minutes" THEN 1
                ELSE 0
              END
            ) / NULLIF(COUNT(*), 0),
            1
          ) AS compliance_pct
        FROM "m0_manager_data_freshness"
        GROUP BY "domain"
        ORDER BY "domain" ASC
      `,
    ]);

    const avgMinutes = this.toNumber(decisionLatencyRow[0]?.avg_minutes);
    const accepted = acceptedRow[0];
    const acceptedPct = this.toNumber(accepted?.accepted_pct);
    const previousAcceptedPct = this.toNumber(accepted?.previous_pct);
    const freshness = freshnessSummary[0];
    const freshnessPct = this.toNumber(freshness?.compliance_pct);
    const previousRiskOpen = criticalRiskOpenYesterday;

    return {
      success: true,
      data: {
        cards: [
          {
            title: 'Decision Latency',
            subtitle: 'Hari ini',
            value: avgMinutes,
            unit: 'minutes',
            formattedValue: `${this.formatNumber(avgMinutes)} menit`,
            formula: 'AVG(decision_at - insight_created_at)',
          },
          {
            title: 'AI Insight Accepted',
            subtitle: '7 hari',
            value: acceptedPct,
            unit: 'percent',
            formattedValue: this.formatPercent(acceptedPct),
            numerator: this.toNumber(accepted?.accepted_count),
            denominator: this.toNumber(accepted?.total_count),
            delta: Number((acceptedPct - previousAcceptedPct).toFixed(1)),
            deltaLabel: 'vs 7 hari sebelumnya',
            formula: 'accepted_insights / total_insights * 100',
          },
          {
            title: 'Critical Risk Open',
            subtitle: 'Live',
            value: criticalRiskOpen,
            unit: 'count',
            formattedValue: this.formatNumber(criticalRiskOpen),
            delta: criticalRiskOpen - previousRiskOpen,
            deltaLabel: 'vs awal hari',
            formula: 'COUNT(risk WHERE severity=critical AND status IN open,in_progress)',
          },
          {
            title: 'Data Freshness SLA',
            subtitle: 'Lintas domain',
            value: freshnessPct,
            unit: 'percent',
            formattedValue: this.formatPercent(freshnessPct),
            numerator: this.toNumber(freshness?.compliant_count),
            denominator: this.toNumber(freshness?.total_count),
            formula: 'datasets_within_sla / total_datasets * 100',
          },
        ],
        breakdown: {
          dataFreshnessByDomain: freshnessDomainRows.map((row) => ({
            domain: row.domain,
            datasetCount: this.toNumber(row.dataset_count),
            compliantCount: this.toNumber(row.compliant_count),
            compliancePct: this.toNumber(row.compliance_pct),
          })),
        },
      },
    };
  }

  async metadata(domainInput: string) {
    const domain = this.assertDomain(domainInput);
    const metadata = await this.dashboardMysqlService.getDomainMetadata(domain);

    const tableColumns = new Map<string, Set<string>>();
    for (const tableInfo of metadata.columnsByTable) {
      tableColumns.set(tableInfo.tableName, new Set(tableInfo.columns));
    }

    const breakdownTable = metadata.sourceTables.breakdown;
    const tableTable = metadata.sourceTables.table;
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain];

    const allowedGroupByExisting = this.filterExistingColumns(
      allowed.groupBy,
      breakdownTable ? tableColumns.get(breakdownTable) : undefined,
    );
    const allowedSortByExisting = this.filterExistingColumns(
      allowed.sortBy,
      tableTable ? tableColumns.get(tableTable) : undefined,
    );

    return {
      success: true,
      data: {
        domain,
        templates: metadata.templates,
        sourceTables: metadata.sourceTables,
        columnsByTable: metadata.columnsByTable,
        allowlist: {
          groupBy: [...allowed.groupBy],
          sortBy: [...allowed.sortBy],
        },
        effective: {
          groupBy: allowedGroupByExisting,
          sortBy: allowedSortByExisting,
        },
      },
    };
  }

  private assertDomain(domain: string): SupportedDomain {
    if ((this.supportedDomains as readonly string[]).includes(domain)) {
      return domain as SupportedDomain;
    }

    throw new BadRequestException(
      `Unsupported domain '${domain}'. Allowed domains: ${this.supportedDomains.join(', ')}`,
    );
  }

  private normalizeRange(query: QueryDashboardRangeDto): { fromDate: string; toDate: string } {
    const now = new Date();
    const toDate = query.toDate ?? now.toISOString().slice(0, 10);

    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    const fromDate = query.fromDate ?? defaultFrom.toISOString().slice(0, 10);

    if (fromDate > toDate) {
      throw new BadRequestException('fromDate must be less than or equal to toDate');
    }

    return { fromDate, toDate };
  }

  private resolveAllowedGroupBy(domain: SupportedDomain, input?: string): string {
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain].groupBy;
    if (!input) {
      return allowed[0];
    }
    if (!allowed.includes(input)) {
      throw new BadRequestException(
        `groupBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
      );
    }
    return input;
  }

  private resolveAllowedSortBy(domain: SupportedDomain, input?: string): string {
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain].sortBy;
    if (!input) {
      return allowed[0];
    }
    if (!allowed.includes(input)) {
      throw new BadRequestException(
        `sortBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
      );
    }
    return input;
  }

  private resolveM2SourceCode(domain: SupportedDomain, feature?: string): string | null {
    if (domain !== 'm2' || !feature) {
      return null;
    }

    const featureToSource: Record<string, string> = {
      m2_aj: 'AJ',
      m2_bd: 'BD',
      m2_cb: 'CB',
      m2_cr: 'CR',
      m2_cd: 'CD',
      m2_gj: 'GJ',
      m2_jm: 'JM',
      m2_rg: 'RG',
      m2_rgc: 'RGC',
      m2_rm: 'RM',
      m2_sg: 'SG',
      m2_sgc: 'SGC',
      m2_sm: 'SM',
      m2_template: 'TJ',
    };

    const normalized = feature.trim().toLowerCase();
    return featureToSource[normalized] ?? null;
  }

  private wrapExecutionError(error: unknown, domain: string, endpoint: string): Error {
    if (error instanceof BadRequestException) {
      return error;
    }

    if (error instanceof InternalServerErrorException) {
      return error;
    }

    const reason = error instanceof Error ? error.message : 'unknown error';
    return new InternalServerErrorException(
      `Dashboard query failed (${domain}/${endpoint}): ${reason}`,
    );
  }

  private async executePresetBreakdown(
    domain: SupportedDomain,
    type: 'status' | 'realisasi' | 'salesman' | 'customer' | 'cashflow' | 'branch',
    fileName: string,
    query: QueryDashboardRangeDto,
  ) {
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode(domain, query.feature);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, fileName, {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: `breakdown_${type}`,
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, fileName),
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, `breakdown_${type}`);
    }
  }

  private filterExistingColumns(candidates: readonly string[], columns?: Set<string>): string[] {
    if (!columns || columns.size === 0) {
      return [...candidates];
    }
    return candidates.filter((candidate) => columns.has(candidate));
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private formatNumber(value: number): string {
    return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  }

  private formatMoneyCompact(value: number): string {
    return `Rp ${value.toLocaleString('id-ID', {
      notation: 'compact',
      maximumFractionDigits: 2,
    })}`;
  }

  private formatPercent(value: number): string {
    return `${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
  }

  private toAuditUserId(actorId?: string | number): number | null {
    if (typeof actorId === 'number' && Number.isInteger(actorId) && actorId > 0) {
      return actorId;
    }
    const parsed = Number(String(actorId ?? '').trim());
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
    return null;
  }
}
