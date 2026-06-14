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
exports.ClinicBookingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const idempotency_interceptor_1 = require("../common/interceptors/idempotency.interceptor");
const clinic_booking_service_1 = require("./clinic-booking.service");
const clinic_booking_dto_1 = require("./dto/clinic-booking.dto");
const audit_action_decorator_1 = require("../clinic-audit/decorators/audit-action.decorator");
const READ_ROLES = ['clinic-admin', 'clinic-psikolog', 'clinic-resepsionis', 'clinic-owner'];
const WRITE_ROLES = ['clinic-admin', 'clinic-resepsionis'];
let ClinicBookingController = class ClinicBookingController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.sub ?? req.user?.id);
    }
    createPackage(dto, req) {
        return this.service.createPackage(dto, req.user?.sub ?? req.user?.id);
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
    start(id, req) {
        return this.service.start(id, req.user?.sub ?? req.user?.id);
    }
    complete(id, req) {
        return this.service.complete(id, req.user?.sub ?? req.user?.id);
    }
    cancel(id, dto, req) {
        return this.service.cancel(id, dto, req.user?.sub ?? req.user?.id);
    }
    reschedule(id, dto, req) {
        return this.service.reschedule(id, dto, req.user?.sub ?? req.user?.id);
    }
    addNote(id, dto, req) {
        return this.service.addNote(id, dto.noteText, req.user?.sub ?? req.user?.id);
    }
    listNotes(id) {
        return this.service.listNotes(id);
    }
    sendReminder(id, dto, req) {
        return this.service.sendReminder(id, dto?.templateName ?? 'Pengingat H-1', req.user?.sub ?? req.user?.id);
    }
};
exports.ClinicBookingController = ClinicBookingController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create booking (supports Idempotency-Key header)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('package'),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, audit_action_decorator_1.AuditAction)('create-package'),
    (0, swagger_1.ApiOperation)({ summary: 'Create multi-session package booking (atomic, all-or-nothing)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_booking_dto_1.CreatePackageBookingDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...READ_ROLES),
    (0, throttler_1.SkipThrottle)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_booking_dto_1.QueryBookingDto]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(...READ_ROLES),
    (0, throttler_1.SkipThrottle)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_booking_dto_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, audit_action_decorator_1.AuditAction)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark session started (psikolog)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, audit_action_decorator_1.AuditAction)('complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark session complete (psikolog)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    (0, audit_action_decorator_1.AuditAction)('cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel booking' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_booking_dto_1.CancelBookingDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/reschedule'),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    (0, audit_action_decorator_1.AuditAction)('reschedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule booking (slot/psikolog/room)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_booking_dto_1.RescheduleBookingDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Post)(':id/note'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, audit_action_decorator_1.AuditAction)('note'),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah clinical note untuk booking (psikolog only)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "addNote", null);
__decorate([
    (0, common_1.Get)(':id/note'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, swagger_1.ApiOperation)({ summary: 'List clinical notes untuk booking' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "listNotes", null);
__decorate([
    (0, common_1.Post)(':id/send-reminder'),
    (0, roles_decorator_1.Roles)(...WRITE_ROLES),
    (0, audit_action_decorator_1.AuditAction)('send_reminder'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send manual WA reminder ke klien (template Pengingat H-1 atau 30-min)',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicBookingController.prototype, "sendReminder", null);
exports.ClinicBookingController = ClinicBookingController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Booking'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/booking'),
    __metadata("design:paramtypes", [clinic_booking_service_1.ClinicBookingService])
], ClinicBookingController);
//# sourceMappingURL=clinic-booking.controller.js.map