'use client';

import * as React from 'react';
import { PropRow, SelectInput } from './controls';
import { LayoutFields } from './layout-fields';
import { ExpressionEditor } from './expression-editor';
import type { DesignerAction, PropTab, RptBand, RptImageComponent } from '@/lib/report-types';

interface Props {
  band: RptBand;
  comp: RptImageComponent;
  tab: PropTab;
  columns: string[];
  dispatch: React.Dispatch<DesignerAction>;
}

export function ImageProperties({ band, comp, tab, columns, dispatch }: Props) {
  function p(patch: Partial<RptImageComponent>) {
    dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch });
  }

  if (tab === 'layout') return <LayoutFields comp={comp} onPatch={p} />;

  if (tab === 'style') {
    return (
      <PropRow label="Fit">
        <SelectInput
          value={comp.fit ?? 'contain'}
          options={[{ value: 'contain', label: 'Contain' }, { value: 'cover', label: 'Cover' }, { value: 'fill', label: 'Fill' }]}
          onChange={v => p({ fit: v })}
        />
      </PropRow>
    );
  }

  // data
  return (
    <div>
      <PropRow label="Nama">
        <input type="text" value={comp.name} onChange={e => p({ name: e.target.value })}
          className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)]" />
      </PropRow>
      <div className="text-[11px] text-[var(--fg-muted)] mt-1 mb-0.5">Sumber (URL / expression)</div>
      <ExpressionEditor value={comp.src} onChange={v => p({ src: v })} columns={columns} rows={1} />
      <p className="text-[10px] text-[var(--fg-muted)] mt-1">Mis. <code>{'{company.logoUrl}'}</code> atau URL gambar langsung.</p>
    </div>
  );
}
