'use client';

import * as React from 'react';
import { ChkInput, ColorInput, NumInput, PropRow, SelectInput } from './controls';
import { LayoutFields } from './layout-fields';
import { ExpressionEditor } from './expression-editor';
import type { DesignerAction, PropTab, RptBand, RptTextComponent } from '@/lib/report-types';

interface Props {
  band: RptBand;
  comp: RptTextComponent;
  tab: PropTab;
  columns: string[];
  dispatch: React.Dispatch<DesignerAction>;
}

export function TextProperties({ band, comp, tab, columns, dispatch }: Props) {
  function p(patch: Partial<RptTextComponent>) {
    dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch });
  }
  function ps(patch: Partial<RptTextComponent['style']>) {
    p({ style: { ...comp.style, ...patch } });
  }

  if (tab === 'layout') {
    return (
      <div>
        <LayoutFields comp={comp} onPatch={p} />
        <div className="flex gap-3 mt-2">
          <ChkInput checked={comp.canGrow ?? false} onChange={v => p({ canGrow: v })} label="Can grow" />
          <ChkInput checked={comp.canShrink ?? false} onChange={v => p({ canShrink: v })} label="Can shrink" />
        </div>
      </div>
    );
  }

  if (tab === 'style') {
    return (
      <div>
        <PropRow label="Font size"><NumInput value={comp.style.fontSize ?? 9} onChange={v => ps({ fontSize: v })} min={6} /></PropRow>
        <PropRow label="Warna"><ColorInput value={comp.style.color ?? '#000000'} onChange={v => ps({ color: v })} /></PropRow>
        <PropRow label="Align">
          <SelectInput
            value={comp.style.align ?? 'left'}
            options={[{ value: 'left', label: 'Kiri' }, { value: 'center', label: 'Tengah' }, { value: 'right', label: 'Kanan' }]}
            onChange={v => ps({ align: v })}
          />
        </PropRow>
        <PropRow label="Background"><ColorInput value={comp.style.background ?? '#ffffff'} onChange={v => ps({ background: v })} /></PropRow>
        <PropRow label="">
          <div className="flex gap-3">
            <ChkInput checked={comp.style.bold ?? false} onChange={v => ps({ bold: v })} label="Bold" />
            <ChkInput checked={comp.style.italic ?? false} onChange={v => ps({ italic: v })} label="Italic" />
            <ChkInput checked={comp.style.wordWrap ?? false} onChange={v => ps({ wordWrap: v })} label="Wrap" />
          </div>
        </PropRow>
      </div>
    );
  }

  // data
  return (
    <div>
      <PropRow label="Nama">
        <input type="text" value={comp.name} onChange={e => p({ name: e.target.value })}
          className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)]" />
      </PropRow>
      <div className="text-[11px] text-[var(--fg-muted)] mt-1 mb-0.5">Expression</div>
      <ExpressionEditor value={comp.expression} onChange={v => p({ expression: v })} columns={columns} />
    </div>
  );
}
