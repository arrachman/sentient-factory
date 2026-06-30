// HR Timesheets — /api/hr/timesheets (derived aggregation over attendance sessions)
import { apiGet } from './client';

export interface TimesheetRow {
  appUserId: string;
  employeeCode?: string | null;
  username?: string;
  fullName?: string | null;
  daysPresent: number;
  holidayDays?: number;
  totalMinutes: number;
  holidayMinutes?: number;
  overtimeMinutes: number;
  firstDate?: string | null;
  lastDate?: string | null;
}

export interface TimesheetQuery {
  page?: number;
  limit?: number;
  userId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TimesheetPayload {
  data?: TimesheetRow[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    standardDailyMinutes?: number;
    overtimeEnabled?: boolean;
    dailyRegularMinutes?: number;
    countHolidayAsOvertime?: boolean;
  };
  [key: string]: unknown;
}

export async function listTimesheets(query?: TimesheetQuery): Promise<TimesheetPayload> {
  return apiGet<TimesheetPayload>(
    '/hr/timesheets',
    query as Record<string, string | number | undefined>,
  );
}

/** Format minutes as a compact "Xj Ym" (jam/menit) label. */
export function formatMinutes(min: number | null | undefined): string {
  const m = Math.max(0, Math.round(Number(min ?? 0)));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}m`;
  return rem === 0 ? `${h}j` : `${h}j ${rem}m`;
}
