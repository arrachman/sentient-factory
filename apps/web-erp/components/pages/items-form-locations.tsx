'use client';

/**
 * Lokasi editor — multi-row (Gudang + Lokasi) per item, paritas tab "Lokasi"
 * MyERP+ (m1_item_location_warehouse). Add/remove rows, each pair = warehouse
 * (md_warehouses, Gudang) + storage spot (md_item_locations, Lokasi) lookup.
 * Atomic tier: Organism.
 */

import * as React from 'react';
import { SearchSelect } from '@/components/molecules/search-select';
import { loadWarehouseOptions, loadItemLocationOptions } from './items-form-lookups';
import type { ItemLocationFormRow } from './items-form';

export function ItemLocationsEditor({
  rows, onChange,
}: { rows: ItemLocationFormRow[]; onChange: (rows: ItemLocationFormRow[]) => void }) {
  const nextKey = React.useRef(0);

  const addRow = () => onChange([...rows, { key: `new-${nextKey.current++}`, warehouseId: '', locationId: '' }]);
  const removeRow = (key: string) => onChange(rows.filter((r) => r.key !== key));
  const setRow = (key: string, patch: Partial<ItemLocationFormRow>) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <div className="col-span-2 py-1">
      <div className="overflow-hidden rounded-[var(--radius)] border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-[var(--panel-2)] text-left text-[var(--fg-muted)]">
              <th className="w-10 px-2 py-1.5 font-medium">No</th>
              <th className="px-2 py-1.5 font-medium">Gudang</th>
              <th className="px-2 py-1.5 font-medium">Lokasi</th>
              <th className="w-9 px-2 py-1.5" aria-label="Aksi" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-3 text-center text-[var(--fg-subtle)]">
                  Belum ada lokasi. Klik “Tambah” untuk menambah penempatan gudang.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.key} className="border-b border-border last:border-b-0">
                <td className="px-2 py-1 text-center tabular-nums text-[var(--fg-muted)]">{i + 1}</td>
                <td className="px-2 py-1">
                  <SearchSelect
                    id={`il-wh-${row.key}`}
                    value={row.warehouseId}
                    onValueChange={(v) => setRow(row.key, { warehouseId: v })}
                    placeholder="Pilih gudang…"
                    loadOptions={loadWarehouseOptions}
                    initialLabel={row.warehouseLabel}
                    title="Gudang"
                  />
                </td>
                <td className="px-2 py-1">
                  <SearchSelect
                    id={`il-loc-${row.key}`}
                    value={row.locationId}
                    onValueChange={(v) => setRow(row.key, { locationId: v })}
                    placeholder="Pilih lokasi…"
                    loadOptions={loadItemLocationOptions}
                    initialLabel={row.locationLabel}
                    title="Lokasi"
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
