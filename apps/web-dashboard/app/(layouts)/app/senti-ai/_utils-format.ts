// Pure JS/TS formatting utilities — no React, no JSX.
// Extracted from page.tsx to keep each file under 400 lines.

import type { AiModeKey, RunHistoryItem } from './_types';

// ---------------------------------------------------------------------------
// Constants re-used by format utilities
// ---------------------------------------------------------------------------

export const APP_MODES_META = [
  { key: 'ask' as AiModeKey, title: 'Ask' },
  { key: 'transform' as AiModeKey, title: 'Transform' },
  { key: 'monitor' as AiModeKey, title: 'Monitor' },
] as const;

export const RUN_HISTORY_LIMIT = 12;

const modeSignals: Record<AiModeKey, Array<{ term: string; weight: number }>> = {
  ask: [
    { term: 'apa', weight: 1 },
    { term: 'berapa', weight: 2 },
    { term: 'mana', weight: 2 },
    { term: 'analisis', weight: 2 },
    { term: 'ringkas', weight: 2 },
    { term: 'jelaskan', weight: 3 },
    { term: 'rasio', weight: 4 },
    { term: 'opex', weight: 5 },
    { term: 'revenue', weight: 4 },
    { term: 'pendapatan', weight: 3 },
    { term: 'quarter', weight: 2 },
    { term: 'kuartal', weight: 2 },
  ],
  transform: [
    { term: 'dashboard', weight: 5 },
    { term: 'grafik', weight: 3 },
    { term: 'chart', weight: 3 },
    { term: 'visual', weight: 3 },
    { term: 'arr', weight: 5 },
    { term: 'gross new', weight: 4 },
    { term: 'expansion', weight: 4 },
    { term: 'contraction', weight: 4 },
    { term: 'churn', weight: 4 },
    { term: 'actual vs plan', weight: 5 },
    { term: 'drill-down', weight: 3 },
    { term: 'publish', weight: 2 },
  ],
  monitor: [
    { term: 'risiko', weight: 4 },
    { term: 'alert', weight: 4 },
    { term: 'monitor', weight: 4 },
    { term: 'prioritas', weight: 3 },
    { term: 'warning', weight: 3 },
    { term: 'urgent', weight: 3 },
    { term: 'prediksi', weight: 4 },
    { term: 'prediktif', weight: 4 },
    { term: 'pantau', weight: 3 },
    { term: 'churn', weight: 4 },
    { term: 'losses', weight: 4 },
    { term: 'loss', weight: 3 },
    { term: 'variance', weight: 3 },
  ],
};

// ---------------------------------------------------------------------------
// Session key
// ---------------------------------------------------------------------------

export function createManagerSessionKey() {
  if (typeof window === 'undefined') {
    return `mgr-${Date.now()}`;
  }

  return typeof window.crypto?.randomUUID === 'function'
    ? `mgr-${window.crypto.randomUUID()}`
    : `mgr-${Date.now()}`;
}

// ---------------------------------------------------------------------------
// Attachment formatting
// ---------------------------------------------------------------------------

