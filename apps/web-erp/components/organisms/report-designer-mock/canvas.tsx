'use client';

import * as React from 'react';
import type { RdBand, RdComp } from '@/lib/report-designer-mock';
import type { RdSelection } from './left-panel';

const PAPER_W = 760;

/** Render an expression with `{tag}` chips inline. */
function renderExprChips(expr: string | undefined): React.ReactNode {
  if (!expr) return <span className="rd-placeholder">empty</span>;
  const parts = String(expr).split(/(\{[^}]+\})/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\{.*\}$/.test(p) ? <span key={i} className="rd-tag">{p}</span> : <span key={i}>{p}</span>,
  );
}

function CompNode({ c, z, active, onSelect }: {
  c: RdComp; z: number; active: boolean; onSelect: (e: React.MouseEvent) => void;
}) {
  const base: React.CSSProperties = { top: (c.y || 0) * z };

  if (c.kind === 'columns') {
    return (
      <div className={`rd-colhead${active ? ' sel' : ''}`} onClick={onSelect}
        style={{ ...base, left: 0, right: 0 }}>
        {(c.cols || []).map((col, i) => (
          <div key={i} style={{ width: `${col.w}%`, textAlign: col.align }}>{col.label}</div>
        ))}
      </div>
    );
  }
  if (c.kind === 'datarow') {
    return (
      <div className={`rd-datarow${active ? ' sel' : ''}`} onClick={onSelect} style={{ ...base, left: 0, right: 0 }}>
        {(c.cols || []).map((col, i) => (
          <div key={i} className="rd-tagcell"
            style={{ width: `${col.w}%`, textAlign: col.align, fontFamily: col.mono ? 'var(--font-mono)' : undefined }}>
            {col.expr}
          </div>
        ))}
      </div>
    );
  }
  if (c.kind === 'line') {
    return (
      <div className={`rd-line${active ? ' sel' : ''}`} onClick={onSelect}
        style={{ ...base, left: `${c.x || 0}%`, width: `${c.w || 40}%` }} />
    );
  }
  if (c.kind === 'totalrow') {
    return (
      <div className={`rd-totalrow${active ? ' sel' : ''}${c.strong ? ' strong' : ''}`} onClick={onSelect}
        style={{ ...base, right: 0, width: '46%', color: c.muted ? 'var(--fg-muted)' : undefined }}>
        <span className="rd-tot-label">{c.label}</span>
        <span className="rd-tag">{c.expr}</span>
      </div>
    );
  }
  // text / field
  return (
    <div onClick={onSelect}
      className={`rd-text${active ? ' sel' : ''}`}
      style={{
        ...base, left: `${c.x || 0}%`, width: `${c.w || 30}%`,
        fontSize: (c.size || 11) * z, fontWeight: c.bold ? 700 : 400,
        textAlign: c.align || 'left', color: c.muted ? 'var(--fg-muted)' : 'var(--fg)',
      }}>
      {renderExprChips(c.expr)}
    </div>
  );
}

function DesignBand({ band, z, sel, setSel }: {
  band: RdBand; z: number; sel: RdSelection; setSel: (s: RdSelection) => void;
}) {
  const tint = `color-mix(in oklab, ${band.color} 12%, transparent)`;
  const borderTint = `color-mix(in oklab, ${band.color} 30%, transparent)`;
  return (
    <div className="rd-band" style={{ borderLeftColor: band.color }}>
      <div className="rd-band-header" style={{ background: tint, borderTopColor: borderTint }}
        onClick={e => { e.stopPropagation(); setSel({ band: band.id, comp: null }); }}>
        <span className="rd-banddot" style={{ background: band.color }} />
        <span className="rd-band-name" style={{ color: band.color }}>{band.type}</span>
        {band.repeat && <span className="rd-band-repeat">{band.repeat}[i]</span>}
        <span className="rd-band-h">{band.h}px</span>
      </div>
      <div className="rd-band-area" style={{ height: band.h * z }}
        onClick={e => { e.stopPropagation(); setSel({ band: band.id, comp: null }); }}>
        {band.comps.map(c => (
          <CompNode key={c.id} c={c} z={z} active={sel.comp === c.id}
            onSelect={e => { e.stopPropagation(); setSel({ band: band.id, comp: c.id }); }} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  bands: RdBand[];
  zoom: number;
  sel: RdSelection;
  setSel: (s: RdSelection) => void;
  onClear: () => void;
}

export function RdCanvas({ bands, zoom, sel, setSel, onClear }: Props) {
  const z = zoom / 100;
  const w = (PAPER_W * zoom) / 100;
  return (
    <div className="rd-canvas-wrap" onClick={onClear}>
      <div className="rd-ruler">
        <div className="rd-ruler-marks" style={{ width: w }}>
          {Array.from({ length: 21 }).map((_, i) => (
            <span key={i} style={{ left: (i * 38 * zoom) / 100 }}>{i}</span>
          ))}
        </div>
      </div>
      <div className="rd-paper-scroll">
        <div className="rd-paper" style={{ width: w }}>
          {bands.map(b => <DesignBand key={b.id} band={b} z={z} sel={sel} setSel={setSel} />)}
        </div>
      </div>
    </div>
  );
}
