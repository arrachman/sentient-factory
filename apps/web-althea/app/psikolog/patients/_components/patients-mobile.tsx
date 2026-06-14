'use client';

import { Eye, Search } from 'lucide-react';
import {
  RISK_TONE,
  STATUS_TONE,
  type AggregatedClient,
  type ClientStatus,
} from '../_lib/patients-model';

type StatusTab = 'Semua' | 'Aktif' | 'Baru' | 'Selesai';

const TABS: StatusTab[] = ['Semua', 'Aktif', 'Baru', 'Selesai'];

/**
 * Tampilan mobile "Klien saya" psikolog — mirror prototype 02:
 * search, banner privasi, filter chips bercount, card list
 * (avatar + nama + status + progress + next). Desktop pakai table; `lg:hidden`.
 */
function statusBadge(s: ClientStatus): string {
  if (s === 'aktif') return 'aktif';
  if (s === 'baru') return 'baru';
  return 'selesai';
}

export function PatientsMobile({
  visible,
  counts,
  todayCount,
  isLoading,
  statusTab,
  query,
  onSelectTab,
  onQuery,
  onSelect,
}: {
  visible: AggregatedClient[];
  counts: Record<StatusTab, number>;
  todayCount: number;
  isLoading: boolean;
  statusTab: StatusTab;
  query: string;
  onSelectTab: (t: StatusTab) => void;
  onQuery: (q: string) => void;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="lg:hidden">
      <div className="space-y-3 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari klien…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        {/* Privacy banner */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px]"
          style={{ background: 'var(--info-soft, #e6f0f7)', color: '#2c4a60' }}
        >
          <Eye className="h-3.5 w-3.5 shrink-0" />
          Hanya klien Anda ({counts.Semua}). Privasi terjaga.
        </div>

        {/* Filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {TABS.map((t) => {
            const active = statusTab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onSelectTab(t)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium"
                style={{
                  borderColor: active ? 'transparent' : 'var(--border)',
                  background: active
                    ? 'var(--sage-500, #5b8a66)'
                    : 'var(--card)',
                  color: active ? '#fff' : 'var(--teal-800, #142828)',
                }}
              >
                {t}
                <span className="opacity-80">{counts[t]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="caption text-[11px] font-semibold uppercase tracking-wide">
            {visible.length} klien
          </span>
          {todayCount > 0 && (
            <span className="caption text-[12px]">{todayCount} hari ini</span>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="caption py-8 text-center">Memuat klien…</div>
        ) : visible.length === 0 ? (
          <div className="caption py-8 text-center">Tidak ada klien.</div>
        ) : (
          <ul className="space-y-2">
            {visible.map((c) => {
              const pct =
                c.sessionTotal > 0
                  ? Math.round((c.sessionN / c.sessionTotal) * 100)
                  : 0;
              const st = STATUS_TONE[c.status];
              const rt = RISK_TONE[c.risk];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border bg-card p-3 text-left"
                  >
                    <span
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        background: 'var(--sage-100, #dde9d8)',
                        color: 'var(--sage-700, #3a5b3f)',
                      }}
                    >
                      {c.initial}
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card"
                        style={{ background: rt.dot }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-teal-800">
                          {c.name}
                        </span>
                        <span
                          className="badge shrink-0 text-[10px]"
                          style={{ background: st.bg, color: st.fg }}
                        >
                          {statusBadge(c.status)}
                        </span>
                      </div>
                      <p className="caption truncate text-[12px]">
                        {c.category} · sesi {c.sessionN}/{c.sessionTotal}
                      </p>
                      <div
                        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
                        style={{ background: 'var(--cream-200, #e8e3d4)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: 'var(--sage-500, #5b8a66)',
                          }}
                        />
                      </div>
                      <p className="caption mt-1.5 truncate text-[11px]">
                        → {c.next}
                        {c.nextRoom ? ` · ${c.nextRoom}` : ''}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
