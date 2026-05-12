'use client';

/**
 * Attendance Review — detail page-view dengan kronologi, snapshot,
 * metadata mesin aturan, history, dan action bar (approve/reject/clarify/reopen).
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  SectionShell,
  fetchJson,
  formatDateTime,
  formatEventLabel,
  formatWorkDate,
  humanizeReasonCode,
  humanizeStatus,
  humanizeValidationUiState,
  postJson,
  statusTone,
} from '../hr-shared';
import { normalizeAttendanceReviewDetail } from './normalizers';
import type { AttendanceReviewDetail } from './types';

type ReviewAction =
  | 'approve'
  | 'reject'
  | 'request-clarification'
  | 'reopen';

export function HrAttendanceReviewDetailPageView({
  eventId,
}: {
  eventId: string;
}) {
  const [detail, setDetail] = useState<AttendanceReviewDetail | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadDetail() {
    const data = await fetchJson<Record<string, unknown>>(
      `/api/hr/attendance-reviews/${eventId}`,
    );
    const next = data?.data ? normalizeAttendanceReviewDetail(data.data) : null;
    setDetail(next);
    setNote(typeof next?.reviewNote === 'string' ? next.reviewNote : '');
  }

  useEffect(() => {
    void loadDetail();
  }, [eventId]);

  async function submitReviewAction(action: ReviewAction) {
    setSubmitting(true);
    try {
      await postJson(`/api/hr/attendance-reviews/${eventId}/${action}`, {
        note: note.trim() || undefined,
      });
      await loadDetail();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionShell title="Attendance Review Detail">
      {!detail ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          Memuat detail review...
        </div>
      ) : (
        <div className="space-y-4">
          <Link
            href="/app/hr/attendance-reviews"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Kembali ke antrian review
          </Link>

          <DetailHeader detail={detail} />
          <DetailKronologi detail={detail} />
          <DetailSnapshotNote detail={detail} note={note} onNote={setNote} />
          <DetailHistory detail={detail} />
          <DetailActionBar
            detail={detail}
            submitting={submitting}
            onAction={(action) => void submitReviewAction(action)}
          />
        </div>
      )}
    </SectionShell>
  );
}

function DetailHeader({ detail }: { detail: AttendanceReviewDetail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {detail.fullName || detail.username}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatEventLabel(detail.event_type)} •{' '}
            {formatWorkDate(detail.work_date)}
          </p>
        </div>
        <Badge
          className={cn(
            'border-0',
            statusTone(detail.reviewStatus ?? detail.result),
          )}
        >
          {humanizeStatus(detail.reviewStatus ?? detail.result)}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <Field label="Jam Masuk" value={formatDateTime(detail.clockInAt)} />
        <Field label="Jam Pulang" value={formatDateTime(detail.clockOutAt)} />
        <Field
          label="Radius Lokasi"
          value={
            detail.defaultWorksiteRadiusMeters
              ? `${detail.defaultWorksiteRadiusMeters} m`
              : '-'
          }
        />
      </div>
    </div>
  );
}

function DetailKronologi({ detail }: { detail: AttendanceReviewDetail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Kronologi</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Field label="Waktu Event" value={formatDateTime(detail.event_at)} />
        <Field
          label="Alasan"
          value={humanizeReasonCode(detail.reason_code) || '-'}
        />
        <Field
          label="Lokasi Kerja"
          value={detail.defaultWorksiteName ?? '-'}
        />
        <Field
          label="Koordinat"
          value={
            typeof detail.latitude === 'number' &&
            typeof detail.longitude === 'number'
              ? `${detail.latitude.toFixed(6)}, ${detail.longitude.toFixed(6)}`
              : '-'
          }
        />
        <Field
          label="Skor Wajah"
          value={
            typeof detail.faceScore === 'number'
              ? detail.faceScore.toFixed(2)
              : '-'
          }
        />
        <Field
          label="Skor Liveness"
          value={
            typeof detail.livenessScore === 'number'
              ? detail.livenessScore.toFixed(2)
              : '-'
          }
        />
      </div>
    </div>
  );
}

function DetailSnapshotNote({
  detail,
  note,
  onNote,
}: {
  detail: AttendanceReviewDetail;
  note: string;
  onNote: (value: string) => void;
}) {
  const metadata = detail.metadataJson;
  const snapshotUrl = `/api/hr/events/${detail.id}/snapshot`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Snapshot dan Catatan</p>
      {detail.snapshotUrl ? (
        <a href={snapshotUrl} target="_blank" rel="noreferrer" className="mt-4 block">
          <img src={snapshotUrl} alt="" className="h-40 w-full rounded-2xl object-cover" />
        </a>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
          Tidak ada snapshot tersimpan untuk event ini.
        </div>
      )}
      <div className="mt-4 space-y-2">
        <Label htmlFor="review-note">Catatan HR</Label>
        <textarea
          id="review-note"
          className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-300"
          value={note}
          onChange={(event) => onNote(event.target.value)}
          placeholder="Tambahkan catatan review..."
        />
      </div>
      {metadata ? <MetadataGrid metadata={metadata} /> : null}
      {detail.reviewedAt || detail.reviewedByFullName || detail.reviewedByUsername ? (
        <p className="mt-3 text-xs text-slate-500">
          Review terakhir: {detail.reviewedByFullName || detail.reviewedByUsername || '-'} •{' '}
          {formatDateTime(detail.reviewedAt)}
        </p>
      ) : null}
    </div>
  );
}

function MetadataGrid({ metadata }: { metadata: Record<string, unknown> }) {
  const percent = (value: unknown) =>
    typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '-';
  const fixed = (value: unknown) =>
    typeof value === 'number' ? value.toFixed(2) : '-';

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
        <Field
          label="Status UI"
          value={
            typeof metadata.validationUiState === 'string'
              ? humanizeValidationUiState(metadata.validationUiState)
              : '-'
          }
        />
        <Field label="Tingkat Keyakinan" value={percent(metadata.identifyConfidence)} />
        <Field label="Pencahayaan" value={fixed(metadata.brightness)} />
        <Field label="Cakupan Wajah" value={percent(metadata.faceCoverage)} />
        <div className="col-span-2">
          <Field
            label="Hint Kualitas"
            value={
              typeof metadata.lowConfidenceHint === 'string'
                ? metadata.lowConfidenceHint
                : '-'
            }
          />
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Data Mesin Aturan</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-700">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      </div>
    </>
  );
}

function DetailHistory({ detail }: { detail: AttendanceReviewDetail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Review History</p>
      <div className="mt-4 space-y-3">
        {detail.reviewHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
            Belum ada transisi review yang tercatat.
          </div>
        ) : (
          detail.reviewHistory.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {entry.actorFullName || entry.actorUsername || 'Sistem'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </div>
                <Badge
                  className={cn('border-0', statusTone(entry.nextStatus))}
                >
                  {humanizeStatus(entry.nextStatus)}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                {entry.previousStatus
                  ? `${humanizeStatus(entry.previousStatus)} → `
                  : ''}
                {humanizeStatus(entry.nextStatus)}
              </p>
              {entry.note ? (
                <p className="mt-2 text-sm text-slate-700">{entry.note}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DetailActionBar({
  detail,
  submitting,
  onAction,
}: {
  detail: AttendanceReviewDetail;
  submitting: boolean;
  onAction: (action: ReviewAction) => void;
}) {
  return (
    <div className="sticky bottom-4 z-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
      <div
        className={cn(
          'grid gap-3',
          detail.reviewStatus === 'pending' ? 'sm:grid-cols-3' : 'sm:grid-cols-4',
        )}
      >
        <Button
          className="h-11 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
          disabled={submitting}
          onClick={() => onAction('approve')}
        >
          Setujui
        </Button>
        <Button
          className="h-11 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
          disabled={submitting}
          onClick={() => onAction('reject')}
        >
          Tolak
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-xl"
          disabled={submitting}
          onClick={() => onAction('request-clarification')}
        >
          Minta Klarifikasi
        </Button>
        {detail.reviewStatus !== 'pending' ? (
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            disabled={submitting}
            onClick={() => onAction('reopen')}
          >
            Kembalikan ke Antrian
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
