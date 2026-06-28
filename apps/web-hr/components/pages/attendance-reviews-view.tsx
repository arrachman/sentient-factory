'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, X, MessageCircleQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { useAttendanceReviews, hrQueryKeys } from '@/lib/api/hooks';
import { applyAttendanceReviewAction } from '@/lib/api/attendance-reviews';
import type { ReviewStatus, ReviewAction } from '@/lib/api/attendance-reviews';

type ReviewRow = Record<string, unknown>;

const STATUS_TABS: { value: ReviewStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'needs_clarification', label: 'Klarifikasi' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
];

function pick(row: ReviewRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return '—';
}

export function AttendanceReviewsView() {
  const [status, setStatus] = useState<ReviewStatus>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);
  const qc = useQueryClient();

  const query = { reviewStatus: status, limit: 50 };
  const { data, isLoading, error } = useAttendanceReviews(query);
  const rows = (data?.data ?? []) as ReviewRow[];

  async function act(eventId: string, action: ReviewAction) {
    setBusyId(eventId);
    try {
      await applyAttendanceReviewAction(eventId, action);
      toast.success('Tinjauan diperbarui.');
      await qc.invalidateQueries({ queryKey: hrQueryKeys.reviews(query) });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Aksi gagal.');
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<ReviewRow>[] = [
    { key: 'name', header: 'Karyawan', render: (r) => pick(r, 'name', 'employeeName') },
    { key: 'date', header: 'Waktu', render: (r) => pick(r, 'eventAt', 'event_at', 'createdAt', 'workDate') },
    { key: 'reason', header: 'Alasan', render: (r) => pick(r, 'reasonCode', 'reason_code', 'reason') },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant="warn" dot>{pick(r, 'reviewStatus', 'review_status', 'status')}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => {
        const id = pick(r, 'id', 'eventId', 'event_id');
        const busy = busyId === id;
        if (status !== 'pending' && status !== 'needs_clarification') {
          return (
            <Button size="sm" variant="default" disabled={busy} onClick={() => act(id, 'reopen')}>
              Buka lagi
            </Button>
          );
        }
        return (
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="default" disabled={busy} onClick={() => act(id, 'request-clarification')}>
              <MessageCircleQuestion className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="default" disabled={busy} onClick={() => act(id, 'reject')}>
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="primary" disabled={busy} onClick={() => act(id, 'approve')}>
              <Check className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tinjauan Absensi"
        description="Setujui, tolak, atau minta klarifikasi atas absensi yang ditandai (adaptasi jibble Approvals)."
      />
      <div className="mb-4 flex gap-1.5">
        {STATUS_TABS.map((t) => (
          <Button
            key={t.value}
            size="sm"
            variant={status === t.value ? 'primary' : 'default'}
            onClick={() => setStatus(t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r, i) => pick(r, 'id', 'eventId') + i} />
      </QueryState>
    </div>
  );
}
