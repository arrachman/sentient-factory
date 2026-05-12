import type { ChartDatum, ChartType, NormalizedBarDatum, ScatterVisualDatum } from '../_types';

export const CHART_COLORS = ['#2563eb', '#0f766e', '#ea580c', '#7c3aed', '#dc2626', '#0891b2'];

export function normalizeChartType(chartType: string): ChartType {
  if (chartType === 'vertical_bar') return 'vertical_bar';
  if (chartType === 'horizontal_bar') return 'horizontal_bar';
  if (chartType === 'line') return 'line';
  if (chartType === 'area') return 'area';
  if (chartType === 'pie') return 'pie';
  if (chartType === 'donut') return 'donut';
  if (chartType === 'scatter') return 'scatter';
  return 'bar';
}

export function resolveChartDataLimit(chartType: ChartType, configuredLimit?: number | null) {
  const safeConfiguredLimit =
    typeof configuredLimit === 'number' && Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.floor(configuredLimit)
      : chartType === 'pie' || chartType === 'donut'
        ? 6
        : chartType === 'line' || chartType === 'area'
          ? 12
          : chartType === 'scatter'
            ? 24
          : 20;

  if (chartType === 'pie' || chartType === 'donut') {
    return Math.min(safeConfiguredLimit, 6);
  }

  if (chartType === 'line' || chartType === 'area') {
    return Math.min(safeConfiguredLimit, 12);
  }

  if (chartType === 'scatter') {
    return Math.min(safeConfiguredLimit, 24);
  }

  return Math.min(safeConfiguredLimit, 20);
}

export function resolveInitialChartDataLimit(chartType: ChartType, configuredLimit?: number | null) {
  const maxLimit = resolveChartDataLimit(chartType, null);
  if (typeof configuredLimit === 'number' && Number.isFinite(configuredLimit) && configuredLimit > 0) {
    return Math.min(Math.floor(configuredLimit), maxLimit);
  }
  return maxLimit;
}

export function limitChartData(data: ChartDatum[], chartType: ChartType, configuredLimit: number) {
  if (!data.length) return data;

  if (chartType === 'line' || chartType === 'area') {
    return data.slice(0, configuredLimit);
  }

  return [...data]
    .sort((left, right) => right.value - left.value)
    .slice(0, configuredLimit);
}

export function buildNormalizedBarData(data: ChartDatum[]): NormalizedBarDatum[] {
  if (!data.length) return [];

  const maxValue = Math.max(...data.map((item) => item.value), 0);
  if (maxValue <= 0) {
    return data.map((item) => ({
      label: item.label,
      originalValue: item.value,
      normalizedValue: 0,
    }));
  }

  return data.map((item) => ({
    label: item.label,
    originalValue: item.value,
    normalizedValue: Number(((item.value / maxValue) * 100).toFixed(1)),
  }));
}

export function buildScatterVisualData(data: ChartDatum[]): ScatterVisualDatum[] {
  if (!data.length) return [];

  const sortedValues = data
    .map((item) => item.value)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  const maxValue = Math.max(...sortedValues, 1);

  return data.map((item) => {
    const normalized = maxValue > 0 ? item.value / maxValue : 0;
    const percentile = computeScatterPercentile(sortedValues, item.value);
    const { color, level } = getScatterLevel(percentile);

    return {
      ...item,
      bubbleSize: Number((normalized * 100).toFixed(1)),
      scatterColor: color,
      scatterLevel: level,
    };
  });
}

export function computeScatterPercentile(sortedValues: number[], value: number) {
  if (!sortedValues.length) return 0;

  const index = sortedValues.findIndex((entry) => value <= entry);
  if (index === -1) return 1;

  return sortedValues.length === 1 ? 1 : index / (sortedValues.length - 1);
}

export function getScatterLevel(percentile: number) {
  if (percentile >= 0.9) return { color: '#c23531', level: 'Critical' };
  if (percentile >= 0.72) return { color: '#f97316', level: 'High' };
  if (percentile >= 0.48) return { color: '#facc15', level: 'Elevated' };
  if (percentile >= 0.24) return { color: '#34d399', level: 'Normal' };
  return { color: '#60a5fa', level: 'Low' };
}

