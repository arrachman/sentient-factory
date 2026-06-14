'use client';

import * as React from 'react';
import { ChkInput, NumInput, PropRow, SelectInput, TxtInput } from './controls';
import type { DesignerAction, RptBand } from '@/lib/report-types';

export function BandProperties({ band, dispatch }: { band: RptBand; dispatch: React.Dispatch<DesignerAction> }) {
  function p(patch: Partial<RptBand>) {
    dispatch({ type: 'UPDATE_BAND', bandId: band.id, patch });
  }
  const isGroup = band.type === 'groupHeader' || band.type === 'groupFooter';
  return (
    <div>
      <PropRow label="Tipe">{band.type}</PropRow>
      <PropRow label="Tinggi (mm)"><NumInput value={band.height} onChange={v => p({ height: v })} min={1} /></PropRow>

      {isGroup && (
        <PropRow label="Level">
          <SelectInput
            value={band.level ?? 1}
            options={[{ value: 1, label: '1 (Inner)' }, { value: 2, label: '2 (Outer)' }]}
            onChange={v => p({ level: v as 1 | 2 })}
          />
        </PropRow>
      )}
      {band.type === 'groupHeader' && (
        <PropRow label="Group By"><TxtInput value={band.groupBy ?? ''} onChange={v => p({ groupBy: v })} mono /></PropRow>
      )}
      {band.type === 'groupHeader' && (
        <PropRow label="">
          <ChkInput checked={band.printOnAllPages ?? false} onChange={v => p({ printOnAllPages: v })} label="Print on all pages" />
        </PropRow>
      )}
      {isGroup && (
        <PropRow label="">
          <ChkInput checked={band.newPageBefore ?? false} onChange={v => p({ newPageBefore: v })} label="New page before" />
        </PropRow>
      )}
      {band.type === 'data' && (
        <>
          <PropRow label="">
            <ChkInput checked={band.canGrow ?? false} onChange={v => p({ canGrow: v })} label="Can grow" />
          </PropRow>
          <PropRow label="Min rows"><NumInput value={band.minRows ?? 0} onChange={v => p({ minRows: v })} min={0} /></PropRow>
        </>
      )}
    </div>
  );
}
