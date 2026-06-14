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
exports.ErpSettingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const query_erp_setting_dto_1 = require("./dto/query-erp-setting.dto");
const update_erp_setting_dto_1 = require("./dto/update-erp-setting.dto");
const erp_settings_service_1 = require("./erp-settings.service");
let ErpSettingsController = class ErpSettingsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(key) {
        return this.service.findOne(key);
    }
    upsert(key, dto, req) {
        return this.service.upsert(key, dto, req.user?.id);
    }
};
exports.ErpSettingsController = ErpSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all ERP settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP settings' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_setting_dto_1.QueryErpSettingDto]),
    __metadata("design:returntype", void 0)
], ErpSettingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP setting by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP setting detail' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpSettingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP setting by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP setting updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_setting_dto_1.UpdateErpSettingDto, Object]),
    __metadata("design:returntype", void 0)
], ErpSettingsController.prototype, "upsert", null);
exports.ErpSettingsController = ErpSettingsController = __decorate([
    (0, swagger_1.ApiTags)('ERP Settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/settings'),
    __metadata("design:paramtypes", [erp_settings_service_1.ErpSettingsService])
], ErpSettingsController);
//# sourceMappingURL=erp-settings.controller.js.map