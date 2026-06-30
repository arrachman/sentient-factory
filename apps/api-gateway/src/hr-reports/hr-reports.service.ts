import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeHrDates } from '../hr-attendance/hr-attendance-helpers';
import {
  HrReportCatalogItem,
  HrReportColumn,
  HrReportDataset,
  HrReportDef,
  HrReportFilters,
} from './report-types';

const DEFAULT_DAILY_MINUTES = 480;

function toHours(minutes: unknown): number {
  const m = Number(minutes) || 0;
  return Math.round((m / 60) * 100) / 100;
}

@Injectable()
export class HrReportsService {
  constructor(private prisma: PrismaService) {}

  private readonly defs: HrReportDef[] = [
    {
      key: 'attendance-recap',
      title: 'Rekap Kehadiran',
      description: 'Hari hadir, total jam, dan lembur per karyawan untuk periode terpilih.',
      columns: [
        { key: 'employeeCode', header: 'Kode', type: 'text' },
        { key: 'fullName', header: 'Karyawan', type: 'text' },
        { key: 'daysPresent', header: 'Hari Hadir', type: 'number' },
        { key: 'totalHours', header: 'Total Jam', type: 'hours' },
        { key: 'overtimeHours', header: 'Lembur (jam)', type: 'hours' },
      ],
      resolve: (f) => this.resolveAttendanceRecap(f),
    },
    {
      key: 'project-hours',
      title: 'Jam per Proyek',
      description: 'Akumulasi jam kerja per proyek, termasuk status billable.',
      columns: [
        { key: 'projectCode', header: 'Kode', type: 'text' },
        { key: 'projectName', header: 'Proyek', type: 'text' },
        { key: 'billableLabel', header: 'Tipe', type: 'status' },
        { key: 'totalHours', header: 'Total Jam', type: 'hours' },
        { key: 'entries', header: 'Entri', type: 'number' },
        { key: 'employees', header: 'Karyawan', type: 'number' },
      ],
      resolve: (f) => this.resolveProjectHours(f),
    },
    {
      key: 'leave-recap',
      title: 'Rekap Cuti',
      description: 'Total hari cuti yang disetujui per karyawan dan tipe cuti.',
      columns: [
        { key: 'employeeCode', header: 'Kode', type: 'text' },
        { key: 'fullName', header: 'Karyawan', type: 'text' },
        { key: 'leaveType', header: 'Tipe Cuti', type: 'text' },
        { key: 'requests', header: 'Pengajuan', type: 'number' },
        { key: 'totalDays', header: 'Total Hari', type: 'days' },
      ],
      resolve: (f) => this.resolveLeaveRecap(f),
    },
  ];

  getCatalog(): HrReportCatalogItem[] {
    return this.defs.map((d) => ({
      key: d.key,
      title: d.title,
      description: d.description,
      columns: d.columns,
    }));
  }

  async getReport(key: string, filters: HrReportFilters): Promise<HrReportDataset> {
    const def = this.defs.find((d) => d.key === key);
    if (!def) throw new NotFoundException(`Laporan "${key}" tidak ditemukan.`);
    const { rows, summary } = await def.resolve(filters);
    return {
      key: def.key,
      title: def.title,
      columns: def.columns as HrReportColumn[],
      rows,
      summary: summary ?? [],
      filters,
      generatedAt: new Date().toISOString(),
    };
  }

  private async getStandardDailyMinutes(): Promise<number> {
    const rows = await this.prisma.$queryRaw<Array<{ setting_value: string }>>(Prisma.sql`
      SELECT setting_value FROM public.hr_settings
      WHERE setting_group = 'attendance' AND setting_key = 'standard_daily_minutes' LIMIT 1`);
    const n = Number(rows[0]?.setting_value);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_DAILY_MINUTES;
  }

  private dateRange(f: HrReportFilters, col: Prisma.Sql) {
    const from = f.dateFrom ? Prisma.sql`AND ${col} >= ${f.dateFrom}::date` : Prisma.empty;
    const to = f.dateTo ? Prisma.sql`AND ${col} <= ${f.dateTo}::date` : Prisma.empty;
    return { from, to };
  }

