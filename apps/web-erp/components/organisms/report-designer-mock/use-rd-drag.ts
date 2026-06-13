'use client';

import * as React from 'react';

/** Position patch applied to a component while dragging on the canvas. */
export interface RdDragPatch { x?: number; y?: number; w?: number }

export type RdDragMode = 'move' | 'resize-w';

export interface RdDragStart {
  e: React.PointerEvent;
  mode: RdDragMode;
  bandId: string;
  compId: string;
  /** Current geometry (x/w in %, y in unzoomed px). */
  x: number;
  y: number;
  w: number;
  /** The band-area element — used to convert screen px → band-relative %. */
  areaEl: HTMLElement | null;
  /** Band height in unzoomed px (clamps vertical movement). */
  bandH: number;
  /** Live zoom factor (zoom/100). */
  z: number;
  /** When false the component is full-width / right-anchored → vertical drag only. */
  horizontal: boolean;
}

const MIN_W = 4; // %
const MIN_H_MARGIN = 4; // px kept inside the band when dragging down

const clamp = (n: number, lo: number, hi: number): number => Math.min(Math.max(n, lo), hi);

/**
 * Pointer-drag controller for canvas components. Returns a `start` callback to
 * wire onto `onPointerDown`; it tracks the gesture on `window` so the drag keeps
 * working even when the cursor leaves the small component box, and clamps the
 * result to the band so components can never escape their band content area.
 */
export function useRdDrag(
  onMove: (bandId: string, compId: string, patch: RdDragPatch) => void,
): (s: RdDragStart) => void {
  const ref = React.useRef<(RdDragStart & { originX: number; originY: number; areaW: number }) | null>(null);

  React.useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      const d = ref.current;
      if (!d) return;
      const dx = ev.clientX - d.originX;
      const dy = ev.clientY - d.originY;
      const dxPct = d.areaW > 0 ? (dx / d.areaW) * 100 : 0;

      if (d.mode === 'resize-w') {
        onMove(d.bandId, d.compId, { w: clamp(d.w + dxPct, MIN_W, 100 - d.x) });
        return;
      }
      const patch: RdDragPatch = { y: clamp(d.y + dy / d.z, 0, Math.max(0, d.bandH - MIN_H_MARGIN)) };
      if (d.horizontal) patch.x = clamp(d.x + dxPct, 0, Math.max(0, 100 - d.w));
      onMove(d.bandId, d.compId, patch);
    };
    const onPointerUp = () => {
      if (!ref.current) return;
      ref.current = null;
      document.body.classList.remove('rd-dragging');
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onMove]);

  return React.useCallback((s: RdDragStart) => {
    s.e.preventDefault();
    s.e.stopPropagation();
    ref.current = {
      ...s,
      originX: s.e.clientX,
      originY: s.e.clientY,
      areaW: s.areaEl?.getBoundingClientRect().width ?? 0,
    };
    document.body.classList.add('rd-dragging');
  }, []);
}
