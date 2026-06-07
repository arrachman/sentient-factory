'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import { executeSqlQuery } from '@/lib/api/reports';
import {
  FIELD_DND_MIME,
  makeBoundText,
  resolveTargetBand,
  type FieldDragPayload,
} from '@/lib/report-component-factory';
import type { DesignerAction, DesignerSelection, RptBand, RptDataSource } from '@/lib/report-types';

interface Props {
  dataSources: RptDataSource[];
  schemas: Record<string, string[]>;
  selection: DesignerSelection;
  bands: RptBand[];
  onSchema: (alias: string, columns: string[]) => void;
  dispatch: React.Dispatch<DesignerAction>;
}

export function FieldPalette({ dataSources, schemas, selection, bands, onSchema, dispatch }: Props) {
  const [loading, setLoading] = React.useState<string | null>(null);

  async function loadFields(ds: RptDataSource) {
    setLoading(ds.id);
    try {
      const res = await executeSqlQuery(ds.sql, {}, 1);
      if (res.columns?.length) onSchema(ds.alias, res.columns);
      else notify('Query tidak mengembalikan kolom', 'warn');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal memuat field', 'danger');
    } finally {
      setLoading(null);
    }
  }

  function insertField(column: string) {
    const band = resolveTargetBand(bands, selection.bandId);
    if (!band) { notify('Tambah band dulu', 'warn'); return; }
    const comp = makeBoundText(band, column);
    dispatch({ type: 'ADD_COMPONENT', bandId: band.id, component: comp });
    dispatch({ type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id });
  }

  if (!dataSources.length) {
    return (
      <div className="p-4 text-xs text-[var(--fg-muted)] italic text-center">
        Belum ada data source. Buat query di tab Data Sources, lalu Test Query untuk memunculkan field.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <p className="px-3 py-2 text-[10px] text-[var(--fg-muted)] leading-relaxed border-b border-[var(--border)]">
        Klik field untuk sisipkan ke band terpilih, atau seret langsung ke posisi di canvas.
      </p>
      {dataSources.map(ds => {
        const cols = schemas[ds.alias];
        return (
          <div key={ds.id} className="border-b border-[var(--border)]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-muted)]">
              <span className="text-xs font-semibold font-mono truncate">{ds.alias}</span>
              <button
                onClick={() => loadFields(ds)}
                disabled={loading === ds.id}
                className="text-[var(--accent)] hover:opacity-70 cursor-pointer disabled:opacity-40"
                title="Muat ulang field"
              >
                <Icon name="refresh" size={12} className={loading === ds.id ? 'animate-spin' : ''} />
              </button>
            </div>
            {!cols ? (
              <button
                onClick={() => loadFields(ds)}
                disabled={loading === ds.id}
                className="w-full text-left px-3 py-2 text-xs text-[var(--accent)] hover:bg-[var(--bg-hover)] cursor-pointer"
              >
                {loading === ds.id ? 'Memuat field…' : 'Muat field dari query →'}
              </button>
            ) : cols.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[var(--fg-muted)] italic">Tidak ada kolom</div>
            ) : (
              <div className="py-1">
                {cols.map(col => (
                  <div
                    key={col}
                    draggable
                    onDragStart={e => {
                      const payload: FieldDragPayload = { alias: ds.alias, column: col };
                      e.dataTransfer.setData(FIELD_DND_MIME, JSON.stringify(payload));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => insertField(col)}
                    className="flex items-center gap-2 px-3 py-1 text-xs cursor-grab hover:bg-[var(--bg-hover)] active:cursor-grabbing"
                    title={`Sisip {${col}}`}
                  >
                    <Icon name="grip-vertical" size={11} className="text-[var(--fg-muted)] shrink-0" />
                    <span className="font-mono truncate">{col}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
