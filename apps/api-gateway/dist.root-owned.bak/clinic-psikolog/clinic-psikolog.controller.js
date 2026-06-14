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
exports.ClinicPsikologController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const clinic_psikolog_service_1 = require("./clinic-psikolog.service");
const create_psikolog_dto_1 = require("./dto/create-psikolog.dto");
const query_psikolog_dto_1 = require("./dto/query-psikolog.dto");
const update_psikolog_dto_1 = require("./dto/update-psikolog.dto");
let ClinicPsikologController = class ClinicPsikologController {
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
    findMe(req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Unauthorized — userId tidak ada di JWT');
        }
        return this.service.findByUserId(userId);
    }
    myStats(req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Unauthorized — userId tidak ada di JWT');
        }
        return this.service.getMyStats(userId);
    }
    myDashboardStats(req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Unauthorized — userId tidak ada di JWT');
        }
        return this.service.getDashboardStats(userId);
    }
    updateMe(body, req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Unauthorized — userId tidak ada di JWT');
        }
        return this.service.updateMe(userId, body);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    updateMyAvailability(body, req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Unauthorized — userId tidak ada di JWT');
        }
        return this.service.updateOwnAvailability(userId, body.weeklyAvailability ?? {});
    }
    listMyDateOverrides(from, to, req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId)
            throw new common_1.BadRequestException('Unauthorized');
        return this.service.listOwnDateOverrides(userId, from, to);
    }
    upsertMyDateOverride(body, req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId)
            throw new common_1.BadRequestException('Unauthorized');
        if (!body?.date)
            throw new common_1.BadRequestException('Field "date" wajib (format YYYY-MM-DD)');
        return this.service.upsertOwnDateOverride(userId, body);
    }
    deleteMyDateOverride(date, req) {
        const userId = req.user?.sub ?? req.user?.id;
        if (!userId)
            throw new common_1.BadRequestException('Unauthorized');
        return this.service.deleteOwnDateOverride(userId, date);
    }
    listDateOverridesByUser(userId, from, to) {
        return this.service.listDateOverridesByUser(userId, from, to);
    }
    getAvailabilityForDate(userId, date) {
        if (!date)
            throw new common_1.BadRequestException('Query param "date" wajib (format YYYY-MM-DD)');
        return this.service.resolveAvailabilityForDate(userId, date);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(id, req.user?.sub ?? req.user?.id);
    }
};
exports.ClinicPsikologController = ClinicPsikologController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create psikolog (User + ClinicPsikologProfile)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Psikolog created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_psikolog_dto_1.CreatePsikologDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog', 'clinic-owner', 'clinic-resepsionis', 'clinic-marketing'),
    (0, swagger_1.ApiOperation)({ summary: 'List psikolog (paginated)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of psikolog' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_psikolog_dto_1.QueryPsikologDto]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get own psikolog profile (lookup by JWT userId)',
        description: 'Dipakai oleh /psikolog/profile page supaya psikolog tidak perlu tahu psikolog.id sendiri.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "findMe", null);
__decorate([
    (0, common_1.Get)('me/stats'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistik 30 hari terakhir untuk psikolog yang login',
        description: 'Return { sesi30Hari, klienAktif, kehadiran, ratingKlien? }. Source: clinic_booking aggregations.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "myStats", null);
__decorate([
    (0, common_1.Get)('me/dashboard-stats'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Dashboard psikolog: today + week + queue (catatan/paket habis)',
        description: 'Return { today: {total,completed,inProgress,upcoming,cancelled}, week: {data[7],total,startDate}, klienAktif, catatanTertunda, pendingNotes[], packageEndingSoon[], anchorDate }. Timezone: Asia/Jakarta.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "myDashboardStats", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit own profile (subset: fullName, title, bio, color)',
        description: 'Psikolog hanya boleh edit field non-sensitive sendiri. Email/license/' +
            'defaultSlots/specialty/isActive admin-only (via PATCH /:id).',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-psikolog', 'clinic-owner', 'clinic-resepsionis', 'clinic-marketing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one psikolog detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Psikolog detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('me/availability'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Psikolog set jadwal availability sendiri (self-service)',
        description: 'Body: { weeklyAvailability: { monday: { isOpen, slotIndices? }, ... } }',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "updateMyAvailability", null);
__decorate([
    (0, common_1.Get)('me/date-overrides'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'List override per-tanggal psikolog (self-service)',
        description: 'Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD untuk batasi range. Kalau kosong, return semua.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "listMyDateOverrides", null);
__decorate([
    (0, common_1.Post)('me/date-overrides'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upsert override per-tanggal (psikolog set cuti / makeup / jadwal khusus)',
        description: 'Body: { date: "YYYY-MM-DD", isOpen: bool, slotIndices?: number[]|null, reason?: string }',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "upsertMyDateOverride", null);
__decorate([
    (0, common_1.Delete)('me/date-overrides/:date'),
    (0, roles_decorator_1.Roles)('clinic-psikolog'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus override per-tanggal (revert ke weeklyAvailability)',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "deleteMyDateOverride", null);
__decorate([
    (0, common_1.Get)('by-user/:userId/date-overrides'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis', 'clinic-psikolog', 'clinic-owner'),
    (0, swagger_1.ApiOperation)({
        summary: 'List override per-tanggal untuk psikolog tertentu (admin/wizard)',
        description: 'Mirror /me/date-overrides tapi terima userId eksplisit. Dipakai booking wizard supaya DateStrip render hari yang di-override sebagai available. Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "listDateOverridesByUser", null);
__decorate([
    (0, common_1.Get)('by-user/:userId/availability-for-date'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis', 'clinic-psikolog', 'clinic-owner'),
    (0, swagger_1.ApiOperation)({
        summary: 'Resolve effective availability untuk psikolog di tanggal tertentu',
        description: 'Merge date override (priority) + weeklyAvailability (fallback). Dipakai booking wizard untuk preview slot mana yang available. Query: ?date=YYYY-MM-DD',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "getAvailabilityForDate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update psikolog' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Psikolog updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_psikolog_dto_1.UpdatePsikologDto, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete psikolog' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Psikolog deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicPsikologController.prototype, "remove", null);
exports.ClinicPsikologController = ClinicPsikologController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Psikolog'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/psikolog'),
    __metadata("design:paramtypes", [clinic_psikolog_service_1.ClinicPsikologService])
], ClinicPsikologController);
//# sourceMappingURL=clinic-psikolog.controller.js.map