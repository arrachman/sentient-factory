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
exports.AttendanceClockService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const hr_attendance_snapshot_1 = require("./hr-attendance-snapshot");
const attendance_settings_service_1 = require("./attendance-settings.service");
const face_enrollment_service_1 = require("./face-enrollment.service");
const worksite_service_1 = require("./worksite.service");
const attendance_clock_utils_1 = require("./attendance-clock.utils");
const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_LIVENESS_MIN_SCORE = 0.75;
let AttendanceClockService = class AttendanceClockService {
    prisma;
    settingsService;
    faceEnrollmentService;
    worksiteService;
    constructor(prisma, settingsService, faceEnrollmentService, worksiteService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.faceEnrollmentService = faceEnrollmentService;
        this.worksiteService = worksiteService;
    }
    async clockIn(authUser, dto) {
        const profile = await (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        const inputEmbedding = this.faceEnrollmentService.requireFaceEmbedding(dto.faceEmbedding);
        const verifyThreshold = await this.settingsService.getNumberSetting('attendance', 'face_verify_confidence_threshold', DEFAULT_FACE_VERIFY_MIN_SIMILARITY);
        const livenessThreshold = await this.settingsService.getNumberSetting('attendance', 'face_liveness_threshold', DEFAULT_FACE_LIVENESS_MIN_SCORE);
        const snapshotUrl = dto.snapshotDataUrl
            ? await (0, hr_attendance_snapshot_1.persistSnapshot)('clock-in', `user-${authUser.id}`, dto.snapshotDataUrl)
            : null;
        const activeSessionRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId}
        AND deleted_at IS NULL
        AND work_date = CURRENT_DATE
        AND clock_out_at IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);
        if (activeSessionRows.length > 0) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                eventType: 'clock_in_attempt',
                result: 'rejected',
                reasonCode: 'already_clocked_in',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: dto.faceScore,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: dto.metadata,
            });
            throw new common_1.BadRequestException('Current user already has an active attendance session for today.');
        }
        if ((dto.livenessScore ?? 0) < livenessThreshold) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                eventType: 'clock_in_attempt',
                result: 'rejected',
                reasonCode: 'liveness_not_verified',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: dto.faceScore,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: {
                    ...(dto.metadata ?? {}),
                    livenessThreshold,
                    faceDetectionCount: dto.faceDetectionCount ?? null,
                    faceDetectionMode: dto.faceDetectionMode ?? null,
                },
            });
            throw new common_1.BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
        }
        const activeEnrollment = await this.faceEnrollmentService.requireActiveFaceEnrollment(profile.hrUserId);
        const similarity = this.faceEnrollmentService.compareFaceEmbedding(activeEnrollment.embedding, inputEmbedding);
        if (similarity < verifyThreshold) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                eventType: 'clock_in_attempt',
                result: 'rejected',
                reasonCode: 'face_mismatch',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: similarity,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: {
                    ...(dto.metadata ?? {}),
                    embeddingSimilarity: similarity,
                    faceDetectionCount: dto.faceDetectionCount ?? null,
                    faceDetectionMode: dto.faceDetectionMode ?? null,
                },
            });
            throw new common_1.BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
        }
        const assignedWorksites = await this.worksiteService.getAssignedWorksites(profile.hrUserId);
        const worksiteResolution = this.worksiteService.resolveWorksiteForCoordinates(assignedWorksites, dto.latitude, dto.longitude);
        const worksite = worksiteResolution.worksite;
        const distanceMeters = worksiteResolution.distanceMeters;
        const insideGeofence = worksiteResolution.insideGeofence;
        const clockInStatus = insideGeofence ? 'success' : 'manual_review';
        const reasonCode = insideGeofence ? (dto.reasonCode ?? null) : 'outside_geofence';
        const inserted = await this.prisma.$queryRaw(client_1.Prisma.sql `
      INSERT INTO public.hr_attendance_sessions (
        user_id,
        work_date,
        clock_in_at,
        clock_in_latitude,
        clock_in_longitude,
        clock_in_worksite_id,
        clock_in_status,
        clock_in_face_score,
        clock_in_liveness_score,
        created_at,
        created_by,
        updated_by
      )
      VALUES (
        ${profile.hrUserId},
        CURRENT_DATE,
        now(),
        ${dto.latitude},
        ${dto.longitude},
        ${worksite?.id ?? null},
        ${clockInStatus},
        ${similarity},
        ${dto.livenessScore ?? null},
        now(),
        ${actorId},
        ${actorId}
      )
      RETURNING id
    `);
        const sessionId = inserted[0]?.id ?? null;
        await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
            sessionId,
            eventType: 'clock_in',
            result: clockInStatus,
            reasonCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            faceScore: similarity,
            livenessScore: dto.livenessScore,
            snapshotUrl,
            deviceInfo: dto.deviceInfo,
            metadata: {
                ...(dto.metadata ?? {}),
                distanceMeters,
                worksiteCode: worksite?.code ?? null,
                embeddingSimilarity: similarity,
                faceDetectionCount: dto.faceDetectionCount ?? null,
                faceDetectionMode: dto.faceDetectionMode ?? null,
            },
        });
        return {
            success: true,
            data: {
                sessionId,
                status: clockInStatus,
                reasonCode,
                distanceMeters,
                insideGeofence,
            },
        };
    }
    async clockOut(authUser, dto) {
        const profile = await (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        const inputEmbedding = this.faceEnrollmentService.requireFaceEmbedding(dto.faceEmbedding);
        const verifyThreshold = await this.settingsService.getNumberSetting('attendance', 'face_verify_confidence_threshold', DEFAULT_FACE_VERIFY_MIN_SIMILARITY);
        const livenessThreshold = await this.settingsService.getNumberSetting('attendance', 'face_liveness_threshold', DEFAULT_FACE_LIVENESS_MIN_SCORE);
        const snapshotUrl = dto.snapshotDataUrl
            ? await (0, hr_attendance_snapshot_1.persistSnapshot)('clock-out', `user-${authUser.id}`, dto.snapshotDataUrl)
            : null;
        const activeSessionRows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id, clock_in_at
      FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId}
        AND deleted_at IS NULL
        AND work_date = CURRENT_DATE
        AND clock_out_at IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);
        if (activeSessionRows.length === 0) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                eventType: 'clock_out_attempt',
                result: 'rejected',
                reasonCode: 'no_active_session',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: dto.faceScore,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: dto.metadata,
            });
            throw new common_1.BadRequestException('Current user has no active attendance session.');
        }
        const activeSession = activeSessionRows[0];
        if ((dto.livenessScore ?? 0) < livenessThreshold) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                sessionId: activeSession.id,
                eventType: 'clock_out_attempt',
                result: 'rejected',
                reasonCode: 'liveness_not_verified',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: dto.faceScore,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: {
                    ...(dto.metadata ?? {}),
                    livenessThreshold,
                    faceDetectionCount: dto.faceDetectionCount ?? null,
                    faceDetectionMode: dto.faceDetectionMode ?? null,
                },
            });
            throw new common_1.BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
        }
        const activeEnrollment = await this.faceEnrollmentService.requireActiveFaceEnrollment(profile.hrUserId);
        const similarity = this.faceEnrollmentService.compareFaceEmbedding(activeEnrollment.embedding, inputEmbedding);
        if (similarity < verifyThreshold) {
            await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
                sessionId: activeSession.id,
                eventType: 'clock_out_attempt',
                result: 'rejected',
                reasonCode: 'face_mismatch',
                latitude: dto.latitude,
                longitude: dto.longitude,
                faceScore: similarity,
                livenessScore: dto.livenessScore,
                snapshotUrl,
                deviceInfo: dto.deviceInfo,
                metadata: {
                    ...(dto.metadata ?? {}),
                    embeddingSimilarity: similarity,
                    faceDetectionCount: dto.faceDetectionCount ?? null,
                    faceDetectionMode: dto.faceDetectionMode ?? null,
                },
            });
            throw new common_1.BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
        }
        const assignedWorksites = await this.worksiteService.getAssignedWorksites(profile.hrUserId);
        const worksiteResolution = this.worksiteService.resolveWorksiteForCoordinates(assignedWorksites, dto.latitude, dto.longitude);
        const worksite = worksiteResolution.worksite;
        const distanceMeters = worksiteResolution.distanceMeters;
        const insideGeofence = worksiteResolution.insideGeofence;
        const clockOutStatus = insideGeofence ? 'success' : 'manual_review';
        const reasonCode = insideGeofence ? (dto.reasonCode ?? null) : 'outside_geofence';
        const minutesWorked = (0, attendance_clock_utils_1.diffMinutes)(activeSession.clock_in_at);
        await this.prisma.$executeRaw(client_1.Prisma.sql `
      UPDATE public.hr_attendance_sessions
      SET
        clock_out_at = now(),
        clock_out_latitude = ${dto.latitude},
        clock_out_longitude = ${dto.longitude},
        clock_out_worksite_id = ${worksite?.id ?? null},
        clock_out_status = ${clockOutStatus},
        clock_out_face_score = ${similarity},
        clock_out_liveness_score = ${dto.livenessScore ?? null},
        total_work_minutes = ${minutesWorked},
        updated_at = now(),
        updated_by = ${actorId}
      WHERE id = ${activeSession.id}
    `);
        await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
            sessionId: activeSession.id,
            eventType: 'clock_out',
            result: clockOutStatus,
            reasonCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            faceScore: similarity,
            livenessScore: dto.livenessScore,
            snapshotUrl,
            deviceInfo: dto.deviceInfo,
            metadata: {
                ...(dto.metadata ?? {}),
                distanceMeters,
                worksiteCode: worksite?.code ?? null,
                minutesWorked,
                embeddingSimilarity: similarity,
                faceDetectionCount: dto.faceDetectionCount ?? null,
                faceDetectionMode: dto.faceDetectionMode ?? null,
            },
        });
        return {
            success: true,
            data: {
                sessionId: activeSession.id,
                status: clockOutStatus,
                reasonCode,
                distanceMeters,
                totalWorkMinutes: minutesWorked,
            },
        };
    }
};
exports.AttendanceClockService = AttendanceClockService;
exports.AttendanceClockService = AttendanceClockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_settings_service_1.AttendanceSettingsService,
        face_enrollment_service_1.FaceEnrollmentService,
        worksite_service_1.WorksiteService])
], AttendanceClockService);
//# sourceMappingURL=attendance-clock.service.js.map