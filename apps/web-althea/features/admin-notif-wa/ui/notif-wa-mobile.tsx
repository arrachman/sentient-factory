'use client';

import { formatTime, getStatusStyle } from '../model/format';
import type { Template, WaLog } from '../model/types';

/**
 * Tampilan mobile halaman Notifikasi WA — mirror prototype "Notifikasi WA ·
 * log & template": 3 stat tile (sent/read/failed), section TEMPLATE AKTIF
 * (toggle), section LOG HARI INI (badge status). Editor template tidak
 * ditampilkan di mobile (tap kartu → pilih, edit lewat desktop).
 * Komponen ini hanya render di `lg:hidden`.
 */
export function NotifWaMobile({
  templates,
  logs,
  isLoading,
  sentTodayCount,
  readToday,
  failedToday,
  onToggleActive,
}: {
  templates: Template[];
  logs: WaLog[];
  isLoading: boolean;
  sentTodayCount: number;
  readToday: number;
  failedToday: number;
  onToggleActive: (t: Template) => void;
}) {
  return (
    <div className="lg:hidden">
      <div className="space-y-3 p-4">
        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile value={sentTodayCount} label="sent" />
          <StatTile value={readToday} label="read" />
          <StatTile value={failedToday} label="failed" />
        </div>

        {/* Template aktif */}
        <div className="caption pt-1 text-[11px] font-semibold uppercase tracking-wide">
          Template aktif
        </div>
        {isLoading ? (
          <div className="caption py-6 text-center">Memuat template…</div>
        ) : (
          <ul className="space-y-2">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-teal-800">
                    {t.name}
                  </p>
                  <p className="caption truncate text-[11px]">{t.category}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={t.isActive}
                  aria-label={`Toggle ${t.name}`}
                  onClick={() => onToggleActive(t)}
                  className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                  style={{
                    background: t.isActive
                      ? 'var(--sage-500, #5b8a66)'
                      : 'var(--border, #d6d3c8)',
                  }}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                    style={{ left: t.isActive ? '22px' : '2px' }}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Log hari ini */}
        <div className="caption pt-2 text-[11px] font-semibold uppercase tracking-wide">
          Log hari ini
        </div>
        {logs.length === 0 ? (
          <div className="caption py-6 text-center">Belum ada log.</div>
        ) : (
          <ul className="space-y-2">
            {logs.map((l) => {
              const ss = getStatusStyle(l.status);
              return (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <span className="caption w-12 shrink-0 text-[12px]">
                    {formatTime(l.createdAt)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-teal-800">
                      {l.template?.name ?? 'Pesan WA'}
                    </p>
                    <p className="caption truncate text-[11px]">
                      {l.recipientType} · {l.recipientPhone}
                    </p>
                  </div>
                  <span
                    className="badge shrink-0 capitalize"
                    style={{ background: ss.bg, color: ss.fg }}
                  >
                    {l.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-3 text-center">
      <div className="brand-mark text-xl text-teal-800">{value}</div>
      <div className="caption text-[11px]">{label}</div>
    </div>
  );
}
