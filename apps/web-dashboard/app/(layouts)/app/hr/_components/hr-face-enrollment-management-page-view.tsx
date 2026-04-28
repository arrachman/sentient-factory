'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AlertTriangle, Check, PencilLine, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AssignedWorksiteRow = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

type WorksiteRow = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
};

type FaceEnrollmentManagementRow = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  faceTemplateVersion: number;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
  activeEnrollmentId: number | null;
  snapshotUrl: string | null;
  qualityScore: number | null;
  enrolledAt: string | null;
  registeredByUsername: string | null;
  registeredByFullName: string | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
};

const HR_TIME_ZONE = 'Asia/Jakarta';

function SectionShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2">
        <ToolbarHeading>
          <ToolbarPageTitle>{title}</ToolbarPageTitle>
          {description ? <ToolbarDescription>{description}</ToolbarDescription> : null}
        </ToolbarHeading>
      </div>
      {children}
    </div>
  );
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
  const monthLabel = new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, month: 'short' }).format(
    new Date(Date.UTC(parts.year, parts.month - 1, 1)),
  );
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

function normalizeWorksiteRow(row: Record<string, unknown>): WorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? ''),
    code: String(row.code ?? ''),
    latitude: normalizeNumericValue(row.latitude),
    longitude: normalizeNumericValue(row.longitude),
    radiusMeters: normalizeNumericValue(row.radiusMeters),
    isActive: Boolean(row.isActive),
  };
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

function normalizeFaceEnrollmentManagementRow(row: Record<string, unknown>): FaceEnrollmentManagementRow {
  return {
    hrUserId: Number(row.hrUserId ?? 0),
    appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    faceTemplateVersion: Number(row.faceTemplateVersion ?? 1),
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
    activeEnrollmentId: row.activeEnrollmentId == null ? null : Number(row.activeEnrollmentId),
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    qualityScore: row.qualityScore == null ? null : normalizeNumericValue(row.qualityScore),
    enrolledAt: typeof row.enrolledAt === 'string' ? row.enrolledAt : null,
    registeredByUsername: typeof row.registeredByUsername === 'string' ? row.registeredByUsername : null,
    registeredByFullName: typeof row.registeredByFullName === 'string' ? row.registeredByFullName : null,
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

async function putJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as (ApiEnvelope<T> & { message?: string; error?: string }) | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? payload?.error ?? 'Request failed.');
  }
  return payload;
}

