import type { AiChatResult, SelectedStreamChart, SelectedStreamTable, WorkflowStreamPayload } from './_types';
import { appendYearRangeToTitle, formatColumnLabel, scoreNumericChartColumn, scoreLabelChartColumn } from './_utils-format';

export function extractAiResultFromWorkflowPayload(payload: string): AiChatResult | null {
  try {
    const parsed = JSON.parse(payload) as WorkflowStreamPayload;
    if (!parsed.data || typeof parsed.data !== 'object') return null;
    const candidate = parsed.data as Partial<AiChatResult>;
    if (typeof candidate.answer === 'string' && typeof candidate.model === 'string' && typeof candidate.provider === 'string') {
      return candidate as AiChatResult;
    }
    return null;
  } catch {
    return null;
  }
}

export function parseStreamDataTable(payload: string): SelectedStreamTable | null {
  try {
    const parsed = JSON.parse(payload) as { response?: unknown; data?: unknown };
    const source = parsed.response ?? parsed.data;

    if (Array.isArray(source)) {
      const isQueryExecutionArray = source.length > 0 && source.every((item) => !!item && typeof item === 'object' && 'query_id' in item && 'sql' in item && 'rows' in item);
      if (isQueryExecutionArray) return null;
      const normalizedRows = source.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
      const columns = Array.from(new Set(normalizedRows.flatMap((row) => Object.keys(row))));
      return {
        title: `Data result (${normalizedRows.length} items)`,
        columns,
        rows: normalizedRows.map((row) => Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))),
      };
    }

    if (source && typeof source === 'object') {
      const record = source as Record<string, unknown>;
      if (Array.isArray(record.query_results) && Array.isArray(record.visualizations)) return null;
      if (Array.isArray(record.rows)) {
        const normalizedRows = record.rows.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
        const columns = Array.isArray(record.columns) && record.columns.length > 0
          ? record.columns.map((column) => typeof column === 'string' ? column : column && typeof column === 'object' && 'name' in column ? String(column.name) : String(column))
          : Array.from(new Set(normalizedRows.flatMap((row) => Object.keys(row))));
        return {
          title: typeof record.title === 'string' ? record.title : `Data result (${normalizedRows.length} rows)`,
          columns,
          rows: normalizedRows.map((row) => Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))),
        };
      }
      const columns = Object.keys(record);
      return {
        title: typeof record.title === 'string' ? record.title : 'Data result',
        columns,
        rows: [Object.fromEntries(columns.map((column) => [column, String(record[column] ?? '-')]))],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function buildFallbackCountChart(table: SelectedStreamTable): SelectedStreamChart | null {
  const dateColumn = table.columns.find((column) => /tanggal|date/i.test(column)) ?? null;
  if (dateColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[dateColumn]?.trim();
      if (!label) return;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    if (counts.size > 1) {
      const entries = Array.from(counts.entries()).sort((left, right) => left[0].localeCompare(right[0])).slice(0, 8);
      return {
        title: appendYearRangeToTitle(`${table.title} by ${formatColumnLabel(dateColumn)}`, entries.map(([label]) => label)),
        labels: entries.map(([label]) => label),
        values: entries.map(([, value]) => value),
        valueLabel: 'Count',
      };
    }
  }

  const statusColumn = table.columns.find((column) => /status/i.test(column)) ?? null;
  if (statusColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[statusColumn]?.trim();
      if (!label) return;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    if (counts.size > 0) {
      const entries = Array.from(counts.entries()).slice(0, 8);
      return {
        title: appendYearRangeToTitle(`${table.title} by ${formatColumnLabel(statusColumn)}`, table.rows.flatMap((row) => Object.values(row))),
        labels: entries.map(([label]) => label),
        values: entries.map(([, value]) => value),
        valueLabel: 'Count',
      };
    }
  }

  return null;
}

export function parseStreamDataChart(payload: string): SelectedStreamChart | null {
  const table = parseStreamDataTable(payload);
  if (!table || table.rows.length === 0 || table.columns.length === 0) return null;

  const numericColumns = table.columns.filter((column) => table.rows.some((row) => Number.isFinite(Number(row[column]))));
  if (numericColumns.length === 0) return null;

  const valueColumn = [...numericColumns].sort((left, right) => scoreNumericChartColumn(right) - scoreNumericChartColumn(left))[0];
  const labelCandidates = table.columns.filter((column) => column !== valueColumn);
  const labelColumn = [...labelCandidates].sort((left, right) => scoreLabelChartColumn(right) - scoreLabelChartColumn(left))[0] ?? null;

  const rows = table.rows
    .map((row, index) => ({ label: labelColumn ? row[labelColumn] : `Row ${index + 1}`, value: Number(row[valueColumn]) }))
    .filter((item) => Number.isFinite(item.value))
    .slice(0, 8);

  if (rows.length === 0) return null;

  const hasMeaningfulNumericColumn = scoreNumericChartColumn(valueColumn) > 0;
  const hasNonZeroValue = rows.some((row) => row.value !== 0);
  const uniqueValues = new Set(rows.map((row) => row.value));

  if (!hasMeaningfulNumericColumn || !hasNonZeroValue || uniqueValues.size <= 1) {
    return buildFallbackCountChart(table);
  }

  return {
    title: appendYearRangeToTitle(table.title, rows.flatMap((row) => [row.label])),
    labels: rows.map((row) => row.label),
    values: rows.map((row) => row.value),
    valueLabel: formatColumnLabel(valueColumn),
  };
}
