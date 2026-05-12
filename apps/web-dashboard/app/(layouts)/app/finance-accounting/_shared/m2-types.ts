export type DashboardResponse<T> = {
  success?: boolean;
  data?: { rows?: T[] };
  message?: string;
};

export type SummaryRow = {
  total_journal_rows?: number | string;
  total_debit?: number | string;
  total_kredit?: number | string;
  net_cashflow?: number | string;
  total_cabang?: number | string;
  total_sumber?: number | string;
};

export type InsightResponse = {
  success?: boolean;
  data?: {
    insights?: InsightItem[];
    anomalies?: InsightItem[];
    recommendations?: InsightItem[];
    model?: {
      provider?: string;
      version?: string;
    };
  };
  message?: string;
};

export type InsightItem =
  | string
  | {
      text?: string;
      confidence?: number;
    };

export type FeatureCopy = {
  description: string;
  kpi1: string;
  kpi2: string;
  kpi3: string;
  kpi4: string;
  trendTitle: string;
  flowTitle: string;
  sourceTitle: string;
  branchTitle: string;
  statusTitle: string;
  tableTitle: string;
  insightTitle: string;
  insightHighlights: string;
  insightAnomalies: string;
  insightRecommendations: string;
  totalBranchTitle: string;
  totalSourceTitle: string;
  emptyStatusText: string;
  emptyInsightText: string;
  emptyAnomalyText: string;
  emptyRecommendationText: string;
  emptyTableText: string;
};

export type InsightTermMap = {
  totalDebit?: string;
  totalKredit?: string;
  netCashflow?: string;
  cashIn?: string;
  cashOut?: string;
  arusKasAgregat?: string;
  outlierNetCashflow?: string;
};

export const FEATURE_LABELS: Record<string, string> = {
  m2_aj: 'Jurnal Penyesuaian (AJ)',
  m2_bd: 'Anggaran (BD)',
  m2_cb: 'Saldo Awal COA (CB)',
  m2_cr: 'Kas Masuk (CR)',
  m2_cd: 'Kas Keluar (CD)',
  m2_gj: 'Jurnal Umum (GJ)',
  m2_jm: 'Jurnal Memorial (JM)',
  m2_rg: 'Giro Masuk (RG)',
  m2_rgc: 'Giro Masuk Batal (RGC)',
  m2_rm: 'Bank Receipt (RM)',
  m2_sg: 'Giro Keluar (SG)',
  m2_sgc: 'Giro Keluar Batal (SGC)',
  m2_sm: 'Bank Payment (SM)',
  m2_template: 'Template Jurnal (TJ)',
};

// ---- utility functions ----

export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function fmt(value: unknown, maximumFractionDigits = 0) {
  return toNumber(value).toLocaleString('id-ID', { maximumFractionDigits });
}

export function fmtCompact(value: unknown, maximumFractionDigits = 1) {
  return toNumber(value).toLocaleString('id-ID', {
    notation: 'compact',
    maximumFractionDigits,
  });
}

export function fmtMoney(value: unknown, maximumFractionDigits = 2) {
  return `Rp ${fmt(value, maximumFractionDigits)}`;
}

export function fmtMoneyCompact(value: unknown, maximumFractionDigits = 1) {
  return `Rp ${fmtCompact(value, maximumFractionDigits)}`;
}

export function isNumericLike(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (typeof value === 'string') {
    return value.trim() !== '' && Number.isFinite(Number(value));
  }
  return false;
}

export function isMonetaryColumn(column: string) {
  const lower = column.toLowerCase();
  return (
    lower.includes('debit') ||
    lower.includes('kredit') ||
    lower.includes('cash') ||
    lower.includes('amount') ||
    lower.includes('total') ||
    lower.includes('net')
  );
}

export function isIntegerColumn(column: string) {
  const lower = column.toLowerCase();
  return (
    lower.endsWith('id') ||
    lower.includes('_id') ||
    lower.includes('status') ||
    lower.includes('row')
  );
}

export function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

export function oneYearAgoDateOnly() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

export function normalizeInsightText(item: InsightItem): string {
  if (typeof item === 'string') {
    return item;
  }
  if (item && typeof item === 'object' && typeof item.text === 'string') {
    return item.text;
  }
  return '-';
}

export function normalizeInsightConfidence(item: InsightItem): string | null {
  if (!item || typeof item === 'string') {
    return null;
  }
  if (
    typeof item.confidence !== 'number' ||
    !Number.isFinite(item.confidence)
  ) {
    return null;
  }
  return `${Math.round(item.confidence * 100)}%`;
}

export function contextualizeInsightText(
  text: string,
  termMap: InsightTermMap,
): string {
  let result = text;
  if (termMap.totalDebit)
    result = result.replace(/total debit/gi, termMap.totalDebit);
  if (termMap.totalKredit)
    result = result.replace(/total kredit/gi, termMap.totalKredit);
  if (termMap.netCashflow)
    result = result.replace(/net cashflow/gi, termMap.netCashflow);
  if (termMap.cashIn)
    result = result.replace(/cash in/gi, termMap.cashIn);
  if (termMap.cashOut)
    result = result.replace(/cash out/gi, termMap.cashOut);
  if (termMap.arusKasAgregat)
    result = result.replace(/arus kas agregat/gi, termMap.arusKasAgregat);
  if (termMap.outlierNetCashflow)
    result = result.replace(/outlier net cashflow/gi, termMap.outlierNetCashflow);
  return result;
}

export async function fetchRows<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = (await response
    .json()
    .catch(() => null)) as DashboardResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
  }
  return payload.data?.rows ?? [];
}
