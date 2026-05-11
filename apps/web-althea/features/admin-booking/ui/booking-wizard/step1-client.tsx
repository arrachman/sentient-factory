'use client';

import { useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { useClientList } from '@/features/admin-clients/hooks/use-client';

/**
 * Section "Klien" — searchable combobox.
 * Type-ahead filter by name / phone / MRN. Click selects + closes.
 * Faster than native <select> untuk klinik dengan 50+ klien.
 */
export function Step1Client({
  clientList,
  selectedId,
  onChange,
}: {
  clientList: ReturnType<typeof useClientList>;
  selectedId: number | null;
  onChange: (id: number | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const all = clientList.data?.data ?? [];

  const selected = useMemo(
    () => all.find((c) => c.id === selectedId) ?? null,
    [all, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 12);
    return all
      .filter((c) => {
        const hay = `${c.name} ${c.phoneWa} ${c.medicalRecordNumber ?? ''}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [all, query]);

  if (clientList.isLoading) {
    return <div className="text-fg-muted text-sm">Memuat klien...</div>;
  }

  return (
    <div className="relative">
      {selected && !open ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-sage-300 bg-sage-50">
          <Check className="h-4 w-4 text-sage-700 flex-shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-teal-800 truncate">
              {selected.name}
            </span>
            <span className="caption truncate">
              {selected.phoneWa}
              {selected.medicalRecordNumber ? ` · ${selected.medicalRecordNumber}` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery('');
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="btn btn-ghost btn-icon h-7 w-7"
            aria-label="Ganti klien"
            title="Ganti klien"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              placeholder="Ketik nama, no. WA, atau MRN…"
              className="input-althea pl-9 pr-8"
              autoComplete="off"
              autoFocus
            />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          </div>
          {open && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-72 overflow-y-auto rounded-md border border-border bg-card shadow-lg">
              {filtered.length === 0 ? (
                <div className="px-3 py-2.5 caption text-fg-muted italic">
                  Klien tidak ditemukan. Tambah dulu di menu Klien.
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-cream-50 border-b border-border last:border-b-0"
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[13.5px] font-semibold text-teal-800 truncate">
                        {c.name}
                      </span>
                      <span className="caption truncate">
                        {c.phoneWa}
                        {c.medicalRecordNumber ? ` · ${c.medicalRecordNumber}` : ''}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
