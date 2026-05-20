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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardKpiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
let DashboardKpiService = class DashboardKpiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async managerKpis() {
        const [decisionLatencyRow, acceptedRow, criticalRiskOpen, criticalRiskOpenYesterday, freshnessSummary, freshnessDomainRows,] = await Promise.all([
            this.prisma.$queryRaw `
        SELECT ROUND(AVG(EXTRACT(EPOCH FROM ("decision_at" - "insight_created_at")) / 60.0)::numeric, 1) AS avg_minutes
        FROM "m0_manager_insight"
        WHERE "decision_at" IS NOT NULL
          AND "insight_created_at" >= date_trunc('day', now())
          AND "insight_created_at" < date_trunc('day', now()) + interval '1 day'
      `,
            this.prisma.$queryRaw `
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
            this.prisma.$queryRaw `
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
            this.prisma.$queryRaw `
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
        const avgMinutes = (0, dashboard_utils_1.toNumber)(decisionLatencyRow[0]?.avg_minutes);
        const accepted = acceptedRow[0];
        const acceptedPct = (0, dashboard_utils_1.toNumber)(accepted?.accepted_pct);
        const previousAcceptedPct = (0, dashboard_utils_1.toNumber)(accepted?.previous_pct);
        const freshness = freshnessSummary[0];
        const freshnessPct = (0, dashboard_utils_1.toNumber)(freshness?.compliance_pct);
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
                        formattedValue: `${(0, dashboard_utils_1.formatNumber)(avgMinutes)} menit`,
                        formula: 'AVG(decision_at - insight_created_at)',
                    },
                    {
                        title: 'AI Insight Accepted',
                        subtitle: '7 hari',
                        value: acceptedPct,
                        unit: 'percent',
                        formattedValue: (0, dashboard_utils_1.formatPercent)(acceptedPct),
                        numerator: (0, dashboard_utils_1.toNumber)(accepted?.accepted_count),
                        denominator: (0, dashboard_utils_1.toNumber)(accepted?.total_count),
                        delta: Number((acceptedPct - previousAcceptedPct).toFixed(1)),
                        deltaLabel: 'vs 7 hari sebelumnya',
                        formula: 'accepted_insights / total_insights * 100',
                    },
                    {
                        title: 'Critical Risk Open',
                        subtitle: 'Live',
                        value: criticalRiskOpen,
                        unit: 'count',
                        formattedValue: (0, dashboard_utils_1.formatNumber)(criticalRiskOpen),
                        delta: criticalRiskOpen - previousRiskOpen,
                        deltaLabel: 'vs awal hari',
                        formula: 'COUNT(risk WHERE severity=critical AND status IN open,in_progress)',
                    },
                    {
                        title: 'Data Freshness SLA',
                        subtitle: 'Lintas domain',
                        value: freshnessPct,
                        unit: 'percent',
                        formattedValue: (0, dashboard_utils_1.formatPercent)(freshnessPct),
                        numerator: (0, dashboard_utils_1.toNumber)(freshness?.compliant_count),
                        denominator: (0, dashboard_utils_1.toNumber)(freshness?.total_count),
                        formula: 'datasets_within_sla / total_datasets * 100',
                    },
                ],
                breakdown: {
                    dataFreshnessByDomain: freshnessDomainRows.map((row) => ({
                        domain: row.domain,
                        datasetCount: (0, dashboard_utils_1.toNumber)(row.dataset_count),
                        compliantCount: (0, dashboard_utils_1.toNumber)(row.compliant_count),
                        compliancePct: (0, dashboard_utils_1.toNumber)(row.compliance_pct),
                    })),
                },
            },
        };
    }
};
exports.DashboardKpiService = DashboardKpiService;
exports.DashboardKpiService = DashboardKpiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardKpiService);
//# sourceMappingURL=dashboard-kpi.service.js.map