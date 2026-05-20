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
exports.ClinicClientController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clinic_client_service_1 = require("./clinic-client.service");
const clinic_client_dto_1 = require("./dto/clinic-client.dto");
let ClinicClientController = class ClinicClientController {
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
exports.ClinicClientController = ClinicClientController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, swagger_1.ApiOperation)({ summary: 'Create client (intake form)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog', 'clinic-resepsionis'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_client_dto_1.QueryClientDto]),
    __metadata("design:returntype", void 0)
], ClinicClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog', 'clinic-resepsionis'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_client_dto_1.UpdateClientDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicClientController.prototype, "remove", null);
exports.ClinicClientController = ClinicClientController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Client'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/client'),
    __metadata("design:paramtypes", [clinic_client_service_1.ClinicClientService])
], ClinicClientController);
//# sourceMappingURL=clinic-client.controller.js.map