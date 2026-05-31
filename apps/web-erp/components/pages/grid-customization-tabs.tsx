'use client';

/**
 * Tab strip for Kustomisasi Grid: one transaction type can own many grids
 * (tables) — each is a tab here. Select / add / rename / reorder / delete tabs
 * and mark the primary grid (the one the live entry grid reads).
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import type { ErpTransactionGrid } from '@/lib/api/transaction-grids';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'tab';

function uniqueKey(base: string, taken: Set<string>) {
  let key = base;
  let n = 2;
  while (taken.has(key)) { key = `${base}-${n}`; n += 1; }
  return key;
}

export function GridCustomizationTabs({
  grids,
  activeKey,
  onSelect,
  onGridsChange,
}: {
  grids: ErpTransactionGrid[];
  activeKey?: string;
  onSelect: (key: string) => void;
  onGridsChange: (grids: ErpTransactionGrid[]) => void;
}) {
  const [editingKey, setEditingKey] = React.useState<string | null>(null);

  const addTab = () => {
    const taken = new Set(grids.map((g) => g.key));
    const key = uniqueKey('tab', taken);
    const next: ErpTransactionGrid = {
      key, label: `Tab ${grids.length + 1}`, sortOrder: grids.length,
      lineTable: null, isPrimary: grids.length === 0, columns: [],
    };
    onGridsChange([...grids, next]);
    onSelect(key);
    setEditingKey(key);
  };

  const rename = (key: string, label: string) =>
    onGridsChange(grids.map((g) => (g.key === key ? { ...g, label } : g)));

  const move = (key: string, dir: -1 | 1) => {
    const i = grids.findIndex((g) => g.key === key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= grids.length) return;
    const next = [...grids];
    [next[i], next[j]] = [next[j], next[i]];
    onGridsChange(next);
  };

  const setPrimary = (key: string) =>
    onGridsChange(grids.map((g) => ({ ...g, isPrimary: g.key === key })));

  const remove = (key: string) => {
    if (grids.length <= 1) return; // keep at least one grid
    const next = grids.filter((g) => g.key !== key);
    if (!next.some((g) => g.isPrimary)) next[0] = { ...next[0], isPrimary: true };
    onGridsChange(next);
    if (activeKey === key) onSelect(next[0].key);
  };

  return (
    <div className="flex items-center gap-1 border-b border-border bg-card px-2">
      <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        {grids.map((g, i) => {
          const active = g.key === activeKey;
          return (
            <div
              key={g.key}
              className={cn(
                'group flex items-center gap-1 rounded-t px-2 py-1.5 text-[12.5px]',
                active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {editingKey === g.key ? (
                <Input
                  autoFocus
                  value={g.label}
                  onChange={(e) => rename(g.key, e.target.value)}
                  onBlur={() => setEditingKey(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingKey(null); }}
                  className="h-6 w-28 px-1 text-[12.5px]"
                />
              ) : (
                <button
                  type="button"
                  className="cursor-pointer whitespace-nowrap font-medium"
                  onClick={() => onSelect(g.key)}
                  onDoubleClick={() => setEditingKey(g.key)}
                  title="Klik untuk pilih · klik-ganda untuk ubah nama"
                >
                  {g.label}
                </button>
              )}
              <button
                type="button"
                className={cn('iconbtn', g.isPrimary ? 'text-primary' : 'text-muted-foreground')}
                title={g.isPrimary ? 'Tab utama (dibaca grid entry)' : 'Jadikan tab utama'}
                onClick={() => setPrimary(g.key)}
              >
                <Icon name={g.isPrimary ? 'check' : 'dot'} size={12} />
              </button>
              {active && (
                <span className="flex items-center gap-0.5">
                  <button type="button" className="iconbtn" title="Geser kiri" onClick={() => move(g.key, -1)} disabled={i === 0}>←</button>
                  <button type="button" className="iconbtn" title="Geser kanan" onClick={() => move(g.key, 1)} disabled={i === grids.length - 1}>→</button>
                  <button type="button" className="iconbtn danger" title="Hapus tab" onClick={() => remove(g.key)} disabled={grids.length <= 1}>
                    <Icon name="trash" size={12} />
                  </button>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" className="btn shrink-0" onClick={addTab}>
        <Icon name="plus" size={12} /> Tab
      </button>
    </div>
  );
}
