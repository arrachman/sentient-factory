import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrTimesheetDto } from './dto/query-hr-timesheet.dto';
import {
  getHrProfileByAppUserId,
  resolveHrPrivilege,
  normalizeHrDates,
} from './hr-attendance-helpers';
import {
  getAttendanceStorageBaseDir,
  resolveAttendanceSnapshotPath,
} from './hr-attendance-snapshot';
import { AttendanceSettingsService } from './attendance-settings.service';
import { WorksiteService } from './worksite.service';
import { AttendanceDashboardService } from './attendance-dashboard.service';
import {
  AuthUser,
  DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
  DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
  resolvePagination,
  emptyPaginatedResponse,
  paginatedMeta,
  computeStandardDailyMinutes,
  isPathWithinBase,
  deriveSnapshotMimeType,
  deriveSnapshotFileName,
} from './attendance-query.helpers';
import {
  buildAttendanceTodayQuery,
  buildAttendanceRecentEventsQuery,
  buildAttendanceHistoryFragments,
  buildAttendanceHistoryRowsQuery,
  buildAttendanceHistoryCountQuery,
  buildHolidayExpr,
  buildTimesheetFragments,
  buildTimesheetRowsQuery,
  buildTimesheetCountQuery,
  buildAttendanceSnapshotQuery,
} from './attendance-query.sql';

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

    const todayRows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(
      buildAttendanceTodayQuery(Number(profile.hrUserId)),
    );

    const recentEvents = await this.prisma.$queryRaw<
      Array<Record<string, unknown>>
    >(buildAttendanceRecentEventsQuery(Number(profile.hrUserId)));

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
    const { page, limit, offset } = resolvePagination({
      page: query.page,
      limit: query.limit,
      defaultLimit: 10,
    });
    const privileged = await resolveHrPrivilege(this.prisma, authUser);
    const search = query.search?.trim() ?? '';
    const targetAppUserId = query.userId ? (privileged ? query.userId : authUser.id) : null;

    let targetHrUserId: number | null = null;
    if (targetAppUserId !== null) {
      const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);
      if (!profile) {
        return emptyPaginatedResponse(page, limit);
      }
      targetHrUserId = Number(profile.hrUserId);
    } else if (!privileged) {
      const profile = await getHrProfileByAppUserId(this.prisma, authUser.id);
      if (!profile) {
        return emptyPaginatedResponse(page, limit);
      }
      targetHrUserId = Number(profile.hrUserId);
    }

    const fragments = buildAttendanceHistoryFragments({
      targetHrUserId,
      search,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(
      buildAttendanceHistoryRowsQuery({ fragments, limit, offset }),
    );

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(
      buildAttendanceHistoryCountQuery(fragments),
    );

    const total = Number(countRows[0]?.total ?? 0);

    return {
      success: true,
      data: normalizeHrDates(rows),
      meta: paginatedMeta({ page, limit, total }),
    };
  }

  getAttendanceDashboard(authUser: AuthUser) {
    return this.attendanceDashboardService.getAttendanceDashboard(authUser);
  }

  /**
   * Timesheet — derived aggregation over hr_attendance_sessions (no new tables).
   * One row per employee for the selected period: days present, total minutes,
   * and overtime beyond the standard daily minutes setting. Privileged roles see
   * everyone; regular users see only themselves.
   */
  async getTimesheets(authUser: AuthUser, query: QueryHrTimesheetDto) {
    const { page, limit, offset } = resolvePagination({
      page: query.page,
      limit: query.limit,
      defaultLimit: 25,
    });
    const privileged = await resolveHrPrivilege(this.prisma, authUser);
    const search = query.search?.trim() ?? '';

    // Scope: privileged + userId → that user; otherwise non-privileged → self.
    let targetHrUserId: number | null = null;
    const targetAppUserId = query.userId ? (privileged ? query.userId : authUser.id) : null;
    if (targetAppUserId !== null || !privileged) {
      const profile = await getHrProfileByAppUserId(
        this.prisma,
        targetAppUserId ?? authUser.id,
      );
      if (!profile) {
        return emptyPaginatedResponse(page, limit);
      }
      targetHrUserId = Number(profile.hrUserId);
    }

    // Overtime/break policy (hr-policy module → hr_settings group 'overtime').
    // Falls back to the legacy attendance setting / 8h when unset.
    const legacyStandardMinutes = await this.settingsService.getNumberSetting(
      'attendance',
      'standard_daily_minutes',
      480,
    );
    const overtimeEnabled = await this.settingsService.getBooleanSetting(
      'overtime',
      'enabled',
      true,
    );
    const dailyRegularHours = await this.settingsService.getNumberSetting(
      'overtime',
      'daily_regular_hours',
      Math.round((legacyStandardMinutes / 60) * 100) / 100,
    );
    const countHolidayAsOvertime = await this.settingsService.getBooleanSetting(
      'overtime',
      'count_holiday_as_overtime',
      true,
    );
    const standardDailyMinutes = computeStandardDailyMinutes(dailyRegularHours);

    // A session's work_date is a holiday if an active hr_holidays row matches it,
    // either on the exact date or (for recurring rows) on the same month/day.
    // Built once; interpolated 3× in the rows query so the same expression reuse
    // exactly.
    const isHolidayExpr = buildHolidayExpr();

    const fragments = buildTimesheetFragments({
      targetHrUserId,
      search,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(
      buildTimesheetRowsQuery({
        fragments,
        isHolidayExpr,
        overtimeEnabled,
        countHolidayAsOvertime,
        standardDailyMinutes,
        limit,
        offset,
      }),
    );

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(
      buildTimesheetCountQuery(fragments),
    );

    const total = Number(countRows[0]?.total ?? 0);

    return {
      success: true,
      data: normalizeHrDates(rows),
      meta: paginatedMeta({
        page,
        limit,
        total,
        extra: {
          standardDailyMinutes,
          overtimeEnabled,
          dailyRegularMinutes: standardDailyMinutes,
          countHolidayAsOvertime,
        },
      }),
    };
  }

  async getAttendanceEventSnapshot(authUser: AuthUser, eventId: number) {
    const privileged = await resolveHrPrivilege(this.prisma, authUser);

    // (1) Authorized DB lookup.
    const rows = await this.prisma.$queryRaw<
      Array<{ snapshot_url: string | null; user_id: number }>
    >(buildAttendanceSnapshotQuery({ eventId, privileged, appUserId: authUser.id }));

    const row = rows[0];

    // (2) Missing-URL check.
    if (!row?.snapshot_url) {
      throw new NotFoundException('Attendance snapshot not found.');
    }

    // (3) Resolve path.
    const baseDir = getAttendanceStorageBaseDir();
    const resolvedFile = resolveAttendanceSnapshotPath(row.snapshot_url, baseDir);
    const resolvedBase = path.resolve(baseDir);

    // (4) Enforce base-directory containment (security-sensitive).
    if (!isPathWithinBase(resolvedFile, resolvedBase)) {
      throw new Error('Attendance snapshot path is outside the allowed storage root.');
    }

    // (5) Read file (I/O + error translation stays in the service).
    const buffer = await readFile(resolvedFile).catch(() => null);
    if (!buffer) {
      throw new NotFoundException('Attendance snapshot file is missing.');
    }

    // (6) Derive MIME.
    const mimeType = deriveSnapshotMimeType(resolvedFile);
    const fileName = deriveSnapshotFileName(resolvedFile);

    return {
      buffer,
      mimeType,
      fileName,
    };
  }
}