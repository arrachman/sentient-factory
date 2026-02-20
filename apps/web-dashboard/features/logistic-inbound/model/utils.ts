import {
  type DecimalLike,
  type InboundBatchForm,
  type InboundDetailApi,
  type InboundDetailForm,
  type InboundForm,
  type InboundListItem,
} from '@/features/logistic-inbound/model/types';
import { buildEntityRef, parseEntityRef } from '@/shared/utils/entity-ref';

function toInputDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultExpiredDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return toInputDate(date);
}

export const initialBatch = (): InboundBatchForm => ({
  batchIn: '',
  qty: '',
  expiredDate: getDefaultExpiredDate(),
  notes: '',
});

export const initialDetail = (): InboundDetailForm => ({
  itemId: '',
  uomInput: '',
  notes: '',
  batches: [initialBatch()],
});

export const initialForm: InboundForm = {
  transactionNo: '',
  transactionDate: '',
  supplierId: '',
  warehouseId: '',
  status: 'POSTED',
  notes: '',
  details: [],
};

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

export function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null) {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export function pickInboundId(item?: InboundListItem | null) {
  return toEntityId(item?.id ?? item?.uuid);
}

export function buildInboundRef(id: string, createdAt?: string | null) {
  return buildEntityRef(id, createdAt);
}

export function parseInboundRef(ref: string) {
  return parseEntityRef(ref);
}

export function toNumberInputValue(value: unknown) {
  if (value == null) {
    return '';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (isDecimalLike(value)) {
    return decimalLikeToString(value);
  }

  return '';
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

function readObjectValueByKeys(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (value != null) {
      return value;
    }
  }
  return undefined;
}

function readFirstValueByMatcher(source: Record<string, unknown>, matcher: (key: string) => boolean) {
  const matchedKey = Object.keys(source).find(matcher);
  return matchedKey ? source[matchedKey] : undefined;
}

function toRecord(value: unknown) {
  if (!value || typeof value !== 'object') {
    return {} as Record<string, unknown>;
  }
  return value as Record<string, unknown>;
}

function resolveBatchesFromDetail(detail: InboundDetailApi) {
  const detailRecord = toRecord(detail);
  const detailBatches = detailRecord.batches;
  if (!Array.isArray(detailBatches)) {
    return [];
  }

  return detailBatches.map((batch) => {
    const batchRecord = toRecord(batch);
    const batchInRaw =
      readObjectValueByKeys(batchRecord, ['batchIn', 'batchNumber', 'batchNo', 'batchOut']) ?? '';

    const qtyRaw =
      readObjectValueByKeys(batchRecord, ['qty', 'qtyPcs', 'qty_pcs', 'quantity', 'quantityPcs']) ?? '';

    const expiredRaw =
      readObjectValueByKeys(batchRecord, ['expiredDate', 'expiryDate', 'expired_date']) ?? '';

    const notesRaw = readObjectValueByKeys(batchRecord, ['notes', 'note']) ?? '';

    return {
      batchIn: String(batchInRaw || '').trim(),
      qty: toNumberInputValue(qtyRaw),
      expiredDate: String(expiredRaw || '').trim(),
      notes: String(notesRaw || '').trim(),
    };
  });
}

export function mapDetailFromApi(details?: InboundDetailApi[]): InboundDetailForm[] {
  if (!Array.isArray(details)) {
    return [];
  }

  return details.map((detail) => {
    const detailRecord = toRecord(detail);
    const itemIdRaw = readObjectValueByKeys(detailRecord, ['itemId', 'itemUuid', 'item_id']) ?? '';
    const uomInputRaw =
      readObjectValueByKeys(detailRecord, ['uomInput', 'qty', 'qtyPcs']) ??
      readFirstValueByMatcher(detailRecord, (key) => /uom|qty/i.test(key)) ??
      '';
    const notesRaw = readObjectValueByKeys(detailRecord, ['notes']) ?? '';

    const mappedBatches = resolveBatchesFromDetail(detail).filter(
      (batch) => batch.batchIn || batch.qty || batch.expiredDate || batch.notes,
    );

    return {
      itemId: toEntityId(itemIdRaw),
      uomInput: toNumberInputValue(uomInputRaw),
      notes: String(notesRaw || '').trim(),
      batches: mappedBatches.length > 0 ? mappedBatches : [initialBatch()],
    };
  });
}
