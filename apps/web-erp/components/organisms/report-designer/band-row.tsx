'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { ComponentOverlay } from './component-overlay';
import {
  FIELD_DND_MIME,
  GUTTER_W,
  MM_TO_PX,
  makeBoundText,
  type FieldDragPayload,
} from '@/lib/report-component-factory';
import { computeSnap } from '@/lib/report-snap';
import type { BandType, DesignerAction, DesignerSelection, RptBand } from '@/lib/report-types';

const BAND_LABELS: Record<BandType, string> = {
  pageHeader: 'Page Header',
  pageFooter: 'Page Footer',
  groupHeader: 'Group Header',
  groupFooter: 'Group Footer',
  data: 'Data Band',
};

function bandLabel(band: RptBand): string {
  const lvl = (band.type === 'groupHeader' || band.type === 'groupFooter') ? ` ${band.level ?? 1}` : '';
  return `${BAND_LABELS[band.type]}${lvl} · ${band.height}mm${band.groupBy ? ` · ${band.groupBy}` : ''}`;
}

interface Props {
  band: RptBand;
  index: number;
  totalBands: number;
  selection: DesignerSelection;
  zoom: number;
  dispatch: React.Dispatch<DesignerAction>;
  pageWidthMm: number;
}

const snap = (v: number) => Math.round(v * 2) / 2;

