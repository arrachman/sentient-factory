'use client';

import { useEffect, useRef } from 'react';
import type { WorkflowEventName, WorkflowStreamPayload } from './_types';
import { upsertRunHistory, createManagerSessionKey } from './_utils-format';
import { detectMode, detectSchemaKey } from './_utils-detect';
import {
  APP_TIME_ZONE,
  applyWorkflowEventToSteps,
  buildWorkflowSteps,
  createUserPromptEntry,
  createWorkflowStreamEntry,
  formatWorkflowStreamPayload,
} from './_utils-workflow';
import { parseStreamDataChart, parseStreamDataTable } from './_utils-stream';
import { submitAiChatRequest } from './_utils-ai-fetch';
import type { AiWorkflowOptions } from './_types-ai-workflow';
export type { AiWorkflowOptions };

const WORKFLOW_EVENT_NAMES: WorkflowEventName[] = [
  'started', 'schema_selected', 'query_execution_started', 'query_execution_completed',
  'ai_insight_started', 'ai_insight_completed', 'analysis_started', 'analysis_done',
  'draft_started', 'draft_done', 'review_started', 'review_done', 'completed', 'failed',
];
const WORKFLOW_EVENT_NAMES_SET = new Set<string>(WORKFLOW_EVENT_NAMES);


