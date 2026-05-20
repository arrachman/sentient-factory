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
exports.DashboardQueryM2CrService = void 0;
const common_1 = require("@nestjs/common");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
const dashboard_utils_1 = require("./dashboard.utils");
let DashboardQueryM2CrService = class DashboardQueryM2CrService {
    dashboardMysqlService;
    constructor(dashboardMysqlService) {
        this.dashboardMysqlService = dashboardMysqlService;
    }
    async summaryM2Cr(normalizedRange) {
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
    async trendsM2Cr(normalizedRange) {
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
    async breakdownSourceM2Cr(normalizedRange) {
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
    async breakdownStatusBayarM2Cr(normalizedRange) {
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
    async topContactsM2Cr(normalizedRange) {
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
    async topOutstandingContactsM2Cr(normalizedRange) {
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
    async topBranchesM2Cr(normalizedRange) {
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
    async contactDrilldownM2Cr(normalizedRange, kontakId) {
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
    async tableM2Cr(query, normalizedRange) {
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
        const orderByExpression = sortBy === 'outstanding' ? '(COALESCE(crjumlah, 0) - COALESCE(crjumlahbayar, 0))' : sortBy;
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
    async insightM2Cr(normalizedRange) {
        const [summaryResult, trendResult, statusResult, topResult] = await Promise.all([
            this.summaryM2Cr(normalizedRange),
            this.trendsM2Cr(normalizedRange),
            this.breakdownStatusBayarM2Cr(normalizedRange),
            this.topContactsM2Cr(normalizedRange),
        ]);
        const summary = (summaryResult.data.rows[0] ?? {});
        const trends = trendResult.data.rows;
        const statuses = statusResult.data.rows;
        const tops = topResult.data.rows;
        const totalKasMasuk = (0, dashboard_utils_1.toNumber)(summary.total_kas_masuk);
        const totalTerbayar = (0, dashboard_utils_1.toNumber)(summary.total_terbayar);
        const outstanding = (0, dashboard_utils_1.toNumber)(summary.outstanding);
        const totalTrx = (0, dashboard_utils_1.toNumber)(summary.total_trx);
        const outstandingPct = totalKasMasuk > 0 ? (outstanding / totalKasMasuk) * 100 : 0;
        const sortedTrend = [...trends].sort((a, b) => String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')));
        const latest = sortedTrend[sortedTrend.length - 1];
        const prev = sortedTrend[sortedTrend.length - 2];
        const latestKasMasuk = (0, dashboard_utils_1.toNumber)(latest?.total_kas_masuk);
        const prevKasMasuk = (0, dashboard_utils_1.toNumber)(prev?.total_kas_masuk);
        const deltaPct = prevKasMasuk > 0 ? ((latestKasMasuk - prevKasMasuk) / prevKasMasuk) * 100 : 0;
        const topContact = tops[0];
        const topContactKey = String(topContact?.kontak_key ?? 'N/A');
        const topContactValue = (0, dashboard_utils_1.toNumber)(topContact?.total_kas_masuk);
        const paidStatus = statuses.find((row) => String(row.status_bayar_label) === 'paid');
        const unpaidStatus = statuses.find((row) => String(row.status_bayar_label) === 'unpaid');
        const paidPct = totalTrx > 0 ? ((0, dashboard_utils_1.toNumber)(paidStatus?.total_trx) / totalTrx) * 100 : 0;
        const insights = [
            {
                text: `Periode ${normalizedRange.fromDate} s/d ${normalizedRange.toDate} mencatat ${(0, dashboard_utils_1.formatNumber)(totalTrx)} transaksi kas masuk.`,
                confidence: 0.99,
            },
            {
                text: `Total kas masuk ${(0, dashboard_utils_1.formatMoneyCompact)(totalKasMasuk)} dengan total terbayar ${(0, dashboard_utils_1.formatMoneyCompact)(totalTerbayar)}.`,
                confidence: 0.95,
            },
            {
                text: `Outstanding saat ini ${(0, dashboard_utils_1.formatMoneyCompact)(outstanding)} (${(0, dashboard_utils_1.formatPercent)(outstandingPct)} dari total kas masuk).`,
                confidence: 0.9,
            },
            {
                text: `Periode terbaru menunjukkan ${deltaPct >= 0 ? 'kenaikan' : 'penurunan'} kas masuk ${(0, dashboard_utils_1.formatPercent)(Math.abs(deltaPct))} dibanding periode sebelumnya.`,
                confidence: prev ? 0.86 : 0.68,
            },
            {
                text: `Kontak dengan kontribusi terbesar: ${topContactKey} (${(0, dashboard_utils_1.formatMoneyCompact)(topContactValue)}).`,
                confidence: topContact ? 0.82 : 0.55,
            },
        ];
        const anomalies = [];
        if (outstandingPct > 30) {
            anomalies.push(`Outstanding melebihi ambang 30% (${(0, dashboard_utils_1.formatPercent)(outstandingPct)}).`);
        }
        if (prev && Math.abs(deltaPct) > 40) {
            anomalies.push(`Perubahan kas masuk periode terbaru cukup ekstrem (${(0, dashboard_utils_1.formatPercent)(Math.abs(deltaPct))}).`);
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
    validateKontakId(rawKontakId) {
        const kontakId = Number(rawKontakId);
        if (!Number.isFinite(kontakId) || kontakId <= 0) {
            throw new common_1.BadRequestException('kontakId harus berupa angka positif.');
        }
        return kontakId;
    }
};
exports.DashboardQueryM2CrService = DashboardQueryM2CrService;
exports.DashboardQueryM2CrService = DashboardQueryM2CrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_mysql_service_1.DashboardMysqlService])
], DashboardQueryM2CrService);
//# sourceMappingURL=dashboard-query-m2cr.service.js.map