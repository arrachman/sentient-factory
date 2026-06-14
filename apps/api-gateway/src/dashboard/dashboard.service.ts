import { Injectable } from '@nestjs/common';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
import { DashboardQueryService } from './dashboard-query.service';

/**
 * DashboardService
 *
 * Thin facade for query/custom-db/kpis/insight dashboard operations.
 * Alerting operations live in DashboardAlertingFacadeService.
 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardCustomDbService: DashboardCustomDbService,
    private readonly dashboardQueryService: DashboardQueryService,
  ) {}

  // ── Custom DB ──────────────────────────────────────────────────────────────

  customDbPinTargets() {
    return this.dashboardCustomDbService.customDbPinTargets();
  }

  customDbCatalog(dashboardKey: string) {
    return this.dashboardCustomDbService.customDbCatalog(dashboardKey);
  }

  updateCustomDbCatalog(
    dashboardKey: string,
    body: { title?: string; description?: string | null },
  ) {
    return this.dashboardCustomDbService.updateCustomDbCatalog(dashboardKey, body);
  }

  executeCustomDbQuery(
    dashboardKey: string,
    queryKey: string,
    params: Record<string, unknown>,
  ) {
    return this.dashboardCustomDbService.executeCustomDbQuery(dashboardKey, queryKey, params);
  }

  pinCustomDbWidget(body: {
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

  updateCustomDbWidget(
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

  deleteCustomDbWidget(widgetId: string) {
    return this.dashboardCustomDbService.deleteCustomDbWidget(widgetId);
  }

  duplicateCustomDbWidget(widgetId: string) {
    return this.dashboardCustomDbService.duplicateCustomDbWidget(widgetId);
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  listDomains() {
    return this.dashboardQueryService.listDomains();
  }

  health() {
    return this.dashboardQueryService.health();
  }

  managerKpis() {
    return this.dashboardQueryService.managerKpis();
  }

  metadata(domainInput: string) {
    return this.dashboardQueryService.metadata(domainInput);
  }

  summary(domainInput: string, query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.summary(domainInput, query);
  }

  trends(domainInput: string, query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.trends(domainInput, query);
  }

  breakdown(domainInput: string, query: QueryDashboardBreakdownDto) {
    return this.dashboardQueryService.breakdown(domainInput, query);
  }

  table(domainInput: string, query: QueryDashboardTableDto) {
    return this.dashboardQueryService.table(domainInput, query);
  }

  breakdownStatus(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownStatus(query);
  }

  breakdownRealisasi(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownRealisasi(query);
  }

  breakdownSalesman(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownSalesman(query);
  }

  breakdownCustomer(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownCustomer(query);
  }

  breakdownM2Status(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Status(query);
  }

  breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Cashflow(query);
  }

  breakdownM2Branch(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownM2Branch(query);
  }

  topContactsM2Sm(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topContactsM2Sm(query);
  }

  contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardQueryService.contactDrilldownM2Sm(query);
  }

  summaryM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.summaryM2Cr(query);
  }

  trendsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.trendsM2Cr(query);
  }

  breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownSourceM2Cr(query);
  }

  breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.breakdownStatusBayarM2Cr(query);
  }

  topContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topContactsM2Cr(query);
  }

  topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topOutstandingContactsM2Cr(query);
  }

  topBranchesM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.topBranchesM2Cr(query);
  }

  contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardQueryService.contactDrilldownM2Cr(query);
  }

  tableM2Cr(query: QueryDashboardTableDto) {
    return this.dashboardQueryService.tableM2Cr(query);
  }

  insightM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryService.insightM2Cr(query);
  }

  insightM2(query: QueryDashboardRangeDto & { feature?: string }, actorId?: string | number) {
    return this.dashboardQueryService.insightM2(query, actorId);
  }

  askInsightM2(
    dto: { question: string; fromDate?: string; toDate?: string; feature?: string },
    actorId?: string | number,
  ) {
    return this.dashboardQueryService.askInsightM2(dto, actorId);
  }

  insightHistoryM2(
    query: QueryDashboardRangeDto & { feature?: string; page?: number; pageSize?: number },
    actorId?: string | number,
  ) {
    return this.dashboardQueryService.insightHistoryM2(query, actorId);
  }
}
