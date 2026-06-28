'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Check, X, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { getAttendanceReviewDetail, applyAttendanceReviewAction } from '@/lib/api/attendance-reviews';
import type { ReviewAction } from '@/lib/api/attendance-reviews';
import { attendanceEventSnapshotUrl } from '@/lib/api/face-enrollments';

type Detail = Record<string, unknown>;

function pick(o: Detail, ...keys: string[]): string {
  for (const k of keys) {
    const v = o?.[k];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return '—';
}

export function AttendanceReviewDetailView({ eventId }: { eventId: string }) {
  const qc = useQueryClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const { data, isLoading, error } = useQuery<Detail>({
    queryKey: ['hr', 'attendance-reviews', 'detail', eventId],
    queryFn: () => getAttendanceReviewDetail(eventId),
  });

  async function act(action: ReviewAction) {
    setBusy(true);
    try {
      await applyAttendanceReviewAction(eventId, action);
      toast.success('Tinjauan diperbarui.');
      await qc.invalidateQueries({ queryKey: ['hr', 'attendance-reviews'] });
      router.push('/app/attendance-reviews');
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Aksi gagal.');
    } finally {
      setBusy(false);
    }
  }

  const d = data ?? {};
  const status = pick(d, 'reviewStatus', 'review_status', 'status');

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/app/attendance-reviews"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>
      <PageHeader title={`Detail Tinjauan #${eventId}`} description="Verifikasi snapshot, lokasi, dan alasan sebelum mengambil keputusan." />

      <QueryState isLoading={isLoading} error={error}>
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <div className="overflow-hidden rounded-lg border bg-card">
            <img
              src={attendanceEventSnapshotUrl(eventId)}
              alt={`Snapshot absensi ${eventId}`}
              className="aspect-square w-full bg-muted object-cover"
            />
          </div>

          <div className="space-y-3 rounded-lg border bg-card p-4">
            <Row label="Karyawan" value={pick(d, 'name', 'employeeName')} />
            <Row label="Waktu" value={pick(d, 'eventAt', 'event_at', 'createdAt')} />
            <Row label="Tipe" value={pick(d, 'eventType', 'event_type', 'type')} />
            <Row label="Lokasi" value={pick(d, 'latitude') + ', ' + pick(d, 'longitude')} />
            <Row label="Worksite" value={pick(d, 'worksiteName', 'worksite_name', 'worksite')} />
            <Row label="Alasan" value={pick(d, 'reasonCode', 'reason_code', 'reason')} />
            <Row label="Skor wajah" value={pick(d, 'faceScore', 'face_score')} />
            <Row
              label="Status"
              value={<Badge variant="warn" dot>{status}</Badge>}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="default" disabled={busy} onClick={() => act('request-clarification')}>
            <MessageCircleQuestion className="h-4 w-4" /> Minta klarifikasi
          </Button>
          <Button variant="danger" disabled={busy} onClick={() => act('reject')}>
            <X className="h-4 w-4" /> Tolak
          </Button>
          <Button variant="primary" disabled={busy} onClick={() => act('approve')}>
            <Check className="h-4 w-4" /> Setujui
          </Button>
        </div>
      </QueryState>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