export function HrFaceEnrollmentManagementPageView() {
  const [rows, setRows] = useState<FaceEnrollmentManagementRow[]>([]);
  const [worksites, setWorksites] = useState<WorksiteRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'not_enrolled'>('all');
  const [worksiteDialogOpen, setWorksiteDialogOpen] = useState(false);
  const [worksiteDialogRow, setWorksiteDialogRow] = useState<FaceEnrollmentManagementRow | null>(null);
  const [worksiteSelectionIds, setWorksiteSelectionIds] = useState<number[]>([]);
  const [worksiteSaving, setWorksiteSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRows() {
    const payload = await fetchJson<Record<string, unknown>[]>('/api/hr/face-enrollments');
    setRows((payload?.data ?? []).map((row) => normalizeFaceEnrollmentManagementRow(row)));
  }

  async function loadWorksites() {
    const payload = await fetchJson<Record<string, unknown>[]>('/api/hr/worksites?page=1&limit=100');
    setWorksites((payload?.data ?? []).map((row) => normalizeWorksiteRow(row)));
  }

  useEffect(() => {
    void Promise.all([loadRows(), loadWorksites()]).catch(() => null);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  function openWorksiteDialog(row: FaceEnrollmentManagementRow) {
    setWorksiteDialogRow(row);
    setWorksiteSelectionIds(row.assignedWorksites.map((worksite) => worksite.id));
    setWorksiteDialogOpen(true);
  }

  async function saveWorksiteAssignments() {
    if (!worksiteDialogRow) return;
    setWorksiteSaving(true);
    try {
      await putJson(`/api/hr/users/${worksiteDialogRow.appUserId}/worksites`, {
        worksiteIds: worksiteSelectionIds,
      });
      toast.success('Tempat kerja pegawai berhasil diperbarui.');
      setWorksiteDialogOpen(false);
      setWorksiteDialogRow(null);
      await loadRows();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menyimpan tempat kerja.';
      toast.error(message);
    } finally {
      setWorksiteSaving(false);
    }
  }

  const trimmedSearch = search.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    if (!trimmedSearch) {
      return statusFilter === 'all' || (statusFilter === 'enrolled' ? row.faceEnrollmentStatus === 'enrolled' : row.faceEnrollmentStatus !== 'enrolled');
    }
    const haystack = [row.fullName ?? '', row.username, row.employeeCode ?? '', row.defaultWorksiteName ?? '', row.assignedWorksites.map((worksite) => worksite.name).join(' ')]
      .join(' ')
      .toLowerCase();
    const matchesSearch = haystack.includes(trimmedSearch);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'enrolled' ? row.faceEnrollmentStatus === 'enrolled' : row.faceEnrollmentStatus !== 'enrolled');
    return matchesSearch && matchesStatus;
  });

  const enrolledCount = rows.filter((row) => row.faceEnrollmentStatus === 'enrolled').length;
  const notEnrolledCount = rows.filter((row) => row.faceEnrollmentStatus !== 'enrolled').length;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);
  const rangeStart = filteredRows.length === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(activePage * pageSize, filteredRows.length);
  const pageWindowStart = Math.max(1, Math.min(activePage - 1, Math.max(1, totalPages - 2)));
  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => pageWindowStart + index);

  return (
    <SectionShell title="Manajemen Pendaftaran Wajah" description="Kelola data wajah pegawai untuk keperluan absensi." wide>
      <div className="mx-auto w-full max-w-[1120px] space-y-6 px-4 sm:px-6 xl:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Sudah Terdaftar</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">{enrolledCount}</p>
                <p className="text-sm font-medium text-slate-500">pegawai</p>
              </div>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Check className="size-5" />
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Belum Terdaftar</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">{notEnrolledCount}</p>
                <p className="text-sm font-medium text-slate-500">pegawai</p>
              </div>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="size-5" />
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama pegawai, username, kode..."
                className="h-11 rounded-lg border-slate-200 bg-white pl-11 shadow-none"
              />
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {[
                { key: 'all' as const, label: 'Semua' },
                { key: 'enrolled' as const, label: 'Sudah Terdaftar' },
                { key: 'not_enrolled' as const, label: 'Belum Terdaftar' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStatusFilter(item.key)}
                  className={cn(
                    'rounded-md px-4 py-2 text-xs font-semibold transition-colors',
                    statusFilter === item.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[960px]">
              <div className="grid grid-cols-[minmax(230px,1.25fr)_minmax(130px,0.7fr)_minmax(150px,0.85fr)_minmax(150px,0.85fr)_190px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                <div>Pegawai / Status</div>
                <div>Kualitas Data</div>
                <div>Didaftarkan Oleh</div>
                <div>Tempat Kerja</div>
                <div className="text-right">Aksi</div>
              </div>
              <div className="divide-y divide-slate-200">
                {visibleRows.map((row) => {
                  const enrolled = row.faceEnrollmentStatus === 'enrolled';
                  const qualityText = enrolled && typeof row.qualityScore === 'number' ? `${(row.qualityScore * 100).toFixed(0)}%` : 'Menunggu pendaftaran';
                  const registeredByText = enrolled ? row.registeredByFullName ?? row.registeredByUsername ?? '-' : '';
                  const assignedWorksites = row.assignedWorksites;

                  return (
                    <div key={row.appUserId} className="grid grid-cols-[minmax(230px,1.25fr)_minmax(130px,0.7fr)_minmax(150px,0.85fr)_minmax(150px,0.85fr)_190px] items-center gap-4 px-5 py-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-500">
                            {row.snapshotUrl && enrolled ? (
                              <img src={`/api/hr/face-enrollments/${row.activeEnrollmentId}/snapshot`} alt="" className="h-full w-full object-cover" />
                            ) : (
                              ((row.fullName ?? row.username).slice(0, 2) || 'HR').toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{row.fullName ?? row.username}</p>
                            <Badge className={cn('mt-1 rounded-md border-0 px-2 py-1 text-[10px] font-bold uppercase', enrolled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500')}>
                              {enrolled ? 'Terdaftar' : 'Belum Terdaftar'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-700">
                        {enrolled ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">v{row.faceTemplateVersion} •</p>
                            <p className="text-sm font-semibold text-slate-800">{qualityText}</p>
                            <p className="text-[11px] text-slate-500">{formatDateTime(row.enrolledAt)}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                      <div className="min-w-0 text-sm text-slate-700">
                        {enrolled ? <span className="block line-clamp-2 font-medium leading-5 text-slate-900">{registeredByText}</span> : <span className="text-slate-400">-</span>}
                      </div>
                      <div className="min-w-0">
                        {assignedWorksites.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            <span className="line-clamp-2 text-sm font-medium leading-5 text-slate-700">{assignedWorksites[0]?.name}</span>
                            {assignedWorksites.length > 1 ? <span className="text-xs text-slate-400">+{assignedWorksites.length - 1}</span> : null}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Belum diatur</span>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <div className={cn('flex items-center justify-end gap-2', enrolled ? '' : 'w-full')}>
                          {enrolled ? (
                            <Button
                              variant="outline"
                              className="h-12 rounded-lg border-slate-200 bg-white px-4 text-xs font-semibold leading-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                              onClick={() => openWorksiteDialog(row)}
                            >
                              Atur Tempat
                              <br />
                              Kerja
                            </Button>
                          ) : null}
                          <Button
                            asChild
                            variant="outline"
                            className={cn(
                              'h-10 rounded-lg px-4 text-sm font-semibold',
                              enrolled
                                ? 'size-9 border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                : 'w-full border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white',
                            )}
                          >
                            <Link href={`/app/hr/attendance?targetUserId=${row.appUserId}&action=enroll`}>
                              {enrolled ? <PencilLine className="size-4" /> : 'Daftarkan Wajah'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <div className="border-t border-slate-200 px-4 py-6 text-sm text-slate-500">Tidak ada pegawai yang cocok dengan pencarian atau filter.</div>
          ) : null}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Menampilkan {rangeStart}-{rangeEnd} dari {filteredRows.length} pegawai</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Limit</span>
                {[10, 50, 100].map((limit) => (
                  <Button
                    key={limit}
                    variant={pageSize === limit ? 'primary' : 'outline'}
                    className={cn('h-8 rounded-lg px-3 text-xs', pageSize === limit && 'bg-blue-600 text-white hover:bg-blue-700')}
                    onClick={() => {
                      setPageSize(limit);
                      setPage(1);
                    }}
                  >
                    {limit}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="size-8 rounded-lg p-0" disabled={activePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                  ‹
                </Button>
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={activePage === pageNumber ? 'primary' : 'outline'}
                    className={cn('size-8 rounded-lg p-0 text-sm', activePage === pageNumber && 'bg-blue-600 text-white hover:bg-blue-700')}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button variant="outline" className="size-8 rounded-lg p-0" disabled={activePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                  ›
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={worksiteDialogOpen} onOpenChange={setWorksiteDialogOpen}>
          <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
            <DialogHeader className="border-b border-slate-200 px-5 py-4">
              <DialogTitle className="text-lg font-semibold text-slate-900">Atur Tempat Kerja</DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Pilih satu atau beberapa tempat kerja untuk {worksiteDialogRow?.fullName ?? worksiteDialogRow?.username ?? 'pegawai ini'}.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-4 px-5 py-4">
              <div className="grid max-h-[50vh] gap-2 overflow-auto pr-1">
                {worksites.map((worksite) => {
                  const checked = worksiteSelectionIds.includes(worksite.id);
                  return (
                    <label
                      key={worksite.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors',
                        checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(next) => {
                          setWorksiteSelectionIds((current) => {
                            if (next === true) {
                              return current.includes(worksite.id) ? current : [...current, worksite.id];
                            }
                            return current.filter((id) => id !== worksite.id);
                          });
                        }}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{worksite.name}</p>
                          <Badge className={cn('border-0 text-[11px]', checked ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>
                            {worksite.code}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Radius {worksite.radiusMeters} m • {worksite.latitude}, {worksite.longitude}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                Tempat kerja yang dipilih akan menjadi daftar lokasi yang bisa dipakai pegawai untuk absensi. Lokasi pertama tetap dipakai sebagai lokasi utama.
              </div>
            </DialogBody>
            <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
              <Button variant="outline" className="h-10 rounded-xl" disabled={worksiteSaving} onClick={() => setWorksiteDialogOpen(false)}>
                Batal
              </Button>
              <Button className="h-10 rounded-xl" disabled={worksiteSaving || worksiteSelectionIds.length === 0} onClick={() => void saveWorksiteAssignments()}>
                {worksiteSelectionIds.length === 0 ? 'Pilih Minimal Satu Lokasi' : worksiteSaving ? 'Menyimpan...' : 'Simpan Tempat Kerja'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SectionShell>
  );
}
