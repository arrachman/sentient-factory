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
exports.MasterDataRolesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_master_data_role_dto_1 = require("./dto/create-master-data-role.dto");
const query_master_data_role_dto_1 = require("./dto/query-master-data-role.dto");
const update_master_data_role_dto_1 = require("./dto/update-master-data-role.dto");
const update_role_permissions_dto_1 = require("./dto/update-role-permissions.dto");
const master_data_roles_service_1 = require("./master-data-roles.service");
let MasterDataRolesController = class MasterDataRolesController {
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
    getPermissions(id) {
        return this.service.getRolePermissions(id);
    }
    updatePermissions(id, dto, req) {
        return this.service.updateRolePermissions(id, dto, req.user?.id);
    }
};
exports.MasterDataRolesController = MasterDataRolesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create master data role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Master data role created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_master_data_role_dto_1.CreateMasterDataRoleDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get master data role list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of master data role' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_master_data_role_dto_1.QueryMasterDataRoleDto]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one master data role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data role detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update master data role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data role updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_master_data_role_dto_1.UpdateMasterDataRoleDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete master data role (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Master data role deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assigned permission IDs by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assigned permission IDs' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Put)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign/unassign permissions by role (sync)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role permissions updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_role_permissions_dto_1.UpdateRolePermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], MasterDataRolesController.prototype, "updatePermissions", null);
exports.MasterDataRolesController = MasterDataRolesController = __decorate([
    (0, swagger_1.ApiTags)('Master Data Role'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('master-data-roles'),
    __metadata("design:paramtypes", [master_data_roles_service_1.MasterDataRolesService])
], MasterDataRolesController);
//# sourceMappingURL=master-data-roles.controller.js.map