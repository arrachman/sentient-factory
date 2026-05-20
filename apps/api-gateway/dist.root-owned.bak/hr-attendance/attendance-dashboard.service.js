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
exports.AttendanceDashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const attendance_settings_service_1 = require("./attendance-settings.service");
const worksite_service_1 = require("./worksite.service");
const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;
let AttendanceDashboardService = class AttendanceDashboardService {
    prisma;
    settingsService;
    worksiteService;
    constructor(prisma, settingsService, worksiteService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.worksiteService = worksiteService;
    }
    async getAttendanceDashboard(authUser) {
        if (!authUser.roles?.includes('admin')) {
            throw new common_1.ForbiddenException('Dashboard absensi hanya tersedia untuk admin.');
        }
        const autoSubmitEnabled = await this.settingsService.getBooleanSetting('attendance', 'auto_submit_enabled', true);
        const autoSubmitConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'auto_submit_confidence_threshold', 0.9);
        const faceIdentifyConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'face_identify_confidence_threshold', DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY);
        const faceVerifyConfidenceThreshold = await this.settingsService.getNumberSetting('attendance', 'face_verify_confidence_threshold', DEFAULT_FACE_VERIFY_MIN_SIMILARITY);
        const summaryRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        (SELECT count(*)::int FROM public.hr_users hu WHERE hu.deleted_at IS NULL AND hu.is_active = true) AS total_employees,
        (SELECT count(*)::int FROM public.hr_worksites w WHERE w.deleted_at IS NULL AND w.is_active = true) AS active_worksites,
        (SELECT count(*)::int FROM public.hr_users hu WHERE hu.deleted_at IS NULL AND hu.is_active = true AND hu.face_enrollment_status = 'enrolled') AS enrolled_employees,
        (SELECT count(*)::int
         FROM public.hr_users hu
         WHERE hu.deleted_at IS NULL
           AND hu.is_active = true
           AND (
             hu.default_worksite_id IS NULL
             OR NOT EXISTS (
               SELECT 1
               FROM public.hr_user_worksites huw
               WHERE huw.user_id = hu.id
                 AND huw.deleted_at IS NULL
             )
           )) AS employees_without_worksite,
        (SELECT count(*)::int
         FROM public.hr_attendance_sessions s
         WHERE s.deleted_at IS NULL
           AND s.work_date = CURRENT_DATE
           AND s.clock_in_at IS NOT NULL) AS clocked_in_today,
        (SELECT count(*)::int
         FROM public.hr_attendance_sessions s
         WHERE s.deleted_at IS NULL
           AND s.work_date = CURRENT_DATE
           AND s.clock_out_at IS NOT NULL) AS clocked_out_today,
        (SELECT count(*)::int
         FROM public.hr_attendance_sessions s
         WHERE s.deleted_at IS NULL
           AND s.work_date = CURRENT_DATE
           AND (
             s.clock_in_status IN ('warning', 'manual_review', 'rejected')
             OR s.clock_out_status IN ('warning', 'manual_review', 'rejected')
           )) AS exception_sessions,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND coalesce(e.metadata_json->>'validationUiState', '') = 'success') AS validation_success_today,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND coalesce(e.metadata_json->>'validationUiState', '') = 'low-confidence') AS validation_low_confidence_today,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND coalesce(e.metadata_json->>'validationUiState', '') = 'failure') AS validation_failure_today
    `);
        const qualityRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        (SELECT avg(e.face_score)
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND e.face_score IS NOT NULL) AS avg_face_score_today,
        (SELECT avg(hfe.quality_score)
         FROM public.hr_face_enrollments hfe
         WHERE hfe.deleted_at IS NULL
           AND hfe.is_active = true
           AND hfe.quality_score IS NOT NULL) AS avg_enrollment_quality,
        (SELECT avg(e.face_score)
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND e.face_score IS NOT NULL
           AND coalesce(e.metadata_json->>'validationUiState', '') = 'success') AS avg_match_similarity_today,
        (SELECT avg(e.liveness_score)
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.event_at::date = CURRENT_DATE
           AND e.liveness_score IS NOT NULL) AS avg_liveness_score_today
    `);
        const reviewRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.review_status = 'pending') AS pending_review_count,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.review_status = 'needs_clarification') AS clarification_count,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.review_status = 'approved'
           AND e.reviewed_at::date = CURRENT_DATE) AS approved_today_count,
        (SELECT count(*)::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.review_status = 'rejected'
           AND e.reviewed_at::date = CURRENT_DATE) AS rejected_today_count,
        (SELECT round(avg(extract(epoch from (e.reviewed_at - e.event_at)) / 60.0))::int
         FROM public.hr_attendance_events e
         WHERE e.deleted_at IS NULL
           AND e.reviewed_at IS NOT NULL
           AND e.review_status IN ('approved', 'rejected', 'needs_clarification')
           AND e.reviewed_at::date = CURRENT_DATE) AS avg_resolution_minutes
    `);
        const productivityRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        (SELECT coalesce(sum(s.total_work_minutes), 0)::int
         FROM public.hr_attendance_sessions s
         WHERE s.deleted_at IS NULL
           AND s.work_date = CURRENT_DATE
           AND s.total_work_minutes IS NOT NULL) AS total_work_minutes_today,
        (SELECT avg(s.total_work_minutes)
         FROM public.hr_attendance_sessions s
         WHERE s.deleted_at IS NULL
           AND s.work_date = CURRENT_DATE
           AND s.total_work_minutes IS NOT NULL) AS avg_work_minutes_today
    `);
        const recentSessions = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        s.id,
        s.work_date,
        s.clock_in_at,
        s.clock_out_at,
        s.clock_in_status,
        s.clock_out_status,
        s.total_work_minutes,
        u.id AS app_user_id,
        u.username,
        u.full_name,
        hw.name AS default_worksite_name
      FROM public.hr_attendance_sessions s
      JOIN public.hr_users hu ON hu.id = s.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      WHERE s.deleted_at IS NULL
      ORDER BY s.work_date DESC, s.id DESC
      LIMIT 12
    `);
        const exceptionEvents = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        e.id,
        e.event_type,
        e.event_at,
        e.result,
        e.reason_code,
        e.review_status AS "reviewStatus",
        u.id AS app_user_id,
        u.username,
        u.full_name
      FROM public.hr_attendance_events e
      JOIN public.hr_users hu ON hu.id = e.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE e.deleted_at IS NULL
        AND e.result IN ('warning', 'manual_review', 'rejected')
      ORDER BY e.event_at DESC, e.id DESC
      LIMIT 12
    `);
        return {
            success: true,
            data: {
                mode: 'admin',
                summary: (0, hr_attendance_helpers_1.normalizeHrDates)(summaryRows[0] ?? {
                    total_employees: 0,
                    active_worksites: 0,
                    enrolled_employees: 0,
                    employees_without_worksite: 0,
                    clocked_in_today: 0,
                    clocked_out_today: 0,
                    exception_sessions: 0,
                    validation_success_today: 0,
                    validation_low_confidence_today: 0,
                    validation_failure_today: 0,
                }),
                qualityOverview: (0, hr_attendance_helpers_1.normalizeHrDates)(qualityRows[0] ?? {
                    avg_face_score_today: null,
                    avg_enrollment_quality: null,
                    avg_match_similarity_today: null,
                    avg_liveness_score_today: null,
                }),
                reviewOverview: (0, hr_attendance_helpers_1.normalizeHrDates)(reviewRows[0] ?? {
                    pending_review_count: 0,
                    clarification_count: 0,
                    approved_today_count: 0,
                    rejected_today_count: 0,
                    avg_resolution_minutes: null,
                }),
                productivityOverview: (0, hr_attendance_helpers_1.normalizeHrDates)(productivityRows[0] ?? {
                    total_work_minutes_today: 0,
                    avg_work_minutes_today: null,
                }),
                recentSessions: (0, hr_attendance_helpers_1.normalizeHrDates)(recentSessions),
                exceptionEvents: (0, hr_attendance_helpers_1.normalizeHrDates)(exceptionEvents),
                settings: {
                    autoSubmitEnabled,
                    autoSubmitConfidenceThreshold,
                    faceIdentifyConfidenceThreshold,
                    faceVerifyConfidenceThreshold,
                },
            },
        };
    }
};
exports.AttendanceDashboardService = AttendanceDashboardService;
exports.AttendanceDashboardService = AttendanceDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_settings_service_1.AttendanceSettingsService,
        worksite_service_1.WorksiteService])
], AttendanceDashboardService);
//# sourceMappingURL=attendance-dashboard.service.js.map