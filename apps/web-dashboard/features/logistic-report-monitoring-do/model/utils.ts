import type { DecimalLike } from '@/features/logistic-report-monitoring-do/model/types';

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
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function toDateOrNull(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function fmtExcelDate(value?: string | Date | null) {
  const date = toDateOrNull(value);
  if (!date) {
    return '';
  }

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export function addDaysFromDate(value?: string | null, days?: number) {
  const date = toDateOrNull(value);
  if (!date) {
    return null;
  }

  const safeDays = Number.isFinite(days) ? Number(days) : 0;
  const next = new Date(date);
  next.setDate(next.getDate() + safeDays);
  return next;
}

function normalizeDateOnly(value?: string | Date | null) {
  const date = toDateOrNull(value);
  if (!date) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function computeKpiStatus(actualDate?: string | Date | null, standardDate?: string | Date | null) {
  const actual = normalizeDateOnly(actualDate);
  const standard = normalizeDateOnly(standardDate);
  if (!actual || !standard) {
    return '';
  }
  return actual.getTime() <= standard.getTime() ? 'ONTIME' : 'LATE';
}

export function outboundStatusBadgeVariant(status?: string | null) {
  if (status === 'OPEN') {
    return 'warning';
  }
  if (status === 'DELIVERY') {
    return 'info';
  }
  if (status === 'DELIVERED') {
    return 'primary';
  }
  if (status === 'COMPLETED') {
    return 'success';
  }
  return 'secondary';
}

function isDecimalLike(value: unknown): value is DecimalLike {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as DecimalLike;
  return Array.isArray(candidate.d);
}

function decimalLikeToString(value: DecimalLike): string {
  const sign = value.s === -1 ? '-' : '';
  const exponent = Number.isFinite(value.e) ? Number(value.e) : 0;
  const chunks = Array.isArray(value.d) ? value.d : [];

  if (chunks.length === 0) {
    return '0';
  }

  const digits =
    chunks
      .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
      .join('')
      .replace(/^0+/, '') || '0';

  const decimalPos = exponent + 1;
  let normalized = '';

  if (decimalPos <= 0) {
    normalized = `0.${'0'.repeat(Math.abs(decimalPos))}${digits}`;
  } else if (decimalPos >= digits.length) {
    normalized = `${digits}${'0'.repeat(decimalPos - digits.length)}`;
  } else {
    normalized = `${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`;
  }

  if (normalized.includes('.')) {
    normalized = normalized.replace(/\.?0+$/, '');
  }

  return `${sign}${normalized || '0'}`;
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

export function fmtNumber(value?: unknown) {
  return normalizeNumber(value).toLocaleString('id-ID');
}

export function toEntityId(value: unknown) {
  if (value == null) {
    return '';
  }
  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }
  return id;
}

export function pickIdFromUnknown(entity: unknown, extraKeys: string[] = []) {
  if (!entity || typeof entity !== 'object') {
    return '';
  }

  const source = entity as Record<string, unknown>;
  const keys = ['id', 'uuid', ...extraKeys];
  for (const key of keys) {
    const value = source[key];
    const normalized = toEntityId(value);
    if (normalized) {
      return normalized;
    }
  }

  return '';
}

export function extractRoleNames(values: unknown[]): string[] {
  return values
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }
      if (!item || typeof item !== 'object') {
        return '';
      }

      const source = item as Record<string, unknown>;
      const rawName = source.name ?? source.roleName ?? source.label ?? '';
      return typeof rawName === 'string' ? rawName.trim() : '';
    })
    .filter(Boolean);
}

export function downloadBufferAsXlsx(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
