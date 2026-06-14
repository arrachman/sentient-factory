'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import {
  rdInitialBands, buildTemplate, type RdBand, type RdComp, type RdCompKind,
} from '@/lib/report-designer-mock';
import { RdRibbon } from './ribbon';
import { RdLeftPanel, type RdSelection } from './left-panel';
import { RdCanvas } from './canvas';
import { RdPreview } from './preview';
import { RdRightPanel } from './right-panel';

type Mode = 'design' | 'preview' | 'template';

const MODES: Array<[Mode, string, React.ComponentProps<typeof Icon>['name']]> = [
  ['design', 'Desain', 'file'],
  ['preview', 'Pratinjau', 'eye'],
  ['template', 'Template', 'book'],
];

interface Props {
  templateName: string;
  onBack: () => void;
}

export function MockReportDesigner({ templateName, onBack }: Props) {
  const [bands, setBands] = React.useState<RdBand[]>(rdInitialBands);
  const [sel, setSel] = React.useState<RdSelection>({ band: 'b-title', comp: 'c4' });
  const [mode, setMode] = React.useState<Mode>('design');
  const [zoom, setZoom] = React.useState(100);
  const [leftTab, setLeftTab] = React.useState<'toolbox' | 'dict'>('toolbox');
  const [rightTab, setRightTab] = React.useState<'props' | 'tree'>('props');
  const [paper, setPaper] = React.useState('A4');
  const [expandDict, setExpandDict] = React.useState<Record<string, boolean>>({
    'd.company': true, 'd.doc': true, 'd.items': true, 'd.totals': true,
  });

  const selBand = bands.find(b => b.id === sel.band);
  const selComp = selBand?.comps.find(c => c.id === sel.comp);

  const updateComp = React.useCallback((patch: Partial<RdComp>) => {
    setBands(bs => bs.map(b => b.id !== sel.band ? b : {
      ...b, comps: b.comps.map(c => c.id !== sel.comp ? c : { ...c, ...patch }),
    }));
  }, [sel.band, sel.comp]);

  const updateBand = React.useCallback((bandId: string, patch: Partial<RdBand>) => {
    setBands(bs => bs.map(b => b.id === bandId ? { ...b, ...patch } : b));
  }, []);

  const addComp = React.useCallback((kind: RdCompKind) => {
    const id = 'n' + Math.random().toString(36).slice(2, 7);
    const target = sel.band || 'b-title';
    const newC: RdComp = {
      id, kind: kind === 'line' ? 'line' : 'text', x: 4, y: 8, w: 30,
      expr: kind === 'field' ? '{d.doc.no}' : kind === 'line' ? '' : 'Text baru',
      size: 11, align: 'left',
    };
    setBands(bs => bs.map(b => b.id !== target ? b : { ...b, comps: [...b.comps, newC] }));
    setSel({ band: target, comp: id });
    setLeftTab('toolbox');
  }, [sel.band]);

  const deleteComp = React.useCallback(() => {
    if (!sel.comp) return;
    setBands(bs => bs.map(b => b.id !== sel.band ? b : { ...b, comps: b.comps.filter(c => c.id !== sel.comp) }));
    setSel(s => ({ ...s, comp: null }));
  }, [sel.band, sel.comp]);

  const insertTag = React.useCallback((path: string) => {
    if (!sel.comp) return;
    updateComp({ expr: (selComp?.expr || '') + `{${path}}` });
  }, [sel.comp, selComp, updateComp]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteComp(); }
      else if (e.key.toLowerCase() === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault(); setMode(m => (m === 'preview' ? 'design' : 'preview'));
      } else if (e.key === 'Escape') setSel(s => ({ ...s, comp: null }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteComp]);

  const templateCode = React.useMemo(() => buildTemplate(bands), [bands]);
  const compCount = bands.reduce((s, b) => s + b.comps.length, 0);

  return (
    <div className="rd-page">
      {/* Header */}
      <div className="rd-header">
        <button className="iconbtn" onClick={onBack} title="Kembali ke daftar"><Icon name="arrowleft" size={15} /></button>
        <h1 className="rd-title">Desainer Laporan <span className="rd-code-tag">SRX</span></h1>
        <span className="rd-subtitle">{templateName}</span>
        <div className="rd-header-actions">
          <div className="rd-modeseg">
            {MODES.map(([m, label, ic]) => (
              <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
                <Icon name={ic} size={12} /> {label}
              </button>
            ))}
          </div>
          <button className="btn"><Icon name="upload" size={12} /> Import</button>
          <button className="btn" onClick={() => setMode('preview')}><Icon name="play" size={12} /> Jalankan <Kbd>⌘P</Kbd></button>
          <div className="btn-split">
            <button className="btn"><Icon name="download" size={12} /> Export</button>
            <button className="btn"><Icon name="chevdown" size={12} /></button>
          </div>
          <button className="btn primary"><Icon name="save" size={12} /> Simpan <Kbd>⌘S</Kbd></button>
        </div>
      </div>

      <RdRibbon selComp={selComp} updateComp={updateComp} addComp={addComp}
        paper={paper} setPaper={setPaper} zoom={zoom} setZoom={setZoom} />

      <div className="rd-body">
        <RdLeftPanel leftTab={leftTab} setLeftTab={setLeftTab} bands={bands} sel={sel} setSel={setSel}
          addComp={addComp} expandDict={expandDict} setExpandDict={setExpandDict} insertTag={insertTag} />

        {mode === 'template' ? (
          <div className="rd-canvas-wrap"><pre className="rd-code">{templateCode}</pre></div>
        ) : mode === 'preview' ? (
          <RdPreview bands={bands} zoom={zoom} />
        ) : (
          <RdCanvas bands={bands} zoom={zoom} sel={sel} setSel={setSel}
            onClear={() => setSel(s => ({ ...s, comp: null }))} />
        )}

        <RdRightPanel rightTab={rightTab} setRightTab={setRightTab} bands={bands} sel={sel} setSel={setSel}
          selBand={selBand} selComp={selComp} updateComp={updateComp} updateBand={updateBand} deleteComp={deleteComp} />
      </div>

      {/* Footer pager */}
      <div className="rd-pager">
        <span className="muted">Pintasan:</span>
        <span className="rd-pager-hint"><Kbd>⌘P</Kbd> jalankan</span>
        <span className="rd-pager-hint"><Kbd>Del</Kbd> hapus komponen</span>
        <span className="rd-pager-hint"><Kbd>⌘S</Kbd> simpan</span>
        <div className="rd-spacer" />
        <span className="muted">{bands.length} band · {compCount} komponen · {mode}</span>
      </div>
    </div>
  );
}
