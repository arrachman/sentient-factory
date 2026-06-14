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
exports.ClinicWaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const skip_audit_decorator_1 = require("../clinic-audit/decorators/skip-audit.decorator");
const clinic_wa_service_1 = require("./clinic-wa.service");
const wa_dto_1 = require("./dto/wa.dto");
let ClinicWaController = class ClinicWaController {
    service;
    constructor(service) {
        this.service = service;
    }
    createTemplate(dto, req) {
        return this.service.createTemplate(dto, req.user?.sub ?? req.user?.id);
    }
    findAllTemplates(query) {
        return this.service.findAllTemplates(query);
    }
    findOneTemplate(id) {
        return this.service.findOneTemplate(id);
    }
    updateTemplate(id, dto, req) {
        return this.service.updateTemplate(id, dto, req.user?.sub ?? req.user?.id);
    }
    removeTemplate(id, req) {
        return this.service.removeTemplate(id, req.user?.sub ?? req.user?.id);
    }
    findAllLogs(query) {
        return this.service.findAllLogs(query);
    }
    getStats(date) {
        return this.service.getStats(date);
    }
    sendTest(dto, req) {
        return this.service.sendTest(dto, req.user?.sub ?? req.user?.id);
    }
    webhook(body) {
        const dto = {
            id: body['id'] !== undefined && body['id'] !== null ? String(body['id']) : undefined,
            sender: typeof body['sender'] === 'string' ? body['sender'] : undefined,
            status: typeof body['status'] === 'string' ? body['status'] : undefined,
            state: typeof body['state'] === 'string' ? body['state'] : undefined,
            device: typeof body['device'] === 'string' ? body['device'] : undefined,
            reason: typeof body['reason'] === 'string' ? body['reason'] : undefined,
        };
        return this.service.handleWebhook(dto);
    }
};
exports.ClinicWaController = ClinicWaController;
__decorate([
    (0, common_1.Post)('template'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create WA template' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wa_dto_1.CreateTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('template'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wa_dto_1.QueryTemplateDto]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "findAllTemplates", null);
__decorate([
    (0, common_1.Get)('template/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "findOneTemplate", null);
__decorate([
    (0, common_1.Patch)('template/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, wa_dto_1.UpdateTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('template/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "removeTemplate", null);
__decorate([
    (0, common_1.Get)('log'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wa_dto_1.QueryWaLogDto]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "findAllLogs", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'WA daily stats (sentToday, readToday, failedToday, readRate)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('send-test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Test send WA via Fonnte (admin only, untuk debug)' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wa_dto_1.SendTestDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "sendTest", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, skip_audit_decorator_1.SkipAudit)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fonnte webhook receiver — public endpoint, no JWT' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicWaController.prototype, "webhook", null);
exports.ClinicWaController = ClinicWaController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — WhatsApp'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinic/wa'),
    __metadata("design:paramtypes", [clinic_wa_service_1.ClinicWaService])
], ClinicWaController);
//# sourceMappingURL=clinic-wa.controller.js.map