'use client';

import * as React from 'react';
import type {
  DesignerAction,
  DesignerSelection,
  RptBand,
  RptComponent,
  RptDataSource,
  RptLineComponent,
  RptTextComponent,
} from '@/lib/report-types';

interface Props {
  selection: DesignerSelection;
  bands: RptBand[];
  dataSources: RptDataSource[];
  dispatch: React.Dispatch<DesignerAction>;
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[11px] text-[var(--fg-muted)] w-24 shrink-0 pt-1">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NumInput({ value, onChange, min, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] font-mono"
    />
  );
}

function TxtInput({ value, onChange, mono }: { value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] ${mono ? 'font-mono' : ''}`}
    />
  );
}

function ChkInput({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="text-xs">{label}</span>
    </label>
  );
}

function BandProperties({ band, dispatch }: { band: RptBand; dispatch: React.Dispatch<DesignerAction> }) {
  function p(patch: Partial<RptBand>) {
    dispatch({ type: 'UPDATE_BAND', bandId: band.id, patch });
  }
  return (
    <div>
      <div className="text-xs font-semibold mb-2 text-[var(--fg-muted)] uppercase tracking-wide">Band</div>
      <PropRow label="Tipe">{band.type}</PropRow>
      <PropRow label="Tinggi (mm)">
        <NumInput value={band.height} onChange={v => p({ height: v })} min={1} />
      </PropRow>
      {(band.type === 'groupHeader' || band.type === 'groupFooter') && (
        <>
          <PropRow label="Level">
            <select value={band.level ?? 1} onChange={e => p({ level: parseInt(e.target.value) as 1 | 2 })}
              className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] cursor-pointer">
              <option value={1}>1 (Inner)</option>
              <option value={2}>2 (Outer)</option>
            </select>
          </PropRow>
          {band.type === 'groupHeader' && (
            <PropRow label="Group By">
              <TxtInput value={band.groupBy ?? ''} onChange={v => p({ groupBy: v })} mono />
            </PropRow>
          )}
        </>
      )}
      {band.type === 'groupHeader' && (
        <PropRow label="">
          <ChkInput checked={band.printOnAllPages ?? false} onChange={v => p({ printOnAllPages: v })} label="Print on all pages" />
        </PropRow>
      )}
      {(band.type === 'groupHeader' || band.type === 'groupFooter') && (
        <PropRow label="">
          <ChkInput checked={band.newPageBefore ?? false} onChange={v => p({ newPageBefore: v })} label="New page before" />
        </PropRow>
      )}
      {band.type === 'data' && (
        <>
          <PropRow label="">
            <ChkInput checked={band.canGrow ?? false} onChange={v => p({ canGrow: v })} label="Can grow" />
          </PropRow>
          <PropRow label="Min rows">
            <NumInput value={band.minRows ?? 0} onChange={v => p({ minRows: v })} min={0} />
          </PropRow>
        </>
      )}
    </div>
  );
}

function TextCompProperties({ band, comp, dispatch }: { band: RptBand; comp: RptTextComponent; dispatch: React.Dispatch<DesignerAction> }) {
  function p(patch: Partial<RptTextComponent>) {
    dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch });
  }
  function ps(patch: Partial<RptTextComponent['style']>) {
    p({ style: { ...comp.style, ...patch } });
  }
  return (
    <div>
      <div className="text-xs font-semibold mb-2 text-[var(--fg-muted)] uppercase tracking-wide">Text</div>
      <PropRow label="Nama"><TxtInput value={comp.name} onChange={v => p({ name: v })} /></PropRow>
      <PropRow label="Expression">
        <textarea value={comp.expression} onChange={e => p({ expression: e.target.value })}
          rows={2} className="w-full border rounded px-2 py-1 text-xs font-mono resize-none bg-[var(--bg-card)]" />
      </PropRow>
      <div className="border-t border-[var(--border)] my-2" />
      <div className="text-[10px] font-semibold text-[var(--fg-muted)] mb-1">POSISI (mm)</div>
      <div className="grid grid-cols-2 gap-1">
        <PropRow label="X"><NumInput value={comp.x} onChange={v => p({ x: v })} min={0} /></PropRow>
        <PropRow label="Y"><NumInput value={comp.y} onChange={v => p({ y: v })} min={0} /></PropRow>
        <PropRow label="Lebar"><NumInput value={comp.width} onChange={v => p({ width: v })} min={1} /></PropRow>
        <PropRow label="Tinggi"><NumInput value={comp.height} onChange={v => p({ height: v })} min={1} /></PropRow>
      </div>
      <div className="border-t border-[var(--border)] my-2" />
      <div className="text-[10px] font-semibold text-[var(--fg-muted)] mb-1">STYLE</div>
      <PropRow label="Font size"><NumInput value={comp.style.fontSize ?? 9} onChange={v => ps({ fontSize: v })} min={6} /></PropRow>
      <PropRow label="Warna">
        <div className="flex gap-1 items-center">
          <input type="color" value={comp.style.color ?? '#000000'} onChange={e => ps({ color: e.target.value })} className="w-6 h-6 rounded border cursor-pointer" />
          <TxtInput value={comp.style.color ?? '#000000'} onChange={v => ps({ color: v })} mono />
        </div>
      </PropRow>
      <PropRow label="Align">
        <select value={comp.style.align ?? 'left'} onChange={e => ps({ align: e.target.value as any })}
          className="w-full border rounded px-2 py-0.5 text-xs bg-[var(--bg-card)] cursor-pointer">
          <option value="left">Kiri</option>
          <option value="center">Tengah</option>
          <option value="right">Kanan</option>
        </select>
      </PropRow>
      <PropRow label="">
        <div className="flex gap-3">
          <ChkInput checked={comp.style.bold ?? false} onChange={v => ps({ bold: v })} label="Bold" />
          <ChkInput checked={comp.style.italic ?? false} onChange={v => ps({ italic: v })} label="Italic" />
          <ChkInput checked={comp.style.wordWrap ?? false} onChange={v => ps({ wordWrap: v })} label="Wrap" />
        </div>
      </PropRow>
      <div className="border-t border-[var(--border)] my-2" />
      <PropRow label="">
        <div className="flex gap-3">
          <ChkInput checked={comp.canGrow ?? false} onChange={v => p({ canGrow: v })} label="Can grow" />
          <ChkInput checked={comp.canShrink ?? false} onChange={v => p({ canShrink: v })} label="Can shrink" />
        </div>
      </PropRow>
    </div>
  );
}

function LineCompProperties({ band, comp, dispatch }: { band: RptBand; comp: RptLineComponent; dispatch: React.Dispatch<DesignerAction> }) {
  function p(patch: Partial<RptLineComponent>) {
    dispatch({ type: 'UPDATE_COMPONENT', bandId: band.id, componentId: comp.id, patch });
  }
  return (
    <div>
      <div className="text-xs font-semibold mb-2 text-[var(--fg-muted)] uppercase tracking-wide">Line</div>
      <PropRow label="Nama"><TxtInput value={comp.name} onChange={v => p({ name: v })} /></PropRow>
      <div className="border-t border-[var(--border)] my-2" />
      <div className="text-[10px] font-semibold text-[var(--fg-muted)] mb-1">POSISI (mm)</div>
      <PropRow label="X"><NumInput value={comp.x} onChange={v => p({ x: v })} min={0} /></PropRow>
      <PropRow label="Y"><NumInput value={comp.y} onChange={v => p({ y: v })} min={0} /></PropRow>
      <PropRow label="Lebar"><NumInput value={comp.width} onChange={v => p({ width: v })} min={0} /></PropRow>
      <PropRow label="Tinggi"><NumInput value={comp.height} onChange={v => p({ height: v })} min={0} /></PropRow>
      <div className="border-t border-[var(--border)] my-2" />
      <PropRow label="Warna">
        <div className="flex gap-1 items-center">
          <input type="color" value={comp.style.color} onChange={e => p({ style: { ...comp.style, color: e.target.value } })} className="w-6 h-6 rounded border cursor-pointer" />
          <TxtInput value={comp.style.color} onChange={v => p({ style: { ...comp.style, color: v } })} mono />
        </div>
      </PropRow>
      <PropRow label="Tebal"><NumInput value={comp.style.width} onChange={v => p({ style: { ...comp.style, width: v } })} min={0.1} step={0.5} /></PropRow>
    </div>
  );
}

export function PropertiesPanel({ selection, bands, dataSources, dispatch }: Props) {
  if (!selection.type) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-[var(--fg-muted)] italic p-4 text-center">
        Klik band atau komponen untuk melihat propertinya
      </div>
    );
  }

  const band = bands.find(b => b.id === selection.bandId);
  if (!band) return null;

  if (selection.type === 'band') {
    return <div className="p-3 overflow-y-auto"><BandProperties band={band} dispatch={dispatch} /></div>;
  }

  const comp = band.components.find(c => c.id === selection.componentId);
  if (!comp) return null;

  if (comp.type === 'text') {
    return <div className="p-3 overflow-y-auto"><TextCompProperties band={band} comp={comp} dispatch={dispatch} /></div>;
  }
  if (comp.type === 'line') {
    return <div className="p-3 overflow-y-auto"><LineCompProperties band={band} comp={comp} dispatch={dispatch} /></div>;
  }

  return <div className="p-3 text-xs text-[var(--fg-muted)]">Tipe komponen belum ada editor</div>;
}
