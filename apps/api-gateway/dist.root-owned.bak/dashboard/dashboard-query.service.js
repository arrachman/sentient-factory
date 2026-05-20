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
var DashboardQueryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardQueryService = void 0;
const common_1 = require("@nestjs/common");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
const dashboard_insight_service_1 = require("./dashboard-insight.service");
const dashboard_query_m2_service_1 = require("./dashboard-query-m2.service");
const dashboard_query_m2cr_service_1 = require("./dashboard-query-m2cr.service");
const dashboard_kpi_service_1 = require("./dashboard-kpi.service");
const dashboard_query_utils_1 = require("./dashboard-query.utils");
const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'];
let DashboardQueryService = DashboardQueryService_1 = class DashboardQueryService {
    dashboardMysqlService;
    dashboardInsightService;
    dashboardQueryM2Service;
    dashboardQueryM2CrService;
    dashboardKpiService;
    supportedDomains = SUPPORTED_DOMAINS;
    logger = new common_1.Logger(DashboardQueryService_1.name);
    constructor(dashboardMysqlService, dashboardInsightService, dashboardQueryM2Service, dashboardQueryM2CrService, dashboardKpiService) {
        this.dashboardMysqlService = dashboardMysqlService;
        this.dashboardInsightService = dashboardInsightService;
        this.dashboardQueryM2Service = dashboardQueryM2Service;
        this.dashboardQueryM2CrService = dashboardQueryM2CrService;
        this.dashboardKpiService = dashboardKpiService;
    }
    async summary(domainInput, query) {
        const domain = (0, dashboard_query_utils_1.assertDomain)(domainInput);
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)(domain, query.feature);
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
            throw (0, dashboard_query_utils_1.wrapExecutionError)(error, domain, 'summary');
        }
    }
    async trends(domainInput, query) {
        const domain = (0, dashboard_query_utils_1.assertDomain)(domainInput);
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)(domain, query.feature);
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
            throw (0, dashboard_query_utils_1.wrapExecutionError)(error, domain, 'trends');
        }
    }
    async breakdown(domainInput, query) {
        const domain = (0, dashboard_query_utils_1.assertDomain)(domainInput);
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const groupBy = (0, dashboard_query_utils_1.resolveAllowedGroupBy)(domain, query.groupBy);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)(domain, query.feature);
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
        }
        catch (error) {
            throw (0, dashboard_query_utils_1.wrapExecutionError)(error, domain, 'breakdown');
        }
    }
    async table(domainInput, query) {
        const domain = (0, dashboard_query_utils_1.assertDomain)(domainInput);
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)(domain, query.feature);
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 50;
        const offset = (page - 1) * pageSize;
        const sortBy = (0, dashboard_query_utils_1.resolveAllowedSortBy)(domain, query.sortBy);
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
            throw (0, dashboard_query_utils_1.wrapExecutionError)(error, domain, 'table');
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
    async topContactsM2Sm(query) {
        return this.dashboardQueryM2Service.topContactsM2Sm((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async contactDrilldownM2Sm(query) {
        const kontakId = this.dashboardQueryM2Service.validateKontakId(query.kontakId);
        return this.dashboardQueryM2Service.contactDrilldownM2Sm((0, dashboard_query_utils_1.normalizeRange)(query), kontakId);
    }
    async breakdownM2Status(query) {
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)('m2', query.feature);
        return this.dashboardQueryM2Service.breakdownM2Status(normalizedRange, sourceCode);
    }
    async breakdownM2Cashflow(query) {
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)('m2', query.feature);
        return this.dashboardQueryM2Service.breakdownM2Cashflow(normalizedRange, sourceCode);
    }
    async breakdownM2Branch(query) {
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)('m2', query.feature);
        return this.dashboardQueryM2Service.breakdownM2Branch(normalizedRange, sourceCode);
    }
    async summaryM2Cr(query) {
        return this.dashboardQueryM2CrService.summaryM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async trendsM2Cr(query) {
        return this.dashboardQueryM2CrService.trendsM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async breakdownSourceM2Cr(query) {
        return this.dashboardQueryM2CrService.breakdownSourceM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async breakdownStatusBayarM2Cr(query) {
        return this.dashboardQueryM2CrService.breakdownStatusBayarM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async topContactsM2Cr(query) {
        return this.dashboardQueryM2CrService.topContactsM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async topOutstandingContactsM2Cr(query) {
        return this.dashboardQueryM2CrService.topOutstandingContactsM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async topBranchesM2Cr(query) {
        return this.dashboardQueryM2CrService.topBranchesM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async contactDrilldownM2Cr(query) {
        const kontakId = this.dashboardQueryM2CrService.validateKontakId(query.kontakId);
        return this.dashboardQueryM2CrService.contactDrilldownM2Cr((0, dashboard_query_utils_1.normalizeRange)(query), kontakId);
    }
    async tableM2Cr(query) {
        return this.dashboardQueryM2CrService.tableM2Cr(query, (0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async insightM2Cr(query) {
        return this.dashboardQueryM2CrService.insightM2Cr((0, dashboard_query_utils_1.normalizeRange)(query));
    }
    async insightM2(query, actorId) {
        return this.dashboardInsightService.insightM2(query, actorId);
    }
    async askInsightM2(dto, actorId) {
        return this.dashboardInsightService.askInsightM2(dto, actorId);
    }
    async insightHistoryM2(query, actorId) {
        return this.dashboardInsightService.insightHistoryM2(query, actorId);
    }
    listDomains() {
        return {
            success: true,
            data: this.supportedDomains.map((domain) => ({
                domain,
                allowedGroupBy: dashboard_query_utils_1.DOMAIN_FIELD_ALLOWLIST[domain].groupBy,
                allowedSortBy: dashboard_query_utils_1.DOMAIN_FIELD_ALLOWLIST[domain].sortBy,
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
    async metadata(domainInput) {
        const domain = (0, dashboard_query_utils_1.assertDomain)(domainInput);
        const metadata = await this.dashboardMysqlService.getDomainMetadata(domain);
        const tableColumns = new Map();
        for (const tableInfo of metadata.columnsByTable) {
            tableColumns.set(tableInfo.tableName, new Set(tableInfo.columns));
        }
        const breakdownTable = metadata.sourceTables.breakdown;
        const tableTable = metadata.sourceTables.table;
        const allowed = dashboard_query_utils_1.DOMAIN_FIELD_ALLOWLIST[domain];
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
                    groupBy: (0, dashboard_query_utils_1.filterExistingColumns)(allowed.groupBy, breakdownTable ? tableColumns.get(breakdownTable) : undefined),
                    sortBy: (0, dashboard_query_utils_1.filterExistingColumns)(allowed.sortBy, tableTable ? tableColumns.get(tableTable) : undefined),
                },
            },
        };
    }
    async executePresetBreakdown(domain, type, fileName, query) {
        const normalizedRange = (0, dashboard_query_utils_1.normalizeRange)(query);
        const sourceCode = (0, dashboard_query_utils_1.resolveM2SourceCode)(domain, query.feature);
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
            throw (0, dashboard_query_utils_1.wrapExecutionError)(error, domain, `breakdown_${type}`);
        }
    }
};
exports.DashboardQueryService = DashboardQueryService;
exports.DashboardQueryService = DashboardQueryService = DashboardQueryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_mysql_service_1.DashboardMysqlService,
        dashboard_insight_service_1.DashboardInsightService,
        dashboard_query_m2_service_1.DashboardQueryM2Service,
        dashboard_query_m2cr_service_1.DashboardQueryM2CrService,
        dashboard_kpi_service_1.DashboardKpiService])
], DashboardQueryService);
//# sourceMappingURL=dashboard-query.service.js.map