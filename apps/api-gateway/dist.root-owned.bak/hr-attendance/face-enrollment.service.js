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
exports.FaceEnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const hr_attendance_snapshot_1 = require("./hr-attendance-snapshot");
const attendance_settings_service_1 = require("./attendance-settings.service");
const worksite_service_1 = require("./worksite.service");
const face_identification_service_1 = require("./face-identification.service");
const DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY = 0.24;
const DEFAULT_FACE_LIVENESS_MIN_SCORE = 0.75;
let FaceEnrollmentService = class FaceEnrollmentService {
    prisma;
    settingsService;
    worksiteService;
    faceIdentificationService;
    constructor(prisma, settingsService, worksiteService, faceIdentificationService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.worksiteService = worksiteService;
        this.faceIdentificationService = faceIdentificationService;
    }
    requireFaceEmbedding(faceEmbedding) {
        return this.faceIdentificationService.requireFaceEmbedding(faceEmbedding);
    }
    compareFaceEmbedding(left, right) {
        return this.faceIdentificationService.compareFaceEmbedding(left, right);
    }
    async requireActiveFaceEnrollment(hrUserId) {
        return this.faceIdentificationService.requireActiveFaceEnrollment(hrUserId);
    }
    async hasActiveFaceEnrollment(hrUserId) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT id
      FROM public.hr_face_enrollments
      WHERE user_id = ${hrUserId}
        AND deleted_at IS NULL
        AND is_active = true
      ORDER BY id DESC
      LIMIT 1
    `);
        return rows.length > 0;
    }
    async findDuplicateFaceEnrollmentOwner(targetHrUserId, inputEmbedding, threshold) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        u.username,
        u.full_name AS "fullName",
        hfe.embedding_json AS "embeddingJson"
      FROM public.hr_face_enrollments hfe
      JOIN public.hr_users hu ON hu.id = hfe.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE hfe.deleted_at IS NULL
        AND hfe.is_active = true
        AND hu.deleted_at IS NULL
        AND hu.is_active = true
        AND hu.id <> ${targetHrUserId}
        AND hfe.embedding_json IS NOT NULL
    `);
        for (const row of rows) {
            const similarity = this.faceIdentificationService.compareFaceEmbedding(this.faceIdentificationService.requireFaceEmbedding(row.embeddingJson), inputEmbedding);
            if (similarity >= threshold) {
                return {
                    hrUserId: row.hrUserId,
                    appUserId: row.appUserId,
                    employeeCode: row.employeeCode,
                    username: row.username,
                    fullName: row.fullName,
                    similarity,
                };
            }
        }
        return null;
    }
    async resolveEnrollmentTargetProfile(authUser, targetAppUserId) {
        if (targetAppUserId == null || targetAppUserId === authUser.id) {
            return (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        }
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Hanya manager atau admin yang boleh mendaftarkan wajah pegawai lain.');
        }
        return (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, targetAppUserId);
    }
    async insertAttendanceEvent(hrUserId, actorId, payload) {
        await this.prisma.$executeRaw(client_1.Prisma.sql `
      INSERT INTO public.hr_attendance_events (
        user_id,
        session_id,
        event_type,
        event_at,
        result,
        reason_code,
        review_status,
        latitude,
        longitude,
        face_score,
        liveness_score,
        device_info,
        snapshot_url,
        metadata_json,
        created_at,
        created_by,
        updated_by
      )
      VALUES (
        ${hrUserId},
        ${payload.sessionId ?? null},
        ${payload.eventType},
        now(),
        ${payload.result},
        ${payload.reasonCode ?? null},
        ${['warning', 'manual_review', 'rejected'].includes(payload.result) ? 'pending' : null},
        ${payload.latitude ?? null},
        ${payload.longitude ?? null},
        ${payload.faceScore ?? null},
        ${payload.livenessScore ?? null},
        ${JSON.stringify(payload.deviceInfo ?? {})}::jsonb,
        ${payload.snapshotUrl ?? null},
        ${JSON.stringify(payload.metadata ?? {})}::jsonb,
        now(),
        ${actorId},
        ${actorId}
      )
    `);
    }
    async createFaceEnrollment(authUser, dto) {
        const actorProfile = await (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        const targetProfile = await this.resolveEnrollmentTargetProfile(authUser, dto.targetAppUserId);
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        const faceEmbedding = this.faceIdentificationService.requireFaceEmbedding(dto.faceEmbedding);
        const duplicateThreshold = await this.settingsService.getNumberSetting('attendance', 'face_duplicate_confidence_threshold', DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY);
        const livenessThreshold = await this.settingsService.getNumberSetting('attendance', 'face_liveness_threshold', DEFAULT_FACE_LIVENESS_MIN_SCORE);
        const snapshotUrl = dto.snapshotDataUrl
            ? await (0, hr_attendance_snapshot_1.persistSnapshot)('enrollments', `user-${authUser.id}`, dto.snapshotDataUrl)
            : null;
        if ((dto.livenessScore ?? 0) < livenessThreshold) {
            await this.insertAttendanceEvent(targetProfile.hrUserId, actorId, {
                eventType: 'face_enrollment_attempt',
                result: 'rejected',
                reasonCode: 'liveness_not_verified',
                snapshotUrl,
                metadata: {
                    ...(dto.metadata ?? {}),
                    livenessScore: dto.livenessScore ?? null,
                    livenessThreshold,
                    faceDetectionCount: dto.faceDetectionCount ?? null,
                    faceDetectionMode: dto.faceDetectionMode ?? null,
                },
            });
            throw new common_1.BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
        }
        const hasActive = await this.hasActiveFaceEnrollment(targetProfile.hrUserId);
        if (hasActive || targetProfile.faceEnrollmentStatus === 'enrolled') {
            throw new common_1.BadRequestException('Pegawai ini sudah memiliki wajah terdaftar aktif.');
        }
        const duplicateOwner = await this.findDuplicateFaceEnrollmentOwner(targetProfile.hrUserId, faceEmbedding, duplicateThreshold);
        if (duplicateOwner) {
            throw new common_1.BadRequestException(`Wajah ini sudah terdaftar untuk pegawai lain (${duplicateOwner.fullName ?? duplicateOwner.username}).`);
        }
        await this.prisma.$transaction([
            this.prisma.$executeRaw(client_1.Prisma.sql `
        INSERT INTO public.hr_face_enrollments (
          user_id,
          template_ref,
          quality_score,
          snapshot_url,
          embedding_json,
          detector_metadata,
          enrolled_at,
          is_active,
          created_at,
          created_by,
          updated_by
        )
        VALUES (
          ${targetProfile.hrUserId},
          ${`local://hr/face-embedding/${(0, crypto_1.randomUUID)()}`},
          ${dto.qualityScore ?? 0.85},
          ${snapshotUrl},
          ${JSON.stringify(faceEmbedding)}::jsonb,
          ${JSON.stringify({
                detectionCount: dto.faceDetectionCount ?? null,
                detectionMode: dto.faceDetectionMode ?? null,
                source: 'web-dashboard',
            })}::jsonb,
          now(),
          true,
          now(),
          ${actorId},
          ${actorId}
        )
      `),
            this.prisma.$executeRaw(client_1.Prisma.sql `
        UPDATE public.hr_users
        SET
          face_enrollment_status = 'enrolled',
          face_template_version = face_template_version + 1,
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${targetProfile.hrUserId}
      `),
            this.prisma.$executeRaw(client_1.Prisma.sql `
        INSERT INTO public.hr_attendance_events (
          user_id,
          event_type,
          event_at,
          result,
          reason_code,
          snapshot_url,
          metadata_json,
          created_at,
          created_by,
          updated_by
        )
        VALUES (
          ${targetProfile.hrUserId},
          'face_enrollment',
          now(),
          'success',
          null,
          ${snapshotUrl},
          ${JSON.stringify({
                ...(dto.metadata ?? {}),
                registeredForUserId: targetProfile.appUserId,
                registeredForUsername: targetProfile.username,
                registeredByUserId: actorProfile.appUserId,
                registeredByUsername: actorProfile.username,
                faceDetectionCount: dto.faceDetectionCount ?? null,
                faceDetectionMode: dto.faceDetectionMode ?? null,
                embeddingDimensions: faceEmbedding.length,
            })}::jsonb,
          now(),
          ${actorId},
          ${actorId}
        )
      `),
        ]);
        return {
            success: true,
            message: 'Pendaftaran wajah berhasil disimpan.',
            data: {
                snapshotUrl,
                faceEnrollmentStatus: 'enrolled',
                targetAppUserId: targetProfile.appUserId,
                targetUsername: targetProfile.username,
            },
        };
    }
    async getFaceEnrollmentManagement(authUser) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Manajemen pendaftaran wajah hanya tersedia untuk manager atau admin.');
        }
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        hu.face_enrollment_status AS "faceEnrollmentStatus",
        hu.face_template_version AS "faceTemplateVersion",
        hu.employee_role_type AS "employeeRoleType",
        hu.is_active AS "isActive",
        u.username,
        u.full_name AS "fullName",
        hw.name AS "defaultWorksiteName",
        hfe.id AS "activeEnrollmentId",
        hfe.snapshot_url AS "snapshotUrl",
        hfe.quality_score AS "qualityScore",
        hfe.enrolled_at AS "enrolledAt",
        creator.username AS "registeredByUsername",
        creator.full_name AS "registeredByFullName"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      LEFT JOIN LATERAL (
        SELECT
          hfe_inner.id,
          hfe_inner.snapshot_url,
          hfe_inner.quality_score,
          hfe_inner.enrolled_at,
          hfe_inner.created_by
        FROM public.hr_face_enrollments hfe_inner
        WHERE hfe_inner.user_id = hu.id
          AND hfe_inner.deleted_at IS NULL
          AND hfe_inner.is_active = true
        ORDER BY hfe_inner.id DESC
        LIMIT 1
      ) hfe ON true
      LEFT JOIN public.m0_users creator ON creator.id = hfe.created_by
      WHERE hu.deleted_at IS NULL
        AND hu.is_active = true
      ORDER BY
        CASE WHEN hu.face_enrollment_status = 'enrolled' THEN 0 ELSE 1 END,
        coalesce(u.full_name, u.username) ASC,
        u.username ASC
    `);
        const assignedWorksites = await this.worksiteService.getAssignedWorksiteMap(rows.map((row) => Number(row.hrUserId)));
        return {
            success: true,
            data: (0, hr_attendance_helpers_1.normalizeHrDates)(rows.map((row) => ({
                ...row,
                assignedWorksites: assignedWorksites.get(Number(row.hrUserId)) ?? [],
            }))),
        };
    }
    identifyFace(authUser, dto) {
        return this.faceIdentificationService.identifyFace(authUser, dto);
    }
    getFaceEnrollmentSnapshot(authUser, enrollmentId) {
        return this.faceIdentificationService.getFaceEnrollmentSnapshot(authUser, enrollmentId);
    }
};
exports.FaceEnrollmentService = FaceEnrollmentService;
exports.FaceEnrollmentService = FaceEnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_settings_service_1.AttendanceSettingsService,
        worksite_service_1.WorksiteService,
        face_identification_service_1.FaceIdentificationService])
], FaceEnrollmentService);
//# sourceMappingURL=face-enrollment.service.js.map