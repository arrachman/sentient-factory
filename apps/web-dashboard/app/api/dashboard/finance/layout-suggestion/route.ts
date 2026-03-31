import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LayoutWidgetPayload = {
  id?: unknown;
  title?: unknown;
  kind?: unknown;
  minW?: unknown;
  maxW?: unknown;
  minH?: unknown;
  maxH?: unknown;
  defaultW?: unknown;
  defaultH?: unknown;
};

type LayoutSuggestionPayload = {
  tab?: unknown;
  columns?: unknown;
  widgets?: unknown;
};

type SuggestedLayoutItem = {
  id: string;
  w: number;
  h: number;
};

function getRequestId(request: NextRequest) {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}

function toInt(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
}

function postJson(body: string, requestId: string): Promise<{ statusCode: number; payload: string }> {
  return new Promise((resolve, reject) => {
    const target = new URL('/api/chat/test', getAiBaseUrl());
    const transport = target.protocol === 'https:' ? httpsRequest : httpRequest;
    const upstream = transport(
      target,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body).toString(),
          'x-request-id': requestId,
        },
        timeout: 20_000,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode ?? 502,
            payload: Buffer.concat(chunks).toString('utf8'),
          });
        });
      },
    );

    upstream.on('timeout', () => upstream.destroy(new Error('AI engine request timed out.')));
    upstream.on('error', reject);
    upstream.write(body);
    upstream.end();
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeWidgets(input: unknown, columns: number) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const widget = (item ?? {}) as LayoutWidgetPayload;
      const id = typeof widget.id === 'string' ? widget.id : null;
      const title = typeof widget.title === 'string' ? widget.title : id;
      const kind = typeof widget.kind === 'string' ? widget.kind : 'widget';
      if (!id) return null;

      const minW = clamp(toInt(widget.minW, 1), 1, columns);
      const maxW = clamp(toInt(widget.maxW, columns), minW, columns);
      const minH = clamp(toInt(widget.minH, 2), 1, 12);
      const maxH = clamp(toInt(widget.maxH, 6), minH, 12);
      const defaultW = clamp(toInt(widget.defaultW, minW), minW, maxW);
      const defaultH = clamp(toInt(widget.defaultH, minH), minH, maxH);

      return { id, title: title || id, kind, minW, maxW, minH, maxH, defaultW, defaultH };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function extractJsonBlock(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  return text.trim();
}

function buildFallbackLayout(
  widgets: ReturnType<typeof normalizeWidgets>,
  columns: number,
): SuggestedLayoutItem[] {
  const priority = { kpi: 0, summary: 1, chart: 2, table: 3, list: 4, widget: 5 } as const;
  return [...widgets]
    .sort((a, b) => {
      const byKind = (priority[a.kind as keyof typeof priority] ?? 99) - (priority[b.kind as keyof typeof priority] ?? 99);
      if (byKind !== 0) return byKind;
      return a.title.localeCompare(b.title);
    })
    .map((widget) => {
      const suggestedW =
        widget.kind === 'kpi'
          ? Math.min(columns <= 1 ? 1 : 3, widget.maxW)
          : widget.kind === 'chart'
            ? Math.min(columns, Math.max(widget.defaultW, columns >= 12 ? 6 : widget.defaultW))
            : widget.kind === 'table'
              ? Math.min(columns, Math.max(widget.defaultW, columns >= 12 ? 8 : widget.defaultW))
              : widget.defaultW;
      const suggestedH =
        widget.kind === 'kpi'
          ? Math.min(widget.maxH, 2)
          : widget.kind === 'table'
            ? Math.min(widget.maxH, Math.max(widget.defaultH, 5))
            : widget.defaultH;

      return {
        id: widget.id,
        w: clamp(suggestedW, widget.minW, widget.maxW),
        h: clamp(suggestedH, widget.minH, widget.maxH),
      };
    });
}

function buildPrompt(
  tab: string,
  columns: number,
  widgets: ReturnType<typeof normalizeWidgets>,
) {
  return [
    'You are arranging a finance dashboard widget layout.',
    `Tab: ${tab}`,
    `Grid columns: ${columns}`,
    'Goal: place KPI first, charts before tables, keep large charts wide, keep tables toward bottom, and preserve practical dashboard scanning order.',
    'Return only JSON array. No prose.',
    'Each item must be: {"id":"...","w":number,"h":number}',
    'Use every widget exactly once.',
    'Respect constraints.',
    `Widgets: ${JSON.stringify(widgets)}`,
  ].join('\n');
}

function normalizeSuggestedLayout(
  parsed: unknown,
  widgets: ReturnType<typeof normalizeWidgets>,
  columns: number,
) {
  if (!Array.isArray(parsed)) {
    return null;
  }

  const widgetMap = new Map(widgets.map((widget) => [widget.id, widget]));
  const used = new Set<string>();
  const normalized: SuggestedLayoutItem[] = [];

  for (const item of parsed) {
    const record = (item ?? {}) as Record<string, unknown>;
    const id = typeof record.id === 'string' ? record.id : null;
    if (!id || used.has(id)) continue;
    const widget = widgetMap.get(id);
    if (!widget) continue;

    normalized.push({
      id,
      w: clamp(toInt(record.w, widget.defaultW), widget.minW, Math.min(widget.maxW, columns)),
      h: clamp(toInt(record.h, widget.defaultH), widget.minH, widget.maxH),
    });
    used.add(id);
  }

  if (!normalized.length) {
    return null;
  }

  const missing = widgets
    .filter((widget) => !used.has(widget.id))
    .map((widget) => ({
      id: widget.id,
      w: clamp(widget.defaultW, widget.minW, Math.min(widget.maxW, columns)),
      h: clamp(widget.defaultH, widget.minH, widget.maxH),
    }));

  return [...normalized, ...missing];
}

export async function POST(request: NextRequest) {
  try {
    const requestId = getRequestId(request);
    const payload = (await request.json().catch(() => null)) as LayoutSuggestionPayload | null;
    const tab = typeof payload?.tab === 'string' ? payload.tab : 'Finance';
    const columns = clamp(toInt(payload?.columns, 12), 1, 12);
    const widgets = normalizeWidgets(payload?.widgets, columns);

    if (!widgets.length) {
      return NextResponse.json({ success: false, message: 'No widgets provided.' }, { status: 400 });
    }

    const fallbackLayout = buildFallbackLayout(widgets, columns);

    try {
      const aiResponse = await postJson(
        JSON.stringify({
          prompt: buildPrompt(tab, columns, widgets),
          request_id: requestId,
        }),
        requestId,
      );

      const responsePayload = JSON.parse(aiResponse.payload || '{}') as {
        success?: boolean;
        data?: { answer?: string; model?: string; provider?: string };
        message?: string;
      };

      const answer = responsePayload?.data?.answer;
      const extracted = typeof answer === 'string' ? extractJsonBlock(answer) : '';
      const parsed = extracted ? JSON.parse(extracted) : null;
      const normalized = normalizeSuggestedLayout(parsed, widgets, columns);

      if (normalized) {
        return NextResponse.json({
          success: true,
          source: 'ai',
          model: responsePayload?.data?.model ?? null,
          provider: responsePayload?.data?.provider ?? null,
          layout: normalized,
        });
      }
    } catch {
      // Fallback below.
    }

    return NextResponse.json({
      success: true,
      source: 'fallback',
      layout: fallbackLayout,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to build layout suggestion.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
