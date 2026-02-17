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
exports.MasterDataWarehousesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_master_data_warehouse_dto_1 = require("./dto/create-master-data-warehouse.dto");
const query_master_data_warehouse_dto_1 = require("./dto/query-master-data-warehouse.dto");
const update_master_data_warehouse_dto_1 = require("./dto/update-master-data-warehouse.dto");
const master_data_warehouses_service_1 = require("./master-data-warehouses.service");
let MasterDataWarehousesController = class MasterDataWarehousesController {
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
exports.MasterDataWarehousesController = MasterDataWarehousesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create master data warehouse' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Master data warehouse created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_master_data_warehouse_dto_1.CreateMasterDataWarehouseDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataWarehousesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get master data warehouse list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of master data warehouse' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_master_data_warehouse_dto_1.QueryMasterDataWarehouseDto]),
    __metadata("design:returntype", void 0)
], MasterDataWarehousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one master data warehouse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data warehouse detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataWarehousesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update master data warehouse' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data warehouse updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_master_data_warehouse_dto_1.UpdateMasterDataWarehouseDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataWarehousesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete master data warehouse (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data warehouse deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MasterDataWarehousesController.prototype, "remove", null);
exports.MasterDataWarehousesController = MasterDataWarehousesController = __decorate([
    (0, swagger_1.ApiTags)('Master Data Warehouse'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('master-data-warehouses'),
    __metadata("design:paramtypes", [master_data_warehouses_service_1.MasterDataWarehousesService])
], MasterDataWarehousesController);
//# sourceMappingURL=master-data-warehouses.controller.js.map