export function buildChartData(
  columns: string[],
  rows: Array<Record<string, unknown>>,
): ChartDatum[] | null {
  if (columns.length < 2 || rows.length === 0) return null;

  const valueColumn = pickValueColumn(columns, rows);
  const labelColumn = pickLabelColumn(columns, valueColumn);

  if (!valueColumn || !labelColumn) return null;

  const scatterXColumn = pickSecondaryNumericColumn(columns, rows, valueColumn);
  if (scatterXColumn) {
    const scatterData = rows
      .map((row) => {
        const x = toNumber(row[scatterXColumn]);
        const y = toNumber(row[valueColumn]);
        if (x === null || y === null) return null;
        return {
          label: String(row[labelColumn] ?? '-'),
          value: y,
          x,
          y,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (scatterData.length) return scatterData;
  }

  const data = rows
    .map((row) => {
      const value = toNumber(row[valueColumn]);
      if (value === null) return null;
      return {
        label: String(row[labelColumn] ?? '-'),
        value,
      };
    })
    .filter((entry): entry is ChartDatum => Boolean(entry));

  return data.length ? data : null;
}

export function pickValueColumn(columns: string[], rows: Array<Record<string, unknown>>) {
  const rankedColumns = columns
    .map((column) => ({
      column,
      score: scoreNumericColumn(column),
      numericCount: rows.filter((row) => toNumber(row[column]) !== null).length,
    }))
    .filter((entry) => entry.numericCount > 0)
    .sort((left, right) => right.score - left.score || right.numericCount - left.numericCount);

  return rankedColumns[0]?.column ?? null;
}

export function pickLabelColumn(columns: string[], valueColumn: string | null) {
  const candidates = columns.filter((column) => column !== valueColumn);
  const rankedColumns = candidates
    .map((column) => ({
      column,
      score: scoreLabelColumn(column),
    }))
    .sort((left, right) => right.score - left.score);

  return rankedColumns[0]?.column ?? candidates[0] ?? null;
}

export function pickSecondaryNumericColumn(
  columns: string[],
  rows: Array<Record<string, unknown>>,
  valueColumn: string | null,
) {
  const candidates = columns.filter((column) => column !== valueColumn);
  const rankedColumns = candidates
    .map((column) => ({
      column,
      score: scoreNumericColumn(column),
      numericCount: rows.filter((row) => toNumber(row[column]) !== null).length,
    }))
    .filter((entry) => entry.numericCount > 0)
    .sort((left, right) => right.score - left.score || right.numericCount - left.numericCount);

  return rankedColumns[0]?.column ?? null;
}

export function scoreNumericColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;

  if (normalized.includes('total')) score += 10;
  if (normalized.includes('amount')) score += 9;
  if (normalized.includes('value')) score += 8;
  if (normalized.includes('nominal')) score += 8;
  if (normalized.includes('saldo')) score += 8;
  if (normalized.includes('qty')) score += 7;
  if (normalized.includes('count')) score += 6;
  if (normalized.endsWith('_id')) score -= 10;
  if (normalized === 'id') score -= 12;

  return score;
}

export function scoreLabelColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;

  if (normalized.includes('name')) score += 10;
  if (normalized.includes('label')) score += 9;
  if (normalized.includes('title')) score += 8;
  if (normalized.includes('code')) score += 6;
  if (normalized.includes('month')) score += 6;
  if (normalized.includes('date')) score += 5;
  if (normalized.endsWith('_id')) score -= 10;
  if (normalized === 'id') score -= 12;

  return score;
}

export function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const normalized = value.replaceAll(',', '').trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function formatChartNumber(value: number) {
  if (!Number.isFinite(value)) return '-';

  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}

export function truncateChartLabel(value: string, maxLength = 18) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

export function formatDonutTotal(value: number) {
  if (!Number.isFinite(value)) return '-';

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}
