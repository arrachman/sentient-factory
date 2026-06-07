'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import { executeSqlQuery } from '@/lib/api/reports';
import type { DesignerAction, RptDataSource, SqlQueryResult } from '@/lib/report-types';

interface Props {
  dataSources: RptDataSource[];
  dispatch: React.Dispatch<DesignerAction>;
}

function genId() {
  return `ds_${Date.now().toString(36)}`;
}

function blankDs(count: number): RptDataSource {
  return {
    id: genId(),
    alias: `DS${count + 1}`,
    name: `Data Source ${count + 1}`,
    sql: 'SELECT 1 AS test',
    params: [],
  };
}

export function DataSourcePanel({ dataSources, dispatch }: Props) {
  const [activeId, setActiveId] = React.useState<string | null>(dataSources[0]?.id ?? null);
  const [testResult, setTestResult] = React.useState<SqlQueryResult | null>(null);
  const [testError, setTestError] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState(false);

  const activeDs = dataSources.find(d => d.id === activeId);

  function handleAdd() {
    const ds = blankDs(dataSources.length);
    dispatch({ type: 'ADD_DATASOURCE', ds });
    setActiveId(ds.id);
    setTestResult(null);
    setTestError(null);
  }

  function handleRemove(id: string) {
    dispatch({ type: 'REMOVE_DATASOURCE', dsId: id });
    if (activeId === id) {
      const remaining = dataSources.filter(d => d.id !== id);
      setActiveId(remaining[0]?.id ?? null);
    }
    setTestResult(null);
  }

  function patchActive(patch: Partial<RptDataSource>) {
    if (!activeId) return;
    dispatch({ type: 'UPDATE_DATASOURCE', dsId: activeId, patch });
  }

  async function handleTest() {
    if (!activeDs) return;
    setTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      const result = await executeSqlQuery(activeDs.sql, {}, 50);
      setTestResult(result);
    } catch (e: any) {
      setTestError(e.message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* DS list */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Data Sources</span>
        <button onClick={handleAdd} className="text-[var(--accent)] hover:opacity-70 cursor-pointer" title="Tambah data source">
          <Icon name="plus" size={14} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DS tab list */}
        <div className="w-36 border-r border-[var(--border)] flex flex-col overflow-y-auto shrink-0">
          {dataSources.length === 0 && (
            <div className="p-3 text-xs text-[var(--fg-muted)] italic">Belum ada data source</div>
          )}
          {dataSources.map(ds => (
            <div
              key={ds.id}
              onClick={() => { setActiveId(ds.id); setTestResult(null); setTestError(null); }}
              className={`px-3 py-2 cursor-pointer text-xs flex items-center justify-between group ${activeId === ds.id ? 'bg-[var(--bg-selected)] font-semibold' : 'hover:bg-[var(--bg-hover)]'}`}
            >
              <span className="truncate">{ds.alias}</span>
              <button
                onClick={e => { e.stopPropagation(); handleRemove(ds.id); }}
                className="opacity-0 group-hover:opacity-100 text-[var(--fg-muted)] hover:text-red-500 cursor-pointer"
              >
                <Icon name="x" size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* DS editor */}
        {activeDs ? (
          <div className="flex flex-col flex-1 overflow-hidden p-3 gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-[var(--fg-muted)] mb-1">Alias</label>
                <input
                  value={activeDs.alias}
                  onChange={e => patchActive({ alias: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-xs font-mono bg-[var(--bg-card)]"
                />
              </div>
              <div className="flex-[2]">
                <label className="block text-xs text-[var(--fg-muted)] mb-1">Nama</label>
                <input
                  value={activeDs.name}
                  onChange={e => patchActive({ name: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-xs bg-[var(--bg-card)]"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-xs text-[var(--fg-muted)] mb-1">SQL Query</label>
              <textarea
                value={activeDs.sql}
                onChange={e => patchActive({ sql: e.target.value })}
                spellCheck={false}
                className="flex-1 border rounded px-2 py-2 text-xs font-mono resize-none bg-[var(--bg-input,var(--bg-card))] min-h-[120px]"
                placeholder="SELECT * FROM md_partners WHERE :param1"
              />
              <p className="text-[10px] text-[var(--fg-muted)] mt-1">
                Gunakan <code>:namaParam</code> untuk parameter. Hanya SELECT yang diizinkan.
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleTest} disabled={testing} className="gap-1">
                <Icon name="play" size={12} />
                {testing ? 'Menjalankan...' : 'Test Query'}
              </Button>
            </div>

            {testError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 font-mono break-all">
                {testError}
              </div>
            )}

            {testResult && (
              <div className="flex flex-col gap-1 min-h-0">
                <div className="text-xs text-[var(--fg-muted)]">
                  {testResult.count} baris · {testResult.columns.length} kolom
                </div>
                <div className="overflow-auto border rounded text-xs max-h-40">
                  <table className="w-full min-w-max">
                    <thead className="bg-[var(--bg-muted)] sticky top-0">
                      <tr>
                        {testResult.columns.map(c => (
                          <th key={c} className="px-2 py-1 text-left font-semibold border-r border-[var(--border)] whitespace-nowrap">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {testResult.rows.slice(0, 20).map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--bg-muted)]'}>
                          {testResult.columns.map(c => (
                            <td key={c} className="px-2 py-0.5 border-r border-[var(--border)] whitespace-nowrap font-mono">
                              {row[c] == null ? <span className="text-[var(--fg-muted)] italic">null</span> : String(row[c])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[var(--fg-muted)] italic">
            Pilih atau tambah data source
          </div>
        )}
      </div>
    </div>
  );
}
