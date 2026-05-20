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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ask_m2_insight_dto_1 = require("./dto/ask-m2-insight.dto");
const query_dashboard_breakdown_dto_1 = require("./dto/query-dashboard-breakdown.dto");
const query_dashboard_insight_history_dto_1 = require("./dto/query-dashboard-insight-history.dto");
const query_dashboard_range_dto_1 = require("./dto/query-dashboard-range.dto");
const query_dashboard_table_dto_1 = require("./dto/query-dashboard-table.dto");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    listDomains() {
        return this.dashboardService.listDomains();
    }
    health() {
        return this.dashboardService.health();
    }
    managerKpis() {
        return this.dashboardService.managerKpis();
    }
    customDbPinTargets() {
        return this.dashboardService.customDbPinTargets();
    }
    customDbCatalog(dashboardKey) {
        return this.dashboardService.customDbCatalog(dashboardKey);
    }
    updateCustomDbCatalog(dashboardKey, body) {
        return this.dashboardService.updateCustomDbCatalog(dashboardKey, body);
    }
    executeCustomDbQuery(dashboardKey, queryKey, body) {
        return this.dashboardService.executeCustomDbQuery(dashboardKey, queryKey, body?.params || {});
    }
    pinCustomDbWidget(body) {
        return this.dashboardService.pinCustomDbWidget(body);
    }
    updateCustomDbWidget(widgetId, body) {
        return this.dashboardService.updateCustomDbWidget(widgetId, body);
    }
    duplicateCustomDbWidget(widgetId) {
        return this.dashboardService.duplicateCustomDbWidget(widgetId);
    }
    deleteCustomDbWidget(widgetId) {
        return this.dashboardService.deleteCustomDbWidget(widgetId);
    }
    metadata(domain) {
        return this.dashboardService.metadata(domain);
    }
    summary(domain, query) {
        return this.dashboardService.summary(domain, query);
    }
    trends(domain, query) {
        return this.dashboardService.trends(domain, query);
    }
    breakdown(domain, query) {
        return this.dashboardService.breakdown(domain, query);
    }
    breakdownSoStatus(query) {
        return this.dashboardService.breakdownStatus(query);
    }
    breakdownSoRealisasi(query) {
        return this.dashboardService.breakdownRealisasi(query);
    }
    breakdownSoSalesman(query) {
        return this.dashboardService.breakdownSalesman(query);
    }
    breakdownSoCustomer(query) {
        return this.dashboardService.breakdownCustomer(query);
    }
    breakdownM2Status(query) {
        return this.dashboardService.breakdownM2Status(query);
    }
    breakdownM2Cashflow(query) {
        return this.dashboardService.breakdownM2Cashflow(query);
    }
    breakdownM2Branch(query) {
        return this.dashboardService.breakdownM2Branch(query);
    }
    insightM2(req, query) {
        return this.dashboardService.insightM2(query, req.user?.id);
    }
    summaryM2Cr(query) {
        return this.dashboardService.summaryM2Cr(query);
    }
    trendsM2Cr(query) {
        return this.dashboardService.trendsM2Cr(query);
    }
    breakdownSourceM2Cr(query) {
        return this.dashboardService.breakdownSourceM2Cr(query);
    }
    breakdownStatusBayarM2Cr(query) {
        return this.dashboardService.breakdownStatusBayarM2Cr(query);
    }
    topContactsM2Cr(query) {
        return this.dashboardService.topContactsM2Cr(query);
    }
    topOutstandingContactsM2Cr(query) {
        return this.dashboardService.topOutstandingContactsM2Cr(query);
    }
    topBranchesM2Cr(query) {
        return this.dashboardService.topBranchesM2Cr(query);
    }
    contactDrilldownM2Cr(query) {
        return this.dashboardService.contactDrilldownM2Cr(query);
    }
    topContactsM2Sm(query) {
        return this.dashboardService.topContactsM2Sm(query);
    }
    contactDrilldownM2Sm(query) {
        return this.dashboardService.contactDrilldownM2Sm(query);
    }
    tableM2Cr(query) {
        return this.dashboardService.tableM2Cr(query);
    }
    insightM2Cr(query) {
        return this.dashboardService.insightM2Cr(query);
    }
    askInsightM2(req, dto) {
        return this.dashboardService.askInsightM2(dto, req.user?.id);
    }
    insightHistoryM2(req, query) {
        return this.dashboardService.insightHistoryM2(query, req.user?.id);
    }
    table(domain, query) {
        return this.dashboardService.table(domain, query);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('domains'),
    (0, swagger_1.ApiOperation)({ summary: 'List supported dashboard domains' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supported domains list' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "listDomains", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check dashboard templates and MySQL connectivity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard health status' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('manager/kpis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get manager dashboard KPI cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Manager KPI payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "managerKpis", null);
__decorate([
    (0, common_1.Get)('custom-db/pin-targets'),
    (0, swagger_1.ApiOperation)({ summary: 'List custom dashboard pin targets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard pin targets payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "customDbPinTargets", null);
__decorate([
    (0, common_1.Get)('custom-db/:dashboardKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom dashboard catalog' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard catalog payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('dashboardKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "customDbCatalog", null);
__decorate([
    (0, common_1.Patch)('custom-db/:dashboardKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Update custom dashboard metadata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('dashboardKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateCustomDbCatalog", null);
__decorate([
    (0, common_1.Post)('custom-db/:dashboardKey/query/:queryKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute custom dashboard widget query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard query result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('dashboardKey')),
    __param(1, (0, common_1.Param)('queryKey')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "executeCustomDbQuery", null);
__decorate([
    (0, common_1.Post)('custom-db/pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Pin a widget into a custom dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard pin result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "pinCustomDbWidget", null);
__decorate([
    (0, common_1.Patch)('custom-db/widget/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update custom dashboard widget' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard widget update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateCustomDbWidget", null);
__decorate([
    (0, common_1.Post)('custom-db/widget/:widgetId/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate custom dashboard widget' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard widget duplicate result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "duplicateCustomDbWidget", null);
__decorate([
    (0, common_1.Delete)('custom-db/widget/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete custom dashboard widget' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom dashboard widget delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "deleteCustomDbWidget", null);
__decorate([
    (0, common_1.Get)(':domain/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard metadata (tables, columns, effective allow-list)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metadata payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "metadata", null);
__decorate([
    (0, common_1.Get)(':domain/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('domain')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)(':domain/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard trends' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trends payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('domain')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "trends", null);
__decorate([
    (0, common_1.Get)(':domain/breakdown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('domain')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dashboard_breakdown_dto_1.QueryDashboardBreakdownDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdown", null);
__decorate([
    (0, common_1.Get)('so/breakdown/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SO breakdown by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SO status breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownSoStatus", null);
__decorate([
    (0, common_1.Get)('so/breakdown/realisasi'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SO breakdown by realization status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SO realization breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownSoRealisasi", null);
__decorate([
    (0, common_1.Get)('so/breakdown/salesman'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SO breakdown by salesman key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SO salesman breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownSoSalesman", null);
__decorate([
    (0, common_1.Get)('so/breakdown/customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SO breakdown by customer key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SO customer breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownSoCustomer", null);
__decorate([
    (0, common_1.Get)('m2/breakdown/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2 breakdown by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 status breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownM2Status", null);
__decorate([
    (0, common_1.Get)('m2/breakdown/cashflow'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2 cashflow breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 cashflow breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownM2Cashflow", null);
__decorate([
    (0, common_1.Get)('m2/breakdown/branch'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2 branch breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 branch breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownM2Branch", null);
__decorate([
    (0, common_1.Get)('m2/insight'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI insight for m2 dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 insight payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "insightM2", null);
__decorate([
    (0, common_1.Get)('m2/cr/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr cash-in summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr summary payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "summaryM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr cash-in trends' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr trends payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "trendsM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/breakdown/source'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr breakdown by source' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr source breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownSourceM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/breakdown/status-bayar'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr breakdown by payment status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr payment status breakdown payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "breakdownStatusBayarM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/top-contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr top contacts by nominal cash-in' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr top contacts payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "topContactsM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/top-outstanding-contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr top contacts by outstanding amount' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr top outstanding contacts payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "topOutstandingContactsM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/top-branches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr top branches by nominal cash-in' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr top branches payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "topBranchesM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/contact-drilldown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr drill-down detail by contact for outstanding follow up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr contact drill-down payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "contactDrilldownM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/sm/top-contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_sm top contacts by nominal bank payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_sm top contacts payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "topContactsM2Sm", null);
__decorate([
    (0, common_1.Get)('m2/sm/contact-drilldown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_sm drill-down detail by contact for follow up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_sm contact drill-down payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "contactDrilldownM2Sm", null);
__decorate([
    (0, common_1.Get)('m2/cr/table'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2_cr transaction table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr table payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_table_dto_1.QueryDashboardTableDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "tableM2Cr", null);
__decorate([
    (0, common_1.Get)('m2/cr/insight'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI insight for m2_cr dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2_cr insight payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dashboard_range_dto_1.QueryDashboardRangeDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "insightM2Cr", null);
__decorate([
    (0, common_1.Post)('m2/insight/ask'),
    (0, swagger_1.ApiOperation)({ summary: 'Ask AI for m2 dashboard context' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 ask insight payload' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ask_m2_insight_dto_1.AskM2InsightDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "askInsightM2", null);
__decorate([
    (0, common_1.Get)('m2/insight/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get m2 insight history (audit trail)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'm2 insight history payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_dashboard_insight_history_dto_1.QueryDashboardInsightHistoryDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "insightHistoryM2", null);
__decorate([
    (0, common_1.Get)(':domain/table'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Table payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('domain')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dashboard_table_dto_1.QueryDashboardTableDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "table", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map