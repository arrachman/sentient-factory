'use client';

/**
 * Attendance Reviews — list page-view. Menampilkan KPI ringkas, filter status,
 * dan list event yang butuh review. Klik baris → buka detail.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock3, MapPin, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  MetricCard,
  SectionShell,
  fetchJson,
  formatDateTime,
  formatEventLabel,
  humanizeReasonCode,
  humanizeStatus,
  humanizeValidationUiState,
  statusTone,
} from '../hr-shared';
import { normalizeAttendanceReviewRow } from './normalizers';
import type { AttendanceReviewRow } from './types';

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs_clarification';
type ValidationFilter =
  | 'all'
  | 'idle'
  | 'scanning'
  | 'success'
  | 'failure'
  | 'low-confidence';

type ListPayload = {
  data: AttendanceReviewRow[];
  meta?: { total: number };
};

export function HrAttendanceReviewsPageView() {
  const [payload, setPayload] = useState<ListPayload | null>(null);
  const [search, setSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('pending');
  const [validationUiState, setValidationUiState] =
    useState<ValidationFilter>('all');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      page: '1',
      limit: '20',
      reviewStatus,
    });

    const trimmedSearch = search.trim();
    if (trimmedSearch) params.set('search', trimmedSearch);
    if (validationUiState !== 'all')
      params.set('validationUiState', validationUiState);

    fetchJson<Record<string, unknown>[]>(
      `/api/hr/attendance-reviews?${params.toString()}`,
    ).then((data) => {
      if (!cancelled) {
        setPayload(
          data
            ? {
                data: (data.data ?? []).map((row) =>
                  normalizeAttendanceReviewRow(row),
                ),
                meta: data.meta,
              }
            : null,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reviewStatus, search, validationUiState]);

  const rows = payload?.data ?? [];
  const totalItems = payload?.meta?.total ?? rows.length;
  const outsideGeofenceCount = rows.filter(
    (row) => row.reason_code === 'outside_geofence',
  ).length;
  const gpsDeniedCount = rows.filter(
    (row) => row.reason_code === 'gps_denied',
  ).length;

  return (
    <SectionShell title="Attendance Reviews">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            icon={ShieldAlert}
            label="Total Antrian"
            value={String(totalItems)}
            subtext="sesuai filter aktif"
          />
          <MetricCard
            icon={MapPin}
            label="Di Luar Radius"
            value={String(outsideGeofenceCount)}
            subtext="butuh verifikasi lokasi"
          />
          <MetricCard
            icon={Clock3}
            label="GPS Ditolak"
            value={String(gpsDeniedCount)}
            subtext="kasus akses perangkat"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari pegawai, alasan, atau username"
              className="h-11 rounded-xl"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'pending', label: 'Menunggu Review' },
                { value: 'needs_clarification', label: 'Perlu Klarifikasi' },
                { value: 'approved', label: 'Disetujui' },
                { value: 'rejected', label: 'Ditolak' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setReviewStatus(option.value as ReviewStatus)}
                  className={cn(
                    'rounded-full px-3 py-2 text-xs font-medium transition',
                    reviewStatus === option.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
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
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValidationUiState(option.value as ValidationFilter)
                  }
                  className={cn(
                    'rounded-full px-3 py-2 text-xs font-medium transition',
                    validationUiState === option.value
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100',
                  )}
                >
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
            <Link
              key={row.id}
              href={`/app/hr/attendance-reviews/${row.id}`}
              className={cn(
                'block rounded-2xl border bg-white px-4 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md',
                row.reason_code === 'outside_geofence'
                  ? 'border-l-4 border-l-amber-400'
                  : row.reason_code === 'gps_denied'
                    ? 'border-l-4 border-l-rose-400'
                    : 'border-slate-200',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {row.fullName || row.username}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatEventLabel(row.event_type)} •{' '}
                    {humanizeReasonCode(row.reason_code) || '-'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(row.event_at)} •{' '}
                    {row.defaultWorksiteName ?? 'Belum ada lokasi kerja'}
                  </p>
                  {typeof row.metadataJson?.validationUiState === 'string' ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Status Validasi:{' '}
                      {humanizeValidationUiState(
                        String(row.metadataJson.validationUiState),
                      )}
                    </p>
                  ) : null}
                  {row.reviewNote ? (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {row.reviewNote}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge
                    className={cn(
                      'border-0',
                      statusTone(row.reviewStatus ?? row.result),
                    )}
                  >
                    {humanizeStatus(row.reviewStatus ?? row.result)}
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">
                    Buka detail
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </SectionShell>
  );
}
