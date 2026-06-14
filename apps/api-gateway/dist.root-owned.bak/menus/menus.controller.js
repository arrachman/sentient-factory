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
exports.MenusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const query_menu_dto_1 = require("./dto/query-menu.dto");
const update_menu_sort_batch_dto_1 = require("./dto/update-menu-sort-batch.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const menus_service_1 = require("./menus.service");
let MenusController = class MenusController {
    menusService;
    constructor(menusService) {
        this.menusService = menusService;
    }
    create(dto, req) {
        return this.menusService.create(dto, req.user?.id);
    }
    findAll(query) {
        return this.menusService.findAll(query);
    }
    async getSidebar(req) {
        const userId = req.user?.id;
        const menus = await this.menusService.getSidebarByUserId(userId);
        return {
            success: true,
            data: menus,
        };
    }
    findOne(id) {
        return this.menusService.findOne(id);
    }
    updateSortBatch(dto, req) {
        return this.menusService.updateSortBatch(dto, req.user?.id);
    }
    update(id, dto, req) {
        return this.menusService.update(id, dto, req.user?.id);
    }
    remove(id, req) {
        return this.menusService.remove(id, req.user?.id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create menu' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Menu created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto, Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get menu list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of menus' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_menu_dto_1.QueryMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sidebar'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sidebar menu tree by authenticated user roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sidebar menu list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "getSidebar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('sort-batch'),
    (0, swagger_1.ApiOperation)({ summary: 'Batch update menu sort order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu sort order updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_menu_sort_batch_dto_1.UpdateMenuSortBatchDto, Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "updateSortBatch", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_menu_dto_1.UpdateMenuDto, Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete menu (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, swagger_1.ApiTags)('Menus'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map