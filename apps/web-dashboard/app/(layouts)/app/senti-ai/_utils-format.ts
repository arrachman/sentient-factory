import type React from 'react';
import type { AiModeKey, RunHistoryItem } from './_types';

export const APP_MODES_META = [
  { key: 'ask' as AiModeKey, title: 'Ask' },
  { key: 'transform' as AiModeKey, title: 'Transform' },
  { key: 'monitor' as AiModeKey, title: 'Monitor' },
] as const;

export const RUN_HISTORY_LIMIT = 12;

export function createManagerSessionKey() {
  if (typeof window === 'undefined') return `mgr-${Date.now()}`;
  return typeof window.crypto?.randomUUID === 'function' ? `mgr-${window.crypto.randomUUID()}` : `mgr-${Date.now()}`;
}

export function formatAttachmentSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function clampAttachmentName(value: string, limit = 35) {
  const normalized = value.trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit)}...`;
}

export function formatPromptPreview(prompt: string, maxLength = 160) {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

const APP_TIME_ZONE_FORMAT = 'Asia/Jakarta';

export function formatSessionRelativeTime(value?: string | null) {
  if (!value) return 'Belum ada update';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Waktu tidak valid';
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  const formatter = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });
  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, 'minute');
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, 'hour');
  return formatter.format(diffDays, 'day');
}

export function formatSessionAbsoluteTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID', { timeZone: APP_TIME_ZONE_FORMAT, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getHistorySessionStatusTone(status?: string | null) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300';
    case 'running':
    case 'queued':
    case 'started':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300';
    case 'failed':
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getHistorySessionModeLabel(mode: AiModeKey) {
  const matched = APP_MODES_META.find((item) => item.key === mode);
  return matched?.title ?? mode;
}

export function formatTableCellValue(value: string) {
  const normalized = value.trim();
  if (!normalized) return value;
  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) return value;
  const hasDecimal = normalized.includes('.');
  const fractionDigits = hasDecimal ? Math.min(2, (normalized.split('.')[1] || '').replace(/0+$/, '').length || 0) : 0;
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: fractionDigits, maximumFractionDigits: 2 }).format(numericValue);
}

export function appendYearRangeToTitle(title: string, values: Array<string | number>) {
  const years = Array.from(new Set(
    values.flatMap((value) => String(value).match(/\b(19|20)\d{2}\b/g) ?? [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .sort((left, right) => left - right),
  ));
  if (years.length === 0) return title;
  const yearLabel = years.length === 1 ? String(years[0]) : `${years[0]}-${years[years.length - 1]}`;
  return `${title} · ${yearLabel}`;
}

export function formatCompactNumber(value: number) {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}t`;
  if (absValue >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
  if (absValue >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (absValue >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return formatTableCellValue(String(value));
}

export function getChartLabelInitials(label: string) {
  const parts = label.split(/[\s._-]+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return 'NA';
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function formatColumnLabel(value: string) {
  return value.split('_').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
}

export function isNumericLikeValue(value: unknown) {
  if (value == null) return false;
  const normalized = String(value).trim().replaceAll(',', '');
  if (!normalized) return false;
  return Number.isFinite(Number(normalized));
}

export function isRightAlignedColumn(column: string, rows: Array<Record<string, string>>) {
  const normalized = column.toLowerCase();
  if (normalized.includes('total') || normalized.includes('amount') || normalized.includes('nominal') || normalized.includes('saldo') || normalized.includes('piutang') || normalized.includes('harga') || normalized.includes('revenue') || normalized.includes('qty') || normalized.includes('quantity') || normalized.includes('count') || normalized.includes('bulan') || normalized.includes('month') || normalized.includes('year')) {
    return true;
  }
  const populatedValues = rows.map((row) => row[column]).filter((value) => String(value ?? '').trim().length > 0);
  if (populatedValues.length === 0) return false;
  return populatedValues.every((value) => isNumericLikeValue(value));
}

export function isCodeLikeText(value: string) {
  const normalized = value.trim();
  if (!normalized) return false;
  return (
    normalized.startsWith('{') || normalized.startsWith('[') ||
    /\bselect\b|\bfrom\b|\bwhere\b|\bjoin\b|\border by\b/i.test(normalized) ||
    normalized.includes('=>') || normalized.includes('parsed.') || normalized.includes('query')
  );
}

export function upsertRunHistory(current: RunHistoryItem[], nextItem: RunHistoryItem) {
  return [
    nextItem,
    ...current.filter((item) => item.requestId !== nextItem.requestId && item.prompt !== nextItem.prompt),
  ]
    .sort((left, right) => Number(right.pinned) - Number(left.pinned))
    .slice(0, RUN_HISTORY_LIMIT);
}

export function normalizeCopiedText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function applyNormalizedClipboardCopy(event: React.ClipboardEvent<HTMLElement>, fallbackText: string) {
  const selectedText = window.getSelection?.()?.toString() ?? '';
  const normalizedText = normalizeCopiedText(selectedText || fallbackText);
  if (!normalizedText) return;
  event.preventDefault();
  event.clipboardData.setData('text/plain', normalizedText);
}

export function scoreNumericChartColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;
  if (normalized.includes('total')) score += 8;
  if (normalized.includes('amount')) score += 7;
  if (normalized.includes('value')) score += 7;
  if (normalized.includes('nominal')) score += 7;
  if (normalized.includes('piutang')) score += 9;
  if (normalized.includes('saldo')) score += 8;
  if (normalized.includes('qty')) score += 5;
  if (normalized.includes('count')) score += 4;
  if (normalized.includes('customer_id')) score -= 10;
  if (normalized.endsWith('_id')) score -= 8;
  if (normalized === 'id') score -= 10;
  return score;
}

export function scoreLabelChartColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;
  if (normalized.includes('name')) score += 8;
  if (normalized.includes('customer')) score += 7;
  if (normalized.includes('code')) score += 5;
  if (normalized.includes('label')) score += 6;
  if (normalized.includes('title')) score += 6;
  if (normalized.endsWith('_id')) score -= 8;
  if (normalized === 'id') score -= 10;
  return score;
}

export function limitChartEntries(labels: string[], values: number[], maxItems = 5) {
  const entries = labels
    .map((label, index) => ({ label, value: values[index] ?? 0 }))
    .filter((entry) => Number.isFinite(entry.value))
    .sort((left, right) => right.value - left.value);
  const primaryEntries = entries.slice(0, maxItems);
  const remainingEntries = entries.slice(maxItems);
  if (remainingEntries.length === 0) return primaryEntries;
  return [...primaryEntries, { label: 'Others', value: remainingEntries.reduce((sum, entry) => sum + entry.value, 0) }];
}
