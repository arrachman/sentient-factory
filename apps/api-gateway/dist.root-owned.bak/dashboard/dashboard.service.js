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
const dashboard_custom_db_service_1 = require("./dashboard-custom-db.service");
const dashboard_query_service_1 = require("./dashboard-query.service");
let DashboardService = class DashboardService {
    dashboardCustomDbService;
    dashboardQueryService;
    constructor(dashboardCustomDbService, dashboardQueryService) {
        this.dashboardCustomDbService = dashboardCustomDbService;
        this.dashboardQueryService = dashboardQueryService;
    }
    customDbPinTargets() {
        return this.dashboardCustomDbService.customDbPinTargets();
    }
    customDbCatalog(dashboardKey) {
        return this.dashboardCustomDbService.customDbCatalog(dashboardKey);
    }
    updateCustomDbCatalog(dashboardKey, body) {
        return this.dashboardCustomDbService.updateCustomDbCatalog(dashboardKey, body);
    }
    executeCustomDbQuery(dashboardKey, queryKey, params) {
        return this.dashboardCustomDbService.executeCustomDbQuery(dashboardKey, queryKey, params);
    }
    pinCustomDbWidget(body) {
        return this.dashboardCustomDbService.pinCustomDbWidget(body);
    }
    updateCustomDbWidget(widgetId, body) {
        return this.dashboardCustomDbService.updateCustomDbWidget(widgetId, body);
    }
    deleteCustomDbWidget(widgetId) {
        return this.dashboardCustomDbService.deleteCustomDbWidget(widgetId);
    }
    duplicateCustomDbWidget(widgetId) {
        return this.dashboardCustomDbService.duplicateCustomDbWidget(widgetId);
    }
    listDomains() {
        return this.dashboardQueryService.listDomains();
    }
    health() {
        return this.dashboardQueryService.health();
    }
    managerKpis() {
        return this.dashboardQueryService.managerKpis();
    }
    metadata(domainInput) {
        return this.dashboardQueryService.metadata(domainInput);
    }
    summary(domainInput, query) {
        return this.dashboardQueryService.summary(domainInput, query);
    }
    trends(domainInput, query) {
        return this.dashboardQueryService.trends(domainInput, query);
    }
    breakdown(domainInput, query) {
        return this.dashboardQueryService.breakdown(domainInput, query);
    }
    table(domainInput, query) {
        return this.dashboardQueryService.table(domainInput, query);
    }
    breakdownStatus(query) {
        return this.dashboardQueryService.breakdownStatus(query);
    }
    breakdownRealisasi(query) {
        return this.dashboardQueryService.breakdownRealisasi(query);
    }
    breakdownSalesman(query) {
        return this.dashboardQueryService.breakdownSalesman(query);
    }
    breakdownCustomer(query) {
        return this.dashboardQueryService.breakdownCustomer(query);
    }
    breakdownM2Status(query) {
        return this.dashboardQueryService.breakdownM2Status(query);
    }
    breakdownM2Cashflow(query) {
        return this.dashboardQueryService.breakdownM2Cashflow(query);
    }
    breakdownM2Branch(query) {
        return this.dashboardQueryService.breakdownM2Branch(query);
    }
    topContactsM2Sm(query) {
        return this.dashboardQueryService.topContactsM2Sm(query);
    }
    contactDrilldownM2Sm(query) {
        return this.dashboardQueryService.contactDrilldownM2Sm(query);
    }
    summaryM2Cr(query) {
        return this.dashboardQueryService.summaryM2Cr(query);
    }
    trendsM2Cr(query) {
        return this.dashboardQueryService.trendsM2Cr(query);
    }
    breakdownSourceM2Cr(query) {
        return this.dashboardQueryService.breakdownSourceM2Cr(query);
    }
    breakdownStatusBayarM2Cr(query) {
        return this.dashboardQueryService.breakdownStatusBayarM2Cr(query);
    }
    topContactsM2Cr(query) {
        return this.dashboardQueryService.topContactsM2Cr(query);
    }
    topOutstandingContactsM2Cr(query) {
        return this.dashboardQueryService.topOutstandingContactsM2Cr(query);
    }
    topBranchesM2Cr(query) {
        return this.dashboardQueryService.topBranchesM2Cr(query);
    }
    contactDrilldownM2Cr(query) {
        return this.dashboardQueryService.contactDrilldownM2Cr(query);
    }
    tableM2Cr(query) {
        return this.dashboardQueryService.tableM2Cr(query);
    }
    insightM2Cr(query) {
        return this.dashboardQueryService.insightM2Cr(query);
    }
    insightM2(query, actorId) {
        return this.dashboardQueryService.insightM2(query, actorId);
    }
    askInsightM2(dto, actorId) {
        return this.dashboardQueryService.askInsightM2(dto, actorId);
    }
    insightHistoryM2(query, actorId) {
        return this.dashboardQueryService.insightHistoryM2(query, actorId);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_custom_db_service_1.DashboardCustomDbService,
        dashboard_query_service_1.DashboardQueryService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map