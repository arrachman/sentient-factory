import { Prisma } from '@prisma/client';

/**
 * Pure SQL builders for AttendanceQueryService.
 *
 * Every function returns a `Prisma.Sql` (or `Prisma.empty`) with parameter
 * interpolation intact — no I/O, no service dependencies. Table names, joins,
 * casts, ordering, and limits are preserved verbatim from the original inline
 * construction.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared fragment bundles
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One bundle per request so the same search/date/scope values are reused
 * exactly between the rows query and the count query (and any other consumer).
 * History and timesheet each have their own bundle because the `userId` scope
 * differs (`s.user_id = ${id}` for timesheet, `s.user_id = ${id}` for history —
 * semantically the same shape but kept separate for clarity).
 */
export interface AttendanceScopeFragments {
  hrUserScopeSql: Prisma.Sql;
  searchSql: Prisma.Sql;
  dateFromSql: Prisma.Sql;
  dateToSql: Prisma.Sql;
}

/**
 * Build the search predicate shared by attendance history and timesheet.
 * Duplicated inline at L165–174 and L304–312 of the original service.
 */
function buildSearchPredicate(search: string): Prisma.Sql {
  return search.length > 0
    ? Prisma.sql`
        AND (
          lower(coalesce(u.full_name, '')) LIKE lower(${`%${search}%`})
          OR lower(coalesce(u.username, '')) LIKE lower(${`%${search}%`})
          OR lower(coalesce(hu.employee_code, '')) LIKE lower(${`%${search}%`})
        )
      `
    : Prisma.empty;
}

/**
 * Build the date-from / date-to fragments shared by history and timesheet.
 * Duplicated inline at L175–180 and L313–318 of the original service.
 */
