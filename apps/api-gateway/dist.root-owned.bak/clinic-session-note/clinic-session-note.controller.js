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
exports.ClinicSessionNoteController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clinic_session_note_service_1 = require("./clinic-session-note.service");
const clinic_session_note_dto_1 = require("./dto/clinic-session-note.dto");
let ClinicSessionNoteController = class ClinicSessionNoteController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
    findAll(query, req) {
        return this.service.findAll(query, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
    findByBooking(bookingId, req) {
        return this.service.findByBooking(bookingId, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
    remove(id, req) {
        return this.service.remove(id, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
    }
};
exports.ClinicSessionNoteController = ClinicSessionNoteController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, swagger_1.ApiOperation)({ summary: 'Create clinical session note' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_session_note_dto_1.CreateSessionNoteDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, swagger_1.ApiOperation)({ summary: 'List session notes (privacy-filtered)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clinic_session_note_dto_1.QuerySessionNoteDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notes for a booking' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('bookingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "findByBooking", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, clinic_session_note_dto_1.UpdateSessionNoteDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicSessionNoteController.prototype, "remove", null);
exports.ClinicSessionNoteController = ClinicSessionNoteController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Session Notes (Clinical)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/session-note'),
    __metadata("design:paramtypes", [clinic_session_note_service_1.ClinicSessionNoteService])
], ClinicSessionNoteController);
//# sourceMappingURL=clinic-session-note.controller.js.map