/**
 * Format helpers untuk m2_* finance dashboards.
 * Diisolasi di sini supaya tidak duplikasi di setiap page.
 */

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
  // Variant fields (used by m2_cr/sm credit/payment dashboards).
  total_trx?: number | string;
  total_kas_masuk?: number | string;
  total_kas_keluar?: number | string;
  total_terbayar?: number | string;
  outstanding?: number | string;
  total_kontak?: number | string;
};

export type InsightItem =
  | string
  | {
      text?: string;
      confidence?: number;
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

/**
 * Per-feature contextualizer: replace generic terms (debit, kredit, cashflow)
 * dengan istilah domain-specific. Saat ini cuma m2_bd dan m2_sg yang punya
 * mapping unik — sisanya pakai default text apa adanya.
 */
export function contextualizeInsightText(
  text: string,
  feature: string,
): string {
  if (feature === 'm2_bd') {
    return text
      .replace(/total debit/gi, 'total nilai anggaran')
      .replace(/total kredit/gi, 'total realisasi anggaran')
      .replace(/net cashflow/gi, 'selisih anggaran')
      .replace(/cash in/gi, 'alokasi anggaran')
      .replace(/cash out/gi, 'realisasi anggaran')
      .replace(/arus kas agregat/gi, 'ringkasan alokasi vs realisasi')
      .replace(/outlier net cashflow/gi, 'outlier selisih anggaran');
  }
  if (feature === 'm2_sg') {
    return text
      .replace(/total debit/gi, 'total giro keluar')
      .replace(/total kredit/gi, 'total terbayar')
      .replace(/net cashflow/gi, 'outstanding giro')
      .replace(/cash in/gi, 'nilai giro keluar')
      .replace(/cash out/gi, 'nilai terbayar')
      .replace(/arus kas agregat/gi, 'ringkasan pembayaran giro')
      .replace(/outlier net cashflow/gi, 'outlier pembayaran giro');
  }
  return text;
}

export async function fetchRows<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = (await response
    .json()
    .catch(() => null)) as DashboardResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.message || `Request failed: ${response.status}`,
    );
  }
  return payload.data?.rows ?? [];
}
