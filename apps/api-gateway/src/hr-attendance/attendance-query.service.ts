import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import {
  getHrProfileByAppUserId,
  isPrivileged,
  normalizeHrDates,
} from './hr-attendance-helpers';
import {
  getAttendanceStorageBaseDir,
  resolveAttendanceSnapshotPath,
} from './hr-attendance-snapshot';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';

type AuthUser = {
  id: number;
  roles?: string[];
};

const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;

@Injectable()
export class AttendanceQueryService {
  constructor(
    private prisma: PrismaService,
    private settingsService: AttendanceSettingsService,
    private worksiteService: WorksiteService,
  ) {}

  async getAttendanceMe(authUser: AuthUser) {
    const profile = await getHrProfileByAppUserId(this.prisma, authUser.id);
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

    const assignedWorksites = await this.worksiteService.getAssignedWorksites(
      Number(profile.hrUserId),
    );

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

    const autoSubmitEnabled = await this.settingsService.getBooleanSetting(
      'attendance',
      'auto_submit_enabled',
      true,
    );
    const autoSubmitConfidenceThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );
    const faceVerifyConfidenceThreshold = await this.settingsService.getNumberSetting(
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
    const privileged = isPrivileged(authUser.roles);
    const search = query.search?.trim() ?? '';
    const targetAppUserId = query.userId ? (privileged ? query.userId : authUser.id) : null;

    let targetHrUserId: number | null = null;
    if (targetAppUserId !== null) {
      const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);
      if (!profile) {
        return {
          success: true,
          data: [],
          meta: { page, limit, total: 0, totalPages: 1 },
        };
      }
      targetHrUserId = Number(profile.hrUserId);
    } else if (!privileged) {
      const profile = await getHrProfileByAppUserId(this.prisma, authUser.id);
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
      targetHrUserId !== null ? Prisma.sql`AND s.user_id = ${targetHrUserId}` : Prisma.empty;
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

    const autoSubmitEnabled = await this.settingsService.getBooleanSetting(
      'attendance',
      'auto_submit_enabled',
      true,
    );
    const autoSubmitConfidenceThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );
    const faceVerifyConfidenceThreshold = await this.settingsService.getNumberSetting(
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
        summary: normalizeHrDates(
          summaryRows[0] ?? {
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
          },
        ),
        qualityOverview: normalizeHrDates(
          qualityRows[0] ?? {
            avg_face_score_today: null,
            avg_enrollment_quality: null,
            avg_match_similarity_today: null,
            avg_liveness_score_today: null,
          },
        ),
        reviewOverview: normalizeHrDates(
          reviewRows[0] ?? {
            pending_review_count: 0,
            clarification_count: 0,
            approved_today_count: 0,
            rejected_today_count: 0,
            avg_resolution_minutes: null,
          },
        ),
        productivityOverview: normalizeHrDates(
          productivityRows[0] ?? {
            total_work_minutes_today: 0,
            avg_work_minutes_today: null,
          },
        ),
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

  async getAttendanceEventSnapshot(authUser: AuthUser, eventId: number) {
    const privileged = isPrivileged(authUser.roles);
    const rows = await this.prisma.$queryRaw<
      Array<{ snapshot_url: string | null; user_id: number }>
    >(Prisma.sql`
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

    const baseDir = getAttendanceStorageBaseDir();
    const resolvedFile = resolveAttendanceSnapshotPath(row.snapshot_url, baseDir);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
      throw new Error('Attendance snapshot path is outside the allowed storage root.');
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
}