export function BandRow({ band, index, totalBands, selection, zoom, dispatch, pageWidthMm }: Props) {
  const scale = zoom * MM_TO_PX;
  const isBandSelected = selection.type === 'band' && selection.bandId === band.id;
  const bandHeightPx = band.height * scale;
  const bandWidthPx = pageWidthMm * scale;
  const [dropActive, setDropActive] = React.useState(false);

  const selectedIds = React.useMemo(() => {
    if (selection.type !== 'component' || selection.bandId !== band.id) return new Set<string>();
    return new Set(selection.componentIds ?? (selection.componentId ? [selection.componentId] : []));
  }, [selection, band.id]);

  // Posisi awal komponen yang sedang di-drag (untuk group move tanpa drift).
  const dragRef = React.useRef<Map<string, { x: number; y: number }> | null>(null);
  const [guides, setGuides] = React.useState<{ vx?: number; hy?: number }>({});

  function beginDrag(compId: string) {
    dispatch({ type: 'PUSH_HISTORY' });
    const ids = selectedIds.has(compId) && selectedIds.size > 1 ? [...selectedIds] : [compId];
    const m = new Map<string, { x: number; y: number }>();
    for (const id of ids) {
      const c = band.components.find(x => x.id === id);
      if (c) m.set(id, { x: c.x, y: c.y });
    }
    dragRef.current = m;
  }

  function dragDelta(dx: number, dy: number) {
    const m = dragRef.current;
    if (!m) return;
    // Drag tunggal → snap ke tepi komponen lain + batas band, tampilkan garis bantu.
    if (m.size === 1) {
      const [id, p] = [...m.entries()][0];
      const comp = band.components.find(c => c.id === id);
      if (!comp) return;
      const raw = { x: Math.max(0, snap(p.x + dx)), y: Math.max(0, snap(p.y + dy)), width: comp.width, height: comp.height };
      const others = band.components.filter(c => c.id !== id);
      const sn = computeSnap(raw, others, { w: pageWidthMm, h: band.height });
      setGuides({ vx: sn.guideVX, hy: sn.guideHY });
      dispatch({ type: 'PATCH_COMPONENTS', bandId: band.id, patches: [{ id, patch: { x: sn.x, y: sn.y } }], transient: true });
      return;
    }
    // Grup → geser bebas tanpa snap.
    const patches = [...m.entries()].map(([id, p]) => ({
      id, patch: { x: Math.max(0, snap(p.x + dx)), y: Math.max(0, snap(p.y + dy)) },
    }));
    dispatch({ type: 'PATCH_COMPONENTS', bandId: band.id, patches, transient: true });
  }

  function endDrag() {
    setGuides({});
    dragRef.current = null;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDropActive(false);
    const raw = e.dataTransfer.getData(FIELD_DND_MIME);
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as FieldDragPayload;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.round((e.clientX - rect.left) / scale * 2) / 2);
      const y = Math.max(0, Math.round((e.clientY - rect.top) / scale * 2) / 2);
      const comp = makeBoundText(band, payload.column, x, y);
      dispatch({ type: 'ADD_COMPONENT', bandId: band.id, component: comp });
      dispatch({ type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id });
    } catch { /* payload tak valid → abaikan */ }
  }

  return (
    <div className="flex items-stretch select-none">
      {/* Gutter: identitas band + reorder/hapus (tambah komponen pindah ke toolbar atas) */}
      <div
        className={`flex flex-col justify-between shrink-0 px-2.5 py-1.5 cursor-pointer border-r border-[var(--border)] ${isBandSelected ? 'bg-[var(--bg-selected)]' : 'bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)]'}`}
        style={{ width: GUTTER_W, minHeight: bandHeightPx }}
        onClick={e => { e.stopPropagation(); dispatch({ type: 'SELECT_BAND', bandId: band.id }); }}
      >
        <span className="text-[11px] font-semibold text-[var(--fg-muted)] uppercase tracking-wide leading-tight">
          {bandLabel(band)}
        </span>
        <div className="flex gap-1.5 mt-1.5">
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'MOVE_BAND', bandId: band.id, direction: 'up' }); }}
            disabled={index === 0} className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer" title="Naik">
            <Icon name="chevup" size={13} />
          </button>
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'MOVE_BAND', bandId: band.id, direction: 'down' }); }}
            disabled={index === totalBands - 1} className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer" title="Turun">
            <Icon name="chevdown" size={13} />
          </button>
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_BAND', bandId: band.id }); }}
            className="opacity-60 hover:text-red-500 hover:opacity-100 cursor-pointer ml-auto" title="Hapus band">
            <Icon name="trash" size={13} />
          </button>
        </div>
      </div>

      {/* Canvas area (drop target field) */}
      <div
        className={`relative border-b border-[var(--border)] ${dropActive ? 'bg-[var(--accent)]/10 ring-1 ring-inset ring-[var(--accent)]' : isBandSelected ? 'bg-blue-50/30' : 'bg-white'}`}
        style={{ width: bandWidthPx, height: bandHeightPx, overflow: 'hidden' }}
        onClick={e => { e.stopPropagation(); dispatch({ type: 'SELECT_BAND', bandId: band.id }); }}
        onDragOver={e => { if (e.dataTransfer.types.includes(FIELD_DND_MIME)) { e.preventDefault(); setDropActive(true); } }}
        onDragLeave={() => setDropActive(false)}
        onDrop={handleDrop}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 pointer-events-none" width={bandWidthPx} height={bandHeightPx} style={{ opacity: 0.15 }}>
          {Array.from({ length: Math.floor(pageWidthMm / 5) }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 5 * scale} y1={0} x2={(i + 1) * 5 * scale} y2={bandHeightPx} stroke="#888" strokeWidth={0.5} />
          ))}
          {Array.from({ length: Math.floor(band.height / 5) }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={(i + 1) * 5 * scale} x2={bandWidthPx} y2={(i + 1) * 5 * scale} stroke="#888" strokeWidth={0.5} />
          ))}
        </svg>

        {band.components.map(comp => (
          <ComponentOverlay
            key={comp.id}
            comp={comp}
            zoom={zoom}
            selected={selectedIds.has(comp.id)}
            resizable={selectedIds.has(comp.id) && selectedIds.size <= 1}
            onSelect={additive => dispatch(additive
              ? { type: 'TOGGLE_COMPONENT', bandId: band.id, componentId: comp.id }
              : { type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id })}
            onDragStart={() => beginDrag(comp.id)}
            onDragDelta={dragDelta}
            onDragEnd={endDrag}
            onResize={(patch, transient) => dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch, transient })}
            onRemove={() => dispatch({ type: 'REMOVE_COMPONENT', bandId: band.id, componentId: comp.id })}
          />
        ))}

        {/* Garis bantu snap */}
        {guides.vx != null && (
          <div className="absolute top-0 bottom-0 pointer-events-none z-30" style={{ left: guides.vx * scale, width: 1, background: 'var(--accent)' }} />
        )}
        {guides.hy != null && (
          <div className="absolute left-0 right-0 pointer-events-none z-30" style={{ top: guides.hy * scale, height: 1, background: 'var(--accent)' }} />
        )}

        {band.components.length === 0 && !dropActive && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[var(--fg-muted)] italic pointer-events-none">
            seret field ke sini, atau pakai toolbar komponen di atas
          </div>
        )}
      </div>
    </div>
  );
}
