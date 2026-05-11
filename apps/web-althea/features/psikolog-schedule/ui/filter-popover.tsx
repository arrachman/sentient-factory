'use client';

/**
 * Filter popover untuk Jadwal Saya (psikolog).
 *
 * Filters yang tersedia:
 *   - Status booking (Semua / Akan datang / Berlangsung / Selesai)
 *   - Kategori layanan (Semua / Konseling / Terapi / Anak / Tes)
 *   - Tipe sesi (Semua / Tunggal / Paket / Sesi akhir)
 *   - Cari nama klien (text input substring)
 *
 * Lebih simpel dari admin/schedule karena psikolog hanya lihat booking
 * sendiri — gak butuh filter psikolog/ruangan (ada di admin saja).
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  CATEGORY_FILTER_LABEL,
  EMPTY_FILTERS,
  SESI_TYPE_LABEL,
  STATUS_FILTER_LABEL,
  type CategoryFilter,
  type ScheduleFilters,
  type SesiTypeFilter,
  type StatusFilter,
} from '../model/constants';
import { filterCount } from '../model/format';

const STATUS_KEYS: StatusFilter[] = ['all', 'next', 'now', 'done'];
const CATEGORY_KEYS: CategoryFilter[] = [
  'all',
  'konseling',
  'terapi',
  'anak',
  'tes',
];
const SESI_KEYS: SesiTypeFilter[] = ['all', 'tunggal', 'multi', 'last'];

export function FilterPopover({
  open,
  onClose,
  filters,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  filters: ScheduleFilters;
  onChange: (next: ScheduleFilters) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, onClose]);

  if (!open) return null;

  const total = filterCount(filters);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Filter jadwal saya"
      className="card-althea"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        width: 300,
        zIndex: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: 16,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 12 }}
      >
        <span className="eyebrow">Filter ({total})</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={total === 0}
            className="btn btn-ghost btn-sm"
            style={{ height: 24, padding: '0 8px', fontSize: 11 }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Tutup"
            style={{ height: 24, width: 24 }}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Status */}
      <FilterSection title="Status">
        <Segmented
          options={STATUS_KEYS.map((k) => [k, STATUS_FILTER_LABEL[k]])}
          value={filters.status}
          onChange={(v) => onChange({ ...filters, status: v as StatusFilter })}
        />
      </FilterSection>

      {/* Kategori layanan */}
      <FilterSection title="Kategori layanan">
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {CATEGORY_KEYS.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...filters, category: cat })}
                className="btn btn-sm"
                style={{
                  height: 24,
                  padding: '0 10px',
                  fontSize: 11.5,
                  background: active ? 'var(--sage-500)' : 'var(--cream-100)',
                  color: active ? '#fff' : 'var(--fg)',
                  border: '1px solid ' + (active ? 'var(--sage-500)' : 'var(--border)'),
                }}
              >
                {CATEGORY_FILTER_LABEL[cat]}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Tipe sesi */}
      <FilterSection title="Tipe sesi">
        <Segmented
          options={SESI_KEYS.map((k) => [k, SESI_TYPE_LABEL[k]])}
          value={filters.sesiType}
          onChange={(v) =>
            onChange({ ...filters, sesiType: v as SesiTypeFilter })
          }
          titleForKey={(k) =>
            k === 'tunggal'
              ? 'Hanya sesi 1×'
              : k === 'multi'
              ? 'Paket multi-sesi'
              : k === 'last'
              ? 'Sesi terakhir di paket (sesiN === sessionTotal)'
              : 'Semua tipe'
          }
        />
      </FilterSection>

      {/* Client search */}
      <div>
        <span
          className="caption"
          style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
        >
          Cari nama klien
        </span>
        <input
          type="search"
          value={filters.clientQuery}
          onChange={(e) => onChange({ ...filters, clientQuery: e.target.value })}
          placeholder="ketik nama klien..."
          className="input-althea"
          style={{ height: 30, fontSize: 12.5 }}
        />
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        {title}
      </span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  titleForKey,
}: {
  options: Array<[T, string]>;
  value: T;
  onChange: (v: T) => void;
  titleForKey?: (k: T) => string;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--cream-100)',
        borderRadius: 6,
        padding: 2,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {options.map(([k, label]) => {
        const active = value === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className="btn btn-sm"
            style={{
              height: 24,
              padding: '0 10px',
              fontSize: 11.5,
              background: active ? 'var(--bg-elev, #fff)' : 'transparent',
              boxShadow: active
                ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                : 'none',
              color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
              fontWeight: active ? 600 : 500,
            }}
            title={titleForKey?.(k)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
