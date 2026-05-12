import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { toNumber, formatMoneyCompact, formatPercent, toAuditUserId } from './dashboard.utils';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';

type SupportedDomain = 'm1' | 'm' | 'm2' | 'm2r' | 'so';

@Injectable()
export class DashboardInsightService {
  private readonly logger = new Logger(DashboardInsightService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardMysqlService: DashboardMysqlService,
  ) {}

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
    const userId = toAuditUserId(actorId);

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

    const latestNet = toNumber(latestTrend?.net_cashflow);
    const prevNet = toNumber(prevTrend?.net_cashflow);
    const netDelta = latestNet - prevNet;
    const netDeltaPct = prevNet === 0 ? 0 : (netDelta / Math.abs(prevNet)) * 100;

    const cashIn = cashflow.reduce((acc, row) => acc + toNumber(row.cash_in), 0);
    const cashOut = cashflow.reduce((acc, row) => acc + toNumber(row.cash_out), 0);

    const anomalies: string[] = [];
    const netAbs = sortedTrend.map((row) => Math.abs(toNumber(row.net_cashflow)));
    const netAvgAbs =
      netAbs.length === 0 ? 0 : netAbs.reduce((acc, value) => acc + value, 0) / netAbs.length;
    if (netAvgAbs > 0) {
      const outliers = sortedTrend
        .filter((row) => Math.abs(toNumber(row.net_cashflow)) > netAvgAbs * 2.5)
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
    const topBranchMovement = toNumber(topBranch?.movement_amount);

    const insightItems = [
      {
        text: `Periode analisis ${normalizedRange.fromDate} s/d ${normalizedRange.toDate}.`,
        confidence: 0.99,
      },
      {
        text: `Total debit ${formatMoneyCompact(toNumber(summary.total_debit))} dan total kredit ${formatMoneyCompact(toNumber(summary.total_kredit))}.`,
        confidence: 0.96,
      },
      {
        text: `Net cashflow periode terbaru ${formatMoneyCompact(latestNet)} (${netDelta >= 0 ? 'naik' : 'turun'} ${formatPercent(Math.abs(netDeltaPct))} dibanding periode sebelumnya).`,
        confidence: prevTrend ? 0.9 : 0.72,
      },
      {
        text: `Arus kas agregat: cash in ${formatMoneyCompact(cashIn)} vs cash out ${formatMoneyCompact(cashOut)}.`,
        confidence: 0.92,
      },
      {
        text: `Cabang dengan movement terbesar: ${topBranchName} (${formatMoneyCompact(topBranchMovement)}).`,
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
        totalRows: toNumber(summary.total_journal_rows),
        totalDebit: toNumber(summary.total_debit),
        totalKredit: toNumber(summary.total_kredit),
        netCashflow: toNumber(summary.net_cashflow),
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
    const userId = toAuditUserId(params.actorId);
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

  private normalizeRange(query: { fromDate?: string; toDate?: string }): {
    fromDate: string;
    toDate: string;
  } {
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
}
