'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { GUTTER_W, MM_TO_PX } from '@/lib/report-component-factory';
import { BandRow } from './band-row';
import { ComponentToolbar } from './component-toolbar';
import { AlignToolbar } from './align-toolbar';
import type {
  BandType,
  DesignerAction,
  DesignerSelection,
  RptBand,
  RptDataSource,
} from '@/lib/report-types';

interface Props {
  bands: RptBand[];
  dataSources: RptDataSource[];
  selection: DesignerSelection;
  zoom: number;
  dispatch: React.Dispatch<DesignerAction>;
}

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

export function DesignerCanvas({ bands, selection, zoom, dispatch }: Props) {
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const addMenuRef = React.useRef<HTMLDivElement>(null);

  // A4 portrait minus 20mm margin = 190mm konten.
  const pageWidthMm = 190;

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) setShowAddMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Komponen terpilih (untuk align toolbar saat multi-select dalam satu band).
  const selectedComps = React.useMemo(() => {
    if (selection.type !== 'component' || !selection.bandId) return [];
    const b = bands.find(x => x.id === selection.bandId);
    if (!b) return [];
    const ids = new Set(selection.componentIds ?? (selection.componentId ? [selection.componentId] : []));
    return b.components.filter(c => ids.has(c.id));
  }, [selection, bands]);

  function addBand(preset: typeof BAND_PRESETS[0]) {
    const band: RptBand = { id: genBandId(), type: preset.type, height: 8, components: [], ...preset.defaults };
    dispatch({ type: 'ADD_BAND', band });
    dispatch({ type: 'SELECT_BAND', bandId: band.id });
    setShowAddMenu(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-muted)]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
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

        <div className="w-px h-5 bg-[var(--border)]" />
        {selectedComps.length > 1 && selection.bandId ? (
          <AlignToolbar comps={selectedComps} bandId={selection.bandId} dispatch={dispatch} />
        ) : (
          <ComponentToolbar bands={bands} selection={selection} dispatch={dispatch} />
        )}

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
      <div className="flex-1 overflow-auto p-10">
        <div
          className="shadow-lg mx-auto"
          style={{ width: pageWidthMm * zoom * MM_TO_PX + GUTTER_W, background: 'white', border: '1px solid var(--border)' }}
          onClick={() => dispatch({ type: 'DESELECT' })}
        >
          {/* Ruler */}
          <div className="flex sticky top-0 z-20 bg-[var(--bg-muted)] border-b border-[var(--border)]">
            <div style={{ width: GUTTER_W }} className="shrink-0" />
            <div className="relative overflow-hidden" style={{ width: pageWidthMm * zoom * MM_TO_PX, height: 18 }}>
              {Array.from({ length: Math.floor(pageWidthMm / 10) + 1 }).map((_, i) => (
                <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: i * 10 * zoom * MM_TO_PX }}>
                  <div style={{ width: 1, height: 5, background: '#999' }} />
                  <span style={{ fontSize: 9, color: '#999', marginTop: 1 }}>{i * 10}</span>
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
