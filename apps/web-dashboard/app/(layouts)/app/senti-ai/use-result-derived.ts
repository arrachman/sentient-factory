'use client';

import { useMemo } from 'react';
import type { AiChatResult, SelectedStreamChart, SelectedStreamTable } from './_types';
import {
  formatCompactNumber,
  getChartLabelInitials,
  isRightAlignedColumn,
  limitChartEntries,
} from './_utils-format';

const CHART_COLORS = ['#4f86f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export interface ResultDerivedState {
  queryResultColumns: NonNullable<NonNullable<AiChatResult['query_result']>['columns']>;
  queryResultRows: NonNullable<NonNullable<AiChatResult['query_result']>['rows']>;
  selectedTableRightAlignedColumns: Set<string>;
  queryResultRightAlignedColumns: Set<string>;
  managerChartData: { date: string; value: number }[];
  managerChartSeries: { key: string; label: string; color: string }[];
  managerChartStatusItems: { key: string; label: string; value: number; color: string }[];
  managerTopRows: { initials: string; name: string; code: string; amount: string }[];
}

export function useResultDerived(
  aiResult: AiChatResult | null,
  previewStreamChart: SelectedStreamChart | null,
  previewStreamTable: SelectedStreamTable | null,
): ResultDerivedState {
  const queryResultColumns = useMemo(() => aiResult?.query_result?.columns ?? [], [aiResult]);
  const queryResultRows = useMemo(() => aiResult?.query_result?.rows ?? [], [aiResult]);

  const normalizedQueryResultRows = useMemo(
    () =>
      queryResultRows.map((row) =>
        Object.fromEntries(
          queryResultColumns.map((column) => [column.name, String(row[column.name] ?? '')]),
        ) as Record<string, string>,
      ),
    [queryResultColumns, queryResultRows],
  );

  const selectedTableRightAlignedColumns = useMemo(
    () =>
      new Set(
        (previewStreamTable?.columns ?? []).filter((column) =>
          isRightAlignedColumn(column, previewStreamTable?.rows ?? []),
        ),
      ),
    [previewStreamTable],
  );

  const queryResultRightAlignedColumns = useMemo(
    () =>
      new Set(
        queryResultColumns
          .map((column) => column.name)
          .filter((column) => isRightAlignedColumn(column, normalizedQueryResultRows)),
      ),
    [normalizedQueryResultRows, queryResultColumns],
  );

  const limitedChartEntries = useMemo(
    () =>
      previewStreamChart
        ? limitChartEntries(previewStreamChart.labels, previewStreamChart.values, 5)
        : [],
    [previewStreamChart],
  );

  const managerChartData = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry) => ({ date: entry.label.slice(0, 10), value: entry.value }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );

  const managerChartSeries = useMemo(
    () =>
      previewStreamChart
        ? [{ key: 'value', label: previewStreamChart.valueLabel, color: '#4f86f7' }]
        : [],
    [previewStreamChart],
  );

  const managerChartStatusItems = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry, index) => ({
            key: `${entry.label}-${index}`,
            label: entry.label.slice(0, 14),
            value: Math.max(0, Math.round(entry.value)),
            color: CHART_COLORS[index % CHART_COLORS.length],
          }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );

  const managerTopRows = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry, index) => ({
            initials: getChartLabelInitials(entry.label),
            name: entry.label,
            code: `${entry.label}-${index}`,
            amount: formatCompactNumber(entry.value),
          }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );

  return {
    queryResultColumns,
    queryResultRows,
    selectedTableRightAlignedColumns,
    queryResultRightAlignedColumns,
    managerChartData,
    managerChartSeries,
    managerChartStatusItems,
    managerTopRows,
  };
}
