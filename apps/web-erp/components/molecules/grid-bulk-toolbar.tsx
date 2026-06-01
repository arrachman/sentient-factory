'use client';

/**
 * Toolbar bulk-action di atas tabel kustomisasi grid.
 * Tampil saat ≥1 baris dipilih; tersembunyi bila tidak ada selection.
 * Atomic tier: Molecule.
 */

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icons';
import type { ErpGridColumn } from '@/lib/api/transaction-grids';

export type BooleanColumnFlag = 'isVisible' | 'isRequired' | 'isEditable' | 'isSkippable';

interface GridBulkToolbarProps {
  total: number;
  selectedIndices: Set<number>;
  onSelectAll: (checked: boolean) => void;
  onBulkToggle: (flag: BooleanColumnFlag, value: boolean) => void;
  onBulkReset: () => void;
  columns: ErpGridColumn[];
}

const FLAG_LABELS: { flag: BooleanColumnFlag; label: string }[] = [
  { flag: 'isVisible', label: 'Tampil' },
  { flag: 'isRequired', label: 'Wajib' },
  { flag: 'isEditable', label: 'Edit' },
  { flag: 'isSkippable', label: 'Skip' },
];

export function GridBulkToolbar({
  total,
  selectedIndices,
  onSelectAll,
  onBulkToggle,
  onBulkReset,
  columns,
}: GridBulkToolbarProps) {
  const count = selectedIndices.size;
  const allChecked = count === total && total > 0;
  const someChecked = count > 0 && count < total;

  const selectedCols = [...selectedIndices].map((i) => columns[i]).filter(Boolean);

  const allFlagOn = (flag: BooleanColumnFlag) =>
    selectedCols.length > 0 && selectedCols.every((c) => c[flag]);

  return (
    <div className="flex items-center gap-3 border-b border-border bg-secondary/60 px-3 py-1.5">
      <Checkbox
        checked={allChecked ? true : someChecked ? 'indeterminate' : false}
        onCheckedChange={(v) => onSelectAll(v === true)}
        title="Pilih semua baris"
      />

      {count === 0 ? (
        <span className="text-xs text-muted-foreground">Pilih baris untuk bulk action</span>
      ) : (
        <>
          <span className="text-xs font-medium text-foreground">{count} baris dipilih</span>
          <div className="h-4 w-px bg-border" />
          {FLAG_LABELS.map(({ flag, label }) => (
            <button
              key={flag}
              type="button"
              className="btn text-xs"
              title={`${allFlagOn(flag) ? 'Matikan' : 'Aktifkan'} ${label} pada ${count} baris`}
              onClick={() => onBulkToggle(flag, !allFlagOn(flag))}
            >
              <Icon name="check" size={12} />
              {allFlagOn(flag) ? `Off ${label}` : label}
            </button>
          ))}
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            className="btn text-xs text-warning"
            title="Reset pilihan ke nilai default"
            onClick={onBulkReset}
          >
            <Icon name="refresh" size={12} /> Reset
          </button>
          <button
            type="button"
            className="iconbtn ml-auto"
            title="Batal pilihan"
            onClick={() => onSelectAll(false)}
          >
            <Icon name="x" size={13} />
          </button>
        </>
      )}
    </div>
  );
}
