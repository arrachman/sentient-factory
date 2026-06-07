// ── Report Designer (mock prototype model) ───────────────────────────────────
// Band-based canvas (Stimulsoft-style) + Carbone-style {d.x} tag binding.
// Self-contained mock data + resolver + default report definition. Ported from
// the prototype `report-designer.jsx`. Pure data/helpers — no React here.

export type RdAlign = 'left' | 'center' | 'right';

export type RdCompKind =
  | 'text' | 'field' | 'columns' | 'datarow' | 'line' | 'totalrow'
  | 'image' | 'table' | 'barcode' | 'chart';

export interface RdColumn {
  label?: string;
  expr?: string;
  w: number;
  align: RdAlign;
  mono?: boolean;
}

export interface RdComp {
  id: string;
  kind: RdCompKind;
  x?: number;
  y?: number;
  w?: number;
  expr?: string;
  size?: number;
  bold?: boolean;
  align?: RdAlign;
  muted?: boolean;
  mono?: boolean;
  strong?: boolean;
  label?: string;
  cols?: RdColumn[];
}

export interface RdBand {
  id: string;
  type: string;
  label: string;
  h: number;
  color: string;
  repeat?: string;
  comps: RdComp[];
}

// ── Sample bound data (Carbone `d`) ──────────────────────────────────────────
export const RD_DATA = {
  company: {
    name: 'PT SENTIENT MANUFAKTUR',
    address: 'Jl. Industri Raya No. 88, Cikarang',
    npwp: '01.234.567.8-052.000',
    phone: '021-8990-1234',
  },
  doc: {
    no: 'SO26050099',
    date: '12 Mei 2026',
    customer: 'PT PRIMA KARYA SUKSES',
    address: 'Jl. Daan Mogot KM 12, Tangerang',
    salesman: 'Anna',
    term: 'NET 30',
    ref: 'PO-PKS-0421',
  },
  items: [
    { code: 'BRC3604RD11', name: 'BRASS ROD 11.1MM', qty: 250, unit: 'KG', price: 142500, total: 35625000 },
    { code: 'ZNP4801', name: 'ZINC PLATE 1.0MM x 1000 x 2000', qty: 40, unit: 'LBR', price: 380000, total: 15200000 },
    { code: 'CUWR6001', name: 'COPPER WIRE 2.5MM', qty: 120, unit: 'KG', price: 162000, total: 19440000 },
    { code: 'SSPL8002', name: 'SS PLATE 2.0MM x 1200 x 2400', qty: 12, unit: 'LBR', price: 2280000, total: 27360000 },
  ],
  totals: { subtotal: 97625000, discount: 1952500, ppn: 10523975, grand: 106196475 },
} as const;

export const fmtIDR = (n: number): string =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(n));

export interface RdCtx {
  item?: Record<string, unknown>;
}

const rdGet = (path: string, ctx: RdCtx): unknown => {
  const arr = path.startsWith('i.')
    ? path.slice(2).split('.')
    : path.replace(/^d\./, '').split('.');
  let node: unknown = path.startsWith('i.') ? ctx.item : RD_DATA;
  for (const k of arr) {
    if (node == null) return '';
    node = (node as Record<string, unknown>)[k];
  }
  return node;
};

/** Resolve a `{d.x:fmt}` / `{i.y}` template string against RD_DATA + ctx. */
export const rdResolve = (expr: string | undefined, ctx: RdCtx = {}): string => {
  if (expr == null) return '';
  return String(expr).replace(/\{([^}]+)\}/g, (_m, raw: string) => {
    let token = raw.trim();
    let fmt: string | null = null;
    if (token.includes(':')) {
      const [a, b] = token.split(':');
      token = a.trim();
      fmt = b.trim();
    }
    let val: unknown;
    if (token.startsWith('i.') || token.startsWith('d.')) val = rdGet(token, ctx);
    else val = token;
    if (val == null) val = '';
    if (fmt === 'money') return 'Rp ' + fmtIDR(Number(val) || 0);
    if (fmt === 'num') return fmtIDR(Number(val) || 0);
    return String(val);
  });
};

