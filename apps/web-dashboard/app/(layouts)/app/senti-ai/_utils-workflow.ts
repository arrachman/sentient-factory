// Workflow and stream processing utilities — no React, no JSX.
// Extracted from page.tsx to keep each file under 400 lines.

import type {
  AiChatResult,
  SelectedStreamChart,
  SelectedStreamTable,
  WorkflowEventName,
  WorkflowStep,
  WorkflowStreamDisplayPayload,
  WorkflowStreamEntry,
  WorkflowStreamPayload,
} from './_types';
import {
  appendYearRangeToTitle,
  formatColumnLabel,
  scoreNumericChartColumn,
  scoreLabelChartColumn,
} from './_utils-format';

export const APP_TIME_ZONE = 'Asia/Jakarta';

// ---------------------------------------------------------------------------
// Workflow step builders
// ---------------------------------------------------------------------------

export function buildWorkflowSteps(activeIndex: number): WorkflowStep[] {
  const steps = [
    {
      key: 'schema',
      title: 'Schema Routing',
      detail: 'Memilih semantic schema yang paling relevan untuk pertanyaan manager.',
    },
    {
      key: 'analysis',
      title: 'Analysis',
      detail: 'Mengurai intent bisnis, tabel inti, join, filter, dan potensi ambigu.',
    },
    {
      key: 'draft',
      title: 'Draft Answer',
      detail: 'Menyusun jawaban kerja awal dan kandidat SQL read-only bila perlu.',
    },
    {
      key: 'review',
      title: 'Review',
      detail: 'Memeriksa konsistensi schema, risiko halusinasi, dan kualitas jawaban.',
    },
    {
      key: 'final',
      title: 'Final Response',
      detail: 'Menghasilkan jawaban akhir yang ringkas, matang, dan aman untuk user.',
    },
  ];

  return steps.map((step, index) => ({
    ...step,
    status: index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending',
  }));
}

export function applyWorkflowEventToSteps(eventName: WorkflowEventName): WorkflowStep[] {
  if (eventName === 'started' || eventName === 'schema_selected') {
    return buildWorkflowSteps(0);
  }
  if (eventName === 'analysis_started' || eventName === 'analysis_done') {
    return buildWorkflowSteps(1);
  }
  if (eventName === 'draft_started' || eventName === 'draft_done') {
    return buildWorkflowSteps(2);
  }
  if (eventName === 'review_started' || eventName === 'review_done') {
    return buildWorkflowSteps(3);
  }
  if (eventName === 'completed') {
    return buildWorkflowSteps(5);
  }

  return buildWorkflowSteps(0);
}

export function formatWorkflowStreamPayload(payload: WorkflowStreamPayload) {
  const nextPayload: Record<string, unknown> = {
    ...payload,
  };

  if (payload.data?.answer) {
    nextPayload.data = {
      ...payload.data,
      answer: `${payload.data.answer.slice(0, 240)}${payload.data.answer.length > 240 ? '…' : ''}`,
    };
  }

  return JSON.stringify(nextPayload, null, 2);
}

// ---------------------------------------------------------------------------
// Stream entry factories
// ---------------------------------------------------------------------------

export function createWorkflowStreamEntry(eventName: string, payload: string): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `${eventName}-${uniqueSuffix}`,
    event: eventName,
    receivedAt: new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    payload,
    kind: 'event',
  };
}

export function createUserPromptEntry(prompt: string): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `user-${uniqueSuffix}`,
    event: 'user',
    receivedAt: new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    payload: prompt,
    kind: 'user',
  };
}

