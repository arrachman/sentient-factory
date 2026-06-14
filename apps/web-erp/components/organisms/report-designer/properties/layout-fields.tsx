'use client';

import * as React from 'react';
import { NumInput, PropRow } from './controls';
import type { RptComponent } from '@/lib/report-types';

type GeometryPatch = { x?: number; y?: number; width?: number; height?: number };

/** Editor posisi/ukuran (mm) — dipakai semua tipe komponen di tab Layout. */
export function LayoutFields({ comp, onPatch }: {
  comp: RptComponent;
  onPatch: (patch: GeometryPatch) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-2">
      <PropRow label="X (mm)"><NumInput value={comp.x} onChange={v => onPatch({ x: v })} min={0} step={0.5} /></PropRow>
      <PropRow label="Y (mm)"><NumInput value={comp.y} onChange={v => onPatch({ y: v })} min={0} step={0.5} /></PropRow>
      <PropRow label="Lebar"><NumInput value={comp.width} onChange={v => onPatch({ width: v })} min={0} step={0.5} /></PropRow>
      <PropRow label="Tinggi"><NumInput value={comp.height} onChange={v => onPatch({ height: v })} min={0} step={0.5} /></PropRow>
    </div>
  );
}