// ── Default report definition ────────────────────────────────────────────────
export const rdInitialBands = (): RdBand[] => [
  { id: 'b-title', type: 'ReportTitle', label: 'Report Title', h: 96, color: '#6366f1', comps: [
    { id: 'c1', kind: 'text', x: 0, y: 8, w: 60, expr: '{d.company.name}', size: 18, bold: true, align: 'left' },
    { id: 'c2', kind: 'text', x: 0, y: 38, w: 60, expr: '{d.company.address}', size: 11, align: 'left', muted: true },
    { id: 'c3', kind: 'text', x: 0, y: 56, w: 60, expr: 'NPWP {d.company.npwp} · Telp {d.company.phone}', size: 11, align: 'left', muted: true },
    { id: 'c4', kind: 'text', x: 62, y: 14, w: 38, expr: 'FAKTUR PENJUALAN', size: 20, bold: true, align: 'right' },
    { id: 'c5', kind: 'text', x: 62, y: 48, w: 38, expr: 'No {d.doc.no}', size: 12, align: 'right' },
    { id: 'c6', kind: 'text', x: 62, y: 66, w: 38, expr: 'Tanggal {d.doc.date}', size: 11, align: 'right', muted: true },
  ] },
  { id: 'b-header', type: 'PageHeader', label: 'Page Header', h: 88, color: '#0ea5e9', comps: [
    { id: 'h1', kind: 'text', x: 0, y: 4, w: 50, expr: 'Pelanggan: {d.doc.customer}', size: 11, bold: true, align: 'left' },
    { id: 'h2', kind: 'text', x: 0, y: 22, w: 50, expr: '{d.doc.address}', size: 10.5, align: 'left', muted: true },
    { id: 'h3', kind: 'text', x: 52, y: 4, w: 48, expr: 'Salesman: {d.doc.salesman}', size: 11, align: 'right' },
    { id: 'h4', kind: 'text', x: 52, y: 22, w: 48, expr: 'Termin: {d.doc.term} · Ref {d.doc.ref}', size: 10.5, align: 'right', muted: true },
    { id: 'hcol', kind: 'columns', y: 48, cols: [
      { label: 'KODE', w: 16, align: 'left' }, { label: 'NAMA BARANG', w: 34, align: 'left' },
      { label: 'QTY', w: 10, align: 'right' }, { label: 'SAT', w: 8, align: 'center' },
      { label: 'HARGA', w: 16, align: 'right' }, { label: 'TOTAL', w: 16, align: 'right' },
    ] },
  ] },
  { id: 'b-data', type: 'Data', label: 'Data Band · d.items[i]', h: 30, color: '#10b981', repeat: 'd.items', comps: [
    { id: 'd-row', kind: 'datarow', y: 6, cols: [
      { expr: '{i.code}', w: 16, align: 'left', mono: true }, { expr: '{i.name}', w: 34, align: 'left' },
      { expr: '{i.qty}', w: 10, align: 'right', mono: true }, { expr: '{i.unit}', w: 8, align: 'center' },
      { expr: '{i.price:num}', w: 16, align: 'right', mono: true }, { expr: '{i.total:num}', w: 16, align: 'right', mono: true },
    ] },
  ] },
  { id: 'b-footer', type: 'ReportFooter', label: 'Report Footer', h: 150, color: '#f59e0b', comps: [
    { id: 'f1', kind: 'totalrow', y: 6, label: 'Sub Total', expr: '{d.totals.subtotal:money}' },
    { id: 'f2', kind: 'totalrow', y: 28, label: 'Diskon', expr: '-{d.totals.discount:money}', muted: true },
    { id: 'f3', kind: 'totalrow', y: 50, label: 'PPN 11%', expr: '{d.totals.ppn:money}', muted: true },
    { id: 'f4', kind: 'totalrow', y: 74, label: 'TOTAL', expr: '{d.totals.grand:money}', strong: true },
    { id: 'f5', kind: 'text', x: 0, y: 104, w: 50, expr: 'Terbilang: seratus enam juta ...', size: 10, align: 'left', muted: true },
    { id: 'f6', kind: 'text', x: 60, y: 116, w: 40, expr: 'Hormat kami,', size: 11, align: 'center' },
  ] },
  { id: 'b-pagefoot', type: 'PageFooter', label: 'Page Footer', h: 34, color: '#94a3b8', comps: [
    { id: 'p1', kind: 'text', x: 0, y: 8, w: 60, expr: 'Dicetak {d.doc.date} · Sentient ERP', size: 9.5, align: 'left', muted: true },
    { id: 'p2', kind: 'text', x: 60, y: 8, w: 40, expr: 'Halaman 1 dari 1', size: 9.5, align: 'right', muted: true },
  ] },
];

