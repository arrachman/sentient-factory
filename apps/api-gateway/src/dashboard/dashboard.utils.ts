/**
 * dashboard.utils.ts
 * Pure helper functions shared across dashboard services.
 * No class, no dependencies — import freely.
 */

export function escapeSqlLiteral(value: string): string {
  return value.replaceAll("'", "''");
}

export function asJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (typeof value === 'object') {
    return value as T;
  }
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
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

export function formatNumber(value: number): string {
  return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

export function formatMoneyCompact(value: number): string {
  return `Rp ${value.toLocaleString('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
}

export function toAuditUserId(actorId?: string | number): number | null {
  if (typeof actorId === 'number' && Number.isInteger(actorId) && actorId > 0) {
    return actorId;
  }
  const parsed = Number(String(actorId ?? '').trim());
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return null;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
