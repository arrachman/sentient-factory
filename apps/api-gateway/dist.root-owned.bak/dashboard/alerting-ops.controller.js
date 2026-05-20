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
exports.AlertingOpsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dashboard_alerting_facade_service_1 = require("./dashboard-alerting-facade.service");
let AlertingOpsController = class AlertingOpsController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    alertingAnalytics() {
        return this.dashboardService.alertingAnalytics();
    }
    alertingDeliveryObservability() {
        return this.dashboardService.alertingDeliveryObservability();
    }
    alertingOpsOverview() {
        return this.dashboardService.alertingOpsOverview();
    }
    alertingDeliveryStatus() {
        return this.dashboardService.alertingDeliveryStatus();
    }
    alertingProviderHealth() {
        return this.dashboardService.alertingProviderHealth();
    }
    alertingBaileysPairing(req, body) {
        return this.dashboardService.alertingBaileysPairing(body, req.user?.username || req.user?.email || 'system');
    }
};
exports.AlertingOpsController = AlertingOpsController;
__decorate([
    (0, common_1.Get)('alerting/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerting analytics summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert analytics payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingAnalytics", null);
__decorate([
    (0, common_1.Get)('alerting/delivery-observability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery observability summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery observability payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingDeliveryObservability", null);
__decorate([
    (0, common_1.Get)('alerting/ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerting ops overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert ops overview payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingOpsOverview", null);
__decorate([
    (0, common_1.Get)('alerting/delivery-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert delivery provider readiness' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery provider readiness payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingDeliveryStatus", null);
__decorate([
    (0, common_1.Get)('alerting/provider-health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert delivery provider health details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery provider health payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingProviderHealth", null);
__decorate([
    (0, common_1.Post)('alerting/provider-health/baileys/pairing'),
    (0, swagger_1.ApiOperation)({ summary: 'Start Baileys pairing flow and return pairing code or QR token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Baileys pairing payload' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingOpsController.prototype, "alertingBaileysPairing", null);
exports.AlertingOpsController = AlertingOpsController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_alerting_facade_service_1.DashboardAlertingFacadeService])
], AlertingOpsController);
//# sourceMappingURL=alerting-ops.controller.js.map