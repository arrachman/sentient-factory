'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { executeSqlQuery } from '@/lib/api/reports';
import { MM_TO_PX } from '@/lib/report-component-factory';
import type { RptBand, RptTemplate } from '@/lib/report-types';

const PAGE_DIMS: Record<string, { w: number; h: number }> = {
  A4:     { w: 210, h: 297 },
  A5:     { w: 148, h: 210 },
  Letter: { w: 216, h: 279 },
  Legal:  { w: 216, h: 356 },
};

function pageDims(template: RptTemplate) {
  const d = PAGE_DIMS[template.pageSize] ?? PAGE_DIMS['A4'];
  return template.orientation === 'landscape'
    ? { w: d.h, h: d.w }
    : { w: d.w, h: d.h };
}

function fmtVal(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'number') {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v);
  }
  return String(v);
}

function computeAgg(rows: Record<string, unknown>[]): Record<string, number> {
  const agg: Record<string, number> = { 'COUNT(*)': rows.length };
  if (!rows.length) return agg;
  const cols = Object.keys(rows[0]);
  for (const col of cols) {
    const nums = rows.map(r => { const n = Number(r[col]); return isNaN(n) ? 0 : n; });
    agg[`SUM(${col})`]   = nums.reduce((a, b) => a + b, 0);
    agg[`COUNT(${col})`] = rows.filter(r => r[col] != null).length;
    agg[`AVG(${col})`]   = nums.reduce((a, b) => a + b, 0) / rows.length;
    agg[`MAX(${col})`]   = Math.max(...nums);
    agg[`MIN(${col})`]   = nums.length ? Math.min(...nums) : 0;
  }
  return agg;
}

function evalExpr(
  expr: string,
  row: Record<string, unknown>,
  params: Record<string, string>,
  agg: Record<string, number> = {},
): string {
  if (!expr) return '';
  // Pass 1: resolve {{aggregate(field)}} double-brace expressions
  const result = expr.replace(/\{\{([^}]+)\}\}/g, (_m, inner: string) => {
    const t = inner.trim();
    if (t in agg) return fmtVal(agg[t]);
    // Unknown aggregate (e.g. when rows=0) → show 0
    if (/^(SUM|COUNT|AVG|MAX|MIN)\s*\(/.test(t)) return '0';
    return `{{${t}}}`;
  });
  // Pass 2: resolve {field} single-brace expressions
  return result.replace(/\{([^}]+)\}/g, (_m, inner: string) => {
    const t = inner.trim();
    if (t === 'PageNumber')       return '1';
    if (t === 'TotalPageCount')   return '?';
    if (t.startsWith('data.'))    return fmtVal(row[t.slice(5)]);
    if (t.startsWith('summary.')) return `(${t.slice(8)})`;
    if (t.startsWith('params.'))  return params[t.slice(7)] ?? '';
    if (t in row)    return fmtVal(row[t]);
    if (t in params) return params[t] ?? '';
    return `{${t}}`;
  });
}

function bandHtml(
  band: RptBand,
  row: Record<string, unknown>,
  params: Record<string, string>,
  agg: Record<string, number> = {},
): string {
  const hPx = band.height * MM_TO_PX;
  const comps = band.components.map(comp => {
    const left  = comp.x * MM_TO_PX;
    const top   = comp.y * MM_TO_PX;
    const wPx   = comp.width  * MM_TO_PX;
    const hcPx  = comp.height * MM_TO_PX;

    if (comp.type === 'text') {
      const val = evalExpr(comp.expression, row, params, agg);
      const s   = comp.style;
      return `<div style="position:absolute;left:${left}px;top:${top}px;width:${wPx}px;height:${hcPx}px;` +
        `font-size:${s.fontSize ?? 9}px;` +
        `color:${s.color ?? '#111'};` +
        `text-align:${s.align ?? 'left'};` +
        `font-weight:${s.bold ? '700' : '400'};` +
        `font-style:${s.italic ? 'italic' : 'normal'};` +
        (s.background ? `background-color:${s.background};` : '') +
        `overflow:hidden;line-height:1.35;white-space:nowrap;">${val}</div>`;
    }
    if (comp.type === 'line') {
      return `<div style="position:absolute;left:${left}px;top:${top}px;width:${wPx}px;` +
        `height:${Math.max(1, comp.style.width ?? 1)}px;background:${comp.style.color ?? '#333'};"/>`;
    }
    if (comp.type === 'image') {
      return `<div style="position:absolute;left:${left}px;top:${top}px;width:${wPx}px;height:${hcPx}px;` +
        `border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;` +
        `font-size:9px;color:#aaa;">IMG</div>`;
    }
    return '';
  }).join('');
  return `<div style="position:relative;height:${hPx}px;">${comps}</div>`;
}