  private async resolveAttendanceRecap(f: HrReportFilters) {
    const std = await this.getStandardDailyMinutes();
    const { from, to } = this.dateRange(f, Prisma.sql`s.work_date`);
    const userSql = f.userId ? Prisma.sql`AND hu.user_id = ${f.userId}` : Prisma.empty;
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        hu.employee_code AS "employeeCode",
        coalesce(u.full_name, u.username) AS "fullName",
        count(*) FILTER (WHERE s.clock_in_at IS NOT NULL)::int AS "daysPresent",
        coalesce(sum(s.total_work_minutes), 0)::int AS "totalMinutes",
        coalesce(sum(GREATEST(coalesce(s.total_work_minutes, 0) - ${std}, 0)), 0)::int AS "overtimeMinutes"
      FROM public.hr_attendance_sessions s
      JOIN public.hr_users hu ON hu.id = s.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE s.deleted_at IS NULL ${userSql} ${from} ${to}
      GROUP BY hu.employee_code, u.full_name, u.username
      ORDER BY coalesce(u.full_name, u.username)`);

    let totalHours = 0;
    let overtimeHours = 0;
    const mapped = rows.map((r) => {
      const th = toHours(r.totalMinutes);
      const oh = toHours(r.overtimeMinutes);
      totalHours += th;
      overtimeHours += oh;
      return {
        employeeCode: r.employeeCode ?? '—',
        fullName: r.fullName ?? '—',
        daysPresent: Number(r.daysPresent) || 0,
        totalHours: th,
        overtimeHours: oh,
      };
    });
    return {
      rows: normalizeHrDates(mapped),
      summary: [
        { label: 'Jumlah Karyawan', value: mapped.length, type: 'number' as const },
        { label: 'Total Jam', value: Math.round(totalHours * 100) / 100, type: 'hours' as const },
        {
          label: 'Total Lembur (jam)',
          value: Math.round(overtimeHours * 100) / 100,
          type: 'hours' as const,
        },
      ],
    };
  }

  private async resolveProjectHours(f: HrReportFilters) {
    const { from, to } = this.dateRange(f, Prisma.sql`pte.work_date`);
    const projSql = f.projectId ? Prisma.sql`AND pr.id = ${f.projectId}` : Prisma.empty;
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        pr.code AS "projectCode",
        pr.name AS "projectName",
        pr.is_billable AS "isBillable",
        coalesce(sum(pte.minutes), 0)::int AS "totalMinutes",
        count(pte.id)::int AS "entries",
        count(DISTINCT pte.user_id)::int AS "employees"
      FROM public.hr_projects pr
      LEFT JOIN public.hr_project_time_entries pte
        ON pte.project_id = pr.id AND pte.deleted_at IS NULL ${from} ${to}
      WHERE pr.deleted_at IS NULL ${projSql}
      GROUP BY pr.code, pr.name, pr.is_billable
      ORDER BY pr.name`);

    let totalHours = 0;
    let billableHours = 0;
    const mapped = rows.map((r) => {
      const th = toHours(r.totalMinutes);
      totalHours += th;
      if (r.isBillable) billableHours += th;
      return {
        projectCode: r.projectCode ?? '—',
        projectName: r.projectName ?? '—',
        billableLabel: r.isBillable ? 'Billable' : 'Internal',
        totalHours: th,
        entries: Number(r.entries) || 0,
        employees: Number(r.employees) || 0,
      };
    });
    return {
      rows: normalizeHrDates(mapped),
      summary: [
        { label: 'Jumlah Proyek', value: mapped.length, type: 'number' as const },
        { label: 'Total Jam', value: Math.round(totalHours * 100) / 100, type: 'hours' as const },
        {
          label: 'Jam Billable',
          value: Math.round(billableHours * 100) / 100,
          type: 'hours' as const,
        },
      ],
    };
  }

  private async resolveLeaveRecap(f: HrReportFilters) {
    const { from, to } = this.dateRange(f, Prisma.sql`lr.start_date`);
    const userSql = f.userId ? Prisma.sql`AND hu.user_id = ${f.userId}` : Prisma.empty;
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        hu.employee_code AS "employeeCode",
        coalesce(u.full_name, u.username) AS "fullName",
        lt.name AS "leaveType",
        count(*)::int AS "requests",
        coalesce(sum(lr.total_days), 0)::float AS "totalDays"
      FROM public.hr_leave_requests lr
      JOIN public.hr_leave_types lt ON lt.id = lr.leave_type_id
      JOIN public.hr_users hu ON hu.id = lr.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE lr.deleted_at IS NULL AND lr.status = 'approved' ${userSql} ${from} ${to}
      GROUP BY hu.employee_code, u.full_name, u.username, lt.name
      ORDER BY coalesce(u.full_name, u.username), lt.name`);

    let totalDays = 0;
    let totalRequests = 0;
    const mapped = rows.map((r) => {
      const days = Math.round((Number(r.totalDays) || 0) * 100) / 100;
      totalDays += days;
      totalRequests += Number(r.requests) || 0;
      return {
        employeeCode: r.employeeCode ?? '—',
        fullName: r.fullName ?? '—',
        leaveType: r.leaveType ?? '—',
        requests: Number(r.requests) || 0,
        totalDays: days,
      };
    });
    return {
      rows: normalizeHrDates(mapped),
      summary: [
        { label: 'Total Pengajuan', value: totalRequests, type: 'number' as const },
        {
          label: 'Total Hari Cuti',
          value: Math.round(totalDays * 100) / 100,
          type: 'days' as const,
        },
      ],
    };
  }
}
