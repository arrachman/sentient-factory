import { Injectable, NotFoundException } from '@nestjs/common';
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
import { AttendanceDashboardService } from './attendance-dashboard.service';

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
    private attendanceDashboardService: AttendanceDashboardService,
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

  getAttendanceDashboard(authUser: AuthUser) {
    return this.attendanceDashboardService.getAttendanceDashboard(authUser);
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
