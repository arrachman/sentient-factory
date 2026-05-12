// AI result building utilities — no React, no JSX.
// Extracted from page.tsx to keep each file under 400 lines.

import type { ReactNode } from 'react';
import type {
  AiChatResult,
  AiModeKey,
  DashboardVisualizationBlock,
  HistoryPromptDetail,
  HistoryPromptItem,
  RunHistoryItem,
  SelectedStreamChart,
  SelectedStreamTable,
} from './_types';
import {
  APP_TIME_ZONE,
  createHistoryWorkflowEntry,
  parseStreamDataChart,
  parseStreamDataTable,
} from './_utils-workflow';

// ---------------------------------------------------------------------------
// AI result builders from history
// ---------------------------------------------------------------------------

export function buildAiResultFromHistoryPrompt(prompt: HistoryPromptItem): AiChatResult {
  const failureText =
    prompt.status === 'failed' && prompt.failure_message
      ? `Workflow gagal: ${prompt.failure_message}`
      : null;
  return {
    request_id: prompt.request_id,
    answer:
      prompt.answer_text ||
      prompt.explanation_response ||
      failureText ||
      (prompt.answer_json ? JSON.stringify(prompt.answer_json) : ''),
    model: prompt.model || 'unknown',
    provider: prompt.provider || '',
    data_source: prompt.data_source || null,
    workflow_mode: prompt.workflow_mode || undefined,
    workflow_passes: prompt.workflow_passes || undefined,
    schema_key: prompt.schema_key || undefined,
    schema_source: prompt.schema_source || undefined,
    semantic_schema: null,
    query_result: prompt.query_result || null,
    suggested_queries: [],
  };
}

export function extractAiResultFromPromptDetail(detail: HistoryPromptDetail): AiChatResult | null {
  for (let index = detail.events.length - 1; index >= 0; index -= 1) {
    const payloadData = detail.events[index]?.payload?.data;
    if (!payloadData || typeof payloadData !== 'object') {
      continue;
    }

    const candidate = payloadData as Partial<AiChatResult>;
    if (
      typeof candidate.answer === 'string' &&
      typeof candidate.model === 'string' &&
      typeof candidate.provider === 'string'
    ) {
      return candidate as AiChatResult;
    }
  }

  return null;
}

export function buildRunHistoryFromPromptDetail(
  detail: HistoryPromptDetail,
  sessionKey: string | null,
  mode: AiModeKey = 'ask',
): RunHistoryItem {
  const { prompt, events } = detail;
  const aiResult = extractAiResultFromPromptDetail(detail) ?? buildAiResultFromHistoryPrompt(prompt);
  const dashboardBlocks = buildDashboardVisualizationBlocks(aiResult);
  const primaryDashboardBlock = dashboardBlocks[0] ?? null;
  const historyPayload = JSON.stringify({
    response: prompt.query_result?.rows ?? null,
  });
  const fallbackTable = prompt.query_result?.rows ? parseStreamDataTable(historyPayload) : null;
  const fallbackChart = prompt.query_result?.rows ? parseStreamDataChart(historyPayload) : null;
  const table = primaryDashboardBlock?.table ?? fallbackTable;
  const chart = primaryDashboardBlock?.chart ?? fallbackChart;

  const streamEntries = [
    createHistoryWorkflowEntry('user', prompt.prompt_text, prompt.prompt_created_at),
    ...events.map((event) =>
      createHistoryWorkflowEntry(
        event.event_name,
        JSON.stringify(
          {
            event: event.event_name,
            type: event.event_type,
            progress: event.progress,
            label: event.label,
            response: event.response_text ?? event.payload?.response ?? null,
            data: event.payload?.data ?? null,
            error: event.payload?.error ?? null,
          },
          null,
          2,
        ),
        event.created_at,
      ),
    ),
  ];

  if (streamEntries.length === 1 && prompt.started_response) {
    streamEntries.push(
      createHistoryWorkflowEntry('started', prompt.started_response, prompt.prompt_created_at),
    );
  }

  if (prompt.status === 'failed' && prompt.failure_message) {
    streamEntries.push(
      createHistoryWorkflowEntry(
        'failed',
        `Workflow gagal: ${prompt.failure_message}`,
        prompt.completed_at || prompt.prompt_created_at,
      ),
    );
  }

  return {
    sessionId: prompt.session_id,
    sessionKey,
    promptId: prompt.id,
    requestId: prompt.request_id,
    prompt: prompt.prompt_text,
    mode,
    confidence: 1,
    time: new Date(prompt.prompt_created_at).toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
    }),
    pinned: false,
    result: aiResult,
    table,
    chart,
    streamEntries,
    error: prompt.failure_message ?? null,
  };
}

// ---------------------------------------------------------------------------
// Query result → table / chart
// ---------------------------------------------------------------------------

