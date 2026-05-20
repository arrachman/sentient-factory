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
exports.AlertingDeliveryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dashboard_alerting_facade_service_1 = require("./dashboard-alerting-facade.service");
let AlertingDeliveryController = class AlertingDeliveryController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    alertingDeliveryLogs(eventId) {
        return this.dashboardService.alertingDeliveryLogs(eventId);
    }
    requeueAlertingDeliveryLog(deliveryId, req) {
        return this.dashboardService.requeueAlertingDeliveryLog(deliveryId, req.user?.username || req.user?.email || 'system');
    }
    alertingDeadLetterTriage(query) {
        return this.dashboardService.alertingDeadLetterTriage(query);
    }
    updateAlertingDeadLetterTriage(deliveryId, req, body) {
        return this.dashboardService.updateAlertingDeadLetterTriage(deliveryId, body, req.user?.username || req.user?.email || 'system');
    }
    runAlertingSchedulerCycle(req) {
        return this.dashboardService.runAlertingSchedulerCycle(req.user?.username || req.user?.email || 'system');
    }
    runAlertDeliveryCycle(req) {
        return this.dashboardService.runAlertDeliveryCycle(req.user?.username || req.user?.email || 'system');
    }
    runAlertingTriageEscalationCycle(req) {
        return this.dashboardService.runAlertingTriageEscalationCycle(req.user?.username || req.user?.email || 'system');
    }
};
exports.AlertingDeliveryController = AlertingDeliveryController;
__decorate([
    (0, common_1.Get)('alerting/delivery-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'List alert delivery logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery log payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "alertingDeliveryLogs", null);
__decorate([
    (0, common_1.Post)('alerting/delivery-logs/:deliveryId/requeue'),
    (0, swagger_1.ApiOperation)({ summary: 'Requeue failed or dead-lettered delivery log' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery requeue result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('deliveryId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "requeueAlertingDeliveryLog", null);
__decorate([
    (0, common_1.Get)('alerting/dead-letter-triage'),
    (0, swagger_1.ApiOperation)({ summary: 'List dead-letter triage items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dead-letter triage payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "alertingDeadLetterTriage", null);
__decorate([
    (0, common_1.Patch)('alerting/dead-letter-triage/:deliveryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dead-letter triage item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dead-letter triage update result' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('deliveryId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "updateAlertingDeadLetterTriage", null);
__decorate([
    (0, common_1.Post)('alerting/scheduler/run'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute due alert rules through scheduler cycle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert scheduler cycle result' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "runAlertingSchedulerCycle", null);
__decorate([
    (0, common_1.Post)('alerting/delivery/run'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute queued alert delivery logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert delivery worker result' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "runAlertDeliveryCycle", null);
__decorate([
    (0, common_1.Post)('alerting/triage/escalation/run'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute dead-letter triage auto-escalation cycle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dead-letter triage escalation cycle result' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertingDeliveryController.prototype, "runAlertingTriageEscalationCycle", null);
exports.AlertingDeliveryController = AlertingDeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_alerting_facade_service_1.DashboardAlertingFacadeService])
], AlertingDeliveryController);
//# sourceMappingURL=alerting-delivery.controller.js.map