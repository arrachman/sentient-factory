import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import {
  requireHrProfileByAppUserId,
  resolveHrPrivilege,
  normalizeHrDates,
} from './hr-attendance-helpers';
import { persistSnapshot } from './hr-attendance-snapshot';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';
import { FaceIdentificationService } from './face-identification.service';

type AuthUser = { id: number; roles?: string[] };

type AttendanceEventPayload = {
  sessionId?: number | null;
  eventType: string;
  result: string;
  reasonCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  faceScore?: number | null;
  livenessScore?: number | null;
  snapshotUrl?: string | null;
  deviceInfo?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

const DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY = 0.24;
const DEFAULT_FACE_LIVENESS_MIN_SCORE = 0.75;

@Injectable()
export class FaceEnrollmentService {
  constructor(
    private prisma: PrismaService,
    private settingsService: AttendanceSettingsService,
    private worksiteService: WorksiteService,
    private faceIdentificationService: FaceIdentificationService,
  ) {}

  requireFaceEmbedding(faceEmbedding: unknown) {
    return this.faceIdentificationService.requireFaceEmbedding(faceEmbedding);
  }

  compareFaceEmbedding(left: number[], right: number[]) {
    return this.faceIdentificationService.compareFaceEmbedding(left, right);
  }

  async requireActiveFaceEnrollment(hrUserId: number) {
    return this.faceIdentificationService.requireActiveFaceEnrollment(hrUserId);
  }

  private async hasActiveFaceEnrollment(hrUserId: number) {
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
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

  private async findDuplicateFaceEnrollmentOwner(
    targetHrUserId: number,
    inputEmbedding: number[],
    threshold: number,
  ) {
    const rows = await this.prisma.$queryRaw<
      Array<{
        hrUserId: number;
        appUserId: number;
        employeeCode: string | null;
        username: string;
        fullName: string | null;
        embeddingJson: unknown;
      }>
    >(Prisma.sql`
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
      const similarity = this.faceIdentificationService.compareFaceEmbedding(
        this.faceIdentificationService.requireFaceEmbedding(row.embeddingJson),
        inputEmbedding,
      );
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

  private async resolveEnrollmentTargetProfile(authUser: AuthUser, targetAppUserId?: number) {
    if (targetAppUserId == null || targetAppUserId === authUser.id) {
      return requireHrProfileByAppUserId(this.prisma, authUser.id);
    }

    if (!await resolveHrPrivilege(this.prisma, authUser)) {
      throw new BadRequestException(
        'Hanya manager atau admin yang boleh mendaftarkan wajah pegawai lain.',
      );
    }

    return requireHrProfileByAppUserId(this.prisma, targetAppUserId);
  }

  async insertAttendanceEvent(hrUserId: number, actorId: number | null, payload: AttendanceEventPayload) {
    await this.prisma.$executeRaw(Prisma.sql`
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

  async createFaceEnrollment(authUser: AuthUser, dto: CreateFaceEnrollmentDto) {
    const actorProfile = await requireHrProfileByAppUserId(this.prisma, authUser.id);
    const targetProfile = await this.resolveEnrollmentTargetProfile(authUser, dto.targetAppUserId);
    const actorId = toAuditUserId(authUser.id);
    const faceEmbedding = this.faceIdentificationService.requireFaceEmbedding(dto.faceEmbedding);
    const duplicateThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_duplicate_confidence_threshold',
      DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await persistSnapshot('enrollments', `user-${authUser.id}`, dto.snapshotDataUrl)
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
      throw new BadRequestException(
        'Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.',
      );
    }

    const hasActive = await this.hasActiveFaceEnrollment(targetProfile.hrUserId);
    if (hasActive || targetProfile.faceEnrollmentStatus === 'enrolled') {
      throw new BadRequestException('Pegawai ini sudah memiliki wajah terdaftar aktif.');
    }

    const duplicateOwner = await this.findDuplicateFaceEnrollmentOwner(
      targetProfile.hrUserId,
      faceEmbedding,
      duplicateThreshold,
    );
    if (duplicateOwner) {
      throw new BadRequestException(
        `Wajah ini sudah terdaftar untuk pegawai lain (${duplicateOwner.fullName ?? duplicateOwner.username}).`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.$executeRaw(Prisma.sql`
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
          ${`local://hr/face-embedding/${randomUUID()}`},
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
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_users
        SET
          face_enrollment_status = 'enrolled',
          face_template_version = face_template_version + 1,
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${targetProfile.hrUserId}
      `),
      this.prisma.$executeRaw(Prisma.sql`
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

  async getFaceEnrollmentManagement(authUser: AuthUser) {
    if (!await resolveHrPrivilege(this.prisma, authUser)) {
      throw new BadRequestException(
        'Manajemen pendaftaran wajah hanya tersedia untuk manager atau admin.',
      );
    }

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const assignedWorksites = await this.worksiteService.getAssignedWorksiteMap(
      rows.map((row) => Number(row.hrUserId)),
    );

    return {
      success: true,
      data: normalizeHrDates(
        rows.map((row) => ({
          ...row,
          assignedWorksites: assignedWorksites.get(Number(row.hrUserId)) ?? [],
        })),
      ),
    };
  }

  identifyFace(authUser: AuthUser, dto: IdentifyFaceDto) {
    return this.faceIdentificationService.identifyFace(authUser, dto);
  }

  getFaceEnrollmentSnapshot(authUser: AuthUser, enrollmentId: number) {
    return this.faceIdentificationService.getFaceEnrollmentSnapshot(authUser, enrollmentId);
  }
}
