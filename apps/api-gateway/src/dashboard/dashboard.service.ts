import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  constructor(
    private readonly dashboardMysqlService: DashboardMysqlService,
    private readonly prisma: PrismaService,
  ) {}

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
    const sortBy = query.sortBy && allowedSortColumns.has(query.sortBy) ? query.sortBy : 'outstanding';
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
