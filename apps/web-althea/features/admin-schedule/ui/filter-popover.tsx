'use client';

/**
 * Popover filter — composer dari section terpisah:
 *   1. Kategori layanan (4 chips)
 *   2. Status booking
 *   3. Psikolog (checkbox list)
 *   4. Ruangan (chip toggle)
 *   5. Lanjutan: client search + time-of-day + sesi-type + services
 *
 * Dialog kanan-bawah toolbar (top: 100% + 6px). Klik di luar = close.
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { EMPTY_FILTERS } from '../model/constants';
import { filterCount } from '../model/filters';
import type { Filters } from '../model/types';
import { AdvancedFilterSection } from './filter-popover/filter-section-advanced';
import { CategoriesFilterSection } from './filter-popover/filter-section-categories';
import { PsikologFilterSection } from './filter-popover/filter-section-psikolog';
import { RoomsFilterSection } from './filter-popover/filter-section-rooms';
import { StatusFilterSection } from './filter-popover/filter-section-status';

export function FilterPopover({
  open,
  onClose,
  filters,
  onChange,
  psikologs,
  rooms,
  services,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (next: Filters) => void;
  psikologs: Psikolog[];
  rooms: Array<{ id: number; name: string; type: string }>;
  services: Array<{ id: number; name: string; category: string }>;
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
      aria-label="Filter jadwal"
      className="card-althea"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        width: 320,
        maxHeight: 480,
        overflowY: 'auto',
        zIndex: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: 16,
      }}
    >
      <PopoverHeader
        total={total}
        onReset={() => onChange(EMPTY_FILTERS)}
        onClose={onClose}
      />
      <CategoriesFilterSection filters={filters} onChange={onChange} />
      <StatusFilterSection filters={filters} onChange={onChange} />
      <PsikologFilterSection
        filters={filters}
        psikologs={psikologs}
        onChange={onChange}
      />
      <RoomsFilterSection filters={filters} rooms={rooms} onChange={onChange} />
      <AdvancedFilterSection
        filters={filters}
        services={services}
        onChange={onChange}
      />
    </div>
  );
}

function PopoverHeader({
  total,
  onReset,
  onClose,
}: {
  total: number;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: 12 }}
    >
      <span className="eyebrow">Filter ({total})</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
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
  );
}