function buildDateFragments(
  dateFrom: string | undefined,
  dateTo: string | undefined,
): { dateFromSql: Prisma.Sql; dateToSql: Prisma.Sql } {
  return {
    dateFromSql: dateFrom
      ? Prisma.sql`AND s.work_date >= ${dateFrom}::date`
      : Prisma.empty,
    dateToSql: dateTo
      ? Prisma.sql`AND s.work_date <= ${dateTo}::date`
      : Prisma.empty,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getAttendanceMe — current-day session + recent events
// ─────────────────────────────────────────────────────────────────────────────

/** Current-day session query (original L56–75). */
export function buildAttendanceTodayQuery(hrUserId: number): Prisma.Sql {
  return Prisma.sql`
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
    WHERE s.user_id = ${hrUserId}
      AND s.deleted_at IS NULL
      AND s.work_date = CURRENT_DATE
    ORDER BY s.id DESC
    LIMIT 1
  `;
}

/** Recent attendance events query (original L77–90). */
export function buildAttendanceRecentEventsQuery(hrUserId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT
      e.id,
      e.event_type,
      e.event_at,
      e.result,
      e.reason_code,
      e.snapshot_url
    FROM public.hr_attendance_events e
    WHERE e.user_id = ${hrUserId}
      AND e.deleted_at IS NULL
    ORDER BY e.event_at DESC, e.id DESC
    LIMIT 5
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Attendance history — scope fragments, rows query, count query
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the shared history scope/search/date fragment bundle.
 * History user-scope resolution (original L138–161) stays in the service;
 * here we only receive the resolved `targetHrUserId`.
 */
export function buildAttendanceHistoryFragments(args: {
  targetHrUserId: number | null;
  search: string;
  dateFrom: string | undefined;
  dateTo: string | undefined;
}): AttendanceScopeFragments {
  const { targetHrUserId, search, dateFrom, dateTo } = args;
  const { dateFromSql, dateToSql } = buildDateFragments(dateFrom, dateTo);
  return {
    hrUserScopeSql:
      targetHrUserId !== null
        ? Prisma.sql`AND s.user_id = ${targetHrUserId}`
        : Prisma.empty,
    searchSql: buildSearchPredicate(search),
    dateFromSql,
    dateToSql,
  };
}

/** Attendance history rows query (original L182–208). */
export function buildAttendanceHistoryRowsQuery(args: {
  fragments: AttendanceScopeFragments;
  limit: number;
  offset: number;
}): Prisma.Sql {
  const { fragments, limit, offset } = args;
  return Prisma.sql`
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
      ${fragments.hrUserScopeSql}
      ${fragments.searchSql}
      ${fragments.dateFromSql}
      ${fragments.dateToSql}
    ORDER BY s.work_date DESC, s.id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}

/** Attendance history count query (original L210–220). */
export function buildAttendanceHistoryCountQuery(
  fragments: AttendanceScopeFragments,
): Prisma.Sql {
  return Prisma.sql`
    SELECT count(*)::bigint AS total
    FROM public.hr_attendance_sessions s
    JOIN public.hr_users hu ON hu.id = s.user_id
    JOIN public.m0_users u ON u.id = hu.user_id
    WHERE s.deleted_at IS NULL
      ${fragments.hrUserScopeSql}
      ${fragments.searchSql}
      ${fragments.dateFromSql}
      ${fragments.dateToSql}
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Timesheet — holiday predicate, scope fragments, rows query, count query
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holiday predicate expression (original L291–300). Reused 3× within the
 * timesheet rows query (daysHoliday, holidayMinutes, overtime conditional).
 * Built once per request so the exact same expression interpolates each use.
 */
export function buildHolidayExpr(): Prisma.Sql {
  return Prisma.sql`EXISTS (
    SELECT 1 FROM public.hr_holidays h
    WHERE h.deleted_at IS NULL AND h.is_active
      AND (
        (NOT h.is_recurring AND h.holiday_date = s.work_date)
        OR (h.is_recurring AND to_char(h.holiday_date, 'MM-DD') = to_char(s.work_date, 'MM-DD'))
      )
  )`;
}

/**
 * Build the shared timesheet scope/search/date fragment bundle.
 * Timesheet user-scope resolution (original L253–265) stays in the service;
 * here we only receive the resolved `targetHrUserId`.
 */
export function buildTimesheetFragments(args: {
  targetHrUserId: number | null;
  search: string;
  dateFrom: string | undefined;
  dateTo: string | undefined;
}): AttendanceScopeFragments {
  const { targetHrUserId, search, dateFrom, dateTo } = args;
  const { dateFromSql, dateToSql } = buildDateFragments(dateFrom, dateTo);
  return {
    hrUserScopeSql:
      targetHrUserId !== null
        ? Prisma.sql`AND s.user_id = ${targetHrUserId}`
        : Prisma.empty,
    searchSql: buildSearchPredicate(search),
    dateFromSql,
    dateToSql,
  };
}

/** Timesheet rows query (original L320–352). */
export function buildTimesheetRowsQuery(args: {
  fragments: AttendanceScopeFragments;
  isHolidayExpr: Prisma.Sql;
  overtimeEnabled: boolean;
  countHolidayAsOvertime: boolean;
  standardDailyMinutes: number;
  limit: number;
  offset: number;
}): Prisma.Sql {
  const {
    fragments,
    isHolidayExpr,
    overtimeEnabled,
    countHolidayAsOvertime,
    standardDailyMinutes,
    limit,
    offset,
  } = args;
  return Prisma.sql`
    SELECT
      hu.user_id AS "appUserId",
      hu.employee_code AS "employeeCode",
      u.username,
      u.full_name AS "fullName",
      count(*) FILTER (WHERE s.clock_in_at IS NOT NULL)::int AS "daysPresent",
      count(*) FILTER (WHERE s.clock_in_at IS NOT NULL AND ${isHolidayExpr})::int AS "holidayDays",
      coalesce(sum(s.total_work_minutes), 0)::int AS "totalMinutes",
      coalesce(sum(CASE WHEN ${isHolidayExpr} THEN coalesce(s.total_work_minutes, 0) ELSE 0 END), 0)::int AS "holidayMinutes",
      coalesce(sum(
        CASE
          WHEN ${overtimeEnabled} = false THEN 0
          WHEN ${countHolidayAsOvertime} = true AND ${isHolidayExpr}
            THEN coalesce(s.total_work_minutes, 0)
          ELSE GREATEST(coalesce(s.total_work_minutes, 0) - ${standardDailyMinutes}, 0)
        END
      ), 0)::int AS "overtimeMinutes",
      min(s.work_date) AS "firstDate",
      max(s.work_date) AS "lastDate"
    FROM public.hr_attendance_sessions s
    JOIN public.hr_users hu ON hu.id = s.user_id
    JOIN public.m0_users u ON u.id = hu.user_id
    WHERE s.deleted_at IS NULL
      ${fragments.hrUserScopeSql}
      ${fragments.searchSql}
      ${fragments.dateFromSql}
      ${fragments.dateToSql}
    GROUP BY hu.user_id, hu.employee_code, u.username, u.full_name
    ORDER BY u.full_name NULLS LAST, u.username
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}

/** Timesheet count query (original L354–367). */
export function buildTimesheetCountQuery(
  fragments: AttendanceScopeFragments,
): Prisma.Sql {
  return Prisma.sql`
    SELECT count(*)::bigint AS total FROM (
      SELECT 1
      FROM public.hr_attendance_sessions s
      JOIN public.hr_users hu ON hu.id = s.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE s.deleted_at IS NULL
        ${fragments.hrUserScopeSql}
        ${fragments.searchSql}
        ${fragments.dateFromSql}
        ${fragments.dateToSql}
      GROUP BY hu.user_id
    ) t
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event snapshot — authorized DB lookup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attendance event snapshot query (original L389–402).
 * The authorized DB lookup is step 1 of the snapshot retrieval sequence;
 * path validation + file reading stay in the service.
 */
export function buildAttendanceSnapshotQuery(args: {
  eventId: number;
  privileged: boolean;
  appUserId: number;
}): Prisma.Sql {
  const { eventId, privileged, appUserId } = args;
  return Prisma.sql`
    SELECT e.snapshot_url, e.user_id
    FROM public.hr_attendance_events e
    JOIN public.hr_users hu ON hu.id = e.user_id
    WHERE e.id = ${eventId}
      AND e.deleted_at IS NULL
      AND (
        ${privileged}
        OR hu.user_id = ${appUserId}
      )
    LIMIT 1
  `;
}