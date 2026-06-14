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
exports.ErpRolesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const assign_menus_dto_1 = require("./dto/assign-menus.dto");
const assign_permissions_dto_1 = require("./dto/assign-permissions.dto");
const create_erp_role_dto_1 = require("./dto/create-erp-role.dto");
const query_erp_role_dto_1 = require("./dto/query-erp-role.dto");
const update_erp_role_dto_1 = require("./dto/update-erp-role.dto");
const erp_roles_service_1 = require("./erp-roles.service");
let ErpRolesController = class ErpRolesController {
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
    assignPermissions(id, dto, req) {
        return this.service.assignPermissions(BigInt(id), dto, req.user?.id);
    }
    getPermissions(id) {
        return this.service.getPermissions(BigInt(id));
    }
    assignMenus(id, dto, req) {
        return this.service.assignMenus(BigInt(id), dto, req.user?.id);
    }
    getMenus(id) {
        return this.service.getMenus(BigInt(id));
    }
};
exports.ErpRolesController = ErpRolesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP role created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_role_dto_1.CreateErpRoleDto, Object]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List ERP roles (paginated)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP roles' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_role_dto_1.QueryErpRoleDto]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP role detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP role updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_role_dto_1.UpdateErpRoleDto, Object]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete ERP role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP role deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign (replace) permissions for a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions assigned' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_permissions_dto_1.AssignPermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permissions assigned to a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role permissions list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Post)(':id/menus'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign (replace) menus for a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menus assigned' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_menus_dto_1.AssignMenusDto, Object]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "assignMenus", null);
__decorate([
    (0, common_1.Get)(':id/menus'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menus assigned to a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role menus list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpRolesController.prototype, "getMenus", null);
exports.ErpRolesController = ErpRolesController = __decorate([
    (0, swagger_1.ApiTags)('ERP Roles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/roles'),
    __metadata("design:paramtypes", [erp_roles_service_1.ErpRolesService])
], ErpRolesController);
//# sourceMappingURL=erp-roles.controller.js.map