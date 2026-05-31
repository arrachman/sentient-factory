'use client';

/**
 * Kas Masuk (CR) — advanced filter panel (paritas legacy MyERP+).
 * Atomic tier: Page sub-part. Fields: No Transaksi (range), Status, Tanggal
 * (range), Terima Dari, Lokasi, Cabang, Uraian, Catatan, User.
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchSelect } from '@/components/molecules/search-select';
import {
  loadPartnerOptions,
  loadLocationOptions,
  loadBranchOptions,
} from './items-form-lookups';
import { listUsers } from '@/lib/api/users';

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

const STATUS_OPTIONS = [
  { label: 'Semua', value: '' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Need Approve', value: 'NEED_APPROVE' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Posted', value: 'POSTED' },
];

const loadUserOptions = async (search: string, page: number, limit: number) => {
  const res = await listUsers({ search: search || undefined, page, limit });
  return {
    data: res.data.map((u) => ({ value: u.id, label: u.fullName, code: u.username })),
    total: res.meta.total,
  };
};

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function CashReceiptFilters({
  value,
  onChange,
}: {
  value: CrFilters;
  onChange: (f: CrFilters) => void;
}) {
  const set = (p: Partial<CrFilters>) => onChange({ ...value, ...p });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3 rounded-lg border border-border bg-secondary/30 p-3 mb-3">
      <Field label="No Transaksi">
        <div className="flex items-center gap-1">
          <Input value={value.noFrom} onChange={(e) => set({ noFrom: e.target.value })} placeholder="dari" />
          <span className="text-xs text-muted-foreground">s.d</span>
          <Input value={value.noTo} onChange={(e) => set({ noTo: e.target.value })} placeholder="s.d" />
        </div>
      </Field>
      <Field label="Status">
        <Select value={value.status || '_all'} onValueChange={(v) => set({ status: v === '_all' ? '' : v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value || '_all'} value={o.value || '_all'}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Tanggal">
        <div className="flex items-center gap-1">
          <Input type="date" value={value.dateFrom} onChange={(e) => set({ dateFrom: e.target.value })} />
          <span className="text-xs text-muted-foreground">-</span>
          <Input type="date" value={value.dateTo} onChange={(e) => set({ dateTo: e.target.value })} />
        </div>
      </Field>
      <Field label="Terima Dari">
        <SearchSelect
          placeholder="Semua partner"
          value={value.partnerId}
          initialLabel={value.partnerLabel}
          onValueChange={(v) => set({ partnerId: v })}
          loadOptions={loadPartnerOptions}
        />
      </Field>
      <Field label="Lokasi">
        <SearchSelect
          placeholder="Semua lokasi"
          value={value.locationId}
          initialLabel={value.locationLabel}
          onValueChange={(v) => set({ locationId: v })}
          loadOptions={loadLocationOptions}
        />
      </Field>
      <Field label="Cabang">
        <SearchSelect
          placeholder="Semua cabang"
          value={value.branchId}
          initialLabel={value.branchLabel}
          onValueChange={(v) => set({ branchId: v })}
          loadOptions={loadBranchOptions}
        />
      </Field>
      <Field label="Uraian" wide>
        <Input value={value.uraian} onChange={(e) => set({ uraian: e.target.value })} placeholder="Cari uraian…" />
      </Field>
      <Field label="Catatan" wide>
        <Input value={value.catatan} onChange={(e) => set({ catatan: e.target.value })} placeholder="Cari catatan…" />
      </Field>
      <Field label="User">
        <SearchSelect
          placeholder="Semua user"
          value={value.userId}
          initialLabel={value.userLabel}
          onValueChange={(v) => set({ userId: v })}
          loadOptions={loadUserOptions}
        />
      </Field>
    </div>
  );
}
