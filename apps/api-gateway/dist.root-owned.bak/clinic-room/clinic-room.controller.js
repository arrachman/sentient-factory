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
exports.ClinicRoomController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clinic_room_service_1 = require("./clinic-room.service");
const clinic_room_dto_1 = require("./dto/clinic-room.dto");
const ALL_ROLES = [
    'clinic-admin',
    'clinic-psikolog',
    'clinic-owner',
    'clinic-resepsionis',
    'clinic-marketing',
];
let ClinicRoomController = class ClinicRoomController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.sub ?? req.user?.id);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(id, req.user?.sub ?? req.user?.id);
    }
};
exports.ClinicRoomController = ClinicRoomController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create room' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_room_dto_1.CreateRoomDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicRoomController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...ALL_ROLES),
    (0, throttler_1.SkipThrottle)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_room_dto_1.QueryRoomDto]),
    __metadata("design:returntype", void 0)
], ClinicRoomController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(...ALL_ROLES),
    (0, throttler_1.SkipThrottle)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicRoomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_room_dto_1.UpdateRoomDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicRoomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicRoomController.prototype, "remove", null);
exports.ClinicRoomController = ClinicRoomController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Room'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/room'),
    __metadata("design:paramtypes", [clinic_room_service_1.ClinicRoomService])
], ClinicRoomController);
//# sourceMappingURL=clinic-room.controller.js.map