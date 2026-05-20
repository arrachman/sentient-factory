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
exports.ErpLocationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_erp_location_dto_1 = require("./dto/create-erp-location.dto");
const query_erp_location_dto_1 = require("./dto/query-erp-location.dto");
const update_erp_location_dto_1 = require("./dto/update-erp-location.dto");
const erp_locations_service_1 = require("./erp-locations.service");
let ErpLocationsController = class ErpLocationsController {
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
        return this.service.findOne(BigInt(id));
    }
    update(id, dto, req) {
        return this.service.update(BigInt(id), dto, req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(BigInt(id), req.user?.id);
    }
};
exports.ErpLocationsController = ErpLocationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP location created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_location_dto_1.CreateErpLocationDto, Object]),
    __metadata("design:returntype", void 0)
], ErpLocationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP location list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP locations' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_location_dto_1.QueryErpLocationDto]),
    __metadata("design:returntype", void 0)
], ErpLocationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP location detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpLocationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP location updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_location_dto_1.UpdateErpLocationDto, Object]),
    __metadata("design:returntype", void 0)
], ErpLocationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ERP location (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP location deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpLocationsController.prototype, "remove", null);
exports.ErpLocationsController = ErpLocationsController = __decorate([
    (0, swagger_1.ApiTags)('ERP Locations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/locations'),
    __metadata("design:paramtypes", [erp_locations_service_1.ErpLocationsService])
], ErpLocationsController);
//# sourceMappingURL=erp-locations.controller.js.map