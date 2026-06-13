'use client';

import * as React from 'react';
import { RD_DATA, rdResolve, type RdBand, type RdComp, type RdCtx } from '@/lib/report-designer-mock';

const PAPER_W = 760;

function renderBandComps(band: RdBand, z: number, ctx: RdCtx): React.ReactNode {
  return band.comps.map((c: RdComp) => {
    if (c.kind === 'columns') {
      return (
        <div key={c.id} className="rdv-colhead" style={{ position: 'absolute', left: 0, right: 0, top: (c.y || 0) * z }}>
          {(c.cols || []).map((col, i) => (
            <div key={i} style={{ width: `${col.w}%`, textAlign: col.align }}>{col.label}</div>
          ))}
        </div>
      );
    }
    if (c.kind === 'totalrow') {
      return (
        <div key={c.id} className={`rdv-totalrow${c.strong ? ' strong' : ''}${c.muted ? ' muted' : ''}`}
          style={{ position: 'absolute', right: 0, top: (c.y || 0) * z }}>
          <span>{c.label}</span>
          <span className="num">{rdResolve(c.expr, ctx)}</span>
        </div>
      );
    }
    if (c.kind === 'text') {
      return (
        <div key={c.id} style={{
          position: 'absolute', left: `${c.x || 0}%`, top: (c.y || 0) * z, width: `${c.w || 30}%`,
          fontSize: (c.size || 11) * z, fontWeight: c.bold ? 700 : 400, textAlign: c.align,
          color: c.muted ? 'var(--fg-muted)' : 'inherit',
        }}>
          {rdResolve(c.expr, ctx)}
        </div>
      );
    }
    return null;
  });
}

export function RdPreview({ bands, zoom }: { bands: RdBand[]; zoom: number }) {
  const z = zoom / 100;
  const w = (PAPER_W * zoom) / 100;
  return (
    <div className="rd-canvas-wrap">
      <div className="rd-paper-scroll">
        <div className="rd-paper" style={{ width: w, padding: 24 }}>
          <div className="rdv">
            {bands.map(b => {
              const cols = b.comps[0]?.cols;
              // Only the datarow-style data band repeats over sample rows; report-engine
              // data bands hold individual field comps and render like a normal band.
              if (b.type === 'Data' && cols && cols.length) {
                return (
                  <div key={b.id} className="rdv-databand">
                    {RD_DATA.items.map((item, idx) => (
                      <div key={b.id + idx} className="rdv-datarow">
                        {cols.map((col, i) => (
                          <div key={i} style={{
                            width: `${col.w}%`, textAlign: col.align,
                            fontFamily: col.mono ? 'var(--font-mono)' : undefined,
                          }}>
                            {rdResolve(col.expr, { item })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div key={b.id} className="rdv-band" style={{ height: b.h * z, position: 'relative' }}>
                  {renderBandComps(b, z, {})}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
