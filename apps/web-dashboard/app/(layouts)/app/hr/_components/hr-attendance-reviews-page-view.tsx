'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Clock3, MapPin, ShieldAlert } from 'lucide-react';
import {
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export { HrAttendanceReviewDetailPageView } from './hr-attendance-reviews/review-detail-page-view';

type AttendanceReviewRow = {
  id: number;
  event_type: string;
  event_at: string;
  result: string;
  reason_code: string | null;
  reviewStatus: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  snapshotUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  metadataJson: Record<string, unknown> | null;
  work_date: string | null;
  clockInStatus: string | null;
  clockOutStatus: string | null;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

const HR_TIME_ZONE = 'Asia/Jakarta';

function SectionShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const showToolbar = title.trim().length > 0 || !!description;
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-6 sm:px-5">
      {showToolbar ? (
        <div className="pb-2">
          <ToolbarHeading>
            {title.trim().length > 0 ? <ToolbarPageTitle>{title}</ToolbarPageTitle> : null}
            {description ? <ToolbarDescription>{description}</ToolbarDescription> : null}
          </ToolbarHeading>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext, tone = 'default' }: {
  icon: typeof Clock3; label: string; value: string; subtext?: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const toneClasses = tone === 'danger'
    ? { shell: 'border-rose-200 bg-rose-50/80', icon: 'text-rose-600', value: 'text-rose-900', subtext: 'text-rose-700/80' }
    : tone === 'warning'
      ? { shell: 'border-amber-200 bg-amber-50/80', icon: 'text-amber-600', value: 'text-amber-900', subtext: 'text-amber-700/80' }
      : tone === 'success'
        ? { shell: 'border-emerald-200 bg-emerald-50/80', icon: 'text-emerald-600', value: 'text-emerald-900', subtext: 'text-emerald-700/80' }
        : { shell: 'border-slate-200 bg-white', icon: 'text-slate-500', value: 'text-slate-900', subtext: 'text-slate-500' };
  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', toneClasses.shell)}>
      <div className={cn('flex items-center gap-2', toneClasses.icon)}>
        <Icon className="size-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn('mt-3 text-lg font-semibold sm:text-xl', toneClasses.value)}>{value}</p>
      {subtext ? <p className={cn('mt-1 text-xs leading-5', toneClasses.subtext)}>{subtext}</p> : null}
    </div>
  );
}

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success': return 'bg-emerald-100 text-emerald-700';
    case 'manual_review': return 'bg-amber-100 text-amber-800';
    case 'warning': return 'bg-orange-100 text-orange-800';
    case 'rejected': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending': return 'Menunggu Review';
    case 'manual_review': return 'Perlu Review';
    case 'success': return 'Berhasil';
    case 'rejected': return 'Ditolak';
    case 'approved': return 'Disetujui';
    case 'needs_clarification': return 'Perlu Klarifikasi';
    case 'warning': return 'Peringatan';
    default:
      if (!value) return '-';
      return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

function humanizeReasonCode(value: string | null | undefined) {
  switch (value) {
    case 'face_identified_as_other_user': return 'Wajah lebih cocok dengan akun pengguna lain';
    case 'face_mismatch': return 'Wajah tidak cocok dengan data terdaftar';
    case 'face_embedding_missing': return 'Embedding wajah tidak tersedia';
    case 'face_enrollment_reference_missing': return 'Referensi wajah terdaftar belum tersedia';
    case 'face_not_centered': return 'Wajah belum pas di dalam frame';
    case 'liveness_not_verified': return 'Verifikasi wajah asli belum berhasil';
    case 'outside_geofence': return 'Di luar radius lokasi';
    case 'already_clocked_in': return 'Sudah memiliki sesi absen masuk aktif';
    case 'no_active_session': return 'Belum ada sesi absensi aktif';
    case 'gps_denied': return 'Akses GPS ditolak';
    case 'camera_denied': return 'Akses kamera ditolak';
    case 'gps_timeout': return 'GPS timeout';
    case 'gps_unavailable': return 'GPS tidak tersedia';
    default: return value ?? '';
  }
}

function humanizeValidationUiState(value: string | null | undefined) {
  switch (value) {
    case 'idle': return 'Siaga';
    case 'scanning': return 'Sedang Memindai';
    case 'success': return 'Berhasil';
    case 'failure': return 'Gagal';
    case 'low-confidence': return 'Kemiripan Rendah';
    default: return value ?? '-';
  }
}

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return { year: Number(parts.find((p) => p.type === 'year')?.value ?? '0'), month: Number(parts.find((p) => p.type === 'month')?.value ?? '1'), day: Number(parts.find((p) => p.type === 'day')?.value ?? '1') };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseHrWallClock(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4] ?? '0'), minute: Number(match[5] ?? '0') };
}

