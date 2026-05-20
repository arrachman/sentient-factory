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
exports.ErpPartnerCategoriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_erp_partner_category_dto_1 = require("./dto/create-erp-partner-category.dto");
const query_erp_partner_category_dto_1 = require("./dto/query-erp-partner-category.dto");
const update_erp_partner_category_dto_1 = require("./dto/update-erp-partner-category.dto");
const erp_partner_categories_service_1 = require("./erp-partner-categories.service");
let ErpPartnerCategoriesController = class ErpPartnerCategoriesController {
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
exports.ErpPartnerCategoriesController = ErpPartnerCategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP partner category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP partner category created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_partner_category_dto_1.CreateErpPartnerCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnerCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP partner category list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP partner categories' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_partner_category_dto_1.QueryErpPartnerCategoryDto]),
    __metadata("design:returntype", void 0)
], ErpPartnerCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP partner category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner category detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpPartnerCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP partner category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner category updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_partner_category_dto_1.UpdateErpPartnerCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnerCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ERP partner category (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner category deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnerCategoriesController.prototype, "remove", null);
exports.ErpPartnerCategoriesController = ErpPartnerCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('ERP Partner Categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/partner-categories'),
    __metadata("design:paramtypes", [erp_partner_categories_service_1.ErpPartnerCategoriesService])
], ErpPartnerCategoriesController);
//# sourceMappingURL=erp-partner-categories.controller.js.map