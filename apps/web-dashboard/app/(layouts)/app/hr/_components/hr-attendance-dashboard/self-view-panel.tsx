'use client';

import { Clock3, Timer } from 'lucide-react';

export function SelfViewPanel({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 className="size-4" />
            <span className="text-xs uppercase tracking-wide">Masuk Hari Ini</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">{String(summary.clocked_in_today ?? 0)}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Status kehadiran hari ini</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Timer className="size-4" />
            <span className="text-xs uppercase tracking-wide">Pulang Hari Ini</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">{String(summary.clocked_out_today ?? 0)}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Status kepulangan hari ini</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Ringkasan Saya</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Hari Kerja</p>
            <p className="mt-1 font-medium text-slate-900">{String(summary.total_work_days ?? 0)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Exception</p>
            <p className="mt-1 font-medium text-slate-900">{String(summary.exception_sessions ?? 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