function formatJakartaWallClock(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, month: 'short' }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));
  return { dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`, timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`, dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` };
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const wallClock = parseHrWallClock(value);
  if (wallClock) {
    const formatted = formatJakartaWallClock(wallClock);
    return `${formatted.dayKey === getJakartaDayKey(new Date()) ? formatted.timeLabel : `${formatted.dateLabel}, ${formatted.timeLabel}`} WIB`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return new Intl.DateTimeFormat('id-ID', isToday ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' } : { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date) + ' WIB';
}

function formatEventLabel(value: string) {
  switch (value) {
    case 'clock_in': return 'Absen Masuk';
    case 'clock_out': return 'Absen Pulang';
    case 'clock_in_attempt':
    case 'clock_out_attempt': return 'Percobaan Absen';
    case 'face_enrollment': return 'Pendaftaran Wajah';
    case 'face_enrollment_attempt': return 'Percobaan Pendaftaran Wajah';
    default: return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const p = Number(value); return Number.isFinite(p) ? p : 0; }
  if (value && typeof value === 'object') {
    const d = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(d.d)) {
      const s = d.d.join('');
      const exp = typeof d.e === 'number' ? d.e : s.length - 1;
      const sign = d.s === -1 ? -1 : 1;
      const n = Number(`${sign < 0 ? '-' : ''}${s[0] ?? '0'}${s.length > 1 ? `.${s.slice(1)}` : ''}e${exp}`);
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

function normalizeAttendanceReviewRow(row: Record<string, unknown>): AttendanceReviewRow {
  return {
    id: Number(row.id ?? 0), event_type: String(row.event_type ?? ''), event_at: String(row.event_at ?? ''), result: String(row.result ?? ''),
    reason_code: typeof row.reason_code === 'string' ? row.reason_code : null,
    reviewStatus: typeof row.reviewStatus === 'string' ? row.reviewStatus : null,
    reviewedAt: typeof row.reviewedAt === 'string' ? row.reviewedAt : null,
    reviewNote: typeof row.reviewNote === 'string' ? row.reviewNote : null,
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    latitude: row.latitude == null ? null : normalizeNumericValue(row.latitude),
    longitude: row.longitude == null ? null : normalizeNumericValue(row.longitude),
    metadataJson: row.metadataJson && typeof row.metadataJson === 'object' ? (row.metadataJson as Record<string, unknown>) : null,
    work_date: typeof row.work_date === 'string' ? row.work_date : null,
    clockInStatus: typeof row.clockInStatus === 'string' ? row.clockInStatus : null,
    clockOutStatus: typeof row.clockOutStatus === 'string' ? row.clockOutStatus : null,
    username: String(row.username ?? ''), fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

export function HrAttendanceReviewsPageView() {
  const [payload, setPayload] = useState<ApiEnvelope<AttendanceReviewRow[]> | null>(null);
  const [search, setSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected' | 'needs_clarification'>('pending');
  const [validationUiState, setValidationUiState] = useState<'all' | 'idle' | 'scanning' | 'success' | 'failure' | 'low-confidence'>('all');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: '1', limit: '20', reviewStatus });
    const trimmedSearch = search.trim();
    if (trimmedSearch) params.set('search', trimmedSearch);
    if (validationUiState !== 'all') params.set('validationUiState', validationUiState);
    fetchJson<Record<string, unknown>[]>(`/api/hr/attendance-reviews?${params.toString()}`).then((data) => {
      if (!cancelled) {
        setPayload(data ? { data: (data.data ?? []).map((row) => normalizeAttendanceReviewRow(row)), meta: data.meta } : null);
      }
    });
    return () => { cancelled = true; };
  }, [reviewStatus, search, validationUiState]);

  const rows = payload?.data ?? [];
  const totalItems = payload?.meta?.total ?? rows.length;
  const outsideGeofenceCount = rows.filter((row) => row.reason_code === 'outside_geofence').length;
  const gpsDeniedCount = rows.filter((row) => row.reason_code === 'gps_denied').length;

  return (
    <SectionShell title="Attendance Reviews">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard icon={ShieldAlert} label="Total Antrian" value={String(totalItems)} subtext="sesuai filter aktif" />
          <MetricCard icon={MapPin} label="Di Luar Radius" value={String(outsideGeofenceCount)} subtext="butuh verifikasi lokasi" />
          <MetricCard icon={Clock3} label="GPS Ditolak" value={String(gpsDeniedCount)} subtext="kasus akses perangkat" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-3">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari pegawai, alasan, atau username" className="h-11 rounded-xl" />
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'pending', label: 'Menunggu Review' },
                { value: 'needs_clarification', label: 'Perlu Klarifikasi' },
                { value: 'approved', label: 'Disetujui' },
                { value: 'rejected', label: 'Ditolak' },
              ].map((option) => (
                <button key={option.value} type="button"
                  onClick={() => setReviewStatus(option.value as 'pending' | 'approved' | 'rejected' | 'needs_clarification')}
                  className={cn('rounded-full px-3 py-2 text-xs font-medium transition', reviewStatus === option.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Semua Status' },
                { value: 'failure', label: 'Gagal' },
                { value: 'low-confidence', label: 'Kemiripan Rendah' },
                { value: 'success', label: 'Berhasil' },
                { value: 'scanning', label: 'Sedang Memindai' },
              ].map((option) => (
                <button key={option.value} type="button"
                  onClick={() => setValidationUiState(option.value as 'all' | 'idle' | 'scanning' | 'success' | 'failure' | 'low-confidence')}
                  className={cn('rounded-full px-3 py-2 text-xs font-medium transition', validationUiState === option.value ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100')}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            Tidak ada item review untuk filter ini.
          </div>
        ) : (
          rows.map((row) => (
            <Link key={row.id} href={`/app/hr/attendance-reviews/${row.id}`}
              className={cn('block rounded-2xl border bg-white px-4 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md',
                row.reason_code === 'outside_geofence' ? 'border-l-4 border-l-amber-400' : row.reason_code === 'gps_denied' ? 'border-l-4 border-l-rose-400' : 'border-slate-200')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{row.fullName || row.username}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatEventLabel(row.event_type)} • {humanizeReasonCode(row.reason_code) || '-'}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(row.event_at)} • {row.defaultWorksiteName ?? 'Belum ada lokasi kerja'}</p>
                  {typeof row.metadataJson?.validationUiState === 'string' ? (
                    <p className="mt-1 text-xs text-slate-500">Status Validasi: {humanizeValidationUiState(String(row.metadataJson.validationUiState))}</p>
                  ) : null}
                  {row.reviewNote ? <p className="mt-2 line-clamp-2 text-xs text-slate-600">{row.reviewNote}</p> : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge className={cn('border-0', statusTone(row.reviewStatus ?? row.result))}>{humanizeStatus(row.reviewStatus ?? row.result)}</Badge>
                  <span className="text-[11px] font-medium text-slate-500">Buka detail</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </SectionShell>
  );
}
