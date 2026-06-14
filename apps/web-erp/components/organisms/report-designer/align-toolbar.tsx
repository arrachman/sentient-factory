'use client';

import * as React from 'react';
import { alignPatches, type AlignOp } from '@/lib/report-align';
import type { DesignerAction, RptComponent } from '@/lib/report-types';

interface Props {
  comps: RptComponent[];
  bandId: string;
  dispatch: React.Dispatch<DesignerAction>;
}

const GROUPS: Array<Array<{ op: AlignOp; label: string; title: string }>> = [
  [
    { op: 'left', label: 'L', title: 'Ratakan kiri' },
    { op: 'hcenter', label: 'C', title: 'Ratakan tengah (horizontal)' },
    { op: 'right', label: 'R', title: 'Ratakan kanan' },
  ],
  [
    { op: 'top', label: 'T', title: 'Ratakan atas' },
    { op: 'vmiddle', label: 'M', title: 'Ratakan tengah (vertikal)' },
    { op: 'bottom', label: 'B', title: 'Ratakan bawah' },
  ],
  [
    { op: 'dist-h', label: '↔', title: 'Sebar horizontal' },
    { op: 'dist-v', label: '↕', title: 'Sebar vertikal' },
  ],
  [
    { op: 'eq-w', label: '=W', title: 'Samakan lebar' },
    { op: 'eq-h', label: '=H', title: 'Samakan tinggi' },
  ],
];

export function AlignToolbar({ comps, bandId, dispatch }: Props) {
  function run(op: AlignOp) {
    const patches = alignPatches(comps, op);
    if (patches.length) dispatch({ type: 'PATCH_COMPONENTS', bandId, patches });
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[var(--fg-muted)]">{comps.length} dipilih</span>
      {GROUPS.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5 border border-[var(--border)] rounded overflow-hidden">
          {group.map(b => (
            <button
              key={b.op}
              onClick={() => run(b.op)}
              title={b.title}
              className="text-[11px] font-mono px-1.5 py-1 hover:bg-[var(--bg-hover)] cursor-pointer min-w-[24px]"
            >
              {b.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
