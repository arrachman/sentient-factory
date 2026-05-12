import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
    private readonly alertingRuleService: AlertingRuleService,
    @Inject(forwardRef(() => AlertingConfigService))
    private readonly alertingConfigService: AlertingConfigService,
    private readonly alertingObservabilityService: AlertingObservabilityService,
    @Inject(forwardRef(() => AlertingSchedulerService))
    private readonly alertingSchedulerService: AlertingSchedulerService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
  ) {}

  async customDbPinTargets() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        COALESCE(d.dashboard_id::text, '') AS dashboard_id,
        COALESCE(d.dashboard_key, m.key) AS dashboard_key,
        COALESCE(d.title, m.title) AS dashboard_title,
        m.id::text AS menu_id,
        m.key AS menu_key,
        m.title AS menu_title,
        COALESCE(m.path, '') AS route_path
      FROM public.m0_menu m
      LEFT JOIN public.m0_menu parent
        ON parent.id = m.parent_id
      LEFT JOIN public.dashboard d
        ON d.menu_id = m.id
       AND d.is_active = true
      WHERE m.is_active = true
        AND COALESCE(m.is_visible, true) = true
        AND COALESCE(m.path, '') <> ''
        AND (
          parent.key = 'dashboard'
          OR m.key = 'dashboard'
          OR m.path LIKE '/app/dashboard/%'
        )
      ORDER BY m.sort_order NULLS LAST, m.id
    `);

    return { success: true, data: rows };
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
    const identifier = this.escapeSqlLiteral(dashboardKey);
    const dashboardRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      this.buildCustomDashboardLookupSql(identifier),
    );

    if (!dashboardRows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }

    const dashboard = dashboardRows[0];
    const resolvedDashboardKey = String(dashboard.dashboard_key || dashboardKey);

    const widgets = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        w.widget_id::text,
        w.widget_key,
        w.title,
        w.short_label,
        COALESCE(w.description, '') AS description,
        w.widget_kind,
        COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table,
        w.result_kind,
        w.ui_config,
        w.filter_binding,
        COALESCE(w.empty_state, '') AS empty_state,
        COALESCE(w.span_class_name, '') AS span_class_name,
        w.widget_order
      FROM public.dashboard_widget w
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND w.is_active = true
      ORDER BY w.widget_order, w.widget_key
    `);

    const widgetQueries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        q.widget_id::text,
        q.query_key,
        q.label,
        COALESCE(q.purpose, '') AS purpose,
        q.sql_template,
        COALESCE(q.count_sql, '') AS count_sql,
        q.query_params,
        q.output_columns,
        q.default_limit
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.is_active = true
      ORDER BY q.query_key
    `);

    const filters = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        f.filter_key,
        f.label,
        f.filter_type,
        f.data_type,
        f.source_type,
        COALESCE(f.source_table, '') AS source_table,
        COALESCE(f.source_query, '') AS source_query,
        f.static_options,
        COALESCE(f.placeholder, '') AS placeholder,
        f.query_param_name,
        f.default_value,
        COALESCE(f.depends_on_filter_key, '') AS depends_on_filter_key,
        f.allows_multiple,
        f.is_required,
        f.sort_order
      FROM public.dashboard_filter f
      JOIN public.dashboard d ON d.dashboard_id = f.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND f.is_active = true
      ORDER BY f.sort_order, f.filter_key
    `);

    const widgetsWithQueries = widgets.map((widget) => ({
      ...widget,
      ui_config: this.asJson(widget.ui_config, {}),
      filter_binding: this.asJson(widget.filter_binding, []),
      widget_order: Number(widget.widget_order || 0),
      queries: widgetQueries
        .filter((query) => query.widget_id === widget.widget_id)
        .map((query) => ({
          ...query,
          query_params: this.asJson(query.query_params, []),
          output_columns: this.asJson(query.output_columns, []),
          default_limit:
            typeof query.default_limit === 'number'
              ? query.default_limit
              : query.default_limit
                ? Number(query.default_limit)
                : null,
        })),
    }));

    const filtersWithOptions: Array<Record<string, unknown>> = [];
    for (const filter of filters) {
      let options: unknown[] = this.asJson(filter.static_options, []);
      if (
        filter.source_type === 'query' &&
        typeof filter.source_query === 'string' &&
        filter.source_query.trim()
      ) {
        const optionRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          filter.source_query,
        );
        options = optionRows
          .map((row) => row[Object.keys(row)[0] as keyof typeof row])
          .filter(Boolean);
      }
      filtersWithOptions.push({
        ...filter,
        static_options: this.asJson(filter.static_options, []),
        default_value: this.asJson(filter.default_value, null),
        allows_multiple: Boolean(filter.allows_multiple),
        is_required: Boolean(filter.is_required),
        sort_order: Number(filter.sort_order || 0),
        options,
      });
    }

    return {
      success: true,
      data: {
        ...dashboard,
        layout_config: this.asJson(dashboard.layout_config, {}),
        default_filter_values: this.asJson(dashboard.default_filter_values, {}),
        widgets: widgetsWithQueries,
        filters: filtersWithOptions,
      },
    };
  }

  async updateCustomDbCatalog(
    dashboardKey: string,
    body: { title?: string; description?: string | null },
  ) {
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';

    if (!title && body?.description === undefined) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const dashboardId = await this.findCustomDashboardIdOrThrow(dashboardKey);
    const updates: string[] = [];

    if (title) {
      updates.push(`title = '${this.escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${this.escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(
        description
          ? `description = '${this.escapeSqlLiteral(description)}'`
          : 'description = NULL',
      );
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.dashboard
      SET ${updates.join(', ')}
      WHERE dashboard_id = ${dashboardId}
    `);

    return { success: true };
  }

  async executeCustomDbQuery(
    dashboardKey: string,
    queryKey: string,
    params: Record<string, unknown>,
  ) {
    const resolvedDashboardKey = await this.findResolvedDashboardKeyOrThrow(dashboardKey);
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT q.sql_template, q.label, q.output_columns
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${this.escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.query_key = '${this.escapeSqlLiteral(queryKey)}'
        AND d.is_active = true
        AND w.is_active = true
        AND q.is_active = true
      LIMIT 1
    `);

    if (!rows.length) {
      throw new NotFoundException('Query metadata not found.');
    }

    const row = rows[0];
    const renderedSql = this.renderSqlTemplate(String(row.sql_template || ''), params);
    const normalizedSql = renderedSql.trim();
    if (!/^(select|with)\b/i.test(normalizedSql)) {
      throw new BadRequestException('Only SELECT query is allowed.');
    }

    const resultRows =
      await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(normalizedSql);
    const declaredColumns = this.asJson(row.output_columns, []);
    const columns = resultRows.length ? Object.keys(resultRows[0]) : declaredColumns;

    return {
      success: true,
      data: {
        label: row.label,
        sql: normalizedSql,
        columns,
        rows: resultRows,
      },
    };
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
    const dashboardKey = (body?.dashboardKey || '').trim();
    const title = (body?.title || '').trim();
    const description = (body?.description || '').trim();
    const widgetKind = (body?.widgetKind || 'table').trim();
    const chartType = (body?.chartType || '').trim();
    const spanClassName = (body?.spanClassName || 'lg:col-span-6').trim() || 'lg:col-span-6';
    const sqlTemplate = (body?.sqlTemplate || '').trim();
    const outputColumns = Array.isArray(body?.outputColumns)
      ? body.outputColumns.filter(
          (value): value is string => typeof value === 'string' && value.trim().length > 0,
        )
      : [];
    const queryLabel = (body?.queryLabel || title || 'Pinned Widget Query').trim();

    if (!dashboardKey || !title || !sqlTemplate) {
      throw new BadRequestException('dashboardKey, title, dan sqlTemplate wajib diisi.');
    }
    if (!/^(select|with)\b/i.test(sqlTemplate)) {
      throw new BadRequestException('Hanya query SELECT/WITH yang dapat di-pin.');
    }

    const nowSuffix = Date.now().toString().slice(-8);
    const baseKey = this.slugify(title) || 'pinned-widget';
    const widgetKey = `${baseKey}-${nowSuffix}`;
    const queryKey = `${widgetKey}-main`;
    const normalizedWidgetKind = ['chart', 'table', 'list', 'summary', 'metric'].includes(
      widgetKind,
    )
      ? widgetKind
      : 'table';
    const normalizedChartType =
      normalizedWidgetKind === 'chart' &&
      ['bar', 'vertical_bar', 'line', 'pie', 'donut', 'area', 'horizontal_bar', 'scatter'].includes(
        chartType,
      )
        ? chartType
        : normalizedWidgetKind === 'chart'
          ? 'bar'
          : '';

    const dashboardId = await this.findOrCreateCustomDashboardId(dashboardKey);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const widgetOrder = Number(orderRows[0]?.next_widget_order || 1);
    const uiConfigJson = JSON.stringify({
      component: normalizedWidgetKind === 'chart' ? 'PinnedChartCard' : 'PinnedTableCard',
    });

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      VALUES (
        ${dashboardId},
        '${this.escapeSqlLiteral(widgetKey)}',
        '${this.escapeSqlLiteral(title)}',
        '${this.escapeSqlLiteral(title.slice(0, 48))}',
        ${description ? `'${this.escapeSqlLiteral(description)}'` : 'NULL'},
        '${this.escapeSqlLiteral(normalizedWidgetKind)}',
        ${normalizedChartType ? `'${this.escapeSqlLiteral(normalizedChartType)}'` : 'NULL'},
        NULL,
        '${this.escapeSqlLiteral(normalizedWidgetKind === 'chart' ? 'categorical' : 'table')}',
        '${this.escapeSqlLiteral(uiConfigJson)}'::jsonb,
        '[]'::jsonb,
        'No pinned widget data yet.',
        '${this.escapeSqlLiteral(spanClassName)}',
        ${widgetOrder},
        true
      )
      RETURNING widget_id::text
    `);
    const widgetId = insertedRows[0]?.widget_id;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard_widget_query (
        widget_id,
        query_key,
        label,
        purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit,
        is_active
      )
      VALUES (
        ${widgetId},
        '${this.escapeSqlLiteral(queryKey)}',
        '${this.escapeSqlLiteral(queryLabel)}',
        'Pinned from Senti AI',
        '${this.escapeSqlLiteral(sqlTemplate)}',
        NULL,
        '[]'::jsonb,
        '${this.escapeSqlLiteral(JSON.stringify(outputColumns))}'::jsonb,
        50,
        true
      )
    `);

    return {
      success: true,
      data: {
        dashboard_key: dashboardKey,
        widget_key: widgetKey,
        query_key: queryKey,
      },
    };
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
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';
    const spanClassName =
      typeof body?.spanClassName === 'string' && body.spanClassName.trim()
        ? body.spanClassName.trim()
        : null;
    const widgetOrder =
      typeof body?.widgetOrder === 'number' && Number.isFinite(body.widgetOrder)
        ? Math.max(1, Math.floor(body.widgetOrder))
        : null;
    const chartType =
      typeof body?.chartType === 'string' && body.chartType.trim()
        ? body.chartType.trim().toLowerCase()
        : body?.chartType === null
          ? ''
          : null;
    const defaultLimit =
      typeof body?.defaultLimit === 'number' && Number.isFinite(body.defaultLimit)
        ? Math.max(1, Math.floor(body.defaultLimit))
        : body?.defaultLimit === null
          ? null
          : undefined;

    if (
      !title &&
      !spanClassName &&
      widgetOrder === null &&
      body?.description === undefined &&
      chartType === null &&
      defaultLimit === undefined
    ) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!existingRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    const updates: string[] = [];
    if (title) {
      updates.push(`title = '${this.escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${this.escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(
        description
          ? `description = '${this.escapeSqlLiteral(description)}'`
          : 'description = NULL',
      );
    }
    if (spanClassName) {
      updates.push(`span_class_name = '${this.escapeSqlLiteral(spanClassName)}'`);
    }
    if (widgetOrder !== null) {
      updates.push(`widget_order = ${widgetOrder}`);
    }
    if (chartType !== null) {
      const normalizedChartType = [
        'bar',
        'vertical_bar',
        'line',
        'pie',
        'donut',
        'area',
        'horizontal_bar',
        'scatter',
      ].includes(chartType)
        ? chartType
        : '';
      updates.push(
        normalizedChartType ? `chart_type = '${normalizedChartType}'` : 'chart_type = NULL',
      );
      updates.push(
        normalizedChartType
          ? "widget_kind = CASE WHEN widget_kind IN ('table', 'list', 'summary', 'metric') THEN widget_kind ELSE 'chart' END"
          : 'widget_kind = widget_kind',
      );
    }

    if (updates.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget
        SET ${updates.join(', ')}
        WHERE widget_id::text = '${widgetIdSql}'
      `);
    }

    if (defaultLimit !== undefined) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget_query
        SET default_limit = ${defaultLimit === null ? 'NULL' : defaultLimit}
        WHERE widget_id IN (
          SELECT widget_id
          FROM public.dashboard_widget
          WHERE widget_id::text = '${widgetIdSql}'
        )
      `);
    }

    return { success: true };
  }

  async deleteCustomDbWidget(widgetId: string) {
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const rows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!rows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
    `);

    return { success: true };
  }

  async duplicateCustomDbWidget(widgetId: string) {
    const widgetIdSql = this.escapeSqlLiteral(widgetId);
    const sourceRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        w.widget_id::text,
        w.dashboard_id::text,
        w.widget_key,
        w.title,
        w.short_label,
        COALESCE(w.description, '') AS description,
        w.widget_kind,
        COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table,
        w.result_kind,
        w.ui_config,
        w.filter_binding,
        COALESCE(w.empty_state, '') AS empty_state
      FROM public.dashboard_widget w
      WHERE w.widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);

    if (!sourceRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    const source = sourceRows[0];
    const dashboardId = String(source.dashboard_id);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const nextOrder = Number(orderRows[0]?.next_widget_order || 1);
    const nowSuffix = Date.now().toString().slice(-8);
    const duplicatedTitle = `${String(source.title || 'Widget')} Copy`;
    const duplicatedWidgetKey = `${this.slugify(duplicatedTitle) || 'widget-copy'}-${nowSuffix}`;

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      SELECT
        dashboard_id,
        '${this.escapeSqlLiteral(duplicatedWidgetKey)}',
        '${this.escapeSqlLiteral(duplicatedTitle)}',
        '${this.escapeSqlLiteral(duplicatedTitle.slice(0, 48))}',
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        ${nextOrder},
        true
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      RETURNING widget_id::text
    `);

    const duplicatedWidgetId = insertedRows[0]?.widget_id;
    const queryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        query_key,
        label,
        COALESCE(purpose, '') AS purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit
      FROM public.dashboard_widget_query
      WHERE widget_id::text = '${widgetIdSql}'
        AND is_active = true
      ORDER BY query_key
    `);

    for (let index = 0; index < queryRows.length; index += 1) {
      const query = queryRows[index];
      const duplicateQueryKey =
        index === 0 ? `${duplicatedWidgetKey}-main` : `${duplicatedWidgetKey}-${index + 1}`;
      const duplicateQueryLabel = `${duplicatedTitle} Query${index > 0 ? ` ${index + 1}` : ''}`;
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.dashboard_widget_query (
          widget_id,
          query_key,
          label,
          purpose,
          sql_template,
          count_sql,
          query_params,
          output_columns,
          default_limit,
          is_active
        )
        VALUES (
          ${duplicatedWidgetId},
          '${this.escapeSqlLiteral(duplicateQueryKey)}',
          '${this.escapeSqlLiteral(duplicateQueryLabel)}',
          ${query.purpose ? `'${this.escapeSqlLiteral(String(query.purpose))}'` : 'NULL'},
          '${this.escapeSqlLiteral(String(query.sql_template || ''))}',
          ${query.count_sql ? `'${this.escapeSqlLiteral(String(query.count_sql))}'` : 'NULL'},
          '${this.escapeSqlLiteral(JSON.stringify(this.asJson(query.query_params, [])))}'::jsonb,
          '${this.escapeSqlLiteral(JSON.stringify(this.asJson(query.output_columns, [])))}'::jsonb,
          ${query.default_limit ?? 'NULL'},
          true
        )
      `);
    }

    return {
      success: true,
      data: {
        widget_id: duplicatedWidgetId,
        widget_key: duplicatedWidgetKey,
      },
    };
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

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  async ensureAlertingTestRule(actor: string) {
    return this.alertingDeliveryService.ensureAlertingTestRule(actor);
  }

  private resolveRouteSegment(value: string) {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) {
      return '';
    }
    const parts = trimmed.split('/');
    return parts[parts.length - 1] || '';
  }

  private buildCustomDashboardLookupSql(identifier: string) {
    return `
      SELECT
        d.dashboard_id::text,
        d.menu_id::text,
        COALESCE(m.key, '') AS menu_key,
        COALESCE(m.path, '') AS route_path,
        d.dashboard_key,
        d.title,
        d.short_label,
        COALESCE(d.description, '') AS description,
        COALESCE(d.icon_name, '') AS icon_name,
        d.status,
        d.layout_config,
        d.default_filter_values
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${identifier}'
        )
      ORDER BY CASE WHEN d.dashboard_key = '${identifier}' THEN 0 ELSE 1 END
      LIMIT 1
    `;
  }

  private async findCustomDashboardIdOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(
      this.buildCustomDashboardLookupSql(this.escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_id;
  }

  private async findResolvedDashboardKeyOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_key: string }>>(
      this.buildCustomDashboardLookupSql(this.escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_key;
  }

  private async findOrCreateCustomDashboardId(dashboardKey: string) {
    const identifier = this.escapeSqlLiteral(dashboardKey);
    const routeSegment = this.escapeSqlLiteral(this.resolveRouteSegment(dashboardKey));

    let rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (rows.length) {
      return rows[0].dashboard_id;
    }

    const menuRows = await this.prisma.$queryRawUnsafe<Array<{ id: string; title: string }>>(`
      SELECT id::text, title
      FROM public.m0_menu
      WHERE is_active = true
        AND (
          key = '${identifier}'
          OR COALESCE(path, '') = '${identifier}'
          OR COALESCE(split_part(path, '/', array_length(string_to_array(path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!menuRows.length) {
      throw new NotFoundException(`Dashboard/menu ${dashboardKey} tidak ditemukan.`);
    }

    const menuId = menuRows[0].id;
    const menuTitle = menuRows[0].title || dashboardKey;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard (
        menu_id,
        dashboard_key,
        title,
        short_label,
        description,
        icon_name,
        status,
        layout_config,
        default_filter_values,
        is_active
      )
      VALUES (
        ${menuId},
        '${identifier}',
        '${this.escapeSqlLiteral(menuTitle)}',
        '${this.escapeSqlLiteral(String(menuTitle).slice(0, 48))}',
        'Dashboard page generated from menu target.',
        'LayoutDashboard',
        'active',
        '{}'::jsonb,
        '{}'::jsonb,
        true
      )
      ON CONFLICT (dashboard_key) DO UPDATE
      SET menu_id = EXCLUDED.menu_id,
          title = EXCLUDED.title,
          short_label = EXCLUDED.short_label,
          is_active = true
    `);

    rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!rows.length) {
      throw new InternalServerErrorException(`Dashboard ${dashboardKey} gagal dibuat.`);
    }

    return rows[0].dashboard_id;
  }

  private renderSqlTemplate(template: string, params: Record<string, unknown>) {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
      const raw = params[key];
      if (raw === 'Semua Warehouse') {
        return "''";
      }
      return this.toSqlLiteral(raw);
    });
  }

  private toSqlLiteral(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return 'NULL';
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : 'NULL';
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    return `'${this.escapeSqlLiteral(String(value))}'`;
  }

  private asJson<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    if (typeof value === 'object') {
      return value as T;
    }
    try {
      return JSON.parse(String(value)) as T;
    } catch {
      return fallback;
    }
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
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(query);
    const feature = query.feature ?? 'm2_aj';

    try {
      const payload = await this.buildM2InsightPayload(normalizedRange, feature);
      await this.saveInsightHistory({
        actorId,
        domain,
        feature,
        action: 'AUTO_SUMMARY',
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        question: null,
        response: payload,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'insight',
          query: normalizedRange,
          model: {
            provider: 'rule-based',
            version: 'm2-insight-v2',
          },
          ...payload,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight');
    }
  }

  async askInsightM2(
    dto: { question: string; fromDate?: string; toDate?: string; feature?: string },
    actorId?: string | number,
  ) {
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(dto);
    const feature = dto.feature ?? 'm2_aj';
    const question = dto.question.trim();
    if (!question) {
      throw new BadRequestException('Question is required');
    }

    try {
      const payload = await this.buildM2InsightPayload(normalizedRange, feature);
      const q = question.toLowerCase();
      let answer = payload.insights[0]?.text ?? 'Insight tidak tersedia.';
      let confidence = 0.64;

      if (q.includes('net') || q.includes('cashflow')) {
        answer = payload.insights[2]?.text ?? payload.insights[3]?.text ?? answer;
        confidence = 0.88;
      } else if (q.includes('debit') || q.includes('kredit')) {
        answer = payload.insights[1]?.text ?? answer;
        confidence = 0.86;
      } else if (q.includes('cabang') || q.includes('branch')) {
        answer = payload.insights[4]?.text ?? answer;
        confidence = 0.8;
      } else if (q.includes('anomali') || q.includes('outlier')) {
        answer =
          payload.anomalies[0] ??
          'Belum terdeteksi anomali signifikan pada periode ini berdasarkan rule current.';
        confidence = payload.anomalies.length > 0 ? 0.78 : 0.62;
      }

      const askPayload = {
        question,
        answer,
        confidence,
        recommendations: payload.recommendations,
        anomalies: payload.anomalies,
      };

      await this.saveInsightHistory({
        actorId,
        domain,
        feature,
        action: 'ASK',
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        question,
        response: askPayload,
      });

      return {
        success: true,
        data: {
          domain,
          type: 'ask',
          query: normalizedRange,
          model: {
            provider: 'rule-based',
            version: 'm2-insight-v2',
          },
          ...askPayload,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight_ask');
    }
  }

  async insightHistoryM2(
    query: QueryDashboardRangeDto & { feature?: string; page?: number; pageSize?: number },
    actorId?: string | number,
  ) {
    const domain: SupportedDomain = 'm2';
    const normalizedRange = this.normalizeRange(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const feature = query.feature ?? 'm2_aj';
    const userId = this.toAuditUserId(actorId);

    try {
      await this.ensureInsightHistoryTable();
      const rows = (await this.prisma.$queryRaw`
        SELECT
          id,
          domain,
          feature,
          action,
          user_id AS "userId",
          from_date AS "fromDate",
          to_date AS "toDate",
          question,
          response_json AS "response",
          confidence_avg AS "confidenceAvg",
          created_at AS "createdAt"
        FROM m0_dashboard_insight_history
        WHERE domain = ${domain}
          AND feature = ${feature}
          AND from_date >= ${normalizedRange.fromDate}::date
          AND to_date <= ${normalizedRange.toDate}::date
          AND (${userId}::int IS NULL OR user_id = ${userId}::int)
        ORDER BY created_at DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
      `) as Array<Record<string, unknown>>;

      return {
        success: true,
        data: {
          domain,
          type: 'insight_history',
          query: { ...normalizedRange, feature, page, pageSize, offset },
          rows,
        },
      };
    } catch (error) {
      throw this.wrapExecutionError(error, domain, 'insight_history');
    }
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

  private async buildM2InsightPayload(
    normalizedRange: { fromDate: string; toDate: string },
    feature?: string,
  ) {
    const domain: SupportedDomain = 'm2';
    const sourceCode = this.resolveM2SourceCode(domain, feature);
    const [summaryRows, trendRows, cashflowRows, statusRows, branchRows] = await Promise.all([
      this.dashboardMysqlService.executeTemplate(domain, 'summary.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'trends.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_cashflow.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_status.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
      this.dashboardMysqlService.executeTemplate(domain, 'breakdown_branch.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      }),
    ]);

    const summary = (summaryRows[0] ?? {}) as Record<string, unknown>;
    const trend = trendRows as Array<Record<string, unknown>>;
    const cashflow = cashflowRows as Array<Record<string, unknown>>;
    const status = statusRows as Array<Record<string, unknown>>;
    const branch = branchRows as Array<Record<string, unknown>>;

    const sortedTrend = [...trend].sort((a, b) =>
      String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')),
    );
    const latestTrend = sortedTrend[sortedTrend.length - 1];
    const prevTrend = sortedTrend[sortedTrend.length - 2];

    const latestNet = this.toNumber(latestTrend?.net_cashflow);
    const prevNet = this.toNumber(prevTrend?.net_cashflow);
    const netDelta = latestNet - prevNet;
    const netDeltaPct = prevNet === 0 ? 0 : (netDelta / Math.abs(prevNet)) * 100;

    const cashIn = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_in), 0);
    const cashOut = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_out), 0);

    const anomalies: string[] = [];
    const netAbs = sortedTrend.map((row) => Math.abs(this.toNumber(row.net_cashflow)));
    const netAvgAbs =
      netAbs.length === 0 ? 0 : netAbs.reduce((acc, value) => acc + value, 0) / netAbs.length;
    if (netAvgAbs > 0) {
      const outliers = sortedTrend
        .filter((row) => Math.abs(this.toNumber(row.net_cashflow)) > netAvgAbs * 2.5)
        .map((row) => String(row.period_ym ?? 'unknown'));
      if (outliers.length > 0) {
        anomalies.push(`Outlier net cashflow terdeteksi pada periode: ${outliers.join(', ')}`);
      }
    }

    const unknownStatusCount = status.filter((row) =>
      String(row.status_label ?? '').startsWith('unknown_'),
    ).length;
    if (unknownStatusCount > 0) {
      anomalies.push(
        `Terdapat ${unknownStatusCount} kategori status belum terpetakan (unknown_*).`,
      );
    }

    const topBranch = branch[0];
    const topBranchName = String(topBranch?.cabang ?? 'N/A');
    const topBranchMovement = this.toNumber(topBranch?.movement_amount);

    const insightItems = [
      {
        text: `Periode analisis ${normalizedRange.fromDate} s/d ${normalizedRange.toDate}.`,
        confidence: 0.99,
      },
      {
        text: `Total debit ${this.formatMoneyCompact(this.toNumber(summary.total_debit))} dan total kredit ${this.formatMoneyCompact(this.toNumber(summary.total_kredit))}.`,
        confidence: 0.96,
      },
      {
        text: `Net cashflow periode terbaru ${this.formatMoneyCompact(latestNet)} (${netDelta >= 0 ? 'naik' : 'turun'} ${this.formatPercent(Math.abs(netDeltaPct))} dibanding periode sebelumnya).`,
        confidence: prevTrend ? 0.9 : 0.72,
      },
      {
        text: `Arus kas agregat: cash in ${this.formatMoneyCompact(cashIn)} vs cash out ${this.formatMoneyCompact(cashOut)}.`,
        confidence: 0.92,
      },
      {
        text: `Cabang dengan movement terbesar: ${topBranchName} (${this.formatMoneyCompact(topBranchMovement)}).`,
        confidence: topBranchName === 'N/A' ? 0.55 : 0.84,
      },
    ];

    const recommendations: string[] = [];
    if (latestNet < 0) {
      recommendations.push(
        'Prioritaskan review komponen cash out terbesar per sumber transaksi dan cabang.',
      );
    } else {
      recommendations.push(
        'Pertahankan tren positif dengan monitoring periodik pada sumber transaksi berkontribusi tinggi.',
      );
    }
    recommendations.push(
      'Lakukan validasi mapping status unknown_* agar analisis operasional lebih presisi.',
    );
    recommendations.push(
      'Gunakan drill-down detail transaksi untuk 10 transaksi nominal terbesar pada periode outlier.',
    );

    return {
      summary: {
        totalRows: this.toNumber(summary.total_journal_rows),
        totalDebit: this.toNumber(summary.total_debit),
        totalKredit: this.toNumber(summary.total_kredit),
        netCashflow: this.toNumber(summary.net_cashflow),
      },
      insightItems,
      insights: insightItems.map((item) => ({ text: item.text, confidence: item.confidence })),
      anomalies,
      recommendations,
      confidenceAvg:
        insightItems.length > 0
          ? insightItems.reduce((acc, item) => acc + item.confidence, 0) / insightItems.length
          : 0,
    };
  }

  private async ensureInsightHistoryTable(): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS m0_dashboard_insight_history (
        id SERIAL PRIMARY KEY,
        domain TEXT NOT NULL,
        feature TEXT NOT NULL,
        action TEXT NOT NULL,
        user_id INTEGER NULL REFERENCES m0_users(id) ON DELETE SET NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        question TEXT NULL,
        response_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        confidence_avg DOUBLE PRECISION NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await this.prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_lookup ON m0_dashboard_insight_history(domain, feature, created_at DESC);`,
    );
    await this.prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_user ON m0_dashboard_insight_history(user_id, created_at DESC);`,
    );
  }

  private async saveInsightHistory(params: {
    actorId?: string | number;
    domain: string;
    feature: string;
    action: string;
    fromDate: string;
    toDate: string;
    question: string | null;
    response: unknown;
  }) {
    await this.ensureInsightHistoryTable();
    const userId = this.toAuditUserId(params.actorId);
    const responseJson = JSON.stringify(params.response ?? {});
    const confidenceAvg = this.extractConfidenceAverage(params.response);

    await this.prisma.$executeRaw`
      INSERT INTO m0_dashboard_insight_history
      (domain, feature, action, user_id, from_date, to_date, question, response_json, confidence_avg)
      VALUES
      (${params.domain}, ${params.feature}, ${params.action}, ${userId}, ${params.fromDate}::date, ${params.toDate}::date, ${params.question}, ${responseJson}::jsonb, ${confidenceAvg})
    `;
  }

  private extractConfidenceAverage(response: unknown): number | null {
    if (!response || typeof response !== 'object') {
      return null;
    }
    const items = (response as { insightItems?: Array<{ confidence?: number }> }).insightItems;
    if (!Array.isArray(items) || items.length === 0) {
      const direct = (response as { confidence?: number }).confidence;
      return typeof direct === 'number' ? direct : null;
    }
    const nums = items
      .map((item) => (typeof item?.confidence === 'number' ? item.confidence : null))
      .filter((value): value is number => value !== null);
    if (nums.length === 0) {
      return null;
    }
    return nums.reduce((acc, value) => acc + value, 0) / nums.length;
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
