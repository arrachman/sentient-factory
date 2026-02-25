import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardMysqlService } from './dashboard-mysql.service';

const SUPPORTED_DOMAINS = ['m1', 'm', 'm2r', 'so'] as const;
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
    sortBy: [
      'id',
      'tgl',
      'inputtgl',
      'postingtgl',
      'saldojml',
      'saldonilai',
      'saldohpp',
    ],
  },
  m: {
    groupBy: [
      'abstatus',
      'abshift',
      'abkaryawan',
      'abtgl',
    ],
    sortBy: [
      'adid',
      'adtgl',
      'adinputtgl',
      'admodifikasitgl',
      'adtotalpotongan',
      'adkurs',
    ],
  },
  m2r: {
    groupBy: [
      'apstatuslunas',
      'apkontaknama',
      'apsumber',
      'apmatauang',
      'aptgl',
    ],
    sortBy: ['nmtahun', 'nmbulan', 'nmsaldo', 'nmdebit', 'nmkredit', 'nmanggaran'],
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

  constructor(private readonly dashboardMysqlService: DashboardMysqlService) {}

  async summary(domainInput: string, query: QueryDashboardRangeDto) {
    const domain = this.assertDomain(domainInput);
    const normalizedRange = this.normalizeRange(query);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'summary.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
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

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'trends.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
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

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, 'breakdown.sql', {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        groupBy,
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
    type: 'status' | 'realisasi' | 'salesman' | 'customer',
    fileName: string,
    query: QueryDashboardRangeDto,
  ) {
    const normalizedRange = this.normalizeRange(query);

    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, fileName, {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
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

  private filterExistingColumns(
    candidates: readonly string[],
    columns?: Set<string>,
  ): string[] {
    if (!columns || columns.size === 0) {
      return [...candidates];
    }
    return candidates.filter((candidate) => columns.has(candidate));
  }
}