export function formatAttachmentSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function clampAttachmentName(value: string, limit = 35) {
  const normalized = value.trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit)}...`;
}

// ---------------------------------------------------------------------------
// Prompt utilities
// ---------------------------------------------------------------------------

export function normalizePrompt(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectMode(prompt: string): { mode: AiModeKey; confidence: number; reasons: string[] } {
  const normalized = normalizePrompt(prompt);
  const baseScores: Record<AiModeKey, number> = {
    ask: prompt.trim().endsWith('?') ? 1 : 0,
    transform: 0,
    monitor: 0,
  };
  const reasons: Record<AiModeKey, string[]> = {
    ask: [],
    transform: [],
    monitor: [],
  };

  (Object.keys(modeSignals) as AiModeKey[]).forEach((mode) => {
    modeSignals[mode].forEach((signal) => {
      if (normalized.includes(signal.term)) {
        baseScores[mode] += signal.weight;
        reasons[mode].push(signal.term);
      }
    });
  });

  if (normalized.includes('arr') && (normalized.includes('components') || normalized.includes('actual vs plan'))) {
    baseScores.transform += 5;
    reasons.transform.push('arr+components/plan');
  }

  if (normalized.includes('opex') && normalized.includes('revenue')) {
    baseScores.ask += 4;
    reasons.ask.push('opex+revenue');
  }

  if (normalized.includes('buat') && normalized.includes('dashboard')) {
    baseScores.transform += 4;
    reasons.transform.push('buat+dashboard');
  }

  if ((normalized.includes('risiko') || normalized.includes('alert')) && (normalized.includes('churn') || normalized.includes('variance'))) {
    baseScores.monitor += 3;
    reasons.monitor.push('risiko/alert+finance');
  }

  const ranking = (Object.entries(baseScores) as Array<[AiModeKey, number]>).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    const tieBreaker: Record<AiModeKey, number> = {
      monitor: 3,
      transform: 2,
      ask: 1,
    };

    return tieBreaker[right[0]] - tieBreaker[left[0]];
  });

  const [winner, winnerScore] = ranking[0];
  const runnerUpScore = ranking[1]?.[1] ?? 0;
  const totalScore = Math.max(winnerScore + runnerUpScore, 1);

  return {
    mode: winner,
    confidence: Math.min(0.98, Math.max(0.55, winnerScore / totalScore)),
    reasons: reasons[winner].slice(0, 3),
  };
}

export function detectSchemaKey(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  const domainSignals: Array<{ key: string; terms: string[] }> = [
    {
      key: 'finance',
      terms: [
        'kas',
        'bank',
        'payment',
        'receipt',
        'piutang',
        'hutang',
        'coa',
        'jurnal',
        'giro',
        'cash',
        'finance',
        'outstanding invoice',
        'aging',
      ],
    },
    {
      key: 'sales',
      terms: [
        'sales',
        'penjualan',
        'customer',
        'invoice',
        'so',
        'sales order',
        'quotation',
        'delivery',
        'retur',
        'voucher',
      ],
    },
    {
      key: 'purchase',
      terms: [
        'purchase',
        'pembelian',
        'supplier',
        'vendor',
        'po',
        'grn',
        'receipt invoice',
        'ap',
      ],
    },
    {
      key: 'inventory',
      terms: [
        'inventory',
        'stok',
        'stock',
        'gudang',
        'warehouse',
        'mutasi',
        'movement',
        'adjustment',
        'item',
      ],
    },
  ];

  const scored = domainSignals
    .map((domain) => ({
      key: domain.key,
      score: domain.terms.reduce(
        (total, term) => total + (normalized.includes(term) ? 1 : 0),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score);

  const winner = scored[0];
  if (!winner || winner.score <= 0) {
    return 'all';
  }

  const matchedDomains = scored.filter((item) => item.score > 0);
  if (matchedDomains.length >= 2) {
    return 'all';
  }

  const runnerUp = scored[1];
  if (runnerUp && runnerUp.score === winner.score && winner.score > 0) {
    return 'all';
  }

  return winner.key;
}

export function formatPromptPreview(prompt: string, maxLength = 160) {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

// ---------------------------------------------------------------------------
// Session time formatting
// ---------------------------------------------------------------------------

const APP_TIME_ZONE_FORMAT = 'Asia/Jakarta';

export function formatSessionRelativeTime(value?: string | null) {
  if (!value) {
    return 'Belum ada update';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Waktu tidak valid';
  }

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  const formatter = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }
  return formatter.format(diffDays, 'day');
}

export function formatSessionAbsoluteTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('id-ID', {
    timeZone: APP_TIME_ZONE_FORMAT,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Session status / mode labels
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Table / chart formatting
// ---------------------------------------------------------------------------

export function formatTableCellValue(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return value;
  }

  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  const hasDecimal = normalized.includes('.');
  const fractionDigits = hasDecimal
    ? Math.min(2, (normalized.split('.')[1] || '').replace(/0+$/, '').length || 0)
    : 0;

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function appendYearRangeToTitle(title: string, values: Array<string | number>) {
  const years = Array.from(
    new Set(
      values
        .flatMap((value) => String(value).match(/\b(19|20)\d{2}\b/g) ?? [])
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right),
    ),
  );

  if (years.length === 0) {
    return title;
  }

  const yearLabel =
    years.length === 1 ? String(years[0]) : `${years[0]}-${years[years.length - 1]}`;

  return `${title} · ${yearLabel}`;
}

export function formatCompactNumber(value: number) {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}t`;
  }
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
  }
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return formatTableCellValue(String(value));
}

