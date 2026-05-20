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
exports.UserWorksiteService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
let UserWorksiteService = class UserWorksiteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAssignedWorksites(hrUserId) {
        const [primaryRows, extraRows] = await Promise.all([
            this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT
          w.id,
          w.name,
          w.code,
          w.latitude,
          w.longitude,
          w.radius_meters AS "radiusMeters"
        FROM public.hr_users hu
        JOIN public.hr_worksites w ON w.id = hu.default_worksite_id
        WHERE hu.id = ${hrUserId}
          AND hu.deleted_at IS NULL
          AND w.deleted_at IS NULL
        LIMIT 1
      `),
            this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT
          w.id,
          w.name,
          w.code,
          w.latitude,
          w.longitude,
          w.radius_meters AS "radiusMeters"
        FROM public.hr_user_worksites huw
        JOIN public.hr_worksites w ON w.id = huw.worksite_id
        WHERE huw.user_id = ${hrUserId}
          AND huw.deleted_at IS NULL
          AND w.deleted_at IS NULL
        ORDER BY huw.id ASC
      `),
        ]);
        const map = new Map();
        const primary = primaryRows[0];
        if (primary) {
            map.set(primary.id, {
                ...primary,
                isPrimary: true,
            });
        }
        for (const row of extraRows) {
            if (!map.has(row.id)) {
                map.set(row.id, {
                    ...row,
                    isPrimary: false,
                });
            }
        }
        return Array.from(map.values()).sort((a, b) => {
            if (a.isPrimary !== b.isPrimary) {
                return a.isPrimary ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
    }
    async getAssignedWorksiteMap(hrUserIds) {
        const uniqueHrUserIds = Array.from(new Set(hrUserIds.filter((value) => Number.isFinite(value) && value > 0)));
        if (uniqueHrUserIds.length === 0) {
            return new Map();
        }
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      WITH assigned AS (
        SELECT
          hu.id AS "hrUserId",
          hu.default_worksite_id AS "worksiteId",
          hu.created_at AS "assignedAt",
          true AS "isPrimary"
        FROM public.hr_users hu
        WHERE hu.deleted_at IS NULL
          AND hu.default_worksite_id IS NOT NULL
          AND hu.id IN (${client_1.Prisma.join(uniqueHrUserIds)})
        UNION ALL
        SELECT
          huw.user_id AS "hrUserId",
          huw.worksite_id AS "worksiteId",
          huw.assigned_at AS "assignedAt",
          false AS "isPrimary"
        FROM public.hr_user_worksites huw
        WHERE huw.deleted_at IS NULL
          AND huw.user_id IN (${client_1.Prisma.join(uniqueHrUserIds)})
      )
      SELECT
        a."hrUserId",
        w.id AS "worksiteId",
        w.name AS "worksiteName",
        w.code AS "worksiteCode",
        w.radius_meters AS "radiusMeters",
        a."isPrimary",
        a."assignedAt"
      FROM assigned a
      JOIN public.hr_worksites w ON w.id = a."worksiteId"
      WHERE w.deleted_at IS NULL
      ORDER BY a."hrUserId" ASC, a."isPrimary" DESC, a."assignedAt" ASC, w.name ASC
    `);
        const result = new Map();
        for (const row of rows) {
            if (!row.worksiteId) {
                continue;
            }
            const current = result.get(row.hrUserId) ?? [];
            if (current.some((worksite) => worksite.id === row.worksiteId)) {
                continue;
            }
            current.push({
                id: Number(row.worksiteId),
                name: String(row.worksiteName ?? ''),
                code: String(row.worksiteCode ?? ''),
                radiusMeters: Number(row.radiusMeters ?? 0),
                isPrimary: Boolean(row.isPrimary),
            });
            result.set(row.hrUserId, current);
        }
        for (const [hrUserId, worksites] of result) {
            worksites.sort((a, b) => {
                if (a.isPrimary !== b.isPrimary) {
                    return a.isPrimary ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
            result.set(hrUserId, worksites);
        }
        return result;
    }
    async syncAssignedWorksites(targetHrUserId, worksiteIds, actorId) {
        const uniqueWorksiteIds = Array.from(new Set(worksiteIds.filter((value) => Number.isFinite(value) && value > 0)));
        if (uniqueWorksiteIds.length === 0) {
            throw new common_1.BadRequestException('Pilih minimal satu tempat kerja.');
        }
        const activeWorksites = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND id IN (${client_1.Prisma.join(uniqueWorksiteIds)})
    `);
        if (activeWorksites.length !== uniqueWorksiteIds.length) {
            throw new common_1.BadRequestException('Salah satu tempat kerja tidak valid atau sudah tidak aktif.');
        }
        const primaryWorksiteId = uniqueWorksiteIds[0];
        const insertAssignments = uniqueWorksiteIds.map((worksiteId) => this.prisma.$executeRaw(client_1.Prisma.sql `
        INSERT INTO public.hr_user_worksites (
          user_id,
          worksite_id,
          assigned_at,
          created_at,
          created_by,
          updated_by
        )
        VALUES (
          ${targetHrUserId},
          ${worksiteId},
          now(),
          now(),
          ${actorId},
          ${actorId}
        )
      `));
        await this.prisma.$transaction([
            this.prisma.$executeRaw(client_1.Prisma.sql `
        UPDATE public.hr_users
        SET
          default_worksite_id = ${primaryWorksiteId},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${targetHrUserId}
      `),
            this.prisma.$executeRaw(client_1.Prisma.sql `
        UPDATE public.hr_user_worksites
        SET
          deleted_at = now(),
          deleted_by = ${actorId},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE user_id = ${targetHrUserId}
          AND deleted_at IS NULL
      `),
            ...insertAssignments,
        ]);
    }
    async getAttendanceUsers(authUser) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Daftar pegawai hanya tersedia untuk manager atau admin.');
        }
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        hu.face_enrollment_status AS "faceEnrollmentStatus",
        hu.employee_role_type AS "employeeRoleType",
        hu.is_active AS "isActive",
        u.username,
        u.full_name AS "fullName",
        hw.name AS "defaultWorksiteName"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      WHERE hu.deleted_at IS NULL
        AND hu.is_active = true
      ORDER BY coalesce(u.full_name, u.username) ASC, u.username ASC
    `);
        const assignedWorksites = await this.getAssignedWorksiteMap(rows.map((row) => Number(row.hrUserId)));
        return {
            success: true,
            data: (0, hr_attendance_helpers_1.normalizeHrDates)(rows.map((row) => ({
                ...row,
                assignedWorksites: assignedWorksites.get(Number(row.hrUserId)) ?? [],
            }))),
        };
    }
    async getUserWorksites(authUser, targetAppUserId) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Daftar tempat kerja hanya tersedia untuk manager atau admin.');
        }
        const profile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, targetAppUserId);
        if (!profile) {
            throw new common_1.NotFoundException('HR attendance profile not found for selected user.');
        }
        const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));
        return {
            success: true,
            data: {
                hrUserId: Number(profile.hrUserId),
                appUserId: Number(profile.appUserId),
                employeeCode: profile.employeeCode,
                fullName: profile.fullName,
                username: profile.username,
                defaultWorksiteId: profile.defaultWorksiteId,
                assignedWorksites: (0, hr_attendance_helpers_1.normalizeHrDates)(assignedWorksites),
            },
        };
    }
    async updateUserWorksites(authUser, targetAppUserId, dto) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Mengubah tempat kerja hanya tersedia untuk manager atau admin.');
        }
        const profile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, targetAppUserId);
        if (!profile) {
            throw new common_1.NotFoundException('HR attendance profile not found for selected user.');
        }
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        await this.syncAssignedWorksites(Number(profile.hrUserId), dto.worksiteIds, actorId);
        const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));
        const updatedProfile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, targetAppUserId);
        return {
            success: true,
            message: 'Tempat kerja pegawai berhasil diperbarui.',
            data: {
                hrUserId: Number(profile.hrUserId),
                appUserId: Number(profile.appUserId),
                defaultWorksiteId: updatedProfile?.defaultWorksiteId ?? null,
                assignedWorksites: (0, hr_attendance_helpers_1.normalizeHrDates)(assignedWorksites),
            },
        };
    }
};
exports.UserWorksiteService = UserWorksiteService;
exports.UserWorksiteService = UserWorksiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserWorksiteService);
//# sourceMappingURL=user-worksite.service.js.map