'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { RD_BAND_TYPES, type RdBand, type RdComp } from '@/lib/report-designer-mock';
import type { RdSelection } from './left-panel';
import { PropGroup, PropRow, Toggle } from './shared';

interface Props {
  rightTab: 'props' | 'tree';
  setRightTab: (t: 'props' | 'tree') => void;
  bands: RdBand[];
  sel: RdSelection;
  setSel: (s: RdSelection) => void;
  selBand: RdBand | undefined;
  selComp: RdComp | undefined;
  updateComp: (patch: Partial<RdComp>) => void;
  updateBand: (bandId: string, patch: Partial<RdBand>) => void;
  deleteComp: () => void;
}

function CompProps({ selComp, updateComp, deleteComp }: Pick<Props, 'selComp' | 'updateComp' | 'deleteComp'>) {
  const c = selComp!;
  const isText = c.kind === 'text' || c.kind === 'field';
  return (
    <>
      <div className="rd-prop-head">
        <span className="pill primary">{c.kind}</span>
        <span className="rd-prop-id">{c.id}</span>
        <button className="iconbtn" style={{ marginLeft: 'auto', color: 'var(--danger)' }} onClick={deleteComp}>
          <Icon name="trash" size={12} />
        </button>
      </div>
      {isText && (
        <PropGroup label="Konten">
          <PropRow label="Expression" full>
            <textarea className="rd-input" rows={2} value={c.expr || ''}
              onChange={e => updateComp({ expr: e.target.value })} />
          </PropRow>
        </PropGroup>
      )}
      <PropGroup label="Layout">
        <PropRow label="X (%)"><input className="rd-input" type="number" value={c.x ?? 0}
          onChange={e => updateComp({ x: Number(e.target.value) })} /></PropRow>
        <PropRow label="Y (px)"><input className="rd-input" type="number" value={c.y ?? 0}
          onChange={e => updateComp({ y: Number(e.target.value) })} /></PropRow>
        <PropRow label="Width (%)"><input className="rd-input" type="number" value={c.w ?? 30}
          onChange={e => updateComp({ w: Number(e.target.value) })} /></PropRow>
      </PropGroup>
      <PropGroup label="Tipografi">
        <PropRow label="Size"><input className="rd-input" type="number" value={c.size ?? 11}
          onChange={e => updateComp({ size: Number(e.target.value) })} /></PropRow>
        <PropRow label="Align">
          <select className="rd-input" value={c.align || 'left'} onChange={e => updateComp({ align: e.target.value as RdComp['align'] })}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </PropRow>
        <PropRow label="Bold"><Toggle on={!!c.bold} onClick={() => updateComp({ bold: !c.bold })} /></PropRow>
        <PropRow label="Muted"><Toggle on={!!c.muted} onClick={() => updateComp({ muted: !c.muted })} /></PropRow>
      </PropGroup>
    </>
  );
}

function BandProps({ selBand, updateBand }: Pick<Props, 'selBand' | 'updateBand'>) {
  const b = selBand!;
  return (
    <>
      <div className="rd-prop-head">
        <span className="pill" style={{ background: b.color + '22', color: b.color, borderColor: b.color + '55' }}>{b.type}</span>
        <span className="rd-prop-id">{b.label}</span>
      </div>
      <PropGroup label="Band">
        <PropRow label="Type">
          <select className="rd-input" value={b.type} onChange={e => updateBand(b.id, { type: e.target.value })}>
            {RD_BAND_TYPES.map(bt => <option key={bt}>{bt}</option>)}
          </select>
        </PropRow>
        <PropRow label="Height"><input className="rd-input" type="number" value={b.h}
          onChange={e => updateBand(b.id, { h: Number(e.target.value) })} /></PropRow>
        {b.repeat && <PropRow label="Repeat" full><code className="rd-codechip">{b.repeat}[i]</code></PropRow>}
      </PropGroup>
      <div className="rd-hint"><Icon name="info" size={11} /> Pilih komponen di kanvas untuk mengedit propertinya.</div>
    </>
  );
}

function StructureTree({ bands, sel, setSel }: Pick<Props, 'bands' | 'sel' | 'setSel'>) {
  return (
    <div className="rd-panel-body">
      <div className="rd-section-label">Struktur Report</div>
      <div className="rd-tree">
        <div className="rd-tree-root"><Icon name="file" size={12} /> Faktur Penjualan</div>
        {bands.map(b => (
          <div key={b.id}>
            <div className={`rd-tree-band${sel.band === b.id && !sel.comp ? ' active' : ''}`}
              onClick={() => setSel({ band: b.id, comp: null })}>
              <span className="rd-banddot" style={{ background: b.color }} />{b.type}
            </div>
            {b.comps.map(c => (
              <div key={c.id} className={`rd-tree-comp${sel.comp === c.id ? ' active' : ''}`}
                onClick={() => setSel({ band: b.id, comp: c.id })}>
                <Icon name={c.kind === 'line' ? 'swap' : c.kind === 'columns' || c.kind === 'datarow' ? 'boxes' : 'file'} size={11} />
                <span className="rd-tree-label">{(c.expr || c.kind).replace(/[{}]/g, '').slice(0, 22) || c.kind}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RdRightPanel(props: Props) {
  const { rightTab, setRightTab, bands, sel, setSel, selBand, selComp, updateComp, updateBand, deleteComp } = props;
  return (
    <aside className="rd-right">
      <div className="rd-tabs">
        <button className={rightTab === 'props' ? 'active' : ''} onClick={() => setRightTab('props')}>
          <Icon name="gear" size={13} /> Properti
        </button>
        <button className={rightTab === 'tree' ? 'active' : ''} onClick={() => setRightTab('tree')}>
          <Icon name="layers" size={13} /> Struktur
        </button>
      </div>

      {rightTab === 'props' ? (
        <div className="rd-panel-body">
          {selComp ? (
            <CompProps selComp={selComp} updateComp={updateComp} deleteComp={deleteComp} />
          ) : selBand ? (
            <BandProps selBand={selBand} updateBand={updateBand} />
          ) : (
            <div className="rd-empty-props">
              <Icon name="gear" size={24} />
              <div style={{ marginTop: 8 }}>Pilih band atau komponen</div>
            </div>
          )}
        </div>
      ) : (
        <StructureTree bands={bands} sel={sel} setSel={setSel} />
      )}
    </aside>
  );
}
