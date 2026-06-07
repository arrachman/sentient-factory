'use client';

import * as React from 'react';
import { Icon, type IconName } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import { makeImage, makeLine, makeText, resolveTargetBand } from '@/lib/report-component-factory';
import type { DesignerAction, DesignerSelection, RptBand, RptComponent } from '@/lib/report-types';

interface Props {
  bands: RptBand[];
  selection: DesignerSelection;
  dispatch: React.Dispatch<DesignerAction>;
}

const TOOLS: Array<{ key: 'text' | 'line' | 'image'; label: string; icon: IconName }> = [
  { key: 'text', label: 'Text', icon: 'file' },
  { key: 'line', label: 'Garis', icon: 'swap' },
  { key: 'image', label: 'Gambar', icon: 'box' },
];

export function ComponentToolbar({ bands, selection, dispatch }: Props) {
  function add(kind: 'text' | 'line' | 'image') {
    const band = resolveTargetBand(bands, selection.bandId);
    if (!band) { notify('Tambah band dulu sebelum menaruh komponen', 'warn'); return; }
    const comp: RptComponent =
      kind === 'text' ? makeText(band) : kind === 'line' ? makeLine(band) : makeImage(band);
    dispatch({ type: 'ADD_COMPONENT', bandId: band.id, component: comp });
    dispatch({ type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id });
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wide mr-1">Komponen</span>
      {TOOLS.map(t => (
        <button
          key={t.key}
          onClick={() => add(t.key)}
          disabled={!bands.length}
          title={`Tambah ${t.label}`}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-[var(--border)] hover:bg-[var(--bg-hover)] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Icon name={t.icon} size={12} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