export function buildTableFromQueryResult(
  queryResult: NonNullable<AiChatResult['query_result']> | NonNullable<NonNullable<AiChatResult['query_results']>[number]>,
  title: string,
): SelectedStreamTable | null {
  const columns = (queryResult.columns ?? []).map((column) => column.name);
  const rows = (queryResult.rows ?? []).map((row) =>
    Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
  );

  if (!columns.length || !rows.length) {
    return null;
  }

  return {
    title,
    columns,
    rows,
  };
}

export function buildChartFromQueryResult(
  queryResult: NonNullable<AiChatResult['query_result']> | NonNullable<NonNullable<AiChatResult['query_results']>[number]>,
  title: string,
): SelectedStreamChart | null {
  const payload = JSON.stringify({
    response: {
      title,
      columns: queryResult.columns,
      rows: queryResult.rows,
    },
  });
  const chart = parseStreamDataChart(payload);
  if (!chart) {
    return null;
  }
  return {
    ...chart,
    title,
  };
}

export function buildDashboardVisualizationBlocks(result: AiChatResult | null): DashboardVisualizationBlock[] {
  if (!result?.query_results?.length || !result.visualizations?.length) {
    return [];
  }

  const resultsById = new Map(result.query_results.map((item) => [item.query_id, item]));

  return result.visualizations.flatMap((visualization) => {
    const queryResult = resultsById.get(visualization.query_id);
    if (!queryResult?.success) {
      return [];
    }

    const table = buildTableFromQueryResult(queryResult, visualization.title);
    const chart = buildChartFromQueryResult(queryResult, visualization.title);

    return [
      {
        id: visualization.id,
        title: visualization.title,
        chartType: visualization.chart_type,
        table,
        chart,
      },
    ];
  });
}

// ---------------------------------------------------------------------------
// Markdown renderers — return ReactNode, but no JSX file extension needed
// since these use createElement-compatible returns via JSX transform
// ---------------------------------------------------------------------------

export function renderInlineMarkdown(value: string): ReactNode[] {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-900 dark:text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function renderRichTextMarkdown(value: string): ReactNode {
  const normalizedValue = value
    .replace(/(#{1,6}[^\n]*?)\s+(?=\d+\.\s)/g, '$1\n')
    .replace(/([^\n])\s+(?=\d+\.\s)/g, '$1\n');
  const lines = normalizedValue.split('\n');
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let currentList:
    | { type: 'unordered'; items: Array<{ text: string; level: number }> }
    | { type: 'ordered'; items: Array<{ text: string; level: number; number: number }> }
    | null = null;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="whitespace-pre-wrap text-[13px] leading-6 text-slate-700 dark:text-slate-200">
        {renderInlineMarkdown(paragraphBuffer.join(' ').trim())}
      </p>,
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!currentList || currentList.items.length === 0) {
      return;
    }

    if (currentList.type === 'unordered') {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="space-y-2">
          {currentList.items.map((item, index) => (
            <li
              key={`list-item-${index}`}
              className="flex items-start gap-3 text-[13px] leading-6 text-slate-700 dark:text-slate-200"
              style={{ paddingLeft: `${item.level * 16}px` }}
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span className="min-w-0">{renderInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <ol key={`list-${blocks.length}`} className="space-y-2">
          {currentList.items.map((item, index) => (
            <li
              key={`list-item-${index}`}
              className="flex items-start gap-3 text-[13px] leading-6 text-slate-700 dark:text-slate-200"
              style={{ paddingLeft: `${item.level * 16}px` }}
            >
              <span className="min-w-[1.5rem] shrink-0 text-right font-semibold text-slate-500 dark:text-slate-400">
                {item.number}.
              </span>
              <span className="min-w-0">{renderInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ol>,
      );
    }

    currentList = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2]?.trim() ?? '';

      blocks.push(
        <div
          key={`heading-${blocks.length}`}
          className={
            level >= 3
              ? 'pt-1 text-[15px] font-semibold leading-6 text-slate-800 dark:text-slate-100'
              : 'pt-1 text-base font-semibold leading-6 text-slate-900 dark:text-slate-50'
          }
        >
          {renderInlineMarkdown(headingText)}
        </div>,
      );
      return;
    }

    if (bulletMatch) {
      flushParagraph();
      const level = Math.floor((bulletMatch[1]?.length ?? 0) / 2);

      if (!currentList || currentList.type !== 'unordered') {
        flushList();
        currentList = { type: 'unordered', items: [] };
      }

      currentList.items.push({
        level,
        text: bulletMatch[2]?.trim() ?? '',
      });
      return;
    }

    if (orderedMatch) {
      flushParagraph();
      const level = Math.floor((orderedMatch[1]?.length ?? 0) / 2);

      if (!currentList || currentList.type !== 'ordered') {
        flushList();
        currentList = { type: 'ordered', items: [] };
      }

      currentList.items.push({
        level,
        number: Number(orderedMatch[2]),
        text: orderedMatch[3]?.trim() ?? '',
      });
      return;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-3">{blocks}</div>;
}
