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
exports.OutboundController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_outbound_dto_1 = require("./dto/create-outbound.dto");
const query_monitoring_outbound_dto_1 = require("./dto/query-monitoring-outbound.dto");
const query_outbound_dto_1 = require("./dto/query-outbound.dto");
const query_stock_batch_report_dto_1 = require("./dto/query-stock-batch-report.dto");
const query_stock_mutation_report_dto_1 = require("./dto/query-stock-mutation-report.dto");
const update_outbound_dto_1 = require("./dto/update-outbound.dto");
const outbound_service_1 = require("./outbound.service");
let OutboundController = class OutboundController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.id);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    getBatchOptions(itemId, excludeDoId) {
        return this.service.getBatchOptions(itemId, excludeDoId);
    }
    getMonitoringReport(query) {
        return this.service.findMonitoringReport(query);
    }
    getStockBatchReport(query) {
        return this.service.findStockBatchReport(query);
    }
    getStockMutationReport(query) {
        return this.service.findStockMutationReport(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(id, req.user?.id);
    }
};
exports.OutboundController = OutboundController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create outbound with batch details' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'outbound created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_outbound_dto_1.CreateOutboundDto, Object]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get outbounds' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of outbounds' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_outbound_dto_1.QueryOutboundDto]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('batch-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get batch options by item for outbound form' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Batch options' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('itemId')),
    __param(1, (0, common_1.Query)('excludeDoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "getBatchOptions", null);
__decorate([
    (0, common_1.Get)('report-monitoring-do'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monitoring DO and delivery report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monitoring report data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_monitoring_outbound_dto_1.QueryMonitoringOutboundDto]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "getMonitoringReport", null);
__decorate([
    (0, common_1.Get)('report-stock-batch'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock batch report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock batch report data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_stock_batch_report_dto_1.QueryStockBatchReportDto]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "getStockBatchReport", null);
__decorate([
    (0, common_1.Get)('report-stock-mutation'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock mutation report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock mutation report data' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_stock_mutation_report_dto_1.QueryStockMutationReportDto]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "getStockMutationReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one outbound' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'outbound detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update outbound' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'outbound updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_outbound_dto_1.UpdateOutboundDto, Object]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete outbound (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'outbound deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OutboundController.prototype, "remove", null);
exports.OutboundController = OutboundController = __decorate([
    (0, swagger_1.ApiTags)('Outbound'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('outbound'),
    __metadata("design:paramtypes", [outbound_service_1.OutboundService])
], OutboundController);
//# sourceMappingURL=outbound.controller.js.map