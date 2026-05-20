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
exports.AttendanceReviewService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
let AttendanceReviewService = class AttendanceReviewService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAttendanceReviews(authUser, query) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Attendance review queue is only available to privileged roles.');
        }
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const offset = (page - 1) * limit;
        const search = query.search?.trim() ?? '';
        const searchClause = search
            ? client_1.Prisma.sql `AND (
          u.username ILIKE ${`%${search}%`}
          OR u.full_name ILIKE ${`%${search}%`}
          OR coalesce(e.reason_code, '') ILIKE ${`%${search}%`}
        )`
            : client_1.Prisma.empty;
        const reviewStatusClause = query.reviewStatus
            ? client_1.Prisma.sql `AND e.review_status = ${query.reviewStatus}`
            : client_1.Prisma.sql `AND e.review_status = 'pending'`;
        const reasonClause = query.reasonCode
            ? client_1.Prisma.sql `AND e.reason_code = ${query.reasonCode}`
            : client_1.Prisma.empty;
        const validationStateClause = query.validationUiState
            ? client_1.Prisma.sql `AND coalesce(e.metadata_json->>'validationUiState', '') = ${query.validationUiState}`
            : client_1.Prisma.empty;
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        e.id,
        e.event_type,
        e.event_at,
        e.result,
        e.reason_code,
        e.review_status AS "reviewStatus",
        e.reviewed_at AS "reviewedAt",
        e.review_note AS "reviewNote",
        e.snapshot_url AS "snapshotUrl",
        e.latitude,
        e.longitude,
        e.metadata_json AS "metadataJson",
        s.work_date,
        s.clock_in_status AS "clockInStatus",
        s.clock_out_status AS "clockOutStatus",
        u.username,
        u.full_name AS "fullName",
        hw.name AS "defaultWorksiteName"
      FROM public.hr_attendance_events e
      JOIN public.hr_users hu ON hu.id = e.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_attendance_sessions s ON s.id = e.session_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      WHERE e.deleted_at IS NULL
        AND e.result IN ('warning', 'manual_review', 'rejected')
        ${reviewStatusClause}
        ${reasonClause}
        ${validationStateClause}
        ${searchClause}
      ORDER BY e.event_at DESC, e.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);
        const countRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT count(*)::bigint AS total
      FROM public.hr_attendance_events e
      JOIN public.hr_users hu ON hu.id = e.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE e.deleted_at IS NULL
        AND e.result IN ('warning', 'manual_review', 'rejected')
        ${reviewStatusClause}
        ${reasonClause}
        ${validationStateClause}
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
    async getAttendanceReviewDetail(authUser, eventId) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Attendance review detail is only available to privileged roles.');
        }
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        e.id,
        e.session_id AS "sessionId",
        e.event_type,
        e.event_at,
        e.result,
        e.reason_code,
        e.review_status AS "reviewStatus",
        e.reviewed_at AS "reviewedAt",
        e.review_note AS "reviewNote",
        e.snapshot_url AS "snapshotUrl",
        e.latitude,
        e.longitude,
        e.face_score AS "faceScore",
        e.liveness_score AS "livenessScore",
        e.device_info AS "deviceInfo",
        e.metadata_json AS "metadataJson",
        s.work_date,
        s.clock_in_status AS "clockInStatus",
        s.clock_out_status AS "clockOutStatus",
        s.clock_in_at AS "clockInAt",
        s.clock_out_at AS "clockOutAt",
        hw.name AS "defaultWorksiteName",
        hw.code AS "defaultWorksiteCode",
        hw.radius_meters AS "defaultWorksiteRadiusMeters",
        u.username,
        u.full_name AS "fullName",
        reviewer.username AS "reviewedByUsername",
        reviewer.full_name AS "reviewedByFullName"
      FROM public.hr_attendance_events e
      JOIN public.hr_users hu ON hu.id = e.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_attendance_sessions s ON s.id = e.session_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      LEFT JOIN public.m0_users reviewer ON reviewer.id = e.reviewed_by
      WHERE e.id = ${eventId}
        AND e.deleted_at IS NULL
      LIMIT 1
    `);
        const row = rows[0];
        if (!row) {
            throw new common_1.NotFoundException('Attendance review item not found.');
        }
        const reviewHistory = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        l.id,
        l.previous_status AS "previousStatus",
        l.next_status AS "nextStatus",
        l.note,
        l.created_at AS "createdAt",
        l.metadata_json AS "metadataJson",
        actor.username AS "actorUsername",
        actor.full_name AS "actorFullName"
      FROM public.hr_attendance_review_logs l
      LEFT JOIN public.m0_users actor ON actor.id = l.actor_user_id
      WHERE l.event_id = ${eventId}
      ORDER BY l.created_at DESC, l.id DESC
    `);
        return {
            success: true,
            data: (0, hr_attendance_helpers_1.normalizeHrDates)({
                ...row,
                reviewHistory,
            }),
        };
    }
    async updateAttendanceReview(authUser, eventId, nextStatus, note) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Attendance review action is only available to privileged roles.');
        }
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        e.id,
        e.session_id AS "sessionId",
        e.event_type AS "eventType",
        e.result,
        e.review_status AS "reviewStatus"
      FROM public.hr_attendance_events e
      WHERE e.id = ${eventId}
        AND e.deleted_at IS NULL
      LIMIT 1
    `);
        const row = rows[0];
        if (!row) {
            throw new common_1.NotFoundException('Attendance review item not found.');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw(client_1.Prisma.sql `
        UPDATE public.hr_attendance_events
        SET
          review_status = ${nextStatus},
          reviewed_at = now(),
          reviewed_by = ${authUser.id},
          review_note = ${note ?? null},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${eventId}
      `);
            await tx.$executeRaw(client_1.Prisma.sql `
        INSERT INTO public.hr_attendance_review_logs (
          event_id,
          previous_status,
          next_status,
          note,
          actor_user_id,
          metadata_json
        )
        VALUES (
          ${eventId},
          ${row.reviewStatus ?? null},
          ${nextStatus},
          ${note ?? null},
          ${authUser.id},
          ${JSON.stringify({
                eventType: row.eventType,
                eventResult: row.result,
                sessionId: row.sessionId,
            })}::jsonb
        )
      `);
            if (row.sessionId) {
                if (row.eventType === 'clock_in') {
                    await tx.$executeRaw(client_1.Prisma.sql `
            UPDATE public.hr_attendance_sessions
            SET
              clock_in_status = ${nextStatus === 'approved' ? 'success' : nextStatus === 'rejected' ? 'rejected' : 'manual_review'},
              updated_at = now(),
              updated_by = ${actorId}
            WHERE id = ${row.sessionId}
          `);
                }
                if (row.eventType === 'clock_out') {
                    await tx.$executeRaw(client_1.Prisma.sql `
            UPDATE public.hr_attendance_sessions
            SET
              clock_out_status = ${nextStatus === 'approved' ? 'success' : nextStatus === 'rejected' ? 'rejected' : 'manual_review'},
              updated_at = now(),
              updated_by = ${actorId}
            WHERE id = ${row.sessionId}
          `);
                }
            }
        });
        return {
            success: true,
            message: nextStatus === 'pending'
                ? 'Attendance review reopened and returned to pending queue.'
                : nextStatus === 'approved'
                    ? 'Attendance review approved.'
                    : nextStatus === 'rejected'
                        ? 'Attendance review rejected.'
                        : 'Attendance review clarification requested.',
            data: {
                eventId,
                reviewStatus: nextStatus,
            },
        };
    }
};
exports.AttendanceReviewService = AttendanceReviewService;
exports.AttendanceReviewService = AttendanceReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceReviewService);
//# sourceMappingURL=attendance-review.service.js.map