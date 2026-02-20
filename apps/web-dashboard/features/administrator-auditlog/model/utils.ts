import type { AuditLogItem } from '@/features/administrator-auditlog/model/types';

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

export function pickAuditLogId(item?: AuditLogItem | null): string {
  return toEntityId(item?.id ?? item?.uuid);
}

export function formatDate(value?: string): string {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString();
}

export function stringifyJson(value: unknown): string {
  if (value == null) {
    return '';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}
