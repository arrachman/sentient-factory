'use client';

/**
 * Report Designer (/admin/report-designer).
 * Dua mode:
 * - listMode=true  → daftar template
 * - listMode=false → editor designer (canvas + data sources + properties)
 * Arsitektur: multi-panel Stimulsoft-like.
 * Left panel: Data Sources (SQL query editor + test).
 * Center:     Canvas/artboard (bands + components drag).
 * Right:      Properties (selected band/component).
 */

import * as React from 'react';
import { INITIAL_STATE, designerReducer } from '@/lib/report-store';
import { getReportTemplate, updateReportTemplate } from '@/lib/api/reports';
import { notify } from '@/lib/feedback';
import type { RptTemplate } from '@/lib/report-types';
import { ReportDesignerListPage } from './report-designer-list-page';
import { DesignerToolbar } from '@/components/organisms/report-designer/designer-toolbar';
import { DataSourcePanel } from '@/components/organisms/report-designer/datasource-panel';
import { DesignerCanvas } from '@/components/organisms/report-designer/designer-canvas';
import { PropertiesPanel } from '@/components/organisms/report-designer/properties-panel';
import { PreviewPanel } from '@/components/organisms/report-designer/preview-panel';

export function ReportDesignerPage() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [templateName, setTemplateName] = React.useState('');
  const [loadingTemplate, setLoadingTemplate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [state, dispatch] = React.useReducer(designerReducer, INITIAL_STATE);

  async function openDesigner(id: string) {
    setLoadingTemplate(true);
    setEditingId(id);
    try {
      const rec = await getReportTemplate(id);
      setTemplateName(rec.name);
      const tmpl = rec.templateJson as unknown as RptTemplate;
      dispatch({ type: 'SET_TEMPLATE', template: tmpl });
    } catch (e: any) {
      notify(`Gagal memuat template: ${e.message}`, 'danger');
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
    } catch (e: any) {
      notify(e.message, 'danger');
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

  // Designer mode — 3-panel layout
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
        {/* Left panel: Data Sources */}
        <div
          className="border-r border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
          style={{ width: state.activePanel === 'dataSources' ? 380 : 0, transition: 'width 0.15s', minWidth: 0 }}
        >
          {state.activePanel === 'dataSources' && (
            <DataSourcePanel
              dataSources={state.template.dataSources}
              dispatch={dispatch}
            />
          )}
        </div>

        {/* Center: Canvas or Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {state.activePanel === 'preview' ? (
            <PreviewPanel template={state.template} />
          ) : (
            <DesignerCanvas
              bands={state.template.bands}
              dataSources={state.template.dataSources}
              selection={state.selection}
              zoom={state.zoom}
              dispatch={dispatch}
            />
          )}
        </div>

        {/* Right panel: Properties */}
        <div
          className="border-l border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
          style={{ width: state.activePanel === 'bands' ? 240 : 0, transition: 'width 0.15s', minWidth: 0 }}
        >
          {state.activePanel === 'bands' && (
            <div className="overflow-y-auto flex-1">
              <div className="px-3 py-2 border-b border-[var(--border)] flex items-center">
                <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Properti</span>
              </div>
              <PropertiesPanel
                selection={state.selection}
                bands={state.template.bands}
                dataSources={state.template.dataSources}
                dispatch={dispatch}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
