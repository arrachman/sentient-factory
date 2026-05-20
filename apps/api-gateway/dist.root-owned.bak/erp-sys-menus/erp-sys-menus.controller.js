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
exports.ErpSysMenusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const erp_jwt_auth_guard_1 = require("../erp-auth/guards/erp-jwt-auth.guard");
const create_erp_sys_menu_dto_1 = require("./dto/create-erp-sys-menu.dto");
const query_erp_sys_menu_dto_1 = require("./dto/query-erp-sys-menu.dto");
const update_erp_sys_menu_dto_1 = require("./dto/update-erp-sys-menu.dto");
const erp_sys_menus_service_1 = require("./erp-sys-menus.service");
let ErpSysMenusController = class ErpSysMenusController {
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
    getTree() {
        return this.service.getTree();
    }
    getMyMenus(req) {
        return this.service.getMyMenus(req.user.id, req.user.erpLevel);
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
exports.ErpSysMenusController = ErpSysMenusController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP menu item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP menu created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_sys_menu_dto_1.CreateErpSysMenuDto, Object]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List ERP menus (flat)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Flat list of ERP menus' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_sys_menu_dto_1.QueryErpSysMenuDto]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP menu tree (nested)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nested menu tree' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('my-menus'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menus accessible to the current ERP user (role-filtered)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu tree filtered by user role' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "getMyMenus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP menu detail' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'ERP menu not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP menu updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_sys_menu_dto_1.UpdateErpSysMenuDto, Object]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete ERP menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP menu deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpSysMenusController.prototype, "remove", null);
exports.ErpSysMenusController = ErpSysMenusController = __decorate([
    (0, swagger_1.ApiTags)('ERP Sys Menus'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(erp_jwt_auth_guard_1.ErpJwtAuthGuard),
    (0, common_1.Controller)('erp/sys-menus'),
    __metadata("design:paramtypes", [erp_sys_menus_service_1.ErpSysMenusService])
], ErpSysMenusController);
//# sourceMappingURL=erp-sys-menus.controller.js.map