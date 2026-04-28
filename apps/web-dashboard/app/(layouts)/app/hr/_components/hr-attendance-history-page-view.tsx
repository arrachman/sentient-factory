'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Toolbar,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AssignedWorksiteRow = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

type AttendanceUserOption = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
};

type AttendanceHistoryPayload = {
  data: Array<{
    id: number;
    work_date: string;
    clock_in_at: string | null;
    clock_out_at: string | null;
    clock_in_status: string | null;
    clock_out_status: string | null;
    total_work_minutes: number | null;
    clock_in_worksite_name: string | null;
    clock_out_worksite_name: string | null;
    username: string;
    full_name: string | null;
  }>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const HR_TIME_ZONE = 'Asia/Jakarta';

function SectionShell({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2">
        <ToolbarHeading>
          <ToolbarPageTitle>{title}</ToolbarPageTitle>
        </ToolbarHeading>
      </div>
      {children}
    </div>
  );
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === 'object') {
    const decimalLike = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(decimalLike.d)) {
      const serialized = decimalLike.d.join('');
      const exponent = typeof decimalLike.e === 'number' ? decimalLike.e : serialized.length - 1;
      const sign = decimalLike.s === -1 ? -1 : 1;
      const decimal = Number(`${sign < 0 ? '-' : ''}${serialized[0] ?? '0'}${serialized.length > 1 ? `.${serialized.slice(1)}` : ''}e${exponent}`);
      return Number.isFinite(decimal) ? decimal : 0;
    }
  }
  return 0;
}

function normalizeAssignedWorksiteRow(row: Record<string, unknown>): AssignedWorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? row.worksiteName ?? ''),
    code: String(row.code ?? row.worksiteCode ?? ''),
    radiusMeters: row.radiusMeters == null ? 0 : normalizeNumericValue(row.radiusMeters),
    isPrimary: Boolean(row.isPrimary),
  };
}

function normalizeAttendanceUserOption(row: Record<string, unknown>): AttendanceUserOption {
  return {
    hrUserId: Number(row.hrUserId ?? 0),
    appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'),
    isActive: Boolean(row.isActive),
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites)
      ? row.assignedWorksites
          .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
          .map((entry) => normalizeAssignedWorksiteRow(entry))
      : [],
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700';
    case 'manual_review':
      return 'bg-amber-100 text-amber-800';
    case 'warning':
      return 'bg-orange-100 text-orange-800';
    case 'rejected':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending':
      return 'Menunggu Review';
    case 'manual_review':
      return 'Perlu Review';
    case 'success':
      return 'Berhasil';
    case 'rejected':
      return 'Ditolak';
    case 'approved':
      return 'Disetujui';
    case 'needs_clarification':
      return 'Perlu Klarifikasi';
    case 'warning':
      return 'Peringatan';
    default:
      if (!value) return '-';
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
    }
}

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: HR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '0'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '1'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '1'),
  };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map((value) => Number(value));
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);
  return getJakartaDayKey(utcDate);
}

