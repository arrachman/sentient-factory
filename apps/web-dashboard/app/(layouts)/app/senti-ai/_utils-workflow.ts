// Workflow and stream processing utilities — no React, no JSX.
// Extracted from page.tsx to keep each file under 400 lines.

import type {
  WorkflowEventName,
  WorkflowStep,
  WorkflowStreamDisplayPayload,
  WorkflowStreamEntry,
  WorkflowStreamPayload,
} from './_types';

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
