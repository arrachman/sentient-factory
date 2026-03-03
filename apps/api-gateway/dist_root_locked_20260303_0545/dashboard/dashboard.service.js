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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'];
const DOMAIN_FIELD_ALLOWLIST = {
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
let DashboardService = class DashboardService {
    dashboardMysqlService;
    prisma;
    supportedDomains = SUPPORTED_DOMAINS;
    constructor(dashboardMysqlService, prisma) {
        this.dashboardMysqlService = dashboardMysqlService;
        this.prisma = prisma;
    }
    async summary(domainInput, query) {
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, 'summary');
        }
    }
    async trends(domainInput, query) {
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, 'trends');
        }
    }
    async breakdown(domainInput, query) {
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, 'breakdown');
        }
    }
    async table(domainInput, query) {
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, 'table');
        }
    }
    async breakdownStatus(query) {
        return this.executePresetBreakdown('so', 'status', 'breakdown_status.sql', query);
    }
    async breakdownRealisasi(query) {
        return this.executePresetBreakdown('so', 'realisasi', 'breakdown_realisasi.sql', query);
    }
    async breakdownSalesman(query) {
        return this.executePresetBreakdown('so', 'salesman', 'breakdown_salesman.sql', query);
    }
    async breakdownCustomer(query) {
        return this.executePresetBreakdown('so', 'customer', 'breakdown_customer.sql', query);
    }
    async breakdownM2Status(query) {
        return this.executePresetBreakdown('m2', 'status', 'breakdown_status.sql', query);
    }
    async breakdownM2Cashflow(query) {
        return this.executePresetBreakdown('m2', 'cashflow', 'breakdown_cashflow.sql', query);
    }
    async breakdownM2Branch(query) {
        return this.executePresetBreakdown('m2', 'branch', 'breakdown_branch.sql', query);
    }
    async insightM2(query, actorId) {
        const domain = 'm2';
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, 'insight');
        }
    }
    async askInsightM2(dto, actorId) {
        const domain = 'm2';
        const normalizedRange = this.normalizeRange(dto);
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
            throw this.wrapExecutionError(error, domain, 'insight_ask');
        }
    }
    async insightHistoryM2(query, actorId) {
        const domain = 'm2';
        const normalizedRange = this.normalizeRange(query);
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const offset = (page - 1) * pageSize;
        const feature = query.feature ?? 'm2_aj';
        const userId = this.toAuditUserId(actorId);
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
    async metadata(domainInput) {
        const domain = this.assertDomain(domainInput);
        const metadata = await this.dashboardMysqlService.getDomainMetadata(domain);
        const tableColumns = new Map();
        for (const tableInfo of metadata.columnsByTable) {
            tableColumns.set(tableInfo.tableName, new Set(tableInfo.columns));
        }
        const breakdownTable = metadata.sourceTables.breakdown;
        const tableTable = metadata.sourceTables.table;
        const allowed = DOMAIN_FIELD_ALLOWLIST[domain];
        const allowedGroupByExisting = this.filterExistingColumns(allowed.groupBy, breakdownTable ? tableColumns.get(breakdownTable) : undefined);
        const allowedSortByExisting = this.filterExistingColumns(allowed.sortBy, tableTable ? tableColumns.get(tableTable) : undefined);
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
    assertDomain(domain) {
        if (this.supportedDomains.includes(domain)) {
            return domain;
        }
        throw new common_1.BadRequestException(`Unsupported domain '${domain}'. Allowed domains: ${this.supportedDomains.join(', ')}`);
    }
    normalizeRange(query) {
        const now = new Date();
        const toDate = query.toDate ?? now.toISOString().slice(0, 10);
        const defaultFrom = new Date(now);
        defaultFrom.setDate(defaultFrom.getDate() - 30);
        const fromDate = query.fromDate ?? defaultFrom.toISOString().slice(0, 10);
        if (fromDate > toDate) {
            throw new common_1.BadRequestException('fromDate must be less than or equal to toDate');
        }
        return { fromDate, toDate };
    }
    resolveAllowedGroupBy(domain, input) {
        const allowed = DOMAIN_FIELD_ALLOWLIST[domain].groupBy;
        if (!input) {
            return allowed[0];
        }
        if (!allowed.includes(input)) {
            throw new common_1.BadRequestException(`groupBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`);
        }
        return input;
    }
    resolveAllowedSortBy(domain, input) {
        const allowed = DOMAIN_FIELD_ALLOWLIST[domain].sortBy;
        if (!input) {
            return allowed[0];
        }
        if (!allowed.includes(input)) {
            throw new common_1.BadRequestException(`sortBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`);
        }
        return input;
    }
    resolveM2SourceCode(domain, feature) {
        if (domain !== 'm2' || !feature) {
            return null;
        }
        const featureToSource = {
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
    wrapExecutionError(error, domain, endpoint) {
        if (error instanceof common_1.BadRequestException) {
            return error;
        }
        if (error instanceof common_1.InternalServerErrorException) {
            return error;
        }
        const reason = error instanceof Error ? error.message : 'unknown error';
        return new common_1.InternalServerErrorException(`Dashboard query failed (${domain}/${endpoint}): ${reason}`);
    }
    async executePresetBreakdown(domain, type, fileName, query) {
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
        }
        catch (error) {
            throw this.wrapExecutionError(error, domain, `breakdown_${type}`);
        }
    }
    async buildM2InsightPayload(normalizedRange, feature) {
        const domain = 'm2';
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
        const summary = (summaryRows[0] ?? {});
        const trend = trendRows;
        const cashflow = cashflowRows;
        const status = statusRows;
        const branch = branchRows;
        const sortedTrend = [...trend].sort((a, b) => String(a.period_ym ?? '').localeCompare(String(b.period_ym ?? '')));
        const latestTrend = sortedTrend[sortedTrend.length - 1];
        const prevTrend = sortedTrend[sortedTrend.length - 2];
        const latestNet = this.toNumber(latestTrend?.net_cashflow);
        const prevNet = this.toNumber(prevTrend?.net_cashflow);
        const netDelta = latestNet - prevNet;
        const netDeltaPct = prevNet === 0 ? 0 : (netDelta / Math.abs(prevNet)) * 100;
        const cashIn = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_in), 0);
        const cashOut = cashflow.reduce((acc, row) => acc + this.toNumber(row.cash_out), 0);
        const anomalies = [];
        const netAbs = sortedTrend.map((row) => Math.abs(this.toNumber(row.net_cashflow)));
        const netAvgAbs = netAbs.length === 0 ? 0 : netAbs.reduce((acc, value) => acc + value, 0) / netAbs.length;
        if (netAvgAbs > 0) {
            const outliers = sortedTrend
                .filter((row) => Math.abs(this.toNumber(row.net_cashflow)) > netAvgAbs * 2.5)
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
                totalRows: this.toNumber(summary.total_journal_rows),
                totalDebit: this.toNumber(summary.total_debit),
                totalKredit: this.toNumber(summary.total_kredit),
                netCashflow: this.toNumber(summary.net_cashflow),
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
        const userId = this.toAuditUserId(params.actorId);
        const responseJson = JSON.stringify(params.response ?? {});
        const confidenceAvg = this.extractConfidenceAverage(params.response);
        await this.prisma.$executeRaw `
      INSERT INTO m0_dashboard_insight_history
      (domain, feature, action, user_id, from_date, to_date, question, response_json, confidence_avg)
      VALUES
      (${params.domain}, ${params.feature}, ${params.action}, ${userId}, ${params.fromDate}::date, ${params.toDate}::date, ${params.question}, ${responseJson}::jsonb, ${confidenceAvg})
    `;
    }
    extractConfidenceAverage(response) {
        if (!response || typeof response !== 'object') {
            return null;
        }
        const items = response.insightItems;
        if (!Array.isArray(items) || items.length === 0) {
            const direct = response.confidence;
            return typeof direct === 'number' ? direct : null;
        }
        const nums = items
            .map((item) => (typeof item?.confidence === 'number' ? item.confidence : null))
            .filter((value) => value !== null);
        if (nums.length === 0) {
            return null;
        }
        return nums.reduce((acc, value) => acc + value, 0) / nums.length;
    }
    filterExistingColumns(candidates, columns) {
        if (!columns || columns.size === 0) {
            return [...candidates];
        }
        return candidates.filter((candidate) => columns.has(candidate));
    }
    toNumber(value) {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }
    formatNumber(value) {
        return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
    }
    formatMoneyCompact(value) {
        return `Rp ${value.toLocaleString('id-ID', {
            notation: 'compact',
            maximumFractionDigits: 2,
        })}`;
    }
    formatPercent(value) {
        return `${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
    }
    toAuditUserId(actorId) {
        if (typeof actorId === 'number' && Number.isInteger(actorId) && actorId > 0) {
            return actorId;
        }
        const parsed = Number(String(actorId ?? '').trim());
        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }
        return null;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_mysql_service_1.DashboardMysqlService,
        prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map