import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';

type AuthUser = {
  id: number;
  roles?: string[];
};

type HrAssignedWorksite = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isPrimary: boolean;
};

type HrWorksiteAssignmentSummary = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

type HrWorksiteRow = {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY = 0.24;
const DEFAULT_FACE_LIVENESS_MIN_SCORE = 0.75;

function padTimestampPart(value: number) {
  return String(value).padStart(2, '0');
}

function serializeHrTimestampValue(value: Date) {
  const year = value.getUTCFullYear();
  const month = padTimestampPart(value.getUTCMonth() + 1);
  const day = padTimestampPart(value.getUTCDate());
  const hour = padTimestampPart(value.getUTCHours());
  const minute = padTimestampPart(value.getUTCMinutes());
  const second = padTimestampPart(value.getUTCSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function normalizeHrDates<T>(value: T): T {
  if (value instanceof Date) {
    return serializeHrTimestampValue(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeHrDates(entry)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeHrDates(entry)]),
    ) as T;
  }

  return value;
}

@Injectable()
export class HrAttendanceService {
  constructor(private prisma: PrismaService) {}

  private async getAssignedWorksites(hrUserId: number) {
    const [primaryRows, extraRows] = await Promise.all([
      this.prisma.$queryRaw<Array<{
        id: number;
        name: string;
        code: string;
        latitude: number;
        longitude: number;
        radiusMeters: number;
      }>>(Prisma.sql`
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
      this.prisma.$queryRaw<Array<{
        id: number;
        name: string;
        code: string;
        latitude: number;
        longitude: number;
        radiusMeters: number;
      }>>(Prisma.sql`
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

    const map = new Map<number, HrAssignedWorksite>();
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

  private async getAssignedWorksiteMap(hrUserIds: number[]) {
    const uniqueHrUserIds = Array.from(new Set(hrUserIds.filter((value) => Number.isFinite(value) && value > 0)));
    if (uniqueHrUserIds.length === 0) {
      return new Map<number, HrAssignedWorksite[]>();
    }

    const rows = await this.prisma.$queryRaw<Array<{
      hrUserId: number;
      worksiteId: number;
      worksiteName: string;
      worksiteCode: string;
      radiusMeters: number;
      isPrimary: boolean;
      assignedAt: Date | string | null;
    }>>(Prisma.sql`
      WITH assigned AS (
        SELECT
          hu.id AS "hrUserId",
          hu.default_worksite_id AS "worksiteId",
          hu.created_at AS "assignedAt",
          true AS "isPrimary"
        FROM public.hr_users hu
        WHERE hu.deleted_at IS NULL
          AND hu.default_worksite_id IS NOT NULL
          AND hu.id IN (${Prisma.join(uniqueHrUserIds)})
        UNION ALL
        SELECT
          huw.user_id AS "hrUserId",
          huw.worksite_id AS "worksiteId",
          huw.assigned_at AS "assignedAt",
          false AS "isPrimary"
        FROM public.hr_user_worksites huw
        WHERE huw.deleted_at IS NULL
          AND huw.user_id IN (${Prisma.join(uniqueHrUserIds)})
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

    const result = new Map<number, HrWorksiteAssignmentSummary[]>();
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

  private async syncAssignedWorksites(
    targetHrUserId: number,
    worksiteIds: number[],
    actorId: number | null,
  ) {
    const uniqueWorksiteIds = Array.from(new Set(worksiteIds.filter((value) => Number.isFinite(value) && value > 0)));
    if (uniqueWorksiteIds.length === 0) {
      throw new BadRequestException('Pilih minimal satu tempat kerja.');
    }

    const activeWorksites = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND id IN (${Prisma.join(uniqueWorksiteIds)})
    `);

    if (activeWorksites.length !== uniqueWorksiteIds.length) {
      throw new BadRequestException('Salah satu tempat kerja tidak valid atau sudah tidak aktif.');
    }

    const primaryWorksiteId = uniqueWorksiteIds[0];
    const insertAssignments = uniqueWorksiteIds.map((worksiteId) =>
      this.prisma.$executeRaw(Prisma.sql`
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
      `),
    );

    await this.prisma.$transaction([
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_users
        SET
          default_worksite_id = ${primaryWorksiteId},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${targetHrUserId}
      `),
      this.prisma.$executeRaw(Prisma.sql`
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

  async createFaceEnrollment(authUser: AuthUser, dto: CreateFaceEnrollmentDto) {
    const actorProfile = await this.requireHrProfileByAppUserId(authUser.id);
    const targetProfile = await this.resolveEnrollmentTargetProfile(authUser, dto.targetAppUserId);
    const actorId = toAuditUserId(authUser.id);
    const faceEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
    const duplicateThreshold = await this.getNumberSetting(
      'attendance',
      'face_duplicate_confidence_threshold',
      DEFAULT_FACE_DUPLICATE_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await this.persistSnapshot('enrollments', `user-${authUser.id}`, dto.snapshotDataUrl)
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
      throw new BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
    }

    const existingActiveEnrollment = await this.hasActiveFaceEnrollment(targetProfile.hrUserId);
    if (existingActiveEnrollment || targetProfile.faceEnrollmentStatus === 'enrolled') {
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

  async getAttendanceUsers(authUser: AuthUser) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Daftar pegawai hanya tersedia untuk manager atau admin.');
    }

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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
      data: normalizeHrDates(
        rows.map((row) => ({
          ...row,
          assignedWorksites: assignedWorksites.get(Number(row.hrUserId)) ?? [],
        })),
      ),
    };
  }

  async getUserWorksites(authUser: AuthUser, targetAppUserId: number) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Daftar tempat kerja hanya tersedia untuk manager atau admin.');
    }

    const profile = await this.getHrProfileByAppUserId(targetAppUserId);
    if (!profile) {
      throw new NotFoundException('HR attendance profile not found for selected user.');
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
        assignedWorksites: normalizeHrDates(assignedWorksites),
      },
    };
  }

  async updateUserWorksites(authUser: AuthUser, targetAppUserId: number, dto: { worksiteIds: number[] }) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Mengubah tempat kerja hanya tersedia untuk manager atau admin.');
    }

    const profile = await this.getHrProfileByAppUserId(targetAppUserId);
    if (!profile) {
      throw new NotFoundException('HR attendance profile not found for selected user.');
    }

    const actorId = toAuditUserId(authUser.id);
    await this.syncAssignedWorksites(Number(profile.hrUserId), dto.worksiteIds, actorId);

    const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));
    const updatedProfile = await this.getHrProfileByAppUserId(targetAppUserId);

    return {
      success: true,
      message: 'Tempat kerja pegawai berhasil diperbarui.',
      data: {
        hrUserId: Number(profile.hrUserId),
        appUserId: Number(profile.appUserId),
        defaultWorksiteId: updatedProfile?.defaultWorksiteId ?? null,
        assignedWorksites: normalizeHrDates(assignedWorksites),
      },
    };
  }

  async getFaceEnrollmentManagement(authUser: AuthUser) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Manajemen pendaftaran wajah hanya tersedia untuk manager atau admin.');
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

    const assignedWorksites = await this.getAssignedWorksiteMap(rows.map((row) => Number(row.hrUserId)));

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

  async identifyFace(authUser: AuthUser, dto: IdentifyFaceDto) {
    const profile = await this.requireHrProfileByAppUserId(authUser.id);
    const inputEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
    const identifyThreshold = await this.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );

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
        AND hfe.embedding_json IS NOT NULL
    `);

    const matches = rows
      .map((row) => {
        const similarity = this.compareFaceEmbedding(this.requireFaceEmbedding(row.embeddingJson), inputEmbedding);
        return {
          hrUserId: row.hrUserId,
          appUserId: row.appUserId,
          employeeCode: row.employeeCode,
          username: row.username,
          fullName: row.fullName,
          similarity,
        };
      })
      .sort((left, right) => right.similarity - left.similarity);

    const bestMatch = matches[0] ?? null;
    const matched = !!bestMatch && bestMatch.similarity >= identifyThreshold;

    return {
      success: true,
      data: {
        matched,
        threshold: identifyThreshold,
        currentUserHrId: profile.hrUserId,
        currentUserAppId: profile.appUserId,
        candidate: matched && bestMatch
          ? {
              hrUserId: bestMatch.hrUserId,
              appUserId: bestMatch.appUserId,
              employeeCode: bestMatch.employeeCode,
              username: bestMatch.username,
              fullName: bestMatch.fullName,
              similarity: Number(bestMatch.similarity.toFixed(4)),
              isCurrentUser: bestMatch.appUserId === profile.appUserId,
            }
          : null,
        topMatches: matches.slice(0, 3).map((match) => ({
          hrUserId: match.hrUserId,
          appUserId: match.appUserId,
          employeeCode: match.employeeCode,
          username: match.username,
          fullName: match.fullName,
          similarity: Number(match.similarity.toFixed(4)),
          isCurrentUser: match.appUserId === profile.appUserId,
        })),
      },
    };
  }

  async clockIn(authUser: AuthUser, dto: ClockAttendanceDto) {
    const profile = await this.requireHrProfileByAppUserId(authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const inputEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
    const verifyThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await this.persistSnapshot('clock-in', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    const activeSessionRows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
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
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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

      throw new BadRequestException('Current user already has an active attendance session for today.');
    }

    if ((dto.livenessScore ?? 0) < livenessThreshold) {
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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
      throw new BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
    }

    const activeEnrollment = await this.requireActiveFaceEnrollment(profile.hrUserId);
    const similarity = this.compareFaceEmbedding(activeEnrollment.embedding, inputEmbedding);

    if (similarity < verifyThreshold) {
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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

      throw new BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
    }

    const assignedWorksites = await this.getAssignedWorksites(profile.hrUserId);
    const worksiteResolution = this.resolveWorksiteForCoordinates(assignedWorksites, dto.latitude, dto.longitude);
    const worksite = worksiteResolution.worksite;
    const distanceMeters = worksiteResolution.distanceMeters;
    const insideGeofence = worksiteResolution.insideGeofence;
    const clockInStatus = insideGeofence ? 'success' : 'manual_review';
    const reasonCode = insideGeofence ? dto.reasonCode ?? null : 'outside_geofence';

    const inserted = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
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

    await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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

  async clockOut(authUser: AuthUser, dto: ClockAttendanceDto) {
    const profile = await this.requireHrProfileByAppUserId(authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const inputEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
    const verifyThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await this.persistSnapshot('clock-out', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    const activeSessionRows = await this.prisma.$queryRaw<Array<{ id: number; clock_in_at: Date | string | null }>>(Prisma.sql`
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
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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
      throw new BadRequestException('Current user has no active attendance session.');
    }

    const activeSession = activeSessionRows[0];

    if ((dto.livenessScore ?? 0) < livenessThreshold) {
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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
      throw new BadRequestException('Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.');
    }

    const activeEnrollment = await this.requireActiveFaceEnrollment(profile.hrUserId);
    const similarity = this.compareFaceEmbedding(activeEnrollment.embedding, inputEmbedding);

    if (similarity < verifyThreshold) {
      await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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
      throw new BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
    }

    const assignedWorksites = await this.getAssignedWorksites(profile.hrUserId);
    const worksiteResolution = this.resolveWorksiteForCoordinates(assignedWorksites, dto.latitude, dto.longitude);
    const worksite = worksiteResolution.worksite;
    const distanceMeters = worksiteResolution.distanceMeters;
    const insideGeofence = worksiteResolution.insideGeofence;
    const clockOutStatus = insideGeofence ? 'success' : 'manual_review';
    const reasonCode = insideGeofence ? dto.reasonCode ?? null : 'outside_geofence';

    const minutesWorked = this.diffMinutes(activeSession.clock_in_at);

    await this.prisma.$executeRaw(Prisma.sql`
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

    await this.insertAttendanceEvent(profile.hrUserId, actorId, {
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

  async reportAttendanceFailure(authUser: AuthUser, dto: ReportAttendanceFailureDto) {
    const profile = await this.requireHrProfileByAppUserId(authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const snapshotUrl = dto.snapshotDataUrl
      ? await this.persistSnapshot('attempt-failures', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    await this.insertAttendanceEvent(profile.hrUserId, actorId, {
      eventType: dto.eventType,
      result: 'rejected',
      reasonCode: dto.reasonCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      faceScore: dto.faceScore,
      livenessScore: dto.livenessScore,
      snapshotUrl,
      deviceInfo: dto.deviceInfo,
      metadata: dto.metadata,
    });

    return {
      success: true,
      message: 'Attendance failure attempt recorded.',
      data: {
        eventType: dto.eventType,
        reasonCode: dto.reasonCode,
        snapshotUrl,
      },
    };
  }

  async getAttendanceMe(authUser: AuthUser) {
    const profile = await this.getHrProfileByAppUserId(authUser.id);
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

    const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));

    const todayRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const recentEvents = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const autoSubmitEnabled = await this.getBooleanSetting('attendance', 'auto_submit_enabled', true);
    const autoSubmitConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );
    const faceVerifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );

    return {
      success: true,
      data: {
        profile: normalizeHrDates({
          ...profile,
          assignedWorksites,
        }),
        today: normalizeHrDates(todayRows[0] ?? null),
        recentEvents: normalizeHrDates(recentEvents),
        settings: {
          autoSubmitEnabled,
          autoSubmitConfidenceThreshold,
          faceIdentifyConfidenceThreshold,
          faceVerifyConfidenceThreshold,
        },
      },
    };
  }

  async getAttendanceHistory(authUser: AuthUser, query: QueryHrAttendanceHistoryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;
    const privileged = this.isPrivileged(authUser.roles);
    const search = query.search?.trim() ?? '';
    const targetAppUserId = query.userId
      ? (privileged ? query.userId : authUser.id)
      : null;

    let targetHrUserId: number | null = null;
    if (targetAppUserId !== null) {
      const profile = await this.getHrProfileByAppUserId(targetAppUserId);
      if (!profile) {
        return {
          success: true,
          data: [],
          meta: { page, limit, total: 0, totalPages: 1 },
        };
      }
      targetHrUserId = Number(profile.hrUserId);
    } else if (!privileged) {
      const profile = await this.getHrProfileByAppUserId(authUser.id);
      if (!profile) {
        return {
          success: true,
          data: [],
          meta: { page, limit, total: 0, totalPages: 1 },
        };
      }
      targetHrUserId = Number(profile.hrUserId);
    }

    const hrUserScopeSql =
      targetHrUserId !== null
        ? Prisma.sql`AND s.user_id = ${targetHrUserId}`
        : Prisma.empty;
    const searchSql =
      search.length > 0
        ? Prisma.sql`
            AND (
              lower(coalesce(u.full_name, '')) LIKE lower(${`%${search}%`})
              OR lower(coalesce(u.username, '')) LIKE lower(${`%${search}%`})
              OR lower(coalesce(hu.employee_code, '')) LIKE lower(${`%${search}%`})
            )
          `
        : Prisma.empty;
    const dateFromSql = query.dateFrom
      ? Prisma.sql`AND s.work_date >= ${query.dateFrom}::date`
      : Prisma.empty;
    const dateToSql = query.dateTo
      ? Prisma.sql`AND s.work_date <= ${query.dateTo}::date`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
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
      data: normalizeHrDates(rows),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getAttendanceDashboard(authUser: AuthUser) {
    if (!authUser.roles?.includes('admin')) {
      throw new ForbiddenException('Dashboard absensi hanya tersedia untuk admin.');
    }

    const autoSubmitEnabled = await this.getBooleanSetting('attendance', 'auto_submit_enabled', true);
    const autoSubmitConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );
    const faceVerifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );

    const summaryRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const qualityRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const reviewRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const productivityRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const recentSessions = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const exceptionEvents = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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
        summary: normalizeHrDates(summaryRows[0] ?? {
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
        qualityOverview: normalizeHrDates(qualityRows[0] ?? {
          avg_face_score_today: null,
          avg_enrollment_quality: null,
          avg_match_similarity_today: null,
          avg_liveness_score_today: null,
        }),
        reviewOverview: normalizeHrDates(reviewRows[0] ?? {
          pending_review_count: 0,
          clarification_count: 0,
          approved_today_count: 0,
          rejected_today_count: 0,
          avg_resolution_minutes: null,
        }),
        productivityOverview: normalizeHrDates(productivityRows[0] ?? {
          total_work_minutes_today: 0,
          avg_work_minutes_today: null,
        }),
        recentSessions: normalizeHrDates(recentSessions),
        exceptionEvents: normalizeHrDates(exceptionEvents),
        settings: {
          autoSubmitEnabled,
          autoSubmitConfidenceThreshold,
          faceIdentifyConfidenceThreshold,
          faceVerifyConfidenceThreshold,
        },
      },
    };
  }

  async getSettings(authUser: AuthUser) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('HR settings are only available to privileged roles.');
    }

    const autoSubmitEnabled = await this.getBooleanSetting('attendance', 'auto_submit_enabled', true);
    const autoSubmitConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );
    const faceVerifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );

    return {
      success: true,
      data: {
        autoSubmitEnabled,
        autoSubmitConfidenceThreshold,
        faceIdentifyConfidenceThreshold,
        faceVerifyConfidenceThreshold,
      },
    };
  }

  async updateSetting(authUser: AuthUser, settingKey: string, value: string) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Updating HR settings is only available to privileged roles.');
    }

    const actorId = toAuditUserId(authUser.id);
    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.hr_settings (
        setting_key,
        setting_value,
        setting_group,
        is_active,
        created_at,
        created_by,
        updated_at,
        updated_by
      )
      VALUES (
        ${settingKey},
        ${value},
        'attendance',
        true,
        now(),
        ${actorId},
        now(),
        ${actorId}
      )
      ON CONFLICT (setting_key)
      DO UPDATE SET
        setting_value = EXCLUDED.setting_value,
        is_active = true,
        updated_at = now(),
        updated_by = ${actorId},
        deleted_at = null,
        deleted_by = null
    `);

    return {
      success: true,
      data: {
        settingKey,
        value,
      },
    };
  }

  async getAttendanceReviews(authUser: AuthUser, query: QueryHrAttendanceReviewDto) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Attendance review queue is only available to privileged roles.');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const search = query.search?.trim() ?? '';

    const searchClause = search
      ? Prisma.sql`AND (
          u.username ILIKE ${`%${search}%`}
          OR u.full_name ILIKE ${`%${search}%`}
          OR coalesce(e.reason_code, '') ILIKE ${`%${search}%`}
        )`
      : Prisma.empty;

    const reviewStatusClause = query.reviewStatus
      ? Prisma.sql`AND e.review_status = ${query.reviewStatus}`
      : Prisma.sql`AND e.review_status = 'pending'`;

    const reasonClause = query.reasonCode
      ? Prisma.sql`AND e.reason_code = ${query.reasonCode}`
      : Prisma.empty;

    const validationStateClause = query.validationUiState
      ? Prisma.sql`AND coalesce(e.metadata_json->>'validationUiState', '') = ${query.validationUiState}`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
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
      data: normalizeHrDates(rows),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getAttendanceReviewDetail(authUser: AuthUser, eventId: number) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Attendance review detail is only available to privileged roles.');
    }

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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
      throw new NotFoundException('Attendance review item not found.');
    }

    const reviewHistory = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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
      data: normalizeHrDates({
        ...row,
        reviewHistory,
      }),
    };
  }

  async updateAttendanceReview(
    authUser: AuthUser,
    eventId: number,
    nextStatus: 'pending' | 'approved' | 'rejected' | 'needs_clarification',
    note?: string,
  ) {
    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Attendance review action is only available to privileged roles.');
    }

    const actorId = toAuditUserId(authUser.id);
    const rows = await this.prisma.$queryRaw<Array<{
      id: number;
      sessionId: number | null;
      eventType: string;
      result: string;
      reviewStatus: string | null;
    }>>(Prisma.sql`
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
      throw new NotFoundException('Attendance review item not found.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
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

      await tx.$executeRaw(Prisma.sql`
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
          await tx.$executeRaw(Prisma.sql`
            UPDATE public.hr_attendance_sessions
            SET
              clock_in_status = ${nextStatus === 'approved' ? 'success' : nextStatus === 'rejected' ? 'rejected' : 'manual_review'},
              updated_at = now(),
              updated_by = ${actorId}
            WHERE id = ${row.sessionId}
          `);
        }

        if (row.eventType === 'clock_out') {
          await tx.$executeRaw(Prisma.sql`
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
      message:
        nextStatus === 'pending'
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

  async getAttendanceEventSnapshot(authUser: AuthUser, eventId: number) {
    const privileged = this.isPrivileged(authUser.roles);
    const rows = await this.prisma.$queryRaw<Array<{ snapshot_url: string | null; user_id: number }>>(Prisma.sql`
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
      throw new NotFoundException('Attendance snapshot not found.');
    }

    const baseDir = this.getAttendanceStorageBaseDir();
    const resolvedFile = this.resolveAttendanceSnapshotPath(row.snapshot_url, baseDir);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
      throw new BadRequestException('Attendance snapshot path is outside the allowed storage root.');
    }

    const buffer = await readFile(resolvedFile).catch(() => null);
    if (!buffer) {
      throw new NotFoundException('Attendance snapshot file is missing.');
    }

    const extension = path.extname(resolvedFile).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';

    return {
      buffer,
      mimeType,
      fileName: path.basename(resolvedFile),
    };
  }

  async getFaceEnrollmentSnapshot(authUser: AuthUser, enrollmentId: number) {
    const privileged = this.isPrivileged(authUser.roles);
    const rows = await this.prisma.$queryRaw<Array<{ snapshot_url: string | null; app_user_id: number }>>(Prisma.sql`
      SELECT hfe.snapshot_url, hu.user_id AS app_user_id
      FROM public.hr_face_enrollments hfe
      JOIN public.hr_users hu ON hu.id = hfe.user_id
      WHERE hfe.id = ${enrollmentId}
        AND hfe.deleted_at IS NULL
        AND (
          ${privileged}
          OR hu.user_id = ${authUser.id}
        )
      LIMIT 1
    `);

    const row = rows[0];
    if (!row?.snapshot_url) {
      throw new NotFoundException('Face enrollment snapshot not found.');
    }

    const baseDir = this.getAttendanceStorageBaseDir();
    const resolvedFile = this.resolveAttendanceSnapshotPath(row.snapshot_url, baseDir);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
      throw new BadRequestException('Face enrollment snapshot path is outside the allowed storage root.');
    }

    const buffer = await readFile(resolvedFile).catch(() => null);
    if (!buffer) {
      throw new NotFoundException('Face enrollment snapshot file is missing.');
    }

    const extension = path.extname(resolvedFile).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';

    return {
      buffer,
      mimeType,
      fileName: path.basename(resolvedFile),
    };
  }

  async getWorksites(query: QueryHrWorksiteDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const search = query.search?.trim() ?? '';

    const searchClause = search
      ? Prisma.sql`AND (w.name ILIKE ${`%${search}%`} OR w.code ILIKE ${`%${search}%`})`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
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

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
      SELECT count(*)::bigint AS total
      FROM public.hr_worksites w
      WHERE w.deleted_at IS NULL
      ${searchClause}
    `);

    const total = Number(countRows[0]?.total ?? 0);

    return {
      success: true,
      data: normalizeHrDates(rows),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createWorksite(dto: CreateHrWorksiteDto, authUser: AuthUser) {
    const exists = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND code = ${dto.code}
      LIMIT 1
    `);

    if (exists.length > 0) {
      throw new BadRequestException('Worksite code already exists.');
    }

    await this.prisma.$executeRaw(Prisma.sql`
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
        ${toAuditUserId(authUser.id)},
        ${toAuditUserId(authUser.id)}
      )
    `);

    return { success: true, message: 'Worksite created.' };
  }

  async updateWorksite(id: number, dto: UpdateHrWorksiteDto, authUser: AuthUser) {
    const existing = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing.length === 0) {
      throw new NotFoundException('Worksite not found.');
    }

    if (dto.code) {
      const duplicate = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
        SELECT id
        FROM public.hr_worksites
        WHERE deleted_at IS NULL
          AND code = ${dto.code}
          AND id <> ${id}
        LIMIT 1
      `);
      if (duplicate.length > 0) {
        throw new BadRequestException('Worksite code already exists.');
      }
    }

    const sets: Prisma.Sql[] = [];
    if (typeof dto.name !== 'undefined') sets.push(Prisma.sql`name = ${dto.name}`);
    if (typeof dto.code !== 'undefined') sets.push(Prisma.sql`code = ${dto.code}`);
    if (typeof dto.latitude !== 'undefined') sets.push(Prisma.sql`latitude = ${dto.latitude}`);
    if (typeof dto.longitude !== 'undefined') sets.push(Prisma.sql`longitude = ${dto.longitude}`);
    if (typeof dto.radiusMeters !== 'undefined') sets.push(Prisma.sql`radius_meters = ${dto.radiusMeters}`);
    if (typeof dto.isActive !== 'undefined') sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    sets.push(Prisma.sql`updated_at = now()`);
    sets.push(Prisma.sql`updated_by = ${toAuditUserId(authUser.id)}`);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_worksites
      SET ${Prisma.join(sets, ', ')}
      WHERE id = ${id}
    `);

    return { success: true, message: 'Worksite updated.' };
  }

  async removeWorksite(id: number, authUser: AuthUser) {
    const existing = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing.length === 0) {
      throw new NotFoundException('Worksite not found.');
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_worksites
      SET
        deleted_at = now(),
        deleted_by = ${toAuditUserId(authUser.id)},
        updated_at = now(),
        updated_by = ${toAuditUserId(authUser.id)}
      WHERE id = ${id}
    `);

    return { success: true, message: 'Worksite deleted.' };
  }

  private async getHrProfileByAppUserId(appUserId: number) {
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        hu.face_enrollment_status AS "faceEnrollmentStatus",
        hu.employee_role_type AS "employeeRoleType",
        hu.is_active AS "isActive",
        u.username,
        u.full_name AS "fullName",
        hw.id AS "defaultWorksiteId",
        hw.name AS "defaultWorksiteName",
        hw.code AS "defaultWorksiteCode",
        hw.radius_meters AS "defaultWorksiteRadiusMeters"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      WHERE hu.deleted_at IS NULL
        AND hu.user_id = ${appUserId}
      LIMIT 1
    `);

    return rows[0] ?? null;
  }

  private async requireHrProfileByAppUserId(appUserId: number) {
    const profile = await this.getHrProfileByAppUserId(appUserId);
    if (!profile) {
      throw new NotFoundException('HR attendance profile not found for current user.');
    }
    return profile as {
      hrUserId: number;
      appUserId: number;
      employeeCode: string | null;
      faceEnrollmentStatus: string;
      employeeRoleType: string;
      isActive: boolean;
      username: string;
      fullName: string | null;
      defaultWorksiteId: number | null;
      defaultWorksiteName: string | null;
      defaultWorksiteCode: string | null;
      defaultWorksiteRadiusMeters: number | null;
    };
  }

  private async getDefaultWorksite(hrUserId: number) {
    const rows = await this.getAssignedWorksites(hrUserId);
    return rows[0] ?? null;
  }

  private resolveWorksiteForCoordinates(
    worksites: HrWorksiteRow[],
    latitude: number | null | undefined,
    longitude: number | null | undefined,
  ) {
    if (!worksites.length || latitude == null || longitude == null) {
      return {
        worksite: worksites[0] ?? null,
        distanceMeters: null as number | null,
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

  private async resolveEnrollmentTargetProfile(authUser: AuthUser, targetAppUserId?: number) {
    if (targetAppUserId == null || targetAppUserId === authUser.id) {
      return this.requireHrProfileByAppUserId(authUser.id);
    }

    if (!this.isPrivileged(authUser.roles)) {
      throw new BadRequestException('Hanya manager atau admin yang boleh mendaftarkan wajah pegawai lain.');
    }

    return this.requireHrProfileByAppUserId(targetAppUserId);
  }

  private async getBooleanSetting(settingGroup: string, settingKey: string, fallback: boolean) {
    const rows = await this.prisma.$queryRaw<Array<{ settingValue: string | null }>>(Prisma.sql`
      SELECT setting_value AS "settingValue"
      FROM public.hr_settings
      WHERE deleted_at IS NULL
        AND setting_group = ${settingGroup}
        AND (setting_key = ${settingKey} OR setting_key = ${`${settingGroup}.${settingKey}`})
      ORDER BY id DESC
      LIMIT 1
    `);

    const raw = rows[0]?.settingValue?.trim().toLowerCase();
    if (!raw) {
      return fallback;
    }

    if (['1', 'true', 'yes', 'on'].includes(raw)) {
      return true;
    }

    if (['0', 'false', 'no', 'off'].includes(raw)) {
      return false;
    }

    return fallback;
  }

  private async getNumberSetting(settingGroup: string, settingKey: string, fallback: number) {
    const rows = await this.prisma.$queryRaw<Array<{ settingValue: string | null }>>(Prisma.sql`
      SELECT setting_value AS "settingValue"
      FROM public.hr_settings
      WHERE deleted_at IS NULL
        AND setting_group = ${settingGroup}
        AND (setting_key = ${settingKey} OR setting_key = ${`${settingGroup}.${settingKey}`})
      ORDER BY id DESC
      LIMIT 1
    `);

    const raw = rows[0]?.settingValue?.trim();
    if (!raw) {
      return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return parsed;
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
      const similarity = this.compareFaceEmbedding(this.requireFaceEmbedding(row.embeddingJson), inputEmbedding);
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

  private requireFaceEmbedding(faceEmbedding: unknown) {
    if (!Array.isArray(faceEmbedding) || faceEmbedding.length < 16) {
      throw new BadRequestException('Face embedding is required for face verification.');
    }

    const normalized = faceEmbedding
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (normalized.length < 16) {
      throw new BadRequestException('Face embedding payload is invalid.');
    }

    return normalized;
  }

  private async requireActiveFaceEnrollment(hrUserId: number) {
    const rows = await this.prisma.$queryRaw<Array<{ embeddingJson: unknown }>>(Prisma.sql`
      SELECT embedding_json AS "embeddingJson"
      FROM public.hr_face_enrollments
      WHERE user_id = ${hrUserId}
        AND deleted_at IS NULL
        AND is_active = true
      ORDER BY id DESC
      LIMIT 1
    `);

    const row = rows[0];
    if (!row?.embeddingJson) {
      throw new BadRequestException('Active face enrollment reference is missing.');
    }

    return {
      embedding: this.requireFaceEmbedding(row.embeddingJson),
    };
  }

  private compareFaceEmbedding(left: number[], right: number[]) {
    const length = Math.min(left.length, right.length);
    if (length < 16) {
      throw new BadRequestException('Face embedding dimensions do not match.');
    }

    let dot = 0;
    let leftNorm = 0;
    let rightNorm = 0;

    for (let index = 0; index < length; index += 1) {
      const a = Number(left[index] ?? 0);
      const b = Number(right[index] ?? 0);
      dot += a * b;
      leftNorm += a * a;
      rightNorm += b * b;
    }

    if (leftNorm <= 0 || rightNorm <= 0) {
      return 0;
    }

    return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
  }

  private async insertAttendanceEvent(
    hrUserId: number,
    actorId: number | null,
    payload: {
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
    },
  ) {
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

  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadius = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
  }

  private diffMinutes(clockInAt: Date | string | null) {
    if (!clockInAt) {
      return 0;
    }
    const start = new Date(clockInAt);
    const end = new Date();
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  }

  private async persistSnapshot(bucket: string, prefix: string, dataUrl: string) {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new BadRequestException('Snapshot data URL is invalid.');
    }

    const mimeType = match[1];
    const base64 = match[2];
    const extension = mimeType.includes('png') ? 'png' : 'jpg';
    const fileName = `${prefix}-${Date.now()}-${randomUUID()}.${extension}`;
    const baseDir = this.getAttendanceStorageBaseDir();
    const targetDir = path.join(baseDir, bucket);

    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, fileName);
    await writeFile(filePath, Buffer.from(base64, 'base64'));

    return filePath;
  }

  private getAttendanceStorageBaseDir() {
    return (
      process.env.HR_ATTENDANCE_STORAGE_PATH || path.resolve(process.cwd(), '../../temp/hr-attendance')
    );
  }

  private resolveAttendanceSnapshotPath(snapshotUrl: string, baseDir: string) {
    if (snapshotUrl.startsWith('/temp/hr-attendance/')) {
      return path.join(baseDir, snapshotUrl.replace('/temp/hr-attendance/', ''));
    }

    return path.resolve(snapshotUrl);
  }

  private isPrivileged(roles?: string[]) {
    return Array.isArray(roles) && roles.some((role) => role === 'admin' || role === 'manager');
  }
}
