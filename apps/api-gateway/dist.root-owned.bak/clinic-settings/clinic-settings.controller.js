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
exports.ClinicSettingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clinic_settings_service_1 = require("./clinic-settings.service");
const clinic_settings_dto_1 = require("./dto/clinic-settings.dto");
let ClinicSettingsController = class ClinicSettingsController {
    service;
    constructor(service) {
        this.service = service;
    }
    get() {
        return this.service.get();
    }
    update(dto, req) {
        return this.service.update(dto, req.user?.sub ?? req.user?.id);
    }
};
exports.ClinicSettingsController = ClinicSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-owner', 'clinic-psikolog', 'clinic-resepsionis', 'clinic-marketing'),
    (0, throttler_1.SkipThrottle)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get clinic settings (single row, read-only untuk semua clinic role)',
        description: 'Semua clinic-* role butuh baca settings: admin/owner (CRUD/dashboard), psikolog (set jadwal availability — perlu lihat slot), resepsionis (booking wizard — perlu lihat slot), marketing (context). Hanya admin yang boleh PATCH.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClinicSettingsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update clinic settings (partial)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_settings_dto_1.UpdateSettingsDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicSettingsController.prototype, "update", null);
exports.ClinicSettingsController = ClinicSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/settings'),
    __metadata("design:paramtypes", [clinic_settings_service_1.ClinicSettingsService])
], ClinicSettingsController);
//# sourceMappingURL=clinic-settings.controller.js.map