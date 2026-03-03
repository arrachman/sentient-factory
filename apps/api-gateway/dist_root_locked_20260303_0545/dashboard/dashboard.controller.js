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