import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardQueryM2Service } from './dashboard-query-m2.service';
import { DashboardQueryM2CrService } from './dashboard-query-m2cr.service';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import {
  toNumber,
  formatNumber,
  formatMoneyCompact,
  formatPercent,
} from './dashboard.utils';

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
export class DashboardQueryService {
  private readonly supportedDomains: readonly SupportedDomain[] = SUPPORTED_DOMAINS;
  private readonly logger = new Logger(DashboardQueryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly dashboardInsightService: DashboardInsightService,
    private readonly dashboardQueryM2Service: DashboardQueryM2Service,
    private readonly dashboardQueryM2CrService: DashboardQueryM2CrService,
  ) {}

  // ── Generic cross-domain queries ──────────────────────────────────────────

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

  // ── SO preset breakdowns (general/M1) ────────────────────────────────────

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
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2Service.topContactsM2Sm(normalizedRange);
  }

  async contactDrilldownM2Sm(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = this.dashboardQueryM2Service.validateKontakId(query.kontakId);
    return this.dashboardQueryM2Service.contactDrilldownM2Sm(normalizedRange, kontakId);
  }

  async breakdownM2Status(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Status(normalizedRange, sourceCode);
  }

  async breakdownM2Cashflow(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Cashflow(normalizedRange, sourceCode);
  }

  async breakdownM2Branch(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    const sourceCode = this.resolveM2SourceCode('m2', query.feature);
    return this.dashboardQueryM2Service.breakdownM2Branch(normalizedRange, sourceCode);
  }

  // ── M2Cr delegations ──────────────────────────────────────────────────────

  async summaryM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.summaryM2Cr(normalizedRange);
  }

  async trendsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.trendsM2Cr(normalizedRange);
  }

  async breakdownSourceM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.breakdownSourceM2Cr(normalizedRange);
  }

  async breakdownStatusBayarM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.breakdownStatusBayarM2Cr(normalizedRange);
  }

  async topContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.topContactsM2Cr(normalizedRange);
  }

  async topOutstandingContactsM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.topOutstandingContactsM2Cr(normalizedRange);
  }

  async topBranchesM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.topBranchesM2Cr(normalizedRange);
  }

  async contactDrilldownM2Cr(query: QueryDashboardRangeDto & { kontakId?: string }) {
    const normalizedRange = this.normalizeRange(query);
    const kontakId = this.dashboardQueryM2CrService.validateKontakId(query.kontakId);
    return this.dashboardQueryM2CrService.contactDrilldownM2Cr(normalizedRange, kontakId);
  }

  async tableM2Cr(query: QueryDashboardTableDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.tableM2Cr(query, normalizedRange);
  }

  async insightM2Cr(query: QueryDashboardRangeDto) {
    const normalizedRange = this.normalizeRange(query);
    return this.dashboardQueryM2CrService.insightM2Cr(normalizedRange);
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

    const avgMinutes = toNumber(decisionLatencyRow[0]?.avg_minutes);
    const accepted = acceptedRow[0];
    const acceptedPct = toNumber(accepted?.accepted_pct);
    const previousAcceptedPct = toNumber(accepted?.previous_pct);
    const freshness = freshnessSummary[0];
    const freshnessPct = toNumber(freshness?.compliance_pct);
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
            formattedValue: `${formatNumber(avgMinutes)} menit`,
            formula: 'AVG(decision_at - insight_created_at)',
          },
          {
            title: 'AI Insight Accepted',
            subtitle: '7 hari',
            value: acceptedPct,
            unit: 'percent',
            formattedValue: formatPercent(acceptedPct),
            numerator: toNumber(accepted?.accepted_count),
            denominator: toNumber(accepted?.total_count),
            delta: Number((acceptedPct - previousAcceptedPct).toFixed(1)),
            deltaLabel: 'vs 7 hari sebelumnya',
            formula: 'accepted_insights / total_insights * 100',
          },
          {
            title: 'Critical Risk Open',
            subtitle: 'Live',
            value: criticalRiskOpen,
            unit: 'count',
            formattedValue: formatNumber(criticalRiskOpen),
            delta: criticalRiskOpen - previousRiskOpen,
            deltaLabel: 'vs awal hari',
            formula: 'COUNT(risk WHERE severity=critical AND status IN open,in_progress)',
          },
          {
            title: 'Data Freshness SLA',
            subtitle: 'Lintas domain',
            value: freshnessPct,
            unit: 'percent',
            formattedValue: formatPercent(freshnessPct),
            numerator: toNumber(freshness?.compliant_count),
            denominator: toNumber(freshness?.total_count),
            formula: 'datasets_within_sla / total_datasets * 100',
          },
        ],
        breakdown: {
          dataFreshnessByDomain: freshnessDomainRows.map((row) => ({
            domain: row.domain,
            datasetCount: toNumber(row.dataset_count),
            compliantCount: toNumber(row.compliant_count),
            compliancePct: toNumber(row.compliance_pct),
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

  // ── Private helpers ───────────────────────────────────────────────────────

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
}
