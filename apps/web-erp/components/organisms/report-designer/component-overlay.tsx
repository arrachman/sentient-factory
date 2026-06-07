'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { MM_TO_PX } from '@/lib/report-component-factory';
import type { RptComponent } from '@/lib/report-types';

interface Props {
  comp: RptComponent;
  zoom: number;
  selected: boolean;
  /** Tampilkan handle resize (hanya saat seleksi tunggal). */
  resizable: boolean;
  onSelect: (additive: boolean) => void;
  onDragStart: () => void;
  /** Delta drag (mm) dari titik mulai — band-row terapkan ke grup/tunggal. */
  onDragDelta: (dx: number, dy: number) => void;
  onDragEnd: () => void;
  /** Resize komponen ini saja (transient saat berlangsung). */
  onResize: (patch: Partial<RptComponent>, transient: boolean) => void;
  onRemove: () => void;
}

type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const HANDLES: Array<{ h: Handle; cls: string; cursor: string }> = [
  { h: 'nw', cls: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
  { h: 'n', cls: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
  { h: 'ne', cls: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
  { h: 'e', cls: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
  { h: 'se', cls: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cursor: 'nwse-resize' },
  { h: 's', cls: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cursor: 'ns-resize' },
  { h: 'sw', cls: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cursor: 'nesw-resize' },
  { h: 'w', cls: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
];

const snap = (v: number) => Math.round(v * 2) / 2; // 0.5mm grid

export function ComponentOverlay({ comp, zoom, selected, resizable, onSelect, onDragStart, onDragDelta, onDragEnd, onResize, onRemove }: Props) {
  const scale = zoom * MM_TO_PX;
  const isLine = comp.type === 'line';

  function startDrag(e: React.MouseEvent) {
    e.stopPropagation();
    const additive = e.shiftKey || e.metaKey || e.ctrlKey;
    if (additive) { onSelect(true); return; }
    if (!selected) onSelect(false);
    onDragStart();
    const start = { mx: e.clientX, my: e.clientY };
    function move(ev: MouseEvent) {
      onDragDelta((ev.clientX - start.mx) / scale, (ev.clientY - start.my) / scale);
    }
    function up() { onDragEnd(); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  function startResize(e: React.MouseEvent, handle: Handle) {
    e.stopPropagation();
    e.preventDefault();
    if (!selected) onSelect(false);
    onDragStart();
    const start = { mx: e.clientX, my: e.clientY, x: comp.x, y: comp.y, w: comp.width, h: comp.height };
    const minW = 2, minH = isLine ? 0 : 4;
    function move(ev: MouseEvent) {
      const dx = (ev.clientX - start.mx) / scale;
      const dy = (ev.clientY - start.my) / scale;
      let { x, y, w, h } = start;
      if (handle.includes('e')) w = Math.max(minW, snap(start.w + dx));
      if (handle.includes('s')) h = Math.max(minH, snap(start.h + dy));
      if (handle.includes('w')) { const nx = Math.min(start.x + dx, start.x + start.w - minW); x = Math.max(0, snap(nx)); w = snap(start.w + (start.x - x)); }
      if (handle.includes('n')) { const ny = Math.min(start.y + dy, start.y + start.h - minH); y = Math.max(0, snap(ny)); h = snap(start.h + (start.y - y)); }
      onResize({ x, y, width: w, height: h }, true);
    }
    function up() { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: comp.x * scale,
    top: comp.y * scale,
    width: Math.max(2, comp.width) * scale,
    height: Math.max(isLine ? 2 : 4, comp.height) * scale,
    border: isLine ? undefined : (selected ? '2px solid var(--accent)' : '1px dashed var(--border)'),
    cursor: 'move',
    boxSizing: 'border-box',
    userSelect: 'none',
    zIndex: selected ? 10 : 1,
  };

  return (
    <div style={style} onMouseDown={startDrag} onClick={e => e.stopPropagation()} title={`${comp.type}: ${comp.name}`}>
      <OverlayContent comp={comp} zoom={zoom} />
      {selected && resizable && (
        <>
          {HANDLES.filter(({ h }) => !isLine || h === 'e' || h === 'w').map(({ h, cls, cursor }) => (
            <span
              key={h}
              onMouseDown={e => startResize(e, h)}
              className={`absolute ${cls} w-2 h-2 bg-[var(--bg-card)] border border-[var(--accent)] rounded-sm z-20`}
              style={{ cursor }}
            />
          ))}
        </>
      )}
      {selected && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ position: 'absolute', top: -8, right: -8, zIndex: 25, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="x" size={9} />
        </button>
      )}
    </div>
  );
}

function OverlayContent({ comp, zoom }: { comp: RptComponent; zoom: number }) {
  if (comp.type === 'text') {
    return (
      <div className="w-full h-full overflow-hidden px-0.5 flex items-center" style={{
        fontSize: (comp.style.fontSize ?? 9) * zoom * 0.8,
        fontWeight: comp.style.bold ? 'bold' : 'normal',
        fontStyle: comp.style.italic ? 'italic' : 'normal',
        color: comp.style.color ?? '#000',
        justifyContent: comp.style.align === 'right' ? 'flex-end' : comp.style.align === 'center' ? 'center' : 'flex-start',
      }}>
        <span className="truncate opacity-80">{comp.expression}</span>
      </div>
    );
  }
  if (comp.type === 'line') {
    return (
      <div style={{
        width: '100%', height: Math.max(1, comp.style.width), background: comp.style.color,
        borderStyle: comp.style.style, position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      }} />
    );
  }
  return <div className="w-full h-full flex items-center justify-center text-[8px] text-[var(--fg-muted)] border-2 border-dashed border-[var(--border)]">IMG</div>;
}
