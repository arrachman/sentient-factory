'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import {
  buildTemplate, type RdBand, type RdComp, type RdCompKind,
} from '@/lib/report-designer-mock';
import {
  serializeTemplate, loadBands, downloadTemplate, pickTemplateFile, isForeignTemplate,
} from '@/lib/report-designer-io';
import { reApplyGeometry } from '@/lib/report-engine-adapter';
import { updateReportTemplate, previewReportTemplate, materializeReportTemplate } from '@/lib/api/reports';
import { notify, confirmAction } from '@/lib/feedback';
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
  templateId: string;
  templateName: string;
  initialJson?: Record<string, unknown>;
  onBack: () => void;
}

export function MockReportDesigner({ templateId, templateName, initialJson, onBack }: Props) {
  const initial = React.useMemo(() => loadBands(initialJson), [initialJson]);
  const engineSource = initial.engineSource;
  const foreign = React.useMemo(() => isForeignTemplate(initialJson), [initialJson]);
  const [bands, setBands] = React.useState<RdBand[]>(() => initial.bands);
  const [sel, setSel] = React.useState<RdSelection>({ band: 'b-title', comp: 'c4' });
  const [mode, setMode] = React.useState<Mode>('design');
  const [zoom, setZoom] = React.useState(100);
  const [leftTab, setLeftTab] = React.useState<'toolbox' | 'dict'>('toolbox');
  const [rightTab, setRightTab] = React.useState<'props' | 'tree'>('props');
  const [paper, setPaper] = React.useState(initial.paper);
  const [saving, setSaving] = React.useState(false);
  const [previewing, setPreviewing] = React.useState(false);
  const [materializing, setMaterializing] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  // Auto-templates have no editable bands until materialized from the report's columns.
  const isAuto = React.useMemo(
    () => (initialJson as { auto?: boolean } | undefined)?.auto === true,
    [initialJson],
  );
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

  // Position/size patch for a specific component (used by canvas drag-and-drop).
  const moveComp = React.useCallback((bandId: string, compId: string, patch: Partial<RdComp>) => {
    setBands(bs => bs.map(b => b.id !== bandId ? b : {
      ...b, comps: b.comps.map(c => c.id !== compId ? c : { ...c, ...patch }),
    }));
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

  // Mark dirty on any edit to bands/paper (skip the initial mount).
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setDirty(true);
  }, [bands, paper]);

  const persist = React.useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Report-engine templates round-trip through the adapter so SQL/dataSources
      // survive; editor-native templates serialize to the designer's own format.
      const templateJson = engineSource
        ? reApplyGeometry(engineSource, bands, paper)
        : serializeTemplate(bands, paper);
      await updateReportTemplate(templateId, { templateJson });
      setDirty(false);
      notify('Template disimpan', 'success');
    } catch (e) {
      notify(`Gagal menyimpan: ${e instanceof Error ? e.message : String(e)}`, 'danger');
    } finally {
      setSaving(false);
    }
  }, [saving, templateId, bands, paper, engineSource]);

  const handleSave = React.useCallback(() => {
    // The visual designer cannot represent the richer report-engine schema used
    // by seeded templates; saving would replace it. Require explicit confirm.
    if (foreign) {
      confirmAction({
        title: 'Timpa template asli?',
        message: 'Template ini memakai format report-engine lanjutan (query SQL/komponen) yang tidak bisa diedit visual designer. Menyimpan akan MENGGANTINYA dengan layout designer yang disederhanakan.',
        variant: 'danger',
        confirmLabel: 'Timpa & Simpan',
        onConfirm: () => { void persist(); },
      });
      return;
    }
    void persist();
  }, [foreign, persist]);

  const handleExport = React.useCallback(() => {
    downloadTemplate(templateName, bands, paper);
  }, [templateName, bands, paper]);

  // Render the current template to a real PDF (engine, sample data) and open it.
  const handlePreviewPdf = React.useCallback(async () => {
    if (previewing) return;
    setPreviewing(true);
    try {
      const templateJson = engineSource
        ? reApplyGeometry(engineSource, bands, paper)
        : serializeTemplate(bands, paper);
      const blob = await previewReportTemplate(templateJson);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      notify(`Gagal preview PDF: ${e instanceof Error ? e.message : String(e)}`, 'danger');
    } finally {
      setPreviewing(false);
    }
  }, [previewing, engineSource, bands, paper]);

  // Auto-template → generate explicit, editable bands from the report's real columns.
  const handleMaterialize = React.useCallback(async () => {
    if (materializing) return;
    setMaterializing(true);
    try {
      await materializeReportTemplate(templateId);
      notify('Layout dibuat dari kolom laporan. Buka kembali template untuk mengedit.', 'success');
      onBack();
    } catch (e) {
      notify(`Gagal membuat layout: ${e instanceof Error ? e.message : String(e)}`, 'danger');
    } finally {
      setMaterializing(false);
    }
  }, [materializing, templateId, onBack]);

  const handleImport = React.useCallback(async () => {
    const res = await pickTemplateFile();
    if (!res) { notify('File template tidak valid', 'danger'); return; }
    setBands(res.bands);
    setPaper(res.paper);
    setSel({ band: res.bands[0]?.id ?? '', comp: null });
    notify('Template diimpor', 'success');
  }, []);

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

  // Cmd/Ctrl+S saves even while a form field is focused.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault(); void handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  const templateCode = React.useMemo(() => buildTemplate(bands), [bands]);
  const compCount = bands.reduce((s, b) => s + b.comps.length, 0);

  return (
    <div className="rd-page">
      {/* Header */}
      <div className="rd-header">
        <button className="iconbtn" onClick={onBack} title="Kembali ke daftar"><Icon name="arrowleft" size={15} /></button>
        <h1 className="rd-title">Desainer Laporan <span className="rd-code-tag">SRX</span></h1>
        <span className="rd-subtitle">{templateName}</span>
        {foreign && (
          <span className="rd-subtitle" style={{ color: 'var(--warning, #d97706)' }} title="Template asli memakai format report-engine lanjutan; designer menampilkan layout default.">
            <Icon name="info" size={12} /> format lanjutan — tak bisa diedit visual
          </span>
        )}
        <div className="rd-header-actions">
          <div className="rd-modeseg">
            {MODES.map(([m, label, ic]) => (
              <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
                <Icon name={ic} size={12} /> {label}
              </button>
            ))}
          </div>
          <button className="btn" onClick={handleImport}><Icon name="upload" size={12} /> Import</button>
          <button className="btn" onClick={() => setMode('preview')}><Icon name="play" size={12} /> Jalankan <Kbd>⌘P</Kbd></button>
          <button className="btn" onClick={() => void handlePreviewPdf()} disabled={previewing}>
            <Icon name="file" size={12} /> {previewing ? 'Membuat…' : 'Preview PDF'}
          </button>
          {isAuto && (
            <button className="btn" onClick={() => void handleMaterialize()} disabled={materializing}
              title="Template otomatis — buat layout band dari kolom laporan agar bisa diedit">
              <Icon name="layers" size={12} /> {materializing ? 'Membuat…' : 'Buat layout dari kolom'}
            </button>
          )}
          <div className="btn-split">
            <button className="btn" onClick={handleExport}><Icon name="download" size={12} /> Export</button>
            <button className="btn" onClick={handleExport}><Icon name="chevdown" size={12} /></button>
          </div>
          <button className="btn primary" onClick={handleSave} disabled={saving}>
            <Icon name="save" size={12} /> {saving ? 'Menyimpan…' : dirty ? 'Simpan •' : 'Simpan'} <Kbd>⌘S</Kbd>
          </button>
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
            onClear={() => setSel(s => ({ ...s, comp: null }))} moveComp={moveComp} />
        )}

        <RdRightPanel rightTab={rightTab} setRightTab={setRightTab} bands={bands} sel={sel} setSel={setSel}
          title={templateName} selBand={selBand} selComp={selComp} updateComp={updateComp}
          updateBand={updateBand} deleteComp={deleteComp} />
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
