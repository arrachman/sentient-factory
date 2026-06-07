'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { executeSqlQuery } from '@/lib/api/reports';
import type { RptBand, RptTemplate } from '@/lib/report-types';

interface Props {
  template: RptTemplate;
}

// Simple HTML preview generator — renders bands as divs with inline styles.
// Real PDF would go through Puppeteer on the server. This is a live preview.

const MM_TO_PX_PREVIEW = 3.0; // slightly smaller than design scale

function evalExpression(expr: string, row: Record<string, unknown>, summary: Record<string, unknown>): string {
  if (!expr) return '';
  return expr.replace(/\{([^}]+)\}/g, (_match, inner: string) => {
    const trimmed = inner.trim();
    if (trimmed === 'PageNumber') return '1';
    if (trimmed === 'TotalPageCount') return '1';
    if (trimmed.startsWith('data.')) {
      const field = trimmed.slice(5);
      return row[field] != null ? String(row[field]) : '';
    }
    if (trimmed.startsWith('summary.')) {
      const field = trimmed.slice(8);
      return summary[field] != null ? String(summary[field]) : '';
    }
    return `{${trimmed}}`;
  });
}

function renderBandHtml(band: RptBand, rows: Record<string, unknown>[], idx: number): string {
  const row = rows[idx] ?? {};
  const heightPx = band.height * MM_TO_PX_PREVIEW;
  const comps = band.components.map(comp => {
    if (comp.type === 'text') {
      const val = evalExpression(comp.expression, row, {});
      const s = comp.style;
      return `<div style="position:absolute;left:${comp.x * MM_TO_PX_PREVIEW}px;top:${comp.y * MM_TO_PX_PREVIEW}px;width:${comp.width * MM_TO_PX_PREVIEW}px;height:${comp.height * MM_TO_PX_PREVIEW}px;font-size:${(s.fontSize ?? 9) * 0.9}px;color:${s.color ?? '#000'};text-align:${s.align ?? 'left'};font-weight:${s.bold ? 'bold' : 'normal'};font-style:${s.italic ? 'italic' : 'normal'};overflow:hidden;line-height:1.2;">${val}</div>`;
    }
    if (comp.type === 'line') {
      return `<div style="position:absolute;left:${comp.x * MM_TO_PX_PREVIEW}px;top:${comp.y * MM_TO_PX_PREVIEW}px;width:${comp.width * MM_TO_PX_PREVIEW}px;height:${Math.max(1, comp.style.width)}px;background:${comp.style.color};" />`;
    }
    if (comp.type === 'image') {
      return `<div style="position:absolute;left:${comp.x * MM_TO_PX_PREVIEW}px;top:${comp.y * MM_TO_PX_PREVIEW}px;width:${comp.width * MM_TO_PX_PREVIEW}px;height:${comp.height * MM_TO_PX_PREVIEW}px;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;">IMG</div>`;
    }
    return '';
  }).join('');
  return `<div style="position:relative;height:${heightPx}px;border-bottom:1px solid #eee;">${comps}</div>`;
}

export function PreviewPanel({ template }: Props) {
  const [previewHtml, setPreviewHtml] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      // Fetch data from primary data source (DS1 or first)
      const ds = template.dataSources[0];
      let rows: Record<string, unknown>[] = [];
      if (ds) {
        const result = await executeSqlQuery(ds.sql, {}, 20);
        rows = result.rows;
      }

      const pageWidth = 185 * MM_TO_PX_PREVIEW; // A4 - margins
      let bodyHtml = '';

      for (const band of template.bands) {
        if (band.type === 'data' && rows.length > 0) {
          for (let i = 0; i < Math.min(rows.length, 10); i++) {
            bodyHtml += renderBandHtml(band, rows, i);
          }
        } else {
          bodyHtml += renderBandHtml(band, rows, 0);
        }
      }

      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>body{margin:0;padding:16px;font-family:Arial,sans-serif;} .page{width:${pageWidth}px;border:1px solid #ccc;margin:0 auto;background:#fff;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}</style>
</head>
<body>
<div class="page">${bodyHtml}</div>
</body>
</html>`;
      setPreviewHtml(html);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Preview HTML</span>
        <Button size="sm" variant="ghost" onClick={generate} disabled={loading} className="ml-auto gap-1">
          <Icon name="refresh" size={11} />
          {loading ? 'Memuat...' : 'Generate Preview'}
        </Button>
      </div>

      {error && (
        <div className="m-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
      )}

      {!previewHtml && !loading && !error && (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--fg-muted)] italic">
          Klik "Generate Preview" untuk melihat pratinjau laporan
        </div>
      )}

      {previewHtml && (
        <div className="flex-1 overflow-auto bg-[var(--bg-muted)] p-4">
          <iframe
            srcDoc={previewHtml}
            className="w-full border-0 bg-white"
            style={{ minHeight: 600 }}
            title="Report Preview"
          />
        </div>
      )}
    </div>
  );
}
