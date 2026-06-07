'use client';

/**
 * Report Designer (/admin/report-designer).
 * Dua mode:
 * - listMode=true  → daftar template
 * - listMode=false → editor designer
 * Arsitektur: 3 dock simultan + preview split (Stimulsoft-like).
 * Left dock  : tab Data Sources (SQL editor) / Fields (palette kolom, drag-to-bind). Collapsible.
 * Center     : Canvas/artboard (bands + components). Preview split bisa dibuka di kanannya.
 * Right dock : Properties (band/komponen terpilih). Collapsible.
 */

import * as React from 'react';
import { INITIAL_STATE, designerReducer } from '@/lib/report-store';
import { getReportTemplate, updateReportTemplate } from '@/lib/api/reports';
import { notify } from '@/lib/feedback';
import type { RptTemplate } from '@/lib/report-types';
import { ReportDesignerListPage } from './report-designer-list-page';
import { DesignerToolbar } from '@/components/organisms/report-designer/designer-toolbar';
import { DataSourcePanel } from '@/components/organisms/report-designer/datasource-panel';
import { FieldPalette } from '@/components/organisms/report-designer/field-palette';
import { DesignerCanvas } from '@/components/organisms/report-designer/designer-canvas';
import { PropertiesPanel } from '@/components/organisms/report-designer/properties-panel';
import { PreviewPanel } from '@/components/organisms/report-designer/preview-panel';
import { useDesignerShortcuts } from '@/lib/use-designer-shortcuts';
import { Icon } from '@/components/ui/icons';

/** Schema kolom hasil Test Query per data-source alias — dibagi ke FieldPalette. */
export type DsSchemas = Record<string, string[]>;

export function ReportDesignerPage() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [templateName, setTemplateName] = React.useState('');
  const [loadingTemplate, setLoadingTemplate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [schemas, setSchemas] = React.useState<DsSchemas>({});
  const [state, dispatch] = React.useReducer(designerReducer, INITIAL_STATE);

  const setSchema = React.useCallback((alias: string, columns: string[]) => {
    setSchemas(prev => ({ ...prev, [alias]: columns }));
  }, []);

  // Gabungan unik semua kolom hasil query → autocomplete/picker di Properties.
  const allColumns = React.useMemo(
    () => Array.from(new Set(Object.values(schemas).flat())),
    [schemas],
  );

  useDesignerShortcuts({ active: !!editingId, state, dispatch, onSave: () => handleSave() });

  async function openDesigner(id: string) {
    setLoadingTemplate(true);
    setEditingId(id);
    try {
      const rec = await getReportTemplate(id);
      setTemplateName(rec.name);
      const tmpl = rec.templateJson as unknown as RptTemplate;
      dispatch({ type: 'SET_TEMPLATE', template: tmpl });
    } catch (e) {
      notify(`Gagal memuat template: ${e instanceof Error ? e.message : String(e)}`, 'danger');
      setEditingId(null);
    } finally {
      setLoadingTemplate(false);
    }
  }

  async function handleSave() {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateReportTemplate(editingId, { templateJson: state.template as unknown as Record<string, unknown> });
      dispatch({ type: 'MARK_CLEAN' });
      notify('Template disimpan', 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : String(e), 'danger');
    } finally {
      setSaving(false);
    }
  }

  // List mode
  if (!editingId) {
    return <ReportDesignerListPage onOpenDesigner={openDesigner} />;
  }

  // Loading template
  if (loadingTemplate) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--fg-muted)]">
        Memuat template...
      </div>
    );
  }

  // Designer mode — 3 dock simultan + preview split
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <DesignerToolbar
        state={state}
        dispatch={dispatch}
        templateName={templateName}
        onBack={() => { setEditingId(null); dispatch({ type: 'SET_TEMPLATE', template: INITIAL_STATE.template }); }}
        onSave={handleSave}
        saving={saving}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left dock: tab Data / Fields, collapsible */}
        <div
          className="border-r border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
          style={{ width: state.leftOpen ? 380 : 0, transition: 'width 0.15s', minWidth: 0 }}
        >
          {state.leftOpen && (
            <>
              <div className="flex shrink-0 border-b border-[var(--border)]">
                {(['data', 'fields'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => dispatch({ type: 'SET_LEFT_TAB', tab })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                      state.leftTab === tab
                        ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] font-semibold'
                        : 'text-[var(--fg-muted)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Icon name={tab === 'data' ? 'database' : 'layers'} size={12} />
                    {tab === 'data' ? 'Data Sources' : 'Fields'}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {state.leftTab === 'data' ? (
                  <DataSourcePanel
                    dataSources={state.template.dataSources}
                    dispatch={dispatch}
                    onSchema={setSchema}
                  />
                ) : (
                  <FieldPalette
                    dataSources={state.template.dataSources}
                    schemas={schemas}
                    selection={state.selection}
                    bands={state.template.bands}
                    onSchema={setSchema}
                    dispatch={dispatch}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Center: Canvas (+ Preview split bila dibuka) */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            <DesignerCanvas
              bands={state.template.bands}
              dataSources={state.template.dataSources}
              selection={state.selection}
              zoom={state.zoom}
              dispatch={dispatch}
            />
          </div>
          {state.previewOpen && (
            <div className="flex-1 overflow-hidden flex flex-col min-w-0 border-l border-[var(--border)]">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
                <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Preview</span>
                <button onClick={() => dispatch({ type: 'TOGGLE_PREVIEW', open: false })}
                  className="text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer" title="Tutup preview">
                  <Icon name="x" size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <PreviewPanel template={state.template} />
              </div>
            </div>
          )}
        </div>

        {/* Right dock: Properties, collapsible */}
        <div
          className="border-l border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
          style={{ width: state.rightOpen ? 290 : 0, transition: 'width 0.15s', minWidth: 0 }}
        >
          {state.rightOpen && (
            <div className="overflow-y-auto flex-1">
              <div className="px-3 py-2 border-b border-[var(--border)] flex items-center">
                <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Properti</span>
              </div>
              <PropertiesPanel
                selection={state.selection}
                bands={state.template.bands}
                columns={allColumns}
                dispatch={dispatch}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