export function getChartLabelInitials(label: string) {
  const parts = label
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'NA';
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function formatColumnLabel(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function isNumericLikeValue(value: unknown) {
  if (value == null) {
    return false;
  }

  const normalized = String(value).trim().replaceAll(',', '');
  if (!normalized) {
    return false;
  }

  return Number.isFinite(Number(normalized));
}

export function isRightAlignedColumn(column: string, rows: Array<Record<string, string>>) {
  const normalized = column.toLowerCase();

  if (
    normalized.includes('total') ||
    normalized.includes('amount') ||
    normalized.includes('nominal') ||
    normalized.includes('saldo') ||
    normalized.includes('piutang') ||
    normalized.includes('harga') ||
    normalized.includes('revenue') ||
    normalized.includes('qty') ||
    normalized.includes('quantity') ||
    normalized.includes('count') ||
    normalized.includes('bulan') ||
    normalized.includes('month') ||
    normalized.includes('year')
  ) {
    return true;
  }

  const populatedValues = rows
    .map((row) => row[column])
    .filter((value) => String(value ?? '').trim().length > 0);

  if (populatedValues.length === 0) {
    return false;
  }

  return populatedValues.every((value) => isNumericLikeValue(value));
}

export function isCodeLikeText(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  return (
    normalized.startsWith('{') ||
    normalized.startsWith('[') ||
    /\bselect\b|\bfrom\b|\bwhere\b|\bjoin\b|\border by\b/i.test(normalized) ||
    normalized.includes('=>') ||
    normalized.includes('parsed.') ||
    normalized.includes('query')
  );
}

// ---------------------------------------------------------------------------
// Run history
// ---------------------------------------------------------------------------

export function upsertRunHistory(
  current: RunHistoryItem[],
  nextItem: RunHistoryItem,
) {
  return [
    nextItem,
    ...current.filter((item) => item.requestId !== nextItem.requestId && item.prompt !== nextItem.prompt),
  ]
    .sort((left, right) => Number(right.pinned) - Number(left.pinned))
    .slice(0, RUN_HISTORY_LIMIT);
}

// ---------------------------------------------------------------------------
// Clipboard copy helpers
// ---------------------------------------------------------------------------

export function normalizeCopiedText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function applyNormalizedClipboardCopy(
  event: React.ClipboardEvent<HTMLElement>,
  fallbackText: string,
) {
  const selectedText = window.getSelection?.()?.toString() ?? '';
  const normalizedText = normalizeCopiedText(selectedText || fallbackText);
  if (!normalizedText) {
    return;
  }
  event.preventDefault();
  event.clipboardData.setData('text/plain', normalizedText);
}

// ---------------------------------------------------------------------------
// Chart column scoring
// ---------------------------------------------------------------------------

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
    .map((label, index) => ({
      label,
      value: values[index] ?? 0,
    }))
    .filter((entry) => Number.isFinite(entry.value))
    .sort((left, right) => right.value - left.value);

  const primaryEntries = entries.slice(0, maxItems);
  const remainingEntries = entries.slice(maxItems);

  if (remainingEntries.length === 0) {
    return primaryEntries;
  }

  return [
    ...primaryEntries,
    {
      label: 'Others',
      value: remainingEntries.reduce((sum, entry) => sum + entry.value, 0),
    },
  ];
}