export function useAiWorkflow(options: AiWorkflowOptions) {
  const {
    prompt,
    attachments,
    attachmentFiles,
    runHistory,
    currentSessionKey,
    activeHistorySession,
    currentRequestId,
    activeRequestIdRef,
    eventSourceRef,
    requestAbortControllerRef,
    workflowStreamEntriesRef,
    selectedStreamTableRef,
    selectedStreamChartRef,
    activePromptDraftRef,
    setPrompt,
    setSubmittedPrompt,
    setSubmittedAt,
    setAttachments,
    setAttachmentFiles,
    setSubmittedAttachments,
    setAiError,
    setAiResult,
    setIsRunningAi,
    setWorkflowSteps,
    setWorkflowStreamEntries,
    setCurrentRequestId,
    setCurrentSessionKey,
    setActiveStreamDataEntryId,
    setSelectedStreamTable,
    setSelectedStreamChart,
    setSelectedDashboardBlockId,
    setRunHistory,
    setResultView,
    restoreRightPanelWidth,
    scrollLeftPanelToBottom,
    refreshHistoryAfterRun,
    promptTextareaRef,
  } = options;

  // Stable ref to keep option callbacks fresh without re-subscribing SSE
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const applyWorkflowEvent = (eventName: WorkflowEventName) => {
    setWorkflowSteps(applyWorkflowEventToSteps(eventName));
    if (eventName === 'completed' || eventName === 'failed') {
      setIsRunningAi(false);
    }
  };

  const cancelActiveRequest = () => {
    requestAbortControllerRef.current?.abort();
    requestAbortControllerRef.current = null;
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    activeRequestIdRef.current = null;
    setPrompt(activePromptDraftRef.current);
    setCurrentRequestId(null);
    setIsRunningAi(false);
    setWorkflowSteps(buildWorkflowSteps(0));
    setWorkflowStreamEntries((current) => [
      ...current,
      createWorkflowStreamEntry(
        'cancelled',
        JSON.stringify(
          {
            type: 'explanation',
            response: 'Request dibatalkan oleh user. Anda bisa mengirim prompt baru sekarang.',
          },
          null,
          2,
        ),
      ),
    ]);
    window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
      const length = activePromptDraftRef.current.length;
      promptTextareaRef.current?.setSelectionRange(length, length);
    });
  };

  const handleRunAtm = async () => {
    const runTime = new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextPrompt = prompt;
    const nextAttachments = attachments.filter((att) => att.status !== 'failed');
    const nextAttachmentFiles = attachmentFiles;
    activePromptDraftRef.current = nextPrompt;
    requestAbortControllerRef.current?.abort();
    requestAbortControllerRef.current = null;
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    activeRequestIdRef.current = null;
    setSubmittedPrompt(prompt);
    setSubmittedAt(runTime);
    setSubmittedAttachments(nextAttachments);
    setPrompt('');
    setAttachments([]);
    setAttachmentFiles([]);
    setAiError(null);
    setAiResult(null);
    setIsRunningAi(true);
    setWorkflowSteps(buildWorkflowSteps(0));
    setCurrentRequestId(null);
    setActiveStreamDataEntryId(null);
    setSelectedStreamTable(null);
    setSelectedStreamChart(null);
    setSelectedDashboardBlockId(null);
    setWorkflowStreamEntries((current) => [
      ...current,
      createUserPromptEntry(
        nextAttachments.length > 0
          ? `${nextPrompt}\n\n[Attachment: ${nextAttachments.map((att) => att.name).join(', ')}]`
          : nextPrompt,
      ),
    ]);
    const promptDetection = detectMode(prompt);
    const schemaKey = detectSchemaKey(prompt);
    const pinned = runHistory.find((item) => item.prompt === nextPrompt)?.pinned ?? false;
    const abortController = new AbortController();
    requestAbortControllerRef.current = abortController;
    try {
      const sessionKey =
        activeHistorySession?.session_key ?? currentSessionKey ?? createManagerSessionKey();
      if (currentSessionKey !== sessionKey) {
        setCurrentSessionKey(sessionKey);
      }
      const response = await submitAiChatRequest({
        nextPrompt,
        nextAttachments,
        nextAttachmentFiles,
        sessionKey,
        responseMode: promptDetection.mode === 'transform' ? 'dashboard' : 'single',
        schemaKey,
        uiMode: promptDetection.mode,
        signal: abortController.signal,
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            data?: { request_id?: string; status?: string };
          }
        | null;
      if (!response.ok || !payload?.success || !payload.data?.request_id) {
        throw new Error(payload?.message || 'AI engine tidak mengembalikan respons yang valid.');
      }
      const nextRequestId = payload.data.request_id || response.headers.get('x-request-id');
      requestAbortControllerRef.current = null;
      activeRequestIdRef.current = nextRequestId;
      setCurrentRequestId(nextRequestId);
      setRunHistory((current) =>
        upsertRunHistory(current, {
          requestId: nextRequestId,
          sessionKey,
          prompt: nextPrompt,
          mode: promptDetection.mode,
          confidence: promptDetection.confidence,
          time: runTime,
          pinned,
          result: null,
          table: null,
          chart: null,
          streamEntries: [],
          error: null,
        }),
      );
      void refreshHistoryAfterRun(sessionKey);
    } catch (error) {
      requestAbortControllerRef.current = null;
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setAttachments(nextAttachments);
      setAttachmentFiles(nextAttachmentFiles);
      setSubmittedAttachments(nextAttachments);
      setAiError(error instanceof Error ? error.message : 'Gagal menghubungi AI engine.');
      setAiResult(null);
      setWorkflowSteps(buildWorkflowSteps(0));
      setIsRunningAi(false);
    }
  };

  // SSE event source
  useEffect(() => {
    if (!currentRequestId) {
      return;
    }
    const {
      restoreRightPanelWidth: restore,
      scrollLeftPanelToBottom: scrollToBottom,
    } = optionsRef.current;

    const eventSource = new EventSource(`/api/ai/chat/progress/${currentRequestId}`);
    eventSourceRef.current = eventSource;
    activeRequestIdRef.current = currentRequestId;

    const handleWorkflowEvent = (event: MessageEvent<string>) => {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }
      const rawEventName = event.type || 'message';
      const rawPayload = event.data;
      let payload: WorkflowStreamPayload | null = null;
      try {
        payload = JSON.parse(rawPayload) as WorkflowStreamPayload;
      } catch {
        return;
      }
      const nextLiveTable = parseStreamDataTable(rawPayload);
      const nextLiveChart = parseStreamDataChart(rawPayload);
      const streamEntry = createWorkflowStreamEntry(
        rawEventName,
        payload ? formatWorkflowStreamPayload(payload) : rawPayload,
      );
      const nextStreamEntries = [...workflowStreamEntriesRef.current, streamEntry];
      workflowStreamEntriesRef.current = nextStreamEntries;
      setWorkflowStreamEntries(nextStreamEntries);
      if (nextLiveTable) {
        selectedStreamTableRef.current = nextLiveTable;
        selectedStreamChartRef.current = nextLiveChart;
        setSelectedStreamTable(nextLiveTable);
        setSelectedStreamChart(nextLiveChart);
        if (nextLiveTable || nextLiveChart) {
          restore();
        }
        setResultView(nextLiveChart ? 'chart' : 'table');
      }
      const eventName = payload.event ?? (rawEventName as WorkflowEventName);
      if (!WORKFLOW_EVENT_NAMES_SET.has(eventName)) {
        return;
      }
      applyWorkflowEvent(eventName);
      if (eventName === 'completed' && payload.data) {
        setAiResult(payload.data);
        setAiError(null);
        const nextTable = nextLiveTable ?? selectedStreamTableRef.current;
        const nextChart = nextLiveTable ? nextLiveChart : selectedStreamChartRef.current;
        if (nextTable) {
          selectedStreamTableRef.current = nextTable;
          selectedStreamChartRef.current = nextChart;
          setSelectedStreamTable(nextTable);
          setSelectedStreamChart(nextChart);
          if (nextTable || nextChart) {
            restore();
          }
        }
        setRunHistory((current) => {
          const existing = current.find((item) => item.requestId === currentRequestId);
          if (!existing) {
            return current;
          }
          return upsertRunHistory(current, {
            ...existing,
            result: payload.data,
            table: nextTable ?? existing.table ?? null,
            chart: nextTable ? nextChart : (existing.chart ?? null),
            streamEntries: nextStreamEntries,
            error: null,
          });
        });
        window.requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
      if (eventName === 'failed') {
        setAiError(typeof payload.error === 'string' ? payload.error : 'Workflow failed.');
        setAiResult(null);
        setRunHistory((current) => {
          const existing = current.find((item) => item.requestId === currentRequestId);
          if (!existing) {
            return current;
          }
          return upsertRunHistory(current, {
            ...existing,
            error: typeof payload.error === 'string' ? payload.error : 'Workflow failed.',
            streamEntries: nextStreamEntries,
          });
        });
      }
      if (eventName === 'completed' || eventName === 'failed') {
        eventSource.close();
        if (eventSourceRef.current === eventSource) {
          eventSourceRef.current = null;
        }
      }
    };

    WORKFLOW_EVENT_NAMES.forEach((name) => eventSource.addEventListener(name, handleWorkflowEvent as EventListener));
    eventSource.onerror = () => {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }
      setWorkflowStreamEntries((current) => [
        ...current,
        createWorkflowStreamEntry(
          'error',
          JSON.stringify(
            {
              message: 'Event stream connection closed unexpectedly.',
              request_id: currentRequestId,
            },
            null,
            2,
          ),
        ),
      ]);
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
      setIsRunningAi(false);
    };
    return () => {
      WORKFLOW_EVENT_NAMES.forEach((name) =>
        eventSource.removeEventListener(name, handleWorkflowEvent as EventListener),
      );
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
    };
  }, [currentRequestId]);

  return { cancelActiveRequest, handleRunAtm };
}
