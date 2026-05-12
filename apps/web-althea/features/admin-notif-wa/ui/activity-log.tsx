'use client';

/**
 * Center column halaman Notifikasi WA — log aktivitas pengiriman:
 * time + ikon WA + recipient type + template name + nomor + status badge.
 */
import { MessageCircle } from 'lucide-react';
import { formatTime, getStatusStyle } from '../model/format';
import type { WaLog } from '../model/types';

export function ActivityLog({
  logs,
  isLoading,
  totalToday,
}: {
  logs: WaLog[];
  isLoading: boolean;
  totalToday: number;
}) {
  return (
    <div className="card-althea overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="h2">Aktivitas Hari Ini</h2>
        <span className="caption">{totalToday} kirim · auto refresh</span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[700px]">
        {isLoading ? (
          <div className="p-8 text-center text-fg-muted">Memuat...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">
            Belum ada log pengiriman hari ini.
          </div>
        ) : (
          logs.map((l) => <LogRow key={l.id} log={l} />)
        )}
      </div>
    </div>
  );
}

function LogRow({ log: l }: { log: WaLog }) {
  const ss = getStatusStyle(l.status);
  const recipientLabel =
    l.recipientType === 'klien'
      ? 'Klien'
      : l.recipientType === 'psikolog'
        ? 'Psikolog'
        : l.recipientType;
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0">
      <span className="caption font-mono w-12 flex-shrink-0 pt-0.5 tabular-nums">
        {formatTime(l.createdAt)}
      </span>
      <div
        className="flex-shrink-0 rounded-full grid place-items-center"
        style={{
          width: 28,
          height: 28,
          background: 'var(--success-soft)',
        }}
      >
        <MessageCircle
          className="h-3.5 w-3.5"
          style={{ color: 'var(--success)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-teal-800">
            {recipientLabel}
          </span>
          <span className="caption">
            · {l.template?.name ?? '(template dihapus)'}
          </span>
        </div>
        <div className="caption mt-0.5 font-mono text-xs">
          {l.recipientPhone}
          {l.errorReason ? (
            <span className="text-danger"> · {l.errorReason}</span>
          ) : null}
        </div>
      </div>
      <span
        className="badge flex-shrink-0 capitalize"
        style={{ background: ss.bg, color: ss.fg }}
      >
        {l.status}
      </span>
    </div>
  );
}
