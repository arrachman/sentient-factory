export type InboundRow = {
  uuid: string;
  transactionNo: string;
  transactionDate: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  supplier?: {
    name?: string | null;
  } | null;
  _count?: {
    details?: number;
  };
  totalBatches?: number;
};

export type OutboundRow = {
  uuid: string;
  doNumber: string;
  doDate: string;
  status: 'DRAFT' | 'SHIPPED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';
  customer?: {
    name?: string | null;
  } | null;
  totalKg?: unknown;
  totalBatches?: number;
};

type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

export type ListResponse<T> = {
  success?: boolean;
  data?: T[];
  meta?: {
    total?: number;
  };
  message?: string;
};

export type PeriodFilter = 'today' | '7d' | '30d';

export const PERIOD_OPTIONS: Array<{ value: PeriodFilter; label: string }> = [
  { value: 'today', label: 'Hari Ini' },
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
];

function isDecimalLike(value: unknown): value is DecimalLike {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray((value as DecimalLike).d) &&
      typeof (value as DecimalLike).e === 'number',
  );
}

function decimalLikeToString(value: DecimalLike): string {
  const digits = Array.isArray(value.d) ? value.d.join('') : '';
  if (!digits) {
    return '0';
  }

  const sign = value.s === -1 ? '-' : '';
  const exponent = typeof value.e === 'number' ? value.e : digits.length - 1;
  const decimalPos = exponent + 1;

  if (decimalPos <= 0) {
    return `${sign}0.${'0'.repeat(Math.abs(decimalPos))}${digits}`.replace(/\.?0+$/, '') || '0';
  }
  if (decimalPos >= digits.length) {
    return `${sign}${digits}${'0'.repeat(decimalPos - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`.replace(/\.?0+$/, '') || '0';
}

export function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (isDecimalLike(value)) {
    const parsed = Number(decimalLikeToString(value));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
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

export function fmtKg(value: unknown) {
  return normalizeNumber(value).toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

function toDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function resolvePeriodRange(period: PeriodFilter) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const from = new Date(to);
  if (period === 'today') {
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

export function outboundBadgeVariant(status?: OutboundRow['status']) {
  if (status === 'CLOSED' || status === 'RECEIVED') {
    return 'success';
  }
  if (status === 'CANCELLED') {
    return 'destructive';
  }
  if (status === 'SHIPPED') {
    return 'info';
  }
  return 'secondary';
}