function getHistoryQuickRange(range: 'today' | 'week' | 'month') {
  const today = getJakartaDayKey(new Date());
  if (range === 'today') return { dateFrom: today, dateTo: today };

  if (range === 'week') {
    const parts = getJakartaCalendarParts(new Date());
    const localMidnightUtc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const dayOfWeek = localMidnightUtc.getUTCDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    return { dateFrom: shiftDateKey(today, mondayOffset), dateTo: today };
  }

  const { year, month } = getJakartaCalendarParts(new Date());
  return {
    dateFrom: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`,
    dateTo: today,
  };
}

function parseHrWallClock(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/,
  );

  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? '0'),
    minute: Number(match[5] ?? '0'),
  };
}

function formatJakartaWallClock(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    timeZone: HR_TIME_ZONE,
    month: 'short',
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));

  return {
    dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`,
    timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`,
    dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
  };
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';

  const wallClock = parseHrWallClock(value);
  if (wallClock) {
    const currentJakarta = getJakartaDayKey(new Date());
    const formatted = formatJakartaWallClock(wallClock);
    return `${formatted.dayKey === currentJakarta ? formatted.timeLabel : `${formatted.dateLabel}, ${formatted.timeLabel}`} WIB`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return (
    new Intl.DateTimeFormat(
      'id-ID',
      isToday
        ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' }
        : { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    ).format(date) + ' WIB'
  );
}

function formatWorkDate(value: string | null | undefined) {
  if (!value) {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: HR_TIME_ZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }

  const wallClock = parseHrWallClock(value);
  if (wallClock) return formatJakartaWallClock(wallClock).dateLabel;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: HR_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatMinutes(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes}m`;
}

export function HrAttendanceHistoryPageView({ initialUserId }: { initialUserId?: string }) {
  const [payload, setPayload] = useState<AttendanceHistoryPayload | null>(null);
  const [attendanceUsers, setAttendanceUsers] = useState<AttendanceUserOption[]>([]);
  const [selectedHistoryUserId, setSelectedHistoryUserId] = useState<string>('all');
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearchInput, setHistorySearchInput] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyQuickRange, setHistoryQuickRange] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');

  useEffect(() => {
    if (initialUserId) setSelectedHistoryUserId(initialUserId);
  }, [initialUserId]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      page: String(historyPage),
      limit: '20',
    });
    if (selectedHistoryUserId !== 'all') params.set('userId', selectedHistoryUserId);
    if (historySearch) params.set('search', historySearch);
    if (historyDateFrom) params.set('dateFrom', historyDateFrom);
    if (historyDateTo) params.set('dateTo', historyDateTo);

    fetchJson<AttendanceHistoryPayload['data']>(`/api/hr/attendance/history?${params.toString()}`).then((data) => {
      if (!cancelled) {
        setPayload(
          data
            ? {
                data: data.data,
                meta: data.meta,
              }
            : null,
        );
      }
    });

    fetchJson<Record<string, unknown>[]>('/api/hr/users').then((usersPayload) => {
      if (!cancelled && usersPayload?.data) {
        setAttendanceUsers(usersPayload.data.map((row) => normalizeAttendanceUserOption(row)));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [historyDateFrom, historyDateTo, historyPage, historySearch, selectedHistoryUserId]);

  useEffect(() => {
    setHistoryPage(1);
  }, [selectedHistoryUserId, historySearch, historyDateFrom, historyDateTo]);

  const hasMultipleEmployees = new Set((payload?.data ?? []).map((row) => `${row.username}:${row.full_name ?? ''}`)).size > 1;
  const showUserFilter = attendanceUsers.length > 0;

  return (
    <SectionShell title="Riwayat Absensi">
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            {showUserFilter ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pegawai</label>
                <select
                  className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0"
                  value={selectedHistoryUserId}
                  onChange={(event) => setSelectedHistoryUserId(event.target.value)}
                >
                  <option value="all">Semua Pegawai</option>
                  {attendanceUsers.map((user) => (
                    <option key={user.appUserId} value={String(user.appUserId)}>
                      {user.fullName ?? user.username}
                      {user.employeeCode ? ` • ${user.employeeCode}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className={showUserFilter ? '' : 'sm:col-span-2'}>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cari</label>
              <div className="mt-3 flex gap-2">
                <Input
                  value={historySearchInput}
                  onChange={(event) => setHistorySearchInput(event.target.value)}
                  placeholder="Nama, username, atau kode pegawai"
                  className="h-11 rounded-xl border-slate-200"
                />
                <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setHistorySearch(historySearchInput.trim())}>
                  Cari
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Dari Tanggal</label>
              <Input
                type="date"
                value={historyDateFrom}
                onChange={(event) => {
                  setHistoryQuickRange('custom');
                  setHistoryDateFrom(event.target.value);
                }}
                className="mt-3 h-11 rounded-xl border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sampai Tanggal</label>
              <Input
                type="date"
                value={historyDateTo}
                onChange={(event) => {
                  setHistoryQuickRange('custom');
                  setHistoryDateTo(event.target.value);
                }}
                className="mt-3 h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Filter</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Hari Ini' },
                { key: 'week', label: 'Minggu Ini' },
                { key: 'month', label: 'Bulan Ini' },
              ].map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-10 rounded-xl',
                    historyQuickRange === item.key
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700',
                  )}
                  onClick={() => {
                    const range = getHistoryQuickRange(item.key as 'today' | 'week' | 'month');
                    setHistoryQuickRange(item.key as 'today' | 'week' | 'month');
                    setHistoryDateFrom(range.dateFrom);
                    setHistoryDateTo(range.dateTo);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl text-slate-600"
              onClick={() => {
                setSelectedHistoryUserId('all');
                setHistorySearchInput('');
                setHistorySearch('');
                setHistoryDateFrom('');
                setHistoryDateTo('');
                setHistoryQuickRange('all');
              }}
            >
              Reset Filter
            </Button>
          </div>
        </div>

        {(payload?.data ?? []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            Belum ada riwayat absensi.
          </div>
        ) : (
          (payload?.data ?? []).map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{formatWorkDate(row.work_date)}</p>
                  <div className="mt-1 space-y-1">
                    {hasMultipleEmployees ? <p className="text-xs font-medium text-slate-700">{row.full_name ?? row.username}</p> : null}
                    <p className="text-xs text-slate-500">{row.clock_in_worksite_name ?? row.clock_out_worksite_name ?? '-'}</p>
                  </div>
                </div>
                <Badge className={cn('border-0', statusTone(row.clock_out_status ?? row.clock_in_status))}>
                  {humanizeStatus(row.clock_out_status ?? row.clock_in_status)}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Jam Masuk</p>
                  <p className="mt-1 font-medium text-slate-900">{formatDateTime(row.clock_in_at)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Jam Pulang</p>
                  <p className="mt-1 font-medium text-slate-900">{formatDateTime(row.clock_out_at)}</p>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Durasi</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{formatMinutes(row.total_work_minutes)}</p>
              </div>
            </div>
          ))
        )}

        {payload?.meta ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">
              Halaman {payload.meta.page} dari {payload.meta.totalPages} • {payload.meta.total} riwayat
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                disabled={payload.meta.page <= 1}
                onClick={() => setHistoryPage((current) => Math.max(1, current - 1))}
              >
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                disabled={payload.meta.page >= payload.meta.totalPages}
                onClick={() => setHistoryPage((current) => current + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
