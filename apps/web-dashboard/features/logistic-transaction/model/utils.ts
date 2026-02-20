import { buildEntityRef, parseEntityRef } from '@/shared/utils/entity-ref';
import type { ApiDetailPayload, DecimalLike, DeliveryOrderDetailForm, DeliveryOrderStatus } from '@/features/logistic-transaction/model/types';

export { buildEntityRef, parseEntityRef };

export function fmtDate(value?: string | null): string {
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

export function addDays(dateString?: string, days?: string): string {
  if (!dateString) {
    return '-';
  }

  const date = new Date(dateString);
  const dayCount = Number(days || 0);
  if (Number.isNaN(date.getTime()) || Number.isNaN(dayCount)) {
    return '-';
  }

  date.setDate(date.getDate() + dayCount);
  return fmtDate(date.toISOString());
}

export function calculateStandardReceivedDate(dateString?: string, days?: number): string {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const dayCount = Number(days ?? 0);
  if (!Number.isFinite(dayCount)) {
    return '';
  }

  date.setDate(date.getDate() + dayCount);
  return date.toISOString().slice(0, 10);
}

export function resolveDeliveryKpiStatus(actualReceivedDate?: string, standardReceivedDate?: string): string {
  if (!actualReceivedDate || !standardReceivedDate) {
    return '-';
  }

  const actual = new Date(actualReceivedDate);
  const standard = new Date(standardReceivedDate);
  if (Number.isNaN(actual.getTime()) || Number.isNaN(standard.getTime())) {
    return '-';
  }

  return actual.getTime() <= standard.getTime() ? 'ONTIME' : 'LATE';
}

export function outboundStatusBadgeVariant(status?: DeliveryOrderStatus):
  | 'warning'
  | 'info'
  | 'primary'
  | 'success'
  | 'secondary' {
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

  normalized = normalized.replace(/\.?0+$/, '');
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

export function toEntityId(value: unknown): string {
  if (value == null) {
    return '';
  }

  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }

  return id;
}

export function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null): string {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export function mapApiDetails(details: ApiDetailPayload[]): DeliveryOrderDetailForm[] {
  if (!Array.isArray(details) || details.length === 0) {
    return [];
  }

  return details.map((detail) => ({
    itemId: toEntityId(detail.itemId ?? detail.item?.id ?? detail.item?.uuid),
    batchNumbers: detail.batchNumber ? [String(detail.batchNumber)] : [],
    batchQtyMap: detail.batchNumber
      ? {
          [String(detail.batchNumber)]: detail.qtyPcs != null ? String(detail.qtyPcs) : '0',
        }
      : {},
    qtyKg: detail.qtyKg != null ? String(detail.qtyKg) : '',
    notes: String(detail.notes ?? ''),
  }));
}
