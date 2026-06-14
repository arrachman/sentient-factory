"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DashboardInsightService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardInsightService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
const dashboard_utils_1 = require("./dashboard.utils");
const dashboard_insight_utils_1 = require("./dashboard-insight.utils");
let DashboardInsightService = DashboardInsightService_1 = class DashboardInsightService {
    prisma;
    dashboardMysqlService;
    logger = new common_1.Logger(DashboardInsightService_1.name);
    constructor(prisma, dashboardMysqlService) {
        this.prisma = prisma;
        this.dashboardMysqlService = dashboardMysqlService;
    }
    async insightM2(query, actorId) {
        const domain = 'm2';
        const normalizedRange = (0, dashboard_insight_utils_1.normalizeRange)(query);
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
        }
        catch (error) {
            throw (0, dashboard_insight_utils_1.wrapExecutionError)(error, domain, 'insight');
        }
    }
    async askInsightM2(dto, actorId) {
        const domain = 'm2';
        const normalizedRange = (0, dashboard_insight_utils_1.normalizeRange)(dto);
        const feature = dto.feature ?? 'm2_aj';
        const question = dto.question.trim();
        if (!question) {
            throw new common_1.BadRequestException('Question is required');
        }
        try {
            const payload = await this.buildM2InsightPayload(normalizedRange, feature);
            const q = question.toLowerCase();
            let answer = payload.insights[0]?.text ?? 'Insight tidak tersedia.';
            let confidence = 0.64;
            if (q.includes('net') || q.includes('cashflow')) {
                answer = payload.insights[2]?.text ?? payload.insights[3]?.text ?? answer;
                confidence = 0.88;
            }
            else if (q.includes('debit') || q.includes('kredit')) {
                answer = payload.insights[1]?.text ?? answer;
                confidence = 0.86;
            }
            else if (q.includes('cabang') || q.includes('branch')) {
                answer = payload.insights[4]?.text ?? answer;
                confidence = 0.8;
            }
            else if (q.includes('anomali') || q.includes('outlier')) {
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
        }
        catch (error) {
            throw (0, dashboard_insight_utils_1.wrapExecutionError)(error, domain, 'insight_ask');
        }
    }
    async insightHistoryM2(query, actorId) {
        const domain = 'm2';
        const normalizedRange = (0, dashboard_insight_utils_1.normalizeRange)(query);
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const offset = (page - 1) * pageSize;
        const feature = query.feature ?? 'm2_aj';
        const userId = (0, dashboard_utils_1.toAuditUserId)(actorId);
        try {
            await this.ensureInsightHistoryTable();
            const rows = (await this.prisma.$queryRaw `
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
      `);
            return {
                success: true,
                data: {
                    domain,
                    type: 'insight_history',
                    query: { ...normalizedRange, feature, page, pageSize, offset },
                    rows,
                },
            };
        }
        catch (error) {
            throw (0, dashboard_insight_utils_1.wrapExecutionError)(error, domain, 'insight_history');
        }
    }
    async buildM2InsightPayload(normalizedRange, feature) {
        const domain = 'm2';
        const sourceCode = (0, dashboard_insight_utils_1.resolveM2SourceCode)(domain, feature);
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
        const summary = (summaryRows[0] ?? {});
        const trend = trendRows;
        const cashflow = cashflowRows;
        const status = statusRows;
        const branch = branchRows;
        const sortedTrend = [...trend].sort((a, b) => String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')));
        const latestTrend = sortedTrend[sortedTrend.length - 1];
        const prevTrend = sortedTrend[sortedTrend.length - 2];
        const latestNet = (0, dashboard_utils_1.toNumber)(latestTrend?.net_cashflow);
        const prevNet = (0, dashboard_utils_1.toNumber)(prevTrend?.net_cashflow);
        const netDelta = latestNet - prevNet;
        const netDeltaPct = prevNet === 0 ? 0 : (netDelta / Math.abs(prevNet)) * 100;
        const cashIn = cashflow.reduce((acc, row) => acc + (0, dashboard_utils_1.toNumber)(row.cash_in), 0);
        const cashOut = cashflow.reduce((acc, row) => acc + (0, dashboard_utils_1.toNumber)(row.cash_out), 0);
        const anomalies = [];
        const netAbs = sortedTrend.map((row) => Math.abs((0, dashboard_utils_1.toNumber)(row.net_cashflow)));
        const netAvgAbs = netAbs.length === 0 ? 0 : netAbs.reduce((acc, value) => acc + value, 0) / netAbs.length;
        if (netAvgAbs > 0) {
            const outliers = sortedTrend
                .filter((row) => Math.abs((0, dashboard_utils_1.toNumber)(row.net_cashflow)) > netAvgAbs * 2.5)
                .map((row) => String(row.period_ym ?? 'unknown'));
            if (outliers.length > 0) {
                anomalies.push(`Outlier net cashflow terdeteksi pada periode: ${outliers.join(', ')}`);
            }
        }
        const unknownStatusCount = status.filter((row) => String(row.status_label ?? '').startsWith('unknown_')).length;
        if (unknownStatusCount > 0) {
            anomalies.push(`Terdapat ${unknownStatusCount} kategori status belum terpetakan (unknown_*).`);
        }
        const topBranch = branch[0];
        const topBranchName = String(topBranch?.cabang ?? 'N/A');
        const topBranchMovement = (0, dashboard_utils_1.toNumber)(topBranch?.movement_amount);
        const insightItems = [
            {
                text: `Periode analisis ${normalizedRange.fromDate} s/d ${normalizedRange.toDate}.`,
                confidence: 0.99,
            },
            {
                text: `Total debit ${(0, dashboard_utils_1.formatMoneyCompact)((0, dashboard_utils_1.toNumber)(summary.total_debit))} dan total kredit ${(0, dashboard_utils_1.formatMoneyCompact)((0, dashboard_utils_1.toNumber)(summary.total_kredit))}.`,
                confidence: 0.96,
            },
            {
                text: `Net cashflow periode terbaru ${(0, dashboard_utils_1.formatMoneyCompact)(latestNet)} (${netDelta >= 0 ? 'naik' : 'turun'} ${(0, dashboard_utils_1.formatPercent)(Math.abs(netDeltaPct))} dibanding periode sebelumnya).`,
                confidence: prevTrend ? 0.9 : 0.72,
            },
            {
                text: `Arus kas agregat: cash in ${(0, dashboard_utils_1.formatMoneyCompact)(cashIn)} vs cash out ${(0, dashboard_utils_1.formatMoneyCompact)(cashOut)}.`,
                confidence: 0.92,
            },
            {
                text: `Cabang dengan movement terbesar: ${topBranchName} (${(0, dashboard_utils_1.formatMoneyCompact)(topBranchMovement)}).`,
                confidence: topBranchName === 'N/A' ? 0.55 : 0.84,
            },
        ];
        const recommendations = [];
        if (latestNet < 0) {
            recommendations.push('Prioritaskan review komponen cash out terbesar per sumber transaksi dan cabang.');
        }
        else {
            recommendations.push('Pertahankan tren positif dengan monitoring periodik pada sumber transaksi berkontribusi tinggi.');
        }
        recommendations.push('Lakukan validasi mapping status unknown_* agar analisis operasional lebih presisi.');
        recommendations.push('Gunakan drill-down detail transaksi untuk 10 transaksi nominal terbesar pada periode outlier.');
        return {
            summary: {
                totalRows: (0, dashboard_utils_1.toNumber)(summary.total_journal_rows),
                totalDebit: (0, dashboard_utils_1.toNumber)(summary.total_debit),
                totalKredit: (0, dashboard_utils_1.toNumber)(summary.total_kredit),
                netCashflow: (0, dashboard_utils_1.toNumber)(summary.net_cashflow),
            },
            insightItems,
            insights: insightItems.map((item) => ({ text: item.text, confidence: item.confidence })),
            anomalies,
            recommendations,
            confidenceAvg: insightItems.length > 0
                ? insightItems.reduce((acc, item) => acc + item.confidence, 0) / insightItems.length
                : 0,
        };
    }
    async ensureInsightHistoryTable() {
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
        await this.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_lookup ON m0_dashboard_insight_history(domain, feature, created_at DESC);`);
        await this.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_m0_dash_insight_hist_user ON m0_dashboard_insight_history(user_id, created_at DESC);`);
    }
    async saveInsightHistory(params) {
        await this.ensureInsightHistoryTable();
        const userId = (0, dashboard_utils_1.toAuditUserId)(params.actorId);
        const responseJson = JSON.stringify(params.response ?? {});
        const confidenceAvg = (0, dashboard_insight_utils_1.extractConfidenceAverage)(params.response);
        await this.prisma.$executeRaw `
      INSERT INTO m0_dashboard_insight_history
      (domain, feature, action, user_id, from_date, to_date, question, response_json, confidence_avg)
      VALUES
      (${params.domain}, ${params.feature}, ${params.action}, ${userId}, ${params.fromDate}::date, ${params.toDate}::date, ${params.question}, ${responseJson}::jsonb, ${confidenceAvg})
    `;
    }
};
exports.DashboardInsightService = DashboardInsightService;
exports.DashboardInsightService = DashboardInsightService = DashboardInsightService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dashboard_mysql_service_1.DashboardMysqlService])
], DashboardInsightService);
//# sourceMappingURL=dashboard-insight.service.js.map