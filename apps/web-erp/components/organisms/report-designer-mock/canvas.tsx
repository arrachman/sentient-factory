'use client';

import * as React from 'react';
import type { RdBand, RdComp } from '@/lib/report-designer-mock';
import type { RdSelection } from './left-panel';
import { useRdDrag, type RdDragStart } from './use-rd-drag';

const PAPER_W = 760;

/** Render an expression with `{tag}` chips inline. */
function renderExprChips(expr: string | undefined): React.ReactNode {
  if (!expr) return <span className="rd-placeholder">empty</span>;
  const parts = String(expr).split(/(\{[^}]+\})/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\{.*\}$/.test(p) ? <span key={i} className="rd-tag">{p}</span> : <span key={i}>{p}</span>,
  );
}

/** Per-component drag context handed down from the band. */
interface CompDrag {
  bandId: string;
  bandH: number;
  z: number;
  areaRef: React.RefObject<HTMLDivElement | null>;
  start: (s: RdDragStart) => void;
  select: () => void;
}

/** Build the onPointerDown handler that starts a move/resize gesture. */
function dragHandler(
  drag: CompDrag, c: RdComp, mode: 'move' | 'resize-w', horizontal: boolean,
) {
  return (e: React.PointerEvent) => {
    drag.select();
    drag.start({
      e, mode, bandId: drag.bandId, compId: c.id,
      x: c.x ?? 0, y: c.y ?? 0, w: c.w ?? 30,
      areaEl: drag.areaRef.current, bandH: drag.bandH, z: drag.z, horizontal,
    });
  };
}

function CompNode({ c, z, active, onSelect, drag }: {
  c: RdComp; z: number; active: boolean; onSelect: (e: React.MouseEvent) => void; drag: CompDrag;
}) {
  const base: React.CSSProperties = { top: (c.y || 0) * z };

  if (c.kind === 'columns') {
    return (
      <div className={`rd-colhead rd-draggable${active ? ' sel' : ''}`} onClick={onSelect}
        onPointerDown={dragHandler(drag, c, 'move', false)} style={{ ...base, left: 0, right: 0 }}>
        {(c.cols || []).map((col, i) => (
          <div key={i} style={{ width: `${col.w}%`, textAlign: col.align }}>{col.label}</div>
        ))}
      </div>
    );
  }
  if (c.kind === 'datarow') {
    return (
      <div className={`rd-datarow rd-draggable${active ? ' sel' : ''}`} onClick={onSelect}
        onPointerDown={dragHandler(drag, c, 'move', false)} style={{ ...base, left: 0, right: 0 }}>
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
      <div className={`rd-line rd-draggable${active ? ' sel' : ''}`} onClick={onSelect}
        onPointerDown={dragHandler(drag, c, 'move', true)}
        style={{ ...base, left: `${c.x || 0}%`, width: `${c.w || 40}%` }}>
        {active && <span className="rd-resize-handle" onPointerDown={dragHandler(drag, c, 'resize-w', true)} />}
      </div>
    );
  }
  if (c.kind === 'totalrow') {
    return (
      <div className={`rd-totalrow rd-draggable${active ? ' sel' : ''}${c.strong ? ' strong' : ''}`} onClick={onSelect}
        onPointerDown={dragHandler(drag, c, 'move', false)}
        style={{ ...base, right: 0, width: '46%', color: c.muted ? 'var(--fg-muted)' : undefined }}>
        <span className="rd-tot-label">{c.label}</span>
        <span className="rd-tag">{c.expr}</span>
      </div>
    );
  }
  // text / field
  return (
    <div onClick={onSelect} onPointerDown={dragHandler(drag, c, 'move', true)}
      className={`rd-text rd-draggable${active ? ' sel' : ''}`}
      style={{
        ...base, left: `${c.x || 0}%`, width: `${c.w || 30}%`,
        fontSize: (c.size || 11) * z, fontWeight: c.bold ? 700 : 400,
        textAlign: c.align || 'left', color: c.muted ? 'var(--fg-muted)' : 'var(--fg)',
      }}>
      {renderExprChips(c.expr)}
      {active && <span className="rd-resize-handle" onPointerDown={dragHandler(drag, c, 'resize-w', true)} />}
    </div>
  );
}

function DesignBand({ band, z, sel, setSel, startDrag }: {
  band: RdBand; z: number; sel: RdSelection; setSel: (s: RdSelection) => void;
  startDrag: (s: RdDragStart) => void;
}) {
  const areaRef = React.useRef<HTMLDivElement>(null);
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
      <div ref={areaRef} className="rd-band-area" style={{ height: band.h * z }}
        onClick={e => { e.stopPropagation(); setSel({ band: band.id, comp: null }); }}>
        {band.comps.map(c => (
          <CompNode key={c.id} c={c} z={z} active={sel.comp === c.id}
            onSelect={e => { e.stopPropagation(); setSel({ band: band.id, comp: c.id }); }}
            drag={{
              bandId: band.id, bandH: band.h, z, areaRef, start: startDrag,
              select: () => setSel({ band: band.id, comp: c.id }),
            }} />
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
  moveComp: (bandId: string, compId: string, patch: Partial<RdComp>) => void;
}

export function RdCanvas({ bands, zoom, sel, setSel, onClear, moveComp }: Props) {
  const z = zoom / 100;
  const w = (PAPER_W * zoom) / 100;
  const startDrag = useRdDrag(moveComp);
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
          {bands.map(b => (
            <DesignBand key={b.id} band={b} z={z} sel={sel} setSel={setSel} startDrag={startDrag} />
          ))}
        </div>
      </div>
    </div>
  );
}
