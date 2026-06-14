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
exports.MasterDataCitySlasController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_master_data_city_sla_dto_1 = require("./dto/create-master-data-city-sla.dto");
const query_master_data_city_sla_dto_1 = require("./dto/query-master-data-city-sla.dto");
const update_master_data_city_sla_dto_1 = require("./dto/update-master-data-city-sla.dto");
const master_data_city_slas_service_1 = require("./master-data-city-slas.service");
let MasterDataCitySlasController = class MasterDataCitySlasController {
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
exports.MasterDataCitySlasController = MasterDataCitySlasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create master data city SLA' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Master data city SLA created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_master_data_city_sla_dto_1.CreateMasterDataCitySlaDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataCitySlasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get master data city SLA list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of master data city SLA' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_master_data_city_sla_dto_1.QueryMasterDataCitySlaDto]),
    __metadata("design:returntype", void 0)
], MasterDataCitySlasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one master data city SLA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data city SLA detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataCitySlasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update master data city SLA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data city SLA updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_master_data_city_sla_dto_1.UpdateMasterDataCitySlaDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataCitySlasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete master data city SLA (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data city SLA deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MasterDataCitySlasController.prototype, "remove", null);
exports.MasterDataCitySlasController = MasterDataCitySlasController = __decorate([
    (0, swagger_1.ApiTags)('Master Data City SLA'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('master-data-city-slas'),
    __metadata("design:paramtypes", [master_data_city_slas_service_1.MasterDataCitySlasService])
], MasterDataCitySlasController);
//# sourceMappingURL=master-data-city-slas.controller.js.map