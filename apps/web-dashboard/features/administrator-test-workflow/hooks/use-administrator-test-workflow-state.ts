'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export type WorkflowApiPayload = {
  success?: boolean;
  message?: string;
  detail?: unknown;
  data?: {
    request_id?: string | null;
    answer?: string;
    model?: string;
    provider?: string;
    data_source?: string | null;
    workflow_mode?: string | null;
    workflow_passes?: number | null;
    schema_key?: string | null;
    schema_source?: string | null;
    suggested_queries?: Array<{ sql?: string; rationale?: string; safety?: string }>;
    query_result?: {
      sql?: string;
      row_count?: number;
      rows?: Array<Record<string, unknown>>;
    } | null;
  };
};

export type WorkflowProgressEvent = {
  event?: string;
  request_id?: string;
  timestamp?: string;
  error?: string;
  data?: WorkflowApiPayload['data'];
  label?: string;
  summary?: string;
  progress?: number;
  [key: string]: unknown;
};

export type WorkflowRequestSnapshot = {
  prompt: string;
  schemaKey: string;
  messagesJson: string;
  includeSchema: boolean;
  includeSamples: boolean;
  executeReadOnlyQuery: boolean;
  fastMode: boolean;
};

export const DEFAULT_PROMPT =
  'Analisis kebutuhan dashboard piutang, jelaskan tabel yang relevan, risiko ambigu, dan berikan contoh SQL read-only jika diperlukan.';

export const DEFAULT_MESSAGES_JSON = '[]';

const PROGRESS_EVENT_NAMES = [
  'started',
  'schema_selected',
  'analysis_started',
  'analysis_done',
  'draft_started',
  'draft_done',
  'review_started',
  'review_done',
  'completed',
  'failed',
] as const;

