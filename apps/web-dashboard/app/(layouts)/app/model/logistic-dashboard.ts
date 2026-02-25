export type PeriodFilter = 'today' | '7d' | '30d' | 'all';
export type DashboardDomain = 'm1' | 'm' | 'm2r' | 'so';

export const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
  { value: 'all', label: 'Semua Data' },
  { value: 'today', label: 'Hari Ini' },
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
];

export type SummaryRow = {
  total_rows?: number | string;
  total_metric?: number | string;
  avg_metric?: number | string;
  min_metric?: number | string;
  max_metric?: number | string;
};

export type TrendRow = {
  period_date?: string;
  total_rows?: number | string;
  total_metric?: number | string;
};

export type BreakdownRow = {
  group_key?: string;
  total_rows?: number | string;
  total_metric?: number | string;
};

export type MetadataResponse = {
  effective?: {
    groupBy?: string[];
    sortBy?: string[];
  };
};

export type DomainsResponse = {
  success?: boolean;
  data?: Array<{
    domain?: DashboardDomain;
  }>;
};

export type DashboardResponse<T> = {
  success?: boolean;
  data?: {
    rows?: T[];
  };
  message?: string;
};

function toDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function resolvePeriodRange(period: PeriodFilter) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const from = new Date(to);
  if (period === 'all') {
    from.setFullYear(2000, 0, 1);
    from.setHours(0, 0, 0, 0);
  } else if (period === 'today') {
    from.setHours(0, 0, 0, 0);
  } else if (period === '7d') {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  } else {
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  }

  return {
    from: toDateOnly(from),
    to: toDateOnly(to),
  };
}

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

export function fmtNumber(value: unknown, maximumFractionDigits = 2) {
  return toNumber(value).toLocaleString('id-ID', { maximumFractionDigits });
}

export function fmtCompactNumber(value: unknown, maximumFractionDigits = 1) {
  return toNumber(value).toLocaleString('id-ID', {
    notation: 'compact',
    maximumFractionDigits,
  });
}

export function fmtDate(value?: string | null) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