export function createHistoryWorkflowEntry(
  eventName: string,
  payload: string,
  receivedAtIso?: string,
): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `${eventName}-${uniqueSuffix}`,
    event: eventName,
    receivedAt: receivedAtIso
      ? new Date(receivedAtIso).toLocaleTimeString('id-ID', {
          timeZone: APP_TIME_ZONE,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : new Date().toLocaleTimeString('id-ID', {
          timeZone: APP_TIME_ZONE,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
    payload,
    kind: eventName === 'user' ? 'user' : 'event',
  };
}

// ---------------------------------------------------------------------------
// Stream display payload parsing
// ---------------------------------------------------------------------------

export function extractWorkflowDisplayText(payload: string) {
  const display = getWorkflowStreamDisplayPayload(payload);
  return display.kind === 'none' ? '' : display.text.trim();
}

export function getWorkflowStreamDisplayPayload(payload: string): WorkflowStreamDisplayPayload {
  try {
    const parsed = JSON.parse(payload) as {
      event?: unknown;
      type?: unknown;
      response?: unknown;
      summary?: unknown;
      label?: unknown;
      error?: unknown;
      prompt_preview?: unknown;
      data?: unknown;
    };

    const dataAnswer =
      parsed.data &&
      typeof parsed.data === 'object' &&
      'answer' in parsed.data &&
      typeof (parsed.data as { answer?: unknown }).answer === 'string'
        ? ((parsed.data as { answer: string }).answer || '').trim()
        : '';

    const isDataPayload =
      Array.isArray(parsed.response) ||
      (parsed.response !== null && typeof parsed.response === 'object');

    if (parsed.event === 'query_execution_completed' && isDataPayload) {
      return {
        kind: 'data' as const,
        text: 'Hasil data siap ditampilkan sebagai tabel atau dashboard.',
      };
    }

    const resolvedText =
      (typeof parsed.response === 'string' && parsed.response.trim().length > 0
        ? parsed.response
        : typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary
          : typeof parsed.error === 'string' && parsed.error.trim().length > 0
            ? parsed.error
            : typeof parsed.prompt_preview === 'string' && parsed.prompt_preview.trim().length > 0
              ? parsed.prompt_preview
              : dataAnswer.length > 0
                ? dataAnswer
                : typeof parsed.label === 'string' && parsed.label.trim().length > 0
                  ? parsed.label
                  : '');

    if (resolvedText) {
      const isCompletedInsight =
        parsed.event === 'completed' &&
        dataAnswer.length > 0 &&
        typeof parsed.response !== 'object';

      const kind: WorkflowStreamDisplayPayload['kind'] =
        parsed.type === 'insight'
          ? 'insight'
          : parsed.type === 'explanation'
            ? 'explanation'
            : isCompletedInsight
              ? 'insight'
              : isDataPayload
                ? 'data'
                : 'raw';

      if (kind === 'raw' && !isDataPayload) {
        return {
          kind: 'raw',
          text: resolvedText,
        };
      }

      if (kind !== 'insight' && kind !== 'explanation' && !isDataPayload) {
        return {
          kind: 'none',
          text: '',
        };
      }

      return {
        kind,
        text: resolvedText,
      };
    }

    if (
      Array.isArray(parsed.response) ||
      (parsed.response && typeof parsed.response === 'object')
    ) {
      return {
        kind: 'data' as const,
        text:
          typeof parsed.response === 'object' &&
          parsed.response !== null &&
          'title' in parsed.response &&
          typeof parsed.response.title === 'string'
            ? parsed.response.title
            : Array.isArray(parsed.response)
              ? `Data result (${parsed.response.length} items)`
              : 'Data result',
      };
    }

    return {
      kind: 'none' as const,
      text: '',
    };
  } catch {
    return {
      kind: 'none' as const,
      text: '',
    };
  }
}

// ---------------------------------------------------------------------------
// AI result extraction from workflow payload
// ---------------------------------------------------------------------------

export function extractAiResultFromWorkflowPayload(payload: string): AiChatResult | null {
  try {
    const parsed = JSON.parse(payload) as WorkflowStreamPayload;
    if (!parsed.data || typeof parsed.data !== 'object') {
      return null;
    }

    const candidate = parsed.data as Partial<AiChatResult>;
    if (
      typeof candidate.answer === 'string' &&
      typeof candidate.model === 'string' &&
      typeof candidate.provider === 'string'
    ) {
      return candidate as AiChatResult;
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Stream data table / chart parsers
// ---------------------------------------------------------------------------

export function parseStreamDataTable(payload: string): SelectedStreamTable | null {
  try {
    const parsed = JSON.parse(payload) as { response?: unknown; data?: unknown };
    const source = parsed.response ?? parsed.data;

    if (Array.isArray(source)) {
      const isQueryExecutionArray =
        source.length > 0 &&
        source.every(
          (item) =>
            !!item &&
            typeof item === 'object' &&
            'query_id' in item &&
            'sql' in item &&
            'rows' in item,
        );

      if (isQueryExecutionArray) {
        return null;
      }

      const normalizedRows = source.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
      const columns = Array.from(
        new Set(normalizedRows.flatMap((row) => Object.keys(row))),
      );

      return {
        title: `Data result (${normalizedRows.length} items)`,
        columns,
        rows: normalizedRows.map((row) =>
          Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
        ),
      };
    }

    if (source && typeof source === 'object') {
      const record = source as Record<string, unknown>;

      if (Array.isArray(record.query_results) && Array.isArray(record.visualizations)) {
        return null;
      }

      if (Array.isArray(record.rows)) {
        const normalizedRows = record.rows.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
        const columns =
          Array.isArray(record.columns) && record.columns.length > 0
            ? record.columns.map((column) =>
                typeof column === 'string'
                  ? column
                  : column && typeof column === 'object' && 'name' in column
                    ? String(column.name)
                    : String(column),
              )
            : Array.from(new Set(normalizedRows.flatMap((row) => Object.keys(row))));

        return {
          title: typeof record.title === 'string' ? record.title : `Data result (${normalizedRows.length} rows)`,
          columns,
          rows: normalizedRows.map((row) =>
            Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
          ),
        };
      }

      const columns = Object.keys(record);
      return {
        title: typeof record.title === 'string' ? record.title : 'Data result',
        columns,
        rows: [
          Object.fromEntries(columns.map((column) => [column, String(record[column] ?? '-')])),
        ],
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function buildFallbackCountChart(table: SelectedStreamTable): SelectedStreamChart | null {
  const dateColumn =
    table.columns.find((column) => /tanggal|date/i.test(column)) ?? null;
  if (dateColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[dateColumn]?.trim();
      if (!label) {
        return;
      }
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    if (counts.size > 1) {
      const entries = Array.from(counts.entries())
        .sort((left, right) => left[0].localeCompare(right[0]))
        .slice(0, 8);
      const baseTitle = `${table.title} by ${formatColumnLabel(dateColumn)}`;

      return {
        title: appendYearRangeToTitle(
          baseTitle,
          entries.map(([label]) => label),
        ),
        labels: entries.map(([label]) => label),
        values: entries.map(([, value]) => value),
        valueLabel: 'Count',
      };
    }
  }

  const statusColumn =
    table.columns.find((column) => /status/i.test(column)) ?? null;
  if (statusColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[statusColumn]?.trim();
      if (!label) {
        return;
      }
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    if (counts.size > 0) {
      const entries = Array.from(counts.entries()).slice(0, 8);
      return {
        title: appendYearRangeToTitle(
          `${table.title} by ${formatColumnLabel(statusColumn)}`,
          table.rows.flatMap((row) => Object.values(row)),
        ),
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
  if (!table || table.rows.length === 0 || table.columns.length === 0) {
    return null;
  }

  const numericColumns = table.columns.filter((column) =>
    table.rows.some((row) => Number.isFinite(Number(row[column]))),
  );

  if (numericColumns.length === 0) {
    return null;
  }

  const valueColumn = [...numericColumns].sort(
    (left, right) => scoreNumericChartColumn(right) - scoreNumericChartColumn(left),
  )[0];
  const labelCandidates = table.columns.filter((column) => column !== valueColumn);
  const labelColumn =
    [...labelCandidates].sort(
      (left, right) => scoreLabelChartColumn(right) - scoreLabelChartColumn(left),
    )[0] ?? null;

  const rows = table.rows
    .map((row, index) => ({
      label: labelColumn ? row[labelColumn] : `Row ${index + 1}`,
      value: Number(row[valueColumn]),
    }))
    .filter((item) => Number.isFinite(item.value))
    .slice(0, 8);

  if (rows.length === 0) {
    return null;
  }

  const hasMeaningfulNumericColumn = scoreNumericChartColumn(valueColumn) > 0;
  const hasNonZeroValue = rows.some((row) => row.value !== 0);
  const uniqueValues = new Set(rows.map((row) => row.value));

  if (!hasMeaningfulNumericColumn || !hasNonZeroValue || uniqueValues.size <= 1) {
    return buildFallbackCountChart(table);
  }

  const chartTitle = appendYearRangeToTitle(
    table.title,
    rows.flatMap((row) => [row.label]),
  );

  return {
    title: chartTitle,
    labels: rows.map((row) => row.label),
    values: rows.map((row) => row.value),
    valueLabel: formatColumnLabel(valueColumn),
  };
}
