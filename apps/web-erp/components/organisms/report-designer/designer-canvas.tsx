'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { notify } from '@/lib/feedback';
import type {
  DesignerAction,
  DesignerSelection,
  RptBand,
  RptComponent,
  RptDataSource,
  BandType,
} from '@/lib/report-types';

// 1mm = 3.7795275591px at 96dpi; we use a scale knob on top.
const MM_TO_PX = 3.78;

interface Props {
  bands: RptBand[];
  dataSources: RptDataSource[];
  selection: DesignerSelection;
  zoom: number;
  dispatch: React.Dispatch<DesignerAction>;
}

function bandLabel(band: RptBand): string {
  const labels: Record<BandType, string> = {
    pageHeader: 'Page Header',
    pageFooter: 'Page Footer',
    groupHeader: `Group Header ${band.level ?? 1}`,
    groupFooter: `Group Footer ${band.level ?? 1}`,
    data: 'Data Band',
  };
  return `${labels[band.type]} · ${band.height}mm${band.groupBy ? ` · group: ${band.groupBy}` : ''}`;
}

function genId() {
  return `cmp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

function makeText(band: RptBand): RptComponent {
  return {
    id: genId(), type: 'text', name: `Text${band.components.length + 1}`,
    x: 0, y: 0, width: 40, height: band.height,
    expression: '{data.field}',
    style: { fontSize: 9, fontFamily: 'Arial', color: '#000000', align: 'left' },
    canGrow: false, canShrink: false,
  };
}

function makeLine(band: RptBand): RptComponent {
  return {
    id: genId(), type: 'line', name: `Line${band.components.length + 1}`,
    x: 0, y: band.height - 0.5, width: 185, height: 0,
    style: { color: '#000000', width: 0.5, style: 'solid' },
  };
}

function makeImage(band: RptBand): RptComponent {
  return {
    id: genId(), type: 'image', name: `Image${band.components.length + 1}`,
    x: 0, y: 0, width: 30, height: 15,
    src: '{company.logoUrl}', fit: 'contain',
  };
}

// ── Draggable component overlay ──────────────────────────────────────────────
interface ComponentOverlayProps {
  comp: RptComponent;
  bandId: string;
  zoom: number;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<RptComponent>) => void;
  onRemove: () => void;
}

function ComponentOverlay({ comp, bandId, zoom, selected, onSelect, onUpdate, onRemove }: ComponentOverlayProps) {
  const scale = zoom * MM_TO_PX;
  const dragStart = React.useRef<{ mouseX: number; mouseY: number; cx: number; cy: number } | null>(null);

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect();
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, cx: comp.x, cy: comp.y };
    function onMove(ev: MouseEvent) {
      if (!dragStart.current) return;
      const dx = (ev.clientX - dragStart.current.mouseX) / scale;
      const dy = (ev.clientY - dragStart.current.mouseY) / scale;
      onUpdate({ x: Math.max(0, Math.round((dragStart.current.cx + dx) * 2) / 2), y: Math.max(0, Math.round((dragStart.current.cy + dy) * 2) / 2) });
    }
    function onUp() { dragStart.current = null; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  const isLine = comp.type === 'line';
  const borderStyle = selected ? '2px solid var(--accent)' : '1px dashed var(--border)';

  const style: React.CSSProperties = {
    position: 'absolute',
    left: comp.x * scale,
    top: comp.y * scale,
    width: Math.max(2, comp.width) * scale,
    height: Math.max(isLine ? 2 : 4, comp.height) * scale,
    border: isLine ? undefined : borderStyle,
    cursor: 'move',
    boxSizing: 'border-box',
    userSelect: 'none',
    zIndex: selected ? 10 : 1,
  };

  let content: React.ReactNode = null;
  if (comp.type === 'text') {
    const tc = comp;
    content = (
      <div className="w-full h-full overflow-hidden px-0.5 flex items-center" style={{
        fontSize: (tc.style.fontSize ?? 9) * zoom * 0.8,
        fontWeight: tc.style.bold ? 'bold' : 'normal',
        fontStyle: tc.style.italic ? 'italic' : 'normal',
        color: tc.style.color ?? '#000',
        justifyContent: tc.style.align === 'right' ? 'flex-end' : tc.style.align === 'center' ? 'center' : 'flex-start',
      }}>
        <span className="truncate opacity-80">{tc.expression}</span>
      </div>
    );
  } else if (comp.type === 'line') {
    const lc = comp;
    content = (
      <div style={{
        width: '100%',
        height: Math.max(1, lc.style.width),
        background: lc.style.color,
        borderStyle: lc.style.style,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
      }} />
    );
  } else if (comp.type === 'image') {
    content = <div className="w-full h-full flex items-center justify-center text-[8px] text-[var(--fg-muted)] border-2 border-dashed border-[var(--border)]">IMG</div>;
  }

  return (
    <div style={style} onMouseDown={handleMouseDown} title={`${comp.type}: ${comp.name}`}>
      {content}
      {selected && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ position: 'absolute', top: -8, right: -8, zIndex: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="x" size={9} />
        </button>
      )}
    </div>
  );
}

// ── Band row ─────────────────────────────────────────────────────────────────
interface BandRowProps {
  band: RptBand;
  index: number;
  totalBands: number;
  selection: DesignerSelection;
  zoom: number;
  dispatch: React.Dispatch<DesignerAction>;
  pageWidthMm: number;
}

function BandRow({ band, index, totalBands, selection, zoom, dispatch, pageWidthMm }: BandRowProps) {
  const scale = zoom * MM_TO_PX;
  const isBandSelected = selection.type === 'band' && selection.bandId === band.id;
  const bandHeightPx = band.height * scale;
  const bandWidthPx = pageWidthMm * scale;

  function addComp(comp: RptComponent) {
    dispatch({ type: 'ADD_COMPONENT', bandId: band.id, component: comp });
    dispatch({ type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id });
  }

  return (
    <div className="flex items-stretch select-none">
      {/* Left gutter: band label + controls */}
      <div
        className={`flex flex-col justify-between shrink-0 px-2 py-1 cursor-pointer border-r border-[var(--border)] ${isBandSelected ? 'bg-[var(--bg-selected)]' : 'bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)]'}`}
        style={{ width: 120, minHeight: bandHeightPx }}
        onClick={() => dispatch({ type: 'SELECT_BAND', bandId: band.id })}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-semibold text-[var(--fg-muted)] uppercase tracking-wide leading-tight">
            {bandLabel(band)}
          </span>
        </div>
        <div className="flex gap-1 mt-1">
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'MOVE_BAND', bandId: band.id, direction: 'up' }); }}
            disabled={index === 0} className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer" title="Naik">
            <Icon name="chevup" size={10} />
          </button>
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'MOVE_BAND', bandId: band.id, direction: 'down' }); }}
            disabled={index === totalBands - 1} className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer" title="Turun">
            <Icon name="chevdown" size={10} />
          </button>
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_BAND', bandId: band.id }); }}
            className="opacity-60 hover:text-red-500 hover:opacity-100 cursor-pointer ml-auto" title="Hapus band">
            <Icon name="trash" size={10} />
          </button>
        </div>
        {/* Add component buttons */}
        <div className="flex gap-1 mt-1 flex-wrap">
          <button onClick={e => { e.stopPropagation(); addComp(makeText(band)); }} title="Tambah Text"
            className="text-[8px] bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-1 cursor-pointer">T</button>
          <button onClick={e => { e.stopPropagation(); addComp(makeLine(band)); }} title="Tambah Line"
            className="text-[8px] bg-gray-100 text-gray-700 hover:bg-gray-200 rounded px-1 cursor-pointer">—</button>
          <button onClick={e => { e.stopPropagation(); addComp(makeImage(band)); }} title="Tambah Image"
            className="text-[8px] bg-green-100 text-green-700 hover:bg-green-200 rounded px-1 cursor-pointer">IMG</button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        className={`relative border-b border-[var(--border)] ${isBandSelected ? 'bg-blue-50/30' : 'bg-white'}`}
        style={{ width: bandWidthPx, height: bandHeightPx, overflow: 'hidden' }}
        onClick={() => dispatch({ type: 'SELECT_BAND', bandId: band.id })}
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

        {/* Components */}
        {band.components.map(comp => (
          <ComponentOverlay
            key={comp.id}
            comp={comp}
            bandId={band.id}
            zoom={zoom}
            selected={selection.type === 'component' && selection.componentId === comp.id}
            onSelect={() => dispatch({ type: 'SELECT_COMPONENT', bandId: band.id, componentId: comp.id })}
            onUpdate={patch => dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch })}
            onRemove={() => dispatch({ type: 'REMOVE_COMPONENT', bandId: band.id, componentId: comp.id })}
          />
        ))}

        {band.components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[9px] text-[var(--fg-muted)] italic pointer-events-none">
            klik T / — / IMG di kiri untuk tambah komponen
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main canvas ──────────────────────────────────────────────────────────────

const BAND_PRESETS: Array<{ type: BandType; label: string; defaults: Partial<RptBand> }> = [
  { type: 'pageHeader',  label: 'Page Header',      defaults: { height: 30 } },
  { type: 'groupHeader', label: 'Group Header 1',   defaults: { height: 12, level: 1, groupBy: 'id' } },
  { type: 'groupHeader', label: 'Group Header 2',   defaults: { height: 8, level: 2, groupBy: 'groupField' } },
  { type: 'data',        label: 'Data Band',        defaults: { height: 6, canGrow: false, minRows: 0 } },
  { type: 'groupFooter', label: 'Group Footer 1',   defaults: { height: 8, level: 1 } },
  { type: 'groupFooter', label: 'Group Footer 2',   defaults: { height: 8, level: 2 } },
  { type: 'pageFooter',  label: 'Page Footer',      defaults: { height: 8 } },
];

function genBandId() { return `band_${Date.now().toString(36)}`; }

export function DesignerCanvas({ bands, dataSources, selection, zoom, dispatch }: Props) {
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const addMenuRef = React.useRef<HTMLDivElement>(null);

  // Page width for A4 portrait minus 20mm margins = 190mm
  const pageWidthMm = 190;

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function addBand(preset: typeof BAND_PRESETS[0]) {
    const band: RptBand = {
      id: genBandId(),
      type: preset.type,
      height: 8,
      components: [],
      ...preset.defaults,
    };
    dispatch({ type: 'ADD_BAND', band });
    dispatch({ type: 'SELECT_BAND', bandId: band.id });
    setShowAddMenu(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-muted)]">
      {/* Canvas toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(v => !v)}
            className="flex items-center gap-1 text-xs bg-[var(--accent)] text-white px-2 py-1 rounded hover:opacity-90 cursor-pointer"
          >
            <Icon name="plus" size={12} />
            Tambah Band
          </button>
          {showAddMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-card)] border border-[var(--border)] rounded shadow-lg py-1 min-w-[160px]">
              {BAND_PRESETS.map(p => (
                <button
                  key={`${p.type}-${p.defaults.level}`}
                  onClick={() => addBand(p)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-[var(--fg-muted)]">-</span>
          <input type="range" min={50} max={200} step={10} value={Math.round(zoom * 100)}
            onChange={e => dispatch({ type: 'SET_ZOOM', zoom: parseInt(e.target.value) / 100 })}
            className="w-24 cursor-pointer" />
          <span className="text-xs text-[var(--fg-muted)]">+</span>
          <span className="text-xs text-[var(--fg-muted)] w-10 text-right">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Artboard */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className="shadow-lg mx-auto"
          style={{ width: pageWidthMm * zoom * MM_TO_PX + 120, background: 'white', border: '1px solid var(--border)' }}
          onClick={() => dispatch({ type: 'DESELECT' })}
        >
          {/* Page ruler */}
          <div className="flex sticky top-0 z-20 bg-[var(--bg-muted)] border-b border-[var(--border)]">
            <div style={{ width: 120 }} className="shrink-0" />
            <div className="relative overflow-hidden" style={{ width: pageWidthMm * zoom * MM_TO_PX, height: 16 }}>
              {Array.from({ length: Math.floor(pageWidthMm / 10) + 1 }).map((_, i) => (
                <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: i * 10 * zoom * MM_TO_PX }}>
                  <div style={{ width: 1, height: 4, background: '#999' }} />
                  <span style={{ fontSize: 7, color: '#999', marginTop: 1 }}>{i * 10}</span>
                </div>
              ))}
            </div>
          </div>

          {bands.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-[var(--fg-muted)] italic">
              Klik "Tambah Band" untuk mulai membangun layout laporan
            </div>
          )}

          {bands.map((band, idx) => (
            <BandRow
              key={band.id}
              band={band}
              index={idx}
              totalBands={bands.length}
              selection={selection}
              zoom={zoom}
              dispatch={dispatch}
              pageWidthMm={pageWidthMm}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
