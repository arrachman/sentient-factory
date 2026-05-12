import { Injectable, Logger } from '@nestjs/common';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardQueryM2Service } from './dashboard-query-m2.service';
import { DashboardQueryM2CrService } from './dashboard-query-m2cr.service';
import { DashboardKpiService } from './dashboard-kpi.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import {
  SupportedDomain,
  DOMAIN_FIELD_ALLOWLIST,
  assertDomain,
  normalizeRange,
  resolveAllowedGroupBy,
  resolveAllowedSortBy,
  resolveM2SourceCode,
  wrapExecutionError,
  filterExistingColumns,
} from './dashboard-query.utils';

const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'] as const;

@Injectable()
export class DashboardQueryService {
  private readonly supportedDomains: readonly SupportedDomain[] = SUPPORTED_DOMAINS;
  private readonly logger = new Logger(DashboardQueryService.name);

  constructor(
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly dashboardInsightService: DashboardInsightService,
    private readonly dashboardQueryM2Service: DashboardQueryM2Service,
    private readonly dashboardQueryM2CrService: DashboardQueryM2CrService,
    private readonly dashboardKpiService: DashboardKpiService,
  ) {}

  // ── Generic cross-domain queries ──────────────────────────────────────────

  async summary(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = assertDomain(domainInput);
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode(domain, query.feature);

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
      throw wrapExecutionError(error, domain, 'summary');
    }
  }

  async trends(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = assertDomain(domainInput);
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode(domain, query.feature);

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
      throw wrapExecutionError(error, domain, 'trends');
    }
  }

  async breakdown(domainInput: string, query: QueryDashboardBreakdownDto) {
    const domain = assertDomain(domainInput);
    const normalizedRange = normalizeRange(query);
    const groupBy = resolveAllowedGroupBy(domain, query.groupBy);
    const sourceCode = resolveM2SourceCode(domain, query.feature);

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
          query: { ...normalizedRange, groupBy },
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, 'breakdown.sql'),
          rows,
        },
      };
    } catch (error) {
      throw wrapExecutionError(error, domain, 'breakdown');
    }
  }

  async table(domainInput: string, query: QueryDashboardTableDto) {
    const domain = assertDomain(domainInput);
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode(domain, query.feature);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const offset = (page - 1) * pageSize;
    const sortBy = resolveAllowedSortBy(domain, query.sortBy);
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
      throw wrapExecutionError(error, domain, 'table');
    }
  }

  // ── SO preset breakdowns ──────────────────────────────────────────────────

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

  // ── M2/SM delegations ─────────────────────────────────────────────────────

  async topContactsM2Sm(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2Service.topContactsM2Sm(normalizeRange(query));
  }

  async contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const kontakId = this.dashboardQueryM2Service.validateKontakId(query.kontakId);
    return this.dashboardQueryM2Service.contactDrilldownM2Sm(normalizeRange(query), kontakId);
  }

  async breakdownM2Status(query: QueryDashboardRangeDto) {
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Status(normalizedRange, sourceCode);
  }

  async breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Cashflow(normalizedRange, sourceCode);
  }

  async breakdownM2Branch(query: QueryDashboardRangeDto) {
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Branch(normalizedRange, sourceCode);
  }

  // ── M2Cr delegations ──────────────────────────────────────────────────────

  async summaryM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.summaryM2Cr(normalizeRange(query));
  }

  async trendsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.trendsM2Cr(normalizeRange(query));
  }

  async breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.breakdownSourceM2Cr(normalizeRange(query));
  }

  async breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.breakdownStatusBayarM2Cr(normalizeRange(query));
  }

  async topContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.topContactsM2Cr(normalizeRange(query));
  }

  async topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.topOutstandingContactsM2Cr(normalizeRange(query));
  }

  async topBranchesM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.topBranchesM2Cr(normalizeRange(query));
  }

  async contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const kontakId = this.dashboardQueryM2CrService.validateKontakId(query.kontakId);
    return this.dashboardQueryM2CrService.contactDrilldownM2Cr(normalizeRange(query), kontakId);
  }

  async tableM2Cr(query: QueryDashboardTableDto) {
    return this.dashboardQueryM2CrService.tableM2Cr(query, normalizeRange(query));
  }

  async insightM2Cr(query: QueryDashboardRangeDto) {
    return this.dashboardQueryM2CrService.insightM2Cr(normalizeRange(query));
  }

  // ── Insight delegations ───────────────────────────────────────────────────

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

  // ── Domain / health / metadata ────────────────────────────────────────────

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
    return { success: true, data: health };
  }

  async managerKpis() {
    return this.dashboardKpiService.managerKpis();
  }

  async metadata(domainInput: string) {
    const domain = assertDomain(domainInput);
    const metadata = await this.dashboardMysqlService.getDomainMetadata(domain);

    const tableColumns = new Map<string, Set<string>>();
    for (const tableInfo of metadata.columnsByTable) {
      tableColumns.set(tableInfo.tableName, new Set(tableInfo.columns));
    }

    const breakdownTable = metadata.sourceTables.breakdown;
    const tableTable = metadata.sourceTables.table;
    const allowed = DOMAIN_FIELD_ALLOWLIST[domain];

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
          groupBy: filterExistingColumns(
            allowed.groupBy,
            breakdownTable ? tableColumns.get(breakdownTable) : undefined,
          ),
          sortBy: filterExistingColumns(
            allowed.sortBy,
            tableTable ? tableColumns.get(tableTable) : undefined,
          ),
        },
      },
    };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async executePresetBreakdown(
    domain: SupportedDomain,
    type: 'status' | 'realisasi' | 'salesman' | 'customer' | 'cashflow' | 'branch',
    fileName: string,
    query: QueryDashboardRangeDto,
  ) {
    const normalizedRange = normalizeRange(query);
    const sourceCode = resolveM2SourceCode(domain, query.feature);

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
      throw wrapExecutionError(error, domain, `breakdown_${type}`);
    }
  }
}
