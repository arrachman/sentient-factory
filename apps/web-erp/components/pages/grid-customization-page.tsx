'use client';

/**
 * Kustomisasi Grid (/admin/grid-customization) — admin page to customize the
 * column layout of each transaction detail grid (legacy MyERP+ "Grid" parity).
 * Left = module→transaction tree; right = editable column definitions.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import {
  listTransactionTypes,
  getGridColumns,
  saveGridColumns,
  type ErpTransactionType,
  type ErpGridColumn,
} from '@/lib/api/transaction-grids';
import { GridCustomizationTree } from './grid-customization-tree';
import { GridCustomizationColumns } from './grid-customization-columns';

const blankColumn = (index: number): ErpGridColumn => ({
  sortOrder: index,
  headerText: 'Kolom Baru',
  dataField: `customText${index + 1}`,
  width: 120,
  isVisible: true,
  isRequired: false,
  isEditable: true,
  kind: 'CUSTOM',
  dataType: 'TEXT',
  lookupSource: null,
});

export function GridCustomizationPage() {
  const [types, setTypes] = React.useState<ErpTransactionType[]>([]);
  const [selected, setSelected] = React.useState<string | undefined>();
  const [columns, setColumns] = React.useState<ErpGridColumn[]>([]);
  const [loadingCols, setLoadingCols] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    listTransactionTypes()
      .then((t) => {
        setTypes(t);
        const first = t.find((x) => x.code === 'FIN.CR') ?? t[0];
        if (first) setSelected(first.code);
      })
      .catch((e) => setError(e?.message ?? 'Gagal memuat daftar transaksi'));
  }, []);

  React.useEffect(() => {
    if (!selected) return;
    setLoadingCols(true);
    getGridColumns(selected)
      .then((r) => setColumns(r.columns))
      .catch((e) => notify(e?.message ?? 'Gagal memuat kolom', 'danger'))
      .finally(() => setLoadingCols(false));
  }, [selected]);

  const selectedType = types.find((t) => t.code === selected);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const r = await saveGridColumns(selected, columns);
      setColumns(r.columns);
      notify('Layout grid disimpan', 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <div className="p-4 text-sm text-danger">Gagal memuat: {error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-var(--topbar-h,96px))] overflow-hidden rounded-lg border border-border">
      <aside className="w-72 shrink-0 border-r border-border">
        <div className="border-b border-border bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Jenis Transaksi
        </div>
        <GridCustomizationTree types={types} selectedCode={selected} onSelect={setSelected} />
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <h2 className="text-sm font-semibold">{selectedType?.name ?? 'Pilih transaksi'}</h2>
          <div className="flex-1" />
          <button
            type="button"
            className="btn"
            disabled={!selected}
            onClick={() => setColumns((c) => [...c, blankColumn(c.length)])}
          >
            <Icon name="plus" size={12} /> Tambah Kolom
          </button>
          <button type="button" className="btn primary" disabled={!selected || saving} onClick={handleSave}>
            <Icon name="save" size={13} /> Simpan
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {loadingCols ? (
            <div className="p-4 text-sm text-muted-foreground">Memuat…</div>
          ) : (
            <GridCustomizationColumns columns={columns} onColumnsChange={setColumns} />
          )}
        </div>
      </section>
    </div>
  );
}
