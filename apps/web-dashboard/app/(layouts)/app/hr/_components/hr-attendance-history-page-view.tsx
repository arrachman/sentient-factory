'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ToolbarHeading, ToolbarPageTitle } from '@/components/layouts/app/components/toolbar';
import { cn } from '@/lib/utils';
import { HistoryFilterPanel } from './hr-attendance-history/history-filter-panel';
import { HistoryList } from './hr-attendance-history/history-list';

type AssignedWorksiteRow = { id: number; name: string; code: string; radiusMeters: number; isPrimary: boolean };

type AttendanceUserOption = {
  hrUserId: number; appUserId: number; employeeCode: string | null;
  faceEnrollmentStatus: string; employeeRoleType: string; isActive: boolean;
  username: string; fullName: string | null; defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
};

type AttendanceHistoryPayload = {
  data: Array<{
    id: number; work_date: string; clock_in_at: string | null; clock_out_at: string | null;
    clock_in_status: string | null; clock_out_status: string | null; total_work_minutes: number | null;
    clock_in_worksite_name: string | null; clock_out_worksite_name: string | null;
    username: string; full_name: string | null;
  }>;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

type ApiEnvelope<T> = { success?: boolean; data: T; meta?: { page: number; limit: number; total: number; totalPages: number } };

const HR_TIME_ZONE = 'Asia/Jakarta';

function SectionShell({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2"><ToolbarHeading><ToolbarPageTitle>{title}</ToolbarPageTitle></ToolbarHeading></div>
      {children}
    </div>
  );
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const p = Number(value); return Number.isFinite(p) ? p : 0; }
  if (value && typeof value === 'object') {
    const d = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(d.d)) {
      const s = d.d.join(''); const exp = typeof d.e === 'number' ? d.e : s.length - 1; const sign = d.s === -1 ? -1 : 1;
      const n = Number(`${sign < 0 ? '-' : ''}${s[0] ?? '0'}${s.length > 1 ? `.${s.slice(1)}` : ''}e${exp}`);
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

function normalizeAssignedWorksiteRow(row: Record<string, unknown>): AssignedWorksiteRow {
  return { id: Number(row.id ?? 0), name: String(row.name ?? row.worksiteName ?? ''), code: String(row.code ?? row.worksiteCode ?? ''), radiusMeters: row.radiusMeters == null ? 0 : normalizeNumericValue(row.radiusMeters), isPrimary: Boolean(row.isPrimary) };
}

function normalizeAttendanceUserOption(row: Record<string, unknown>): AttendanceUserOption {
  return {
    hrUserId: Number(row.hrUserId ?? 0), appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'), isActive: Boolean(row.isActive),
    username: String(row.username ?? ''), fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites) ? row.assignedWorksites.filter((e): e is Record<string, unknown> => Boolean(e && typeof e === 'object')).map((e) => normalizeAssignedWorksiteRow(e)) : [],
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return { year: Number(parts.find((p) => p.type === 'year')?.value ?? '0'), month: Number(parts.find((p) => p.type === 'month')?.value ?? '1'), day: Number(parts.find((p) => p.type === 'day')?.value ?? '1') };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + days);
  return getJakartaDayKey(d);
}

function getHistoryQuickRange(range: 'today' | 'week' | 'month') {
  const today = getJakartaDayKey(new Date());
  if (range === 'today') return { dateFrom: today, dateTo: today };
  if (range === 'week') {
    const parts = getJakartaCalendarParts(new Date());
    const localUtc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const dow = localUtc.getUTCDay();
    return { dateFrom: shiftDateKey(today, dow === 0 ? -6 : 1 - dow), dateTo: today };
  }
  const { year, month } = getJakartaCalendarParts(new Date());
  return { dateFrom: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`, dateTo: today };
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

  useEffect(() => { if (initialUserId) setSelectedHistoryUserId(initialUserId); }, [initialUserId]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(historyPage), limit: '20' });
    if (selectedHistoryUserId !== 'all') params.set('userId', selectedHistoryUserId);
    if (historySearch) params.set('search', historySearch);
    if (historyDateFrom) params.set('dateFrom', historyDateFrom);
    if (historyDateTo) params.set('dateTo', historyDateTo);
    fetchJson<AttendanceHistoryPayload['data']>(`/api/hr/attendance/history?${params.toString()}`).then((data) => {
      if (!cancelled) setPayload(data ? { data: data.data, meta: data.meta } : null);
    });
    fetchJson<Record<string, unknown>[]>('/api/hr/users').then((usersPayload) => {
      if (!cancelled && usersPayload?.data) setAttendanceUsers(usersPayload.data.map((row) => normalizeAttendanceUserOption(row)));
    });
    return () => { cancelled = true; };
  }, [historyDateFrom, historyDateTo, historyPage, historySearch, selectedHistoryUserId]);

  useEffect(() => { setHistoryPage(1); }, [selectedHistoryUserId, historySearch, historyDateFrom, historyDateTo]);

  const rows = payload?.data ?? [];
  const hasMultipleEmployees = new Set(rows.map((row) => `${row.username}:${row.full_name ?? ''}`)).size > 1;

  function handleQuickRange(range: 'today' | 'week' | 'month') {
    const r = getHistoryQuickRange(range);
    setHistoryQuickRange(range);
    setHistoryDateFrom(r.dateFrom);
    setHistoryDateTo(r.dateTo);
  }

  function handleReset() {
    setSelectedHistoryUserId('all');
    setHistorySearchInput('');
    setHistorySearch('');
    setHistoryDateFrom('');
    setHistoryDateTo('');
    setHistoryQuickRange('all');
  }

  return (
    <SectionShell title="Riwayat Absensi">
      <div className="space-y-3">
        <HistoryFilterPanel
          attendanceUsers={attendanceUsers}
          selectedUserId={selectedHistoryUserId}
          searchInput={historySearchInput}
          dateFrom={historyDateFrom}
          dateTo={historyDateTo}
          quickRange={historyQuickRange}
          onUserChange={setSelectedHistoryUserId}
          onSearchInputChange={setHistorySearchInput}
          onSearch={() => setHistorySearch(historySearchInput.trim())}
          onDateFromChange={(v) => { setHistoryQuickRange('custom'); setHistoryDateFrom(v); }}
          onDateToChange={(v) => { setHistoryQuickRange('custom'); setHistoryDateTo(v); }}
          onQuickRange={handleQuickRange}
          onReset={handleReset}
        />
        <HistoryList
          rows={rows}
          hasMultipleEmployees={hasMultipleEmployees}
          meta={payload?.meta}
          onPrevPage={() => setHistoryPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setHistoryPage((p) => p + 1)}
        />
      </div>
    </SectionShell>
  );
}
