'use client';

/**
 * Report Designer (/admin/report-designer).
 * - listMode (editingId=null) → daftar template (backend-connected).
 * - editor   (editingId set)  → band-based designer (Stimulsoft-style canvas
 *   + Carbone {d.x} tag binding). Editor memakai model mock prototype
 *   (lib/report-designer-mock.ts) — lihat report-designer-mock organisms.
 */

import * as React from 'react';
import { getReportTemplate } from '@/lib/api/reports';
import { notify } from '@/lib/feedback';
import { ReportDesignerListPage } from './report-designer-list-page';
import { MockReportDesigner } from '@/components/organisms/report-designer-mock/mock-designer';

export function ReportDesignerPage() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [templateName, setTemplateName] = React.useState('');
  const [templateJson, setTemplateJson] = React.useState<Record<string, unknown> | undefined>();
  const [loadingTemplate, setLoadingTemplate] = React.useState(false);

  async function openDesigner(id: string) {
    setLoadingTemplate(true);
    setEditingId(id);
    try {
      const rec = await getReportTemplate(id);
      setTemplateName(rec.name);
      setTemplateJson(rec.templateJson);
    } catch (e) {
      notify(`Gagal memuat template: ${e instanceof Error ? e.message : String(e)}`, 'danger');
      setEditingId(null);
    } finally {
      setLoadingTemplate(false);
    }
  }

  if (!editingId) {
    return <ReportDesignerListPage onOpenDesigner={openDesigner} />;
  }

  if (loadingTemplate) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--fg-muted)]">
        Memuat template...
      </div>
    );
  }

  return (
    <MockReportDesigner
      key={editingId}
      templateId={editingId}
      templateName={templateName}
      initialJson={templateJson}
      onBack={() => { setEditingId(null); setTemplateName(''); setTemplateJson(undefined); }}
    />
  );
}
