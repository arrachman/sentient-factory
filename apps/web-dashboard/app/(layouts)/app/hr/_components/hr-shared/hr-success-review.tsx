'use client';

import { Check, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SuccessReviewState } from './_types-hr';
import { formatDateTime } from './formatters';

interface HrSuccessReviewProps {
  successReview: SuccessReviewState;
  onClose: () => void;
}

export function HrSuccessReview({ successReview, onClose }: HrSuccessReviewProps) {
  return (
    <div className="mx-auto max-w-md rounded-[28px] border border-emerald-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check className="size-8" />
      </div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
        Berhasil
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">{successReview.actionLabel}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {successReview.employeeName} • {formatDateTime(successReview.recordedAt)}
      </p>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
        {successReview.snapshotDataUrl ? (
          <img
            src={successReview.snapshotDataUrl}
            alt=""
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center bg-slate-100 text-slate-400">
            <UserRound className="size-12" />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Karyawan</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{successReview.employeeName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Waktu</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(successReview.recordedAt)}</p>
        </div>
      </div>

      <Button className="mt-6 h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={onClose}>
        Tutup
      </Button>
    </div>
  );
}