export function useAdministratorTestWorkflowState() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [schemaKey, setSchemaKey] = useState('all');
  const [messagesJson, setMessagesJson] = useState(DEFAULT_MESSAGES_JSON);
  const [includeSchema, setIncludeSchema] = useState(false);
  const [includeSamples, setIncludeSamples] = useState(false);
  const [executeReadOnlyQuery, setExecuteReadOnlyQuery] = useState(false);
  const [fastMode, setFastMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<WorkflowApiPayload | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progressEvents, setProgressEvents] = useState<WorkflowProgressEvent[]>([]);
  const [lastRequest, setLastRequest] = useState<WorkflowRequestSnapshot | null>(null);
  const progressSourceRef = useRef<EventSource | null>(null);
  const progressViewportRef = useRef<HTMLDivElement | null>(null);
  const { isCopied: isRawCopied, copyToClipboard: copyRaw } = useCopyToClipboard();
  const { isCopied: isSqlCopied, copyToClipboard: copySql } = useCopyToClipboard();

  useEffect(() => {
    if (!requestId) {
      return undefined;
    }

    const eventSource = new EventSource(`/api/ai/chat/progress/${requestId}`);
    progressSourceRef.current = eventSource;

    const pushEvent = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as WorkflowProgressEvent;
        setProgressEvents((current) => [...current, payload]);
        if (payload.event === 'completed' && payload.data) {
          setResponse({ success: true, data: payload.data });
          setResponseStatus(200);
          setSubmitting(false);
          toast.success('Workflow result diterima dari progress stream.');
          eventSource.close();
        }
        if (payload.event === 'failed') {
          setResponse({
            success: false,
            message: typeof payload.error === 'string' ? payload.error : 'Workflow failed.',
          });
          setResponseStatus(502);
          setSubmitting(false);
          toast.error(typeof payload.error === 'string' ? payload.error : 'Workflow failed.');
          eventSource.close();
        }
      } catch {
        // Ignore malformed SSE payloads.
      }
    };

    PROGRESS_EVENT_NAMES.forEach((name) =>
      eventSource.addEventListener(name, pushEvent as EventListener),
    );
    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      PROGRESS_EVENT_NAMES.forEach((name) =>
        eventSource.removeEventListener(name, pushEvent as EventListener),
      );
      eventSource.close();
      if (progressSourceRef.current === eventSource) {
        progressSourceRef.current = null;
      }
    };
  }, [requestId]);

  useEffect(() => {
    const viewport = progressViewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }, [progressEvents]);

  const runWorkflow = async (snapshot: WorkflowRequestSnapshot) => {
    const {
      prompt: snapshotPrompt,
      schemaKey: snapshotSchemaKey,
      messagesJson: snapshotMessagesJson,
      includeSchema: snapshotIncludeSchema,
      includeSamples: snapshotIncludeSamples,
      executeReadOnlyQuery: snapshotExecuteReadOnlyQuery,
    } = snapshot;

    if (!snapshotPrompt.trim()) {
      toast.error('Prompt wajib diisi.');
      return;
    }

    let parsedMessages: unknown[] = [];
    try {
      const parsed = JSON.parse(snapshotMessagesJson);
      if (!Array.isArray(parsed)) {
        throw new Error('Messages harus berupa array JSON.');
      }
      parsedMessages = parsed;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Messages JSON tidak valid.');
      return;
    }

    setSubmitting(true);
    setResponse(null);
    setResponseStatus(null);
    setProgressEvents([]);
    setLastRequest(snapshot);

    const nextRequestId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `workflow-${Date.now()}`;
    setRequestId(nextRequestId);

    try {
      const httpResponse = await fetch('/api/ai/test-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': nextRequestId,
        },
        body: JSON.stringify({
          prompt: snapshotPrompt,
          messages: parsedMessages,
          include_schema: snapshotIncludeSchema,
          include_samples: snapshotIncludeSamples,
          execute_read_only_query: snapshotExecuteReadOnlyQuery,
          schema_key: snapshotSchemaKey.trim() || undefined,
        }),
      });

      const payload = (await httpResponse.json().catch(() => null)) as WorkflowApiPayload | null;

      if (!httpResponse.ok || !payload?.success) {
        throw new Error(payload?.message || 'Workflow test request gagal.');
      }

      setResponseStatus(httpResponse.status);
      toast.success('Workflow request berhasil dikirim. Menunggu hasil dari progress stream.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Workflow test request gagal.';
      toast.error(message);
      setSubmitting(false);
      progressSourceRef.current?.close();
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    await runWorkflow({ prompt, schemaKey, messagesJson, includeSchema, includeSamples, executeReadOnlyQuery, fastMode });
  };

  const handleReplayLastRequest = async () => {
    if (!lastRequest) {
      toast.error('Belum ada request yang bisa diulang.');
      return;
    }

    setPrompt(lastRequest.prompt);
    setSchemaKey(lastRequest.schemaKey);
    setMessagesJson(lastRequest.messagesJson);
    setIncludeSchema(lastRequest.includeSchema);
    setIncludeSamples(lastRequest.includeSamples);
    setExecuteReadOnlyQuery(lastRequest.executeReadOnlyQuery);
    setFastMode(lastRequest.fastMode);

    await runWorkflow(lastRequest);
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    setSchemaKey('all');
    setMessagesJson(DEFAULT_MESSAGES_JSON);
    setIncludeSchema(false);
    setIncludeSamples(false);
    setExecuteReadOnlyQuery(false);
    setFastMode(true);
    setResponse(null);
    setResponseStatus(null);
    setRequestId(null);
    setProgressEvents([]);
    progressSourceRef.current?.close();
  };

  const responseData = response?.data;
  const rawResponseText = JSON.stringify(response, null, 2);
  const latestProgress = progressEvents.length ? progressEvents[progressEvents.length - 1] : null;

  return {
    prompt,
    setPrompt,
    schemaKey,
    setSchemaKey,
    messagesJson,
    setMessagesJson,
    includeSchema,
    setIncludeSchema,
    includeSamples,
    setIncludeSamples,
    executeReadOnlyQuery,
    setExecuteReadOnlyQuery,
    fastMode,
    setFastMode,
    submitting,
    response,
    responseStatus,
    requestId,
    progressEvents,
    lastRequest,
    progressViewportRef,
    isRawCopied,
    isSqlCopied,
    copyRaw,
    copySql,
    responseData,
    rawResponseText,
    latestProgress,
    handleSubmit,
    handleReplayLastRequest,
    handleReset,
  };
}
