'use client';

/**
 * Center column halaman Notifikasi WA — log aktivitas pengiriman:
 * time + ikon WA + recipient type + template name + nomor + status badge.
 */
import { MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
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
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? logs.filter((l) => {
        const q = search.toLowerCase();
        return (
          l.recipientPhone.toLowerCase().includes(q) ||
          (l.template?.name ?? '').toLowerCase().includes(q) ||
          l.status.toLowerCase().includes(q) ||
          l.recipientType.toLowerCase().includes(q)
        );
      })
    : logs;

  return (
    <div className="card-althea overflow-hidden flex flex-col">
      <div className="border-b border-border px-4 pt-3 pb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="h2">Aktivitas Hari Ini</h2>
          <span className="caption">{totalToday} kirim · auto refresh</span>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder="Cari nama, nomor, template, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-althea pl-8 h-8 text-sm w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[700px]">
        {isLoading ? (
          <div className="p-8 text-center text-fg-muted">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">
            {search.trim() ? 'Tidak ada hasil untuk pencarian ini.' : 'Belum ada log pengiriman hari ini.'}
          </div>
        ) : (
          filtered.map((l) => <LogRow key={l.id} log={l} />)
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
