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

interface CrChip {
  key: string;
  label: string;
  clear: Partial<CrFilters>;
}

/** Active *advanced* filters (Status & Tanggal stay in the inline bar). */
function advancedChips(f: CrFilters): CrChip[] {
  const out: CrChip[] = [];
  if (f.noFrom || f.noTo)
    out.push({ key: 'no', label: `No: ${f.noFrom || '…'} – ${f.noTo || '…'}`, clear: { noFrom: '', noTo: '' } });
  if (f.partnerId)
    out.push({ key: 'partner', label: `Terima Dari: ${f.partnerLabel || f.partnerId}`, clear: { partnerId: '', partnerLabel: undefined } });
  if (f.locationId)
    out.push({ key: 'loc', label: `Lokasi: ${f.locationLabel || f.locationId}`, clear: { locationId: '', locationLabel: undefined } });
  if (f.branchId)
    out.push({ key: 'branch', label: `Cabang: ${f.branchLabel || f.branchId}`, clear: { branchId: '', branchLabel: undefined } });
  if (f.uraian)
    out.push({ key: 'uraian', label: `Uraian: ${f.uraian}`, clear: { uraian: '' } });
  if (f.catatan)
    out.push({ key: 'catatan', label: `Catatan: ${f.catatan}`, clear: { catatan: '' } });
  if (f.userId)
    out.push({ key: 'user', label: `User: ${f.userLabel || f.userId}`, clear: { userId: '', userLabel: undefined } });
  return out;
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 pl-2.5 pr-1 py-0.5 text-xs text-foreground">
      <span className="truncate max-w-[220px]">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-[var(--panel-hover)] hover:text-foreground"
        title="Hapus filter"
      >
        <Icon name="x" size={10} />
      </button>
    </span>
  );
}

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

  const chips = advancedChips(value);
  const advCount = chips.length;
  const anyActive = hasActiveCrFilters(value);

  return (
    <div className="mb-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[150px]">
          <Select value={value.status || '_all'} onValueChange={(v) => onChange({ ...value, status: v === '_all' ? '' : v })}>
            <SelectTrigger>
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
        </div>

        <div className="w-[250px]">
          <DateRangePicker
            from={value.dateFrom}
            to={value.dateTo}
            onChangeFrom={(v) => onChange({ ...value, dateFrom: v })}
            onChangeTo={(v) => onChange({ ...value, dateTo: v })}
          />
        </div>

        <button type="button" className="btn ghost sm" onClick={openDrawer}>
          <Icon name="filter" size={12} /> Filter
          {advCount > 0 && (
            <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {advCount}
            </span>
          )}
        </button>

        {anyActive && (
          <button type="button" className="btn ghost sm" onClick={() => onChange(emptyCrFilters)}>
            <Icon name="x" size={11} /> Reset
          </button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <ActiveChip key={c.key} label={c.label} onRemove={() => onChange({ ...value, ...c.clear })} />
          ))}
        </div>
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
    </div>
  );
}