export interface RdToolboxItem { kind: RdCompKind; icon: string; label: string; }
export const RD_TOOLBOX: RdToolboxItem[] = [
  { kind: 'text', icon: 'file', label: 'Text' },
  { kind: 'field', icon: 'database', label: 'Data Field' },
  { kind: 'image', icon: 'eye', label: 'Image' },
  { kind: 'table', icon: 'boxes', label: 'Table' },
  { kind: 'line', icon: 'swap', label: 'Line' },
  { kind: 'barcode', icon: 'stats', label: 'Barcode' },
  { kind: 'chart', icon: 'pie', label: 'Chart' },
];

export const RD_BAND_TYPES = [
  'ReportTitle', 'PageHeader', 'GroupHeader', 'Data', 'GroupFooter', 'ReportFooter', 'PageFooter',
];

export interface RdDictField { path: string; label: string; type: string; }
export interface RdDictNode { path: string; label: string; array?: boolean; children: RdDictField[]; }

// Dictionary tree (Carbone d.*)
export const RD_DICT: RdDictNode[] = [
  { path: 'd.company', label: 'company', children: [
    { path: 'd.company.name', label: 'name', type: 'String' },
    { path: 'd.company.address', label: 'address', type: 'String' },
    { path: 'd.company.npwp', label: 'npwp', type: 'String' },
    { path: 'd.company.phone', label: 'phone', type: 'String' },
  ] },
  { path: 'd.doc', label: 'doc', children: [
    { path: 'd.doc.no', label: 'no', type: 'String' },
    { path: 'd.doc.date', label: 'date', type: 'Date' },
    { path: 'd.doc.customer', label: 'customer', type: 'String' },
    { path: 'd.doc.salesman', label: 'salesman', type: 'String' },
    { path: 'd.doc.term', label: 'term', type: 'String' },
    { path: 'd.doc.ref', label: 'ref', type: 'String' },
  ] },
  { path: 'd.items', label: 'items[ ]', array: true, children: [
    { path: 'i.code', label: 'code', type: 'String' },
    { path: 'i.name', label: 'name', type: 'String' },
    { path: 'i.qty', label: 'qty', type: 'Number' },
    { path: 'i.unit', label: 'unit', type: 'String' },
    { path: 'i.price', label: 'price', type: 'Number' },
    { path: 'i.total', label: 'total', type: 'Number' },
  ] },
  { path: 'd.totals', label: 'totals', children: [
    { path: 'd.totals.subtotal', label: 'subtotal', type: 'Number' },
    { path: 'd.totals.discount', label: 'discount', type: 'Number' },
    { path: 'd.totals.ppn', label: 'ppn', type: 'Number' },
    { path: 'd.totals.grand', label: 'grand', type: 'Number' },
  ] },
];

/** Build a Carbone-ish template text from the band definition (Template mode). */
export const buildTemplate = (bands: RdBand[]): string => {
  let out = '';
  bands.forEach(b => {
    out += `<!-- ${b.type} -->\n`;
    if (b.type === 'Data') {
      out += `{#items}\n`;
      b.comps[0]?.cols?.forEach(col => { out += `  ${(col.expr || '').replace('i.', 'd.items[i].')}\t`; });
      out += `\n{/items}\n\n`;
      return;
    }
    b.comps.forEach(c => {
      if (c.kind === 'columns') out += '  ' + (c.cols || []).map(col => col.label).join('\t') + '\n';
      else if (c.kind === 'totalrow') out += `  ${c.label}: ${c.expr}\n`;
      else if (c.expr) out += `  ${c.expr}\n`;
    });
    out += '\n';
  });
  return out;
};
