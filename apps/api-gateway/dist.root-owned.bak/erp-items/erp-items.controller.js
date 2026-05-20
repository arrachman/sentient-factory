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
exports.ErpItemsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_erp_item_dto_1 = require("./dto/create-erp-item.dto");
const query_erp_item_dto_1 = require("./dto/query-erp-item.dto");
const update_erp_item_dto_1 = require("./dto/update-erp-item.dto");
const erp_items_service_1 = require("./erp-items.service");
let ErpItemsController = class ErpItemsController {
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
exports.ErpItemsController = ErpItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP item created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_item_dto_1.CreateErpItemDto, Object]),
    __metadata("design:returntype", void 0)
], ErpItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP item list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP items' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_item_dto_1.QueryErpItemDto]),
    __metadata("design:returntype", void 0)
], ErpItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP item detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP item updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_item_dto_1.UpdateErpItemDto, Object]),
    __metadata("design:returntype", void 0)
], ErpItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ERP item (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP item deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpItemsController.prototype, "remove", null);
exports.ErpItemsController = ErpItemsController = __decorate([
    (0, swagger_1.ApiTags)('ERP Items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/items'),
    __metadata("design:paramtypes", [erp_items_service_1.ErpItemsService])
], ErpItemsController);
//# sourceMappingURL=erp-items.controller.js.map