"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceQueryService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const hr_attendance_snapshot_1 = require("./hr-attendance-snapshot");
const attendance_settings_service_1 = require("./attendance-settings.service");
const worksite_service_1 = require("./worksite.service");
const attendance_dashboard_service_1 = require("./attendance-dashboard.service");
const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;
let AttendanceQueryService = class AttendanceQueryService {
    prisma;
    settingsService;
    worksiteService;
    attendanceDashboardService;
    constructor(prisma, settingsService, worksiteService, attendanceDashboardService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.worksiteService = worksiteService;
        this.attendanceDashboardService = attendanceDashboardService;
    }
    async getAttendanceMe(authUser) {
        const profile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, authUser.id);
        if (!profile) {
            return {
                success: true,
                data: {
                    profile: null,
                    today: null,
                    recentEvents: [],
                    message: 'Current user is not registered in Sentient HR attendance.',
                },
            };
        }
        const assignedWorksites = await this.worksiteService.getAssignedWorksites(Number(profile.hrUserId));
        const todayRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        s.id,
        s.work_date,
        s.clock_in_at,
        s.clock_out_at,
        s.clock_in_status,
        s.clock_out_status,
        s.total_work_minutes,
        win.name AS clock_in_worksite_name,
        wout.name AS clock_out_worksite_name
      FROM public.hr_attendance_sessions s
      LEFT JOIN public.hr_worksites win ON win.id = s.clock_in_worksite_id
      LEFT JOIN public.hr_worksites wout ON wout.id = s.clock_out_worksite_id
      WHERE s.user_id = ${profile.hrUserId}
        AND s.deleted_at IS NULL
        AND s.work_date = CURRENT_DATE
      ORDER BY s.id DESC
      LIMIT 1
    `);
        const recentEvents = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        e.id,
        e.event_type,
        e.event_at,
        e.result,
        e.reason_code,
        e.snapshot_url
      FROM public.hr_attendance_events e
      WHERE e.user_id = ${profile.hrUserId}
        AND e.deleted_at IS NULL
      ORDER BY e.event_at DESC, e.id DESC
      LIMIT 5
    `);
        const autoSubmitEnabled = await this.settingsService.getBooleanSetting('attendance', 'auto_submit_enabled', true);
        const autoSubmitConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'auto_submit_confidence_threshold', 0.9);
        const faceIdentifyConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'face_identify_confidence_threshold', DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY);
        const faceVerifyConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'face_verify_confidence_threshold', DEFAULT_FACE_VERIFY_MIN_SIMILARITY);
        return {
            success: true,
            data: {
                profile: (0, hr_attendance_helpers_1.normalizeHrDates)({
                    ...profile,
                    assignedWorksites,
                }),
                today: (0, hr_attendance_helpers_1.normalizeHrDates)(todayRows[0] ?? null),
                recentEvents: (0, hr_attendance_helpers_1.normalizeHrDates)(recentEvents),
                settings: {
                    autoSubmitEnabled,
                    autoSubmitConfidenceThreshold,
                    faceIdentifyConfidenceThreshold,
                    faceVerifyConfidenceThreshold,
                },
            },
        };
    }
    async getAttendanceHistory(authUser, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const offset = (page - 1) * limit;
        const privileged = (0, hr_attendance_helpers_1.isPrivileged)(authUser.roles);
        const search = query.search?.trim() ?? '';
        const targetAppUserId = query.userId ? (privileged ? query.userId : authUser.id) : null;
        let targetHrUserId = null;
        if (targetAppUserId !== null) {
            const profile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, targetAppUserId);
            if (!profile) {
                return {
                    success: true,
                    data: [],
                    meta: { page, limit, total: 0, totalPages: 1 },
                };
            }
            targetHrUserId = Number(profile.hrUserId);
        }
        else if (!privileged) {
            const profile = await (0, hr_attendance_helpers_1.getHrProfileByAppUserId)(this.prisma, authUser.id);
            if (!profile) {
                return {
                    success: true,
                    data: [],
                    meta: { page, limit, total: 0, totalPages: 1 },
                };
            }
            targetHrUserId = Number(profile.hrUserId);
        }
        const hrUserScopeSql = targetHrUserId !== null ? client_1.Prisma.sql `AND s.user_id = ${targetHrUserId}` : client_1.Prisma.empty;
        const searchSql = search.length > 0
            ? client_1.Prisma.sql `
            AND (
              lower(coalesce(u.full_name, '')) LIKE lower(${`%${search}%`})
              OR lower(coalesce(u.username, '')) LIKE lower(${`%${search}%`})
              OR lower(coalesce(hu.employee_code, '')) LIKE lower(${`%${search}%`})
            )
          `
            : client_1.Prisma.empty;
        const dateFromSql = query.dateFrom
            ? client_1.Prisma.sql `AND s.work_date >= ${query.dateFrom}::date`
            : client_1.Prisma.empty;
        const dateToSql = query.dateTo
            ? client_1.Prisma.sql `AND s.work_date <= ${query.dateTo}::date`
            : client_1.Prisma.empty;
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        s.id,
        s.work_date,
        s.clock_in_at,
        s.clock_out_at,
        s.clock_in_status,
        s.clock_out_status,
        s.total_work_minutes,
        win.name AS clock_in_worksite_name,
        wout.name AS clock_out_worksite_name,
        u.username,
        u.full_name
      FROM public.hr_attendance_sessions s
      JOIN public.hr_users hu ON hu.id = s.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites win ON win.id = s.clock_in_worksite_id
      LEFT JOIN public.hr_worksites wout ON wout.id = s.clock_out_worksite_id
      WHERE s.deleted_at IS NULL
        ${hrUserScopeSql}
        ${searchSql}
        ${dateFromSql}
        ${dateToSql}
      ORDER BY s.work_date DESC, s.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);
        const countRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT count(*)::bigint AS total
      FROM public.hr_attendance_sessions s
      JOIN public.hr_users hu ON hu.id = s.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE s.deleted_at IS NULL
        ${hrUserScopeSql}
        ${searchSql}
        ${dateFromSql}
        ${dateToSql}
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
    getAttendanceDashboard(authUser) {
        return this.attendanceDashboardService.getAttendanceDashboard(authUser);
    }
    async getAttendanceEventSnapshot(authUser, eventId) {
        const privileged = (0, hr_attendance_helpers_1.isPrivileged)(authUser.roles);
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT e.snapshot_url, e.user_id
      FROM public.hr_attendance_events e
      JOIN public.hr_users hu ON hu.id = e.user_id
      WHERE e.id = ${eventId}
        AND e.deleted_at IS NULL
        AND (
          ${privileged}
          OR hu.user_id = ${authUser.id}
        )
      LIMIT 1
    `);
        const row = rows[0];
        if (!row?.snapshot_url) {
            throw new common_1.NotFoundException('Attendance snapshot not found.');
        }
        const baseDir = (0, hr_attendance_snapshot_1.getAttendanceStorageBaseDir)();
        const resolvedFile = (0, hr_attendance_snapshot_1.resolveAttendanceSnapshotPath)(row.snapshot_url, baseDir);
        const resolvedBase = path.resolve(baseDir);
        if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
            throw new Error('Attendance snapshot path is outside the allowed storage root.');
        }
        const buffer = await (0, promises_1.readFile)(resolvedFile).catch(() => null);
        if (!buffer) {
            throw new common_1.NotFoundException('Attendance snapshot file is missing.');
        }
        const extension = path.extname(resolvedFile).toLowerCase();
        const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';
        return {
            buffer,
            mimeType,
            fileName: path.basename(resolvedFile),
        };
    }
};
exports.AttendanceQueryService = AttendanceQueryService;
exports.AttendanceQueryService = AttendanceQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_settings_service_1.AttendanceSettingsService,
        worksite_service_1.WorksiteService,
        attendance_dashboard_service_1.AttendanceDashboardService])
], AttendanceQueryService);
//# sourceMappingURL=attendance-query.service.js.map