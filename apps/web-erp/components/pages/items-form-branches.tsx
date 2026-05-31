'use client';

/**
 * Branch editor — multi-row (Cabang + Cost Center) per item, paritas tab
 * "Branch" MyERP+ (item master). Add/remove rows, each row = one branch
 * (md_branches, Cabang) + cost center (md_cost_centers, Cost Center) lookup —
 * keduanya wajib. Pelengkap home branchId/costCenterId single di Dimensi GL.
 * Atomic tier: Organism.
 */

import * as React from 'react';
import { SearchSelect } from '@/components/molecules/search-select';
import { loadBranchOptions, loadCostCenterOptions } from './items-form-lookups';
import type { ItemBranchFormRow } from './items-form';

export function ItemBranchesEditor({
  rows, onChange,
}: { rows: ItemBranchFormRow[]; onChange: (rows: ItemBranchFormRow[]) => void }) {
  const nextKey = React.useRef(0);

  const addRow = () => onChange([...rows, { key: `new-${nextKey.current++}`, branchId: '', costCenterId: '' }]);
  const removeRow = (key: string) => onChange(rows.filter((r) => r.key !== key));
  const setRow = (key: string, patch: Partial<ItemBranchFormRow>) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <div className="col-span-2 py-1">
      <div className="overflow-hidden rounded-[var(--radius)] border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-[var(--panel-2)] text-left text-[var(--fg-muted)]">
              <th className="w-10 px-2 py-1.5 font-medium">No</th>
              <th className="px-2 py-1.5 font-medium">Cabang</th>
              <th className="px-2 py-1.5 font-medium">Cost Center</th>
              <th className="w-9 px-2 py-1.5" aria-label="Aksi" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-3 text-center text-[var(--fg-subtle)]">
                  Belum ada cabang. Klik “Tambah” untuk menambah penempatan cabang.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.key} className="border-b border-border last:border-b-0">
                <td className="px-2 py-1 text-center tabular-nums text-[var(--fg-muted)]">{i + 1}</td>
                <td className="px-2 py-1">
                  <SearchSelect
                    id={`ib-branch-${row.key}`}
                    value={row.branchId}
                    onValueChange={(v) => setRow(row.key, { branchId: v })}
                    placeholder="Pilih cabang…"
                    loadOptions={loadBranchOptions}
                    initialLabel={row.branchLabel}
                    title="Cabang"
                  />
                </td>
                <td className="px-2 py-1">
                  <SearchSelect
                    id={`ib-cc-${row.key}`}
                    value={row.costCenterId}
                    onValueChange={(v) => setRow(row.key, { costCenterId: v })}
                    placeholder="Pilih cost center…"
                    loadOptions={loadCostCenterOptions}
                    initialLabel={row.costCenterLabel}
                    title="Cost Center"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    className="rounded-[var(--radius)] px-1.5 py-0.5 text-[var(--fg-muted)] hover:bg-[var(--panel-hover)] hover:text-danger"
                    title="Hapus baris"
                    aria-label={`Hapus baris ${i + 1}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 inline-flex items-center gap-1 rounded-[var(--radius)] border border-border bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-medium hover:bg-[var(--panel-hover)]"
      >
        + Tambah
      </button>
    </div>
  );
}
