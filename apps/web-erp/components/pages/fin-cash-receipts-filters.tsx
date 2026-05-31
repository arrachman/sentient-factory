'use client';

/**
 * Kas Masuk (CR) — slim filter bar (enterprise/minimalist).
 * Inline quick filters (Status, Tanggal) apply live; everything else lives in
 * a right-side filter drawer (staged draft → "Terapkan"). Active advanced
 * filters surface as removable chips below the bar.
 * Atomic tier: Page sub-part.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from '@/components/organisms/drawer';
import { CrFilterFields, STATUS_OPTIONS } from './fin-cash-receipts-filter-fields';

export interface CrFilters {
  noFrom: string;
  noTo: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  partnerId: string;
  partnerLabel?: string;
  locationId: string;
  locationLabel?: string;
  branchId: string;
  branchLabel?: string;
  uraian: string;
  catatan: string;
  userId: string;
  userLabel?: string;
}

export const emptyCrFilters: CrFilters = {
  noFrom: '',
  noTo: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  partnerId: '',
  locationId: '',
  branchId: '',
  uraian: '',
  catatan: '',
  userId: '',
};

export const hasActiveCrFilters = (f: CrFilters): boolean =>
  !!(
    f.noFrom || f.noTo || f.status || f.dateFrom || f.dateTo ||
    f.partnerId || f.locationId || f.branchId || f.uraian || f.catatan || f.userId
  );

/** Count of active *advanced* filters (Status & Tanggal stay inline → excluded). */
function advancedCount(f: CrFilters): number {
  return [f.noFrom || f.noTo, f.partnerId, f.locationId, f.branchId, f.uraian, f.catatan, f.userId]
    .filter(Boolean).length;
}

/**
 * Inline filter controls — designed to sit inside the `ErpListLayout` filter
 * bar (`toolbar` slot), sharing the summary row. Quick filters (Status,
 * Tanggal) apply live; the rest live in the drawer.
 */
export function CashReceiptFilters({
  value,
  onChange,
}: {
  value: CrFilters;
  onChange: (f: CrFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<CrFilters>(value);

  const openDrawer = () => {
    setDraft(value);
    setOpen(true);
  };
  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const advCount = advancedCount(value);
  const anyActive = hasActiveCrFilters(value);

  return (
    <>
      <Select value={value.status || '_all'} onValueChange={(v) => onChange({ ...value, status: v === '_all' ? '' : v })}>
        <SelectTrigger style={{ width: 'auto', minWidth: '7rem' }}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value || '_all'} value={o.value || '_all'}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div style={{ width: 250 }}>
        <DateRangePicker
          from={value.dateFrom}
          to={value.dateTo}
          onChangeFrom={(v) => onChange({ ...value, dateFrom: v })}
          onChangeTo={(v) => onChange({ ...value, dateTo: v })}
        />
      </div>

      <button type="button" className="btn ghost sm" onClick={openDrawer} title="Filter lanjutan">
        <Icon name="filter" size={12} /> Filter
        {advCount > 0 && (
          <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {advCount}
          </span>
        )}
      </button>

      {anyActive && (
        <button type="button" className="btn ghost sm" onClick={() => onChange(emptyCrFilters)} title="Reset semua filter">
          <Icon name="x" size={11} /> Reset
        </button>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <Icon name="filter" size={14} />
            <DrawerTitle>Filter Kas Masuk</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <CrFilterFields value={draft} onChange={setDraft} />
          </DrawerBody>
          <DrawerFooter>
            <button type="button" className="btn ghost sm" onClick={() => setDraft(emptyCrFilters)}>
              Atur ulang
            </button>
            <button type="button" className="btn primary sm" onClick={apply}>
              Terapkan
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