function buildHtml(
  template: RptTemplate,
  rows: Record<string, unknown>[],
  params: Record<string, string>,
): string {
  const { w, h } = pageDims(template);
  const m = template.margins;
  const pageWpx    = w  * MM_TO_PX;
  const pageHpx    = h  * MM_TO_PX;
  const contentWpx = (w - m.left - m.right)   * MM_TO_PX;

  const agg = computeAgg(rows);
  let bands = '';
  for (const band of template.bands) {
    if (band.type === 'data') {
      // Skip data band when no rows — avoids showing {field} placeholders
      for (const row of rows) {
        bands += bandHtml(band, row, params, agg);
      }
    } else {
      bands += bandHtml(band, rows[0] ?? {}, params, agg);
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  *,*::before,*::after{box-sizing:border-box;}
  html,body{margin:0;padding:32px 40px;background:#d1d5db;font-family:Arial,Helvetica,sans-serif;min-height:100vh;}
  .page{
    width:${pageWpx}px;min-height:${pageHpx}px;background:#fff;margin:0 auto;
    padding:${m.top*MM_TO_PX}px ${m.right*MM_TO_PX}px ${m.bottom*MM_TO_PX}px ${m.left*MM_TO_PX}px;
    box-shadow:0 8px 32px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.10);border-radius:2px;
  }
  .content{width:${contentWpx}px;overflow:hidden;}
</style>
</head>
<body>
<div class="page"><div class="content">${bands}</div></div>
</body>
</html>`;
}

// ── collect params from template ──────────────────────────────────────────────

interface ParamDef { name: string; type: string; label: string; required?: boolean }

function collectParams(template: RptTemplate): ParamDef[] {
  if (template.params?.length) {
    return template.params.map(p => ({ name: p.name, type: p.type, label: p.label, required: p.required }));
  }
  const seen = new Set<string>();
  const out: ParamDef[] = [];
  for (const ds of template.dataSources) {
    for (const p of ds.params ?? []) {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        out.push({ name: p.name, type: p.type, label: p.label ?? p.name, required: p.required });
      }
    }
  }
  return out;
}

// ── component ─────────────────────────────────────────────────────────────────

interface Props { template: RptTemplate }

export function PreviewPanel({ template }: Props) {
  const paramDefs = React.useMemo(() => collectParams(template), [template]);
  const today = new Date().toISOString().slice(0, 10);

  const [paramValues, setParamValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(paramDefs.map(p => [p.name, p.type === 'date' ? today : ''])),
  );

  const [previewHtml, setPreviewHtml] = React.useState<string | null>(null);
  const [loading, setLoading]         = React.useState(false);
  const [error, setError]             = React.useState<string | null>(null);
  const [rowCount, setRowCount]       = React.useState(0);
  const iframeRef                     = React.useRef<HTMLIFrameElement>(null);

  function autoSizeIframe() {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.body) return;
    iframe.style.height = `${iframe.contentDocument.body.scrollHeight + 80}px`;
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const ds = template.dataSources[0];
      let rows: Record<string, unknown>[] = [];
      if (ds) {
        const result = await executeSqlQuery(ds.sql, paramValues as Record<string, unknown>, 500);
        rows = result.rows;
        setRowCount(result.count);
      }
      setPreviewHtml(buildHtml(template, rows, paramValues));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  function setParam(name: string, value: string) {
    setParamValues(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-base)]">

      {/* ── params + run bar ───────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
        <div className="flex flex-wrap items-end gap-4">

          {paramDefs.map(p => (
            <div key={p.name} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--fg-muted)]">
                {p.label}
                {p.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input
                type={p.type === 'date' ? 'date' : 'text'}
                value={paramValues[p.name] ?? ''}
                onChange={e => setParam(p.name, e.target.value)}
                className="border border-[var(--border)] rounded-md px-3 py-1.5 text-sm
                  bg-[var(--bg-base)] text-[var(--fg)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40
                  focus:border-[var(--accent)] transition-colors"
                style={{ minWidth: 140 }}
              />
            </div>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            {previewHtml && (
              <span className="text-xs text-[var(--fg-muted)]">
                {rowCount} baris
              </span>
            )}
            <Button
              size="sm"
              onClick={generate}
              disabled={loading}
              className="gap-2 px-4 py-2"
            >
              <Icon name={loading ? 'refresh' : 'play'} size={13} />
              {loading ? 'Memuat...' : 'Jalankan Preview'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="shrink-0 mx-4 mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 leading-relaxed">
          <span className="font-semibold">Error: </span>{error}
        </div>
      )}

      {/* ── empty state ────────────────────────────────────────────────────── */}
      {!previewHtml && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[var(--fg-muted)]">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
            <Icon name="eye" size={28} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--fg)]">Preview Laporan</p>
            <p className="text-xs mt-1">
              {paramDefs.length > 0
                ? 'Isi parameter di atas lalu klik Jalankan Preview'
                : 'Klik Jalankan Preview untuk melihat pratinjau'}
            </p>
          </div>
        </div>
      )}

      {/* ── loading spinner ────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)]">
          <Icon name="refresh" size={28} className="animate-spin" />
          <p className="text-sm">Mengambil data...</p>
        </div>
      )}

      {/* ── preview iframe ─────────────────────────────────────────────────── */}
      {previewHtml && !loading && (
        <div className="flex-1 overflow-auto" style={{ background: '#d1d5db' }}>
          <iframe
            ref={iframeRef}
            srcDoc={previewHtml}
            className="w-full border-0 block"
            style={{ minHeight: 900, height: '100%' }}
            title="Report Preview"
            onLoad={autoSizeIframe}
          />
        </div>
      )}
    </div>
  );
}
