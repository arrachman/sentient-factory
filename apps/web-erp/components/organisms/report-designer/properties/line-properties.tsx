'use client';

import * as React from 'react';
import { ColorInput, NumInput, PropRow, SelectInput, TxtInput } from './controls';
import { LayoutFields } from './layout-fields';
import type { DesignerAction, PropTab, RptBand, RptLineComponent } from '@/lib/report-types';

interface Props {
  band: RptBand;
  comp: RptLineComponent;
  tab: PropTab;
  dispatch: React.Dispatch<DesignerAction>;
}

export function LineProperties({ band, comp, tab, dispatch }: Props) {
  function p(patch: Partial<RptLineComponent>) {
    dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch });
  }
  function ps(patch: Partial<RptLineComponent['style']>) {
    p({ style: { ...comp.style, ...patch } });
  }

  if (tab === 'layout') return <LayoutFields comp={comp} onPatch={p} />;

  if (tab === 'style') {
    return (
      <div>
        <PropRow label="Warna"><ColorInput value={comp.style.color} onChange={v => ps({ color: v })} /></PropRow>
        <PropRow label="Tebal"><NumInput value={comp.style.width} onChange={v => ps({ width: v })} min={0.1} step={0.5} /></PropRow>
        <PropRow label="Gaya">
          <SelectInput
            value={comp.style.style}
            options={[{ value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }]}
            onChange={v => ps({ style: v })}
          />
        </PropRow>
      </div>
    );
  }

  // data
  return (
    <PropRow label="Nama"><TxtInput value={comp.name} onChange={v => p({ name: v })} /></PropRow>
  );
}
