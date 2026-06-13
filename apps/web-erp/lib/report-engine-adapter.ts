// ── Report-engine ⇄ visual-designer adapter ──────────────────────────────────
// Seeded templates use the report-engine schema (`dataSources` + SQL +
// `bands[].components`, geometry in mm). The visual designer uses its own model
// (`bands[].comps`, x/w in %, y in px). This adapter lets the designer SHOW and
// DRAG the real report content, then write geometry/text/style changes BACK into
// the original report-engine JSON — preserving SQL, dataSources, groupBy, borders
// and every other field the designer cannot represent. Pure helpers — no React.

import type { RdAlign, RdBand, RdComp } from '@/lib/report-designer-mock';

type Obj = Record<string, unknown>;

const CANVAS_W = 760; // px width the designer paper represents (full content width)
const A4 = { w: 210, h: 297 }; // mm

const asObj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {});
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const num = (v: unknown, d: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const str = (v: unknown, d = ''): string => (typeof v === 'string' ? v : d);
const round = (n: number): number => Math.round(n * 100) / 100;

/** Page content geometry derived from page size, orientation and margins. */
interface ReGeom { contentWidth: number; vScale: number }

function geom(doc: Obj): ReGeom {
  const m = asObj(doc.margins);
  const left = num(m.left, 20);
  const right = num(m.right, 20);
  const pageW = str(doc.orientation) === 'landscape' ? A4.h : A4.w;
  const contentWidth = Math.max(1, pageW - left - right);
  return { contentWidth, vScale: CANVAS_W / contentWidth };
}

const RE_TO_RD_TYPE: Record<string, string> = {
  reportHeader: 'ReportTitle', pageHeader: 'PageHeader', groupHeader: 'GroupHeader',
  data: 'Data', groupFooter: 'GroupFooter', reportFooter: 'ReportFooter', pageFooter: 'PageFooter',
};
const RD_TYPE_COLOR: Record<string, string> = {
  ReportTitle: '#6366f1', PageHeader: '#0ea5e9', GroupHeader: '#8b5cf6', Data: '#10b981',
  GroupFooter: '#f59e0b', ReportFooter: '#f59e0b', PageFooter: '#94a3b8',
};

/** True when `json` is a report-engine template (bands carry `components`). */
export function isReportEngineDoc(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false;
  const bands = (json as Obj).bands;
  return Array.isArray(bands) && bands.some(b => Array.isArray(asObj(b).components));
}

const isMuted = (color: unknown): boolean => {
  const c = str(color).toLowerCase();
  return c === '#666666' || c === '#999999' || c === '#aaaaaa' || c === '#cccccc';
};

function reComp(raw: unknown, g: ReGeom): RdComp {
  const c = asObj(raw);
  const style = asObj(c.style);
  const xPct = round((num(c.x, 0) / g.contentWidth) * 100);
  const wPct = round((num(c.width, 30) / g.contentWidth) * 100);
  const yPx = Math.round(num(c.y, 0) * g.vScale);
  if (str(c.type) === 'line') {
    return { id: str(c.id) || `l${yPx}`, kind: 'line', x: xPct, y: yPx, w: wPct };
  }
  return {
    id: str(c.id) || `t${yPx}`,
    kind: 'text',
    x: xPct, y: yPx, w: wPct,
    expr: str(c.expression),
    size: num(style.fontSize, 11),
    bold: style.bold === true,
    align: (['left', 'center', 'right'].includes(str(style.align)) ? str(style.align) : 'left') as RdAlign,
    muted: isMuted(style.color),
  };
}

export interface ReLoaded { bands: RdBand[]; paper: string; source: Obj }

/** Convert a report-engine template into editable designer bands (or null). */
export function reToBands(json: unknown): ReLoaded | null {
  if (!isReportEngineDoc(json)) return null;
  const doc = json as Obj;
  const g = geom(doc);
  const alias = str(asObj(asArr(doc.dataSources)[0]).alias) || 'data';
  const bands: RdBand[] = asArr(doc.bands).map((raw, bi) => {
    const b = asObj(raw);
    const reType = str(b.type);
    const type = RE_TO_RD_TYPE[reType] ?? 'PageHeader';
    return {
      id: str(b.id) || `b${bi}`,
      type,
      label: reType || type,
      h: Math.max(14, Math.round(num(b.height, 10) * g.vScale)),
      color: RD_TYPE_COLOR[type] ?? '#64748b',
      repeat: reType === 'data' ? alias : undefined,
      comps: asArr(b.components).map(c => reComp(c, g)),
    };
  });
  return { bands, paper: str(doc.pageSize, 'A4'), source: doc };
}

/** Merge a designer comp's geometry/text/style back onto its source component. */
function mergeComp(src: Obj, rc: RdComp, g: ReGeom): Obj {
  const style: Obj = { ...asObj(src.style), bold: rc.bold === true };
  if (rc.size != null) style.fontSize = rc.size;
  if (rc.align) style.align = rc.align;
  const out: Obj = {
    ...src,
    x: round(((rc.x ?? 0) / 100) * g.contentWidth),
    y: round((rc.y ?? 0) / g.vScale),
    width: round(((rc.w ?? 30) / 100) * g.contentWidth),
    style,
  };
  if (str(src.type) === 'text' && typeof rc.expr === 'string') out.expression = rc.expr;
  return out;
}

/** Build a report-engine component for a comp added inside the designer. */
function newReComp(rc: RdComp, g: ReGeom): Obj {
  const base: Obj = {
    id: rc.id,
    name: rc.id,
    x: round(((rc.x ?? 0) / 100) * g.contentWidth),
    y: round((rc.y ?? 0) / g.vScale),
    width: round(((rc.w ?? 30) / 100) * g.contentWidth),
  };
  if (rc.kind === 'line') {
    return { ...base, type: 'line', height: 1, style: { color: '#333333', width: 1, style: 'solid' } };
  }
  return {
    ...base,
    type: 'text',
    height: Math.max(5, round((rc.size ?? 11) * 0.5)),
    expression: rc.expr ?? '',
    style: { fontSize: rc.size ?? 11, bold: rc.bold === true, align: rc.align ?? 'left' },
  };
}

/**
 * Write designer edits back into the original report-engine document. Only
 * geometry (x/y/width/height), text expression and basic style (fontSize/bold/
 * align) are touched; SQL, dataSources, groupBy, borders, backgrounds and any
 * unknown fields are preserved verbatim. Components are matched by id; removed
 * ones are dropped, brand-new ones appended.
 */
export function reApplyGeometry(source: Obj, bands: RdBand[], paper: string): Obj {
  const g = geom(source);
  const bandById = new Map(bands.map(b => [b.id, b]));
  const newBands = asArr(source.bands).map(raw => {
    const sb = asObj(raw);
    const rb = bandById.get(str(sb.id));
    if (!rb) return sb;
    const compById = new Map(rb.comps.map(c => [c.id, c]));
    const srcComps = asArr(sb.components).map(asObj);
    const srcIds = new Set(srcComps.map(sc => str(sc.id)));
    const kept = srcComps
      .filter(sc => compById.has(str(sc.id)))
      .map(sc => mergeComp(sc, compById.get(str(sc.id)) as RdComp, g));
    const added = rb.comps.filter(rc => !srcIds.has(rc.id)).map(rc => newReComp(rc, g));
    return { ...sb, height: Math.max(1, round(rb.h / g.vScale)), components: [...kept, ...added] };
  });
  return { ...source, pageSize: paper, bands: newBands };
}
