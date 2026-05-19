'use client';

import { Plus, Search } from 'lucide-react';
import { ClientAvatar } from './client-avatar';
import {
  STATUS_BADGE,
  STATUS_LABEL,
  type Client,
  type ClientStatus,
} from '../model/types';

type Filter = 'semua' | 'aktif' | 'baru' | 'selesai';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'aktif', label: 'Aktif' },
  { key: 'baru', label: 'Baru' },
  { key: 'selesai', label: 'Selesai' },
];

/**
 * Tampilan mobile halaman Klien — mirror prototype "Klien · daftar":
 * search, tab filter dengan count, card list (avatar + nama + badge + meta), FAB.
 * Desktop pakai `ClientsTable`; komponen ini hanya render di `lg:hidden`.
 */
export function ClientsMobile({
  items,
  isLoading,
  filter,
  counts,
  search,
  onChangeFilter,
  onChangeSearch,
  onOpen,
  onCreate,
}: {
  items: Client[];
  isLoading: boolean;
  filter: Filter;
  counts: Record<Filter, number>;
  search: string;
  onChangeFilter: (f: Filter) => void;
  onChangeSearch: (s: string) => void;
  onOpen: (id: number) => void;
  onCreate: () => void;
}) {
  return (
    <div className="lg:hidden">
      <div className="space-y-3 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Cari nama klien…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        {/* Filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onChangeFilter(f.key)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium"
                style={{
                  borderColor: active ? 'transparent' : 'var(--border)',
                  background: active ? 'var(--sage-500, #5b8a66)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--teal-800, #142828)',
                }}
              >
                {f.label}
                <span className="opacity-80">{counts[f.key]}</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="caption py-8 text-center">Memuat klien…</div>
        ) : items.length === 0 ? (
          <div className="caption py-8 text-center">Tidak ada klien.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((c) => {
              const status = c.derivedStatus as ClientStatus;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(c.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left"
                  >
                    <ClientAvatar
                      name={c.name}
                      category={c.category ?? undefined}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-teal-800">
                          {c.name}
                        </span>
                        <span
                          className={`badge ${STATUS_BADGE[status]} shrink-0 text-[10px]`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </div>
                      <p className="caption truncate text-[12px]">
                        {c.currentService
                          ? `${c.currentService.name} · Sesi ${c.currentService.sessionN}/${c.currentService.sessionTotal}`
                          : `${c.totalBookings} booking`}
                      </p>
                      {c.nextSession && (
                        <p className="caption truncate text-[11px] opacity-80">
                          → {c.nextSession.date}
                          {c.nextSession.psikologName
                            ? ` · ${c.nextSession.psikologName}`
                            : ''}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={onCreate}
        aria-label="Tambah klien"
        className="fixed bottom-20 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: 'var(--sage-500, #5b8a66)' }}
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
