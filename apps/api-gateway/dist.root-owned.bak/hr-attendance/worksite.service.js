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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorksiteService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const user_worksite_service_1 = require("./user-worksite.service");
let WorksiteService = class WorksiteService {
    prisma;
    userWorksiteService;
    constructor(prisma, userWorksiteService) {
        this.prisma = prisma;
        this.userWorksiteService = userWorksiteService;
    }
    getAssignedWorksites(hrUserId) {
        return this.userWorksiteService.getAssignedWorksites(hrUserId);
    }
    getAssignedWorksiteMap(hrUserIds) {
        return this.userWorksiteService.getAssignedWorksiteMap(hrUserIds);
    }
    getAttendanceUsers(authUser) {
        return this.userWorksiteService.getAttendanceUsers(authUser);
    }
    getUserWorksites(authUser, targetAppUserId) {
        return this.userWorksiteService.getUserWorksites(authUser, targetAppUserId);
    }
    updateUserWorksites(authUser, targetAppUserId, dto) {
        return this.userWorksiteService.updateUserWorksites(authUser, targetAppUserId, dto);
    }
    resolveWorksiteForCoordinates(worksites, latitude, longitude) {
        if (!worksites.length || latitude == null || longitude == null) {
            return {
                worksite: worksites[0] ?? null,
                distanceMeters: null,
                insideGeofence: false,
            };
        }
        const scored = worksites
            .map((worksite) => ({
            worksite,
            distanceMeters: this.calculateDistanceMeters(latitude, longitude, worksite.latitude, worksite.longitude),
        }))
            .sort((a, b) => a.distanceMeters - b.distanceMeters);
        const inside = scored.filter((entry) => entry.distanceMeters <= entry.worksite.radiusMeters);
        return {
            worksite: inside[0]?.worksite ?? scored[0]?.worksite ?? null,
            distanceMeters: inside[0]?.distanceMeters ?? scored[0]?.distanceMeters ?? null,
            insideGeofence: inside.length > 0,
        };
    }
    calculateDistanceMeters(lat1, lon1, lat2, lon2) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const earthRadius = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadius * c);
    }
    async getWorksites(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const offset = (page - 1) * limit;
        const search = query.search?.trim() ?? '';
        const searchClause = search
            ? client_1.Prisma.sql `AND (w.name ILIKE ${`%${search}%`} OR w.code ILIKE ${`%${search}%`})`
            : client_1.Prisma.empty;
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        w.id,
        w.name,
        w.code,
        w.latitude,
        w.longitude,
        w.radius_meters AS "radiusMeters",
        w.is_active AS "isActive",
        w.created_at AS "createdAt"
      FROM public.hr_worksites w
      WHERE w.deleted_at IS NULL
      ${searchClause}
      ORDER BY w.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);
        const countRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT count(*)::bigint AS total
      FROM public.hr_worksites w
      WHERE w.deleted_at IS NULL
      ${searchClause}
    `);
        const total = Number(countRows[0]?.total ?? 0);
        return {
            success: true,
            data: (0, hr_attendance_helpers_1.normalizeHrDates)(rows),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async createWorksite(dto, authUser) {
        const exists = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND code = ${dto.code}
      LIMIT 1
    `);
        if (exists.length > 0) {
            throw new common_1.BadRequestException('Worksite code already exists.');
        }
        await this.prisma.$executeRaw(client_1.Prisma.sql `
      INSERT INTO public.hr_worksites (
        name,
        code,
        latitude,
        longitude,
        radius_meters,
        is_active,
        created_at,
        created_by,
        updated_by
      )
      VALUES (
        ${dto.name},
        ${dto.code},
        ${dto.latitude},
        ${dto.longitude},
        ${dto.radiusMeters},
        ${dto.isActive ?? true},
        now(),
        ${(0, audit_user_util_1.toAuditUserId)(authUser.id)},
        ${(0, audit_user_util_1.toAuditUserId)(authUser.id)}
      )
    `);
        return { success: true, message: 'Worksite created.' };
    }
    async updateWorksite(id, dto, authUser) {
        const existing = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Worksite not found.');
        }
        if (dto.code) {
            const duplicate = await this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT id
        FROM public.hr_worksites
        WHERE deleted_at IS NULL
          AND code = ${dto.code}
          AND id <> ${id}
        LIMIT 1
      `);
            if (duplicate.length > 0) {
                throw new common_1.BadRequestException('Worksite code already exists.');
            }
        }
        const sets = [];
        if (typeof dto.name !== 'undefined')
            sets.push(client_1.Prisma.sql `name = ${dto.name}`);
        if (typeof dto.code !== 'undefined')
            sets.push(client_1.Prisma.sql `code = ${dto.code}`);
        if (typeof dto.latitude !== 'undefined')
            sets.push(client_1.Prisma.sql `latitude = ${dto.latitude}`);
        if (typeof dto.longitude !== 'undefined')
            sets.push(client_1.Prisma.sql `longitude = ${dto.longitude}`);
        if (typeof dto.radiusMeters !== 'undefined')
            sets.push(client_1.Prisma.sql `radius_meters = ${dto.radiusMeters}`);
        if (typeof dto.isActive !== 'undefined')
            sets.push(client_1.Prisma.sql `is_active = ${dto.isActive}`);
        sets.push(client_1.Prisma.sql `updated_at = now()`);
        sets.push(client_1.Prisma.sql `updated_by = ${(0, audit_user_util_1.toAuditUserId)(authUser.id)}`);
        await this.prisma.$executeRaw(client_1.Prisma.sql `
      UPDATE public.hr_worksites
      SET ${client_1.Prisma.join(sets, ', ')}
      WHERE id = ${id}
    `);
        return { success: true, message: 'Worksite updated.' };
    }
    async removeWorksite(id, authUser) {
        const existing = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Worksite not found.');
        }
        await this.prisma.$executeRaw(client_1.Prisma.sql `
      UPDATE public.hr_worksites
      SET
        deleted_at = now(),
        deleted_by = ${(0, audit_user_util_1.toAuditUserId)(authUser.id)},
        updated_at = now(),
        updated_by = ${(0, audit_user_util_1.toAuditUserId)(authUser.id)}
      WHERE id = ${id}
    `);
        return { success: true, message: 'Worksite deleted.' };
    }
};
exports.WorksiteService = WorksiteService;
exports.WorksiteService = WorksiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_worksite_service_1.UserWorksiteService])
], WorksiteService);
//# sourceMappingURL=worksite.service.js.map