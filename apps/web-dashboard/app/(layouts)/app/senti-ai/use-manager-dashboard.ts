'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AiChatResult,
  ResultViewKey,
  RunHistoryItem,
  SelectedStreamChart,
  SelectedStreamTable,
  WorkflowStep,
  WorkflowStreamEntry,
} from './_types';
import { normalizeCopiedText, copyTextToClipboard } from './_utils-format';
import { buildWorkflowSteps } from './_utils-workflow';
import { buildDashboardVisualizationBlocks } from './_utils-result';
import { revokeAttachmentPreviewUrl } from './attachment-file-tile';
import { useAttachmentHandler } from './use-attachment-handler';
import { usePanelResize } from './use-panel-resize';
import { useSessionHistory } from './use-session-history';
import { usePinWidget, type PinQueryResult } from './use-pin-widget';
import { useAiWorkflow } from './use-ai-workflow';
import { useResultDerived } from './use-result-derived';
import { useRunHistory } from './use-run-history';
import { useStreamTableSelector } from './use-stream-table-selector';


export function useManagerDashboard(routeSessionId: string | null) {
  // Core state
  const [activeSessionRouteId, setActiveSessionRouteId] = useState<string | null>(routeSessionId);
  const [resultView, setResultView] = useState<ResultViewKey>('chart');
  const [prompt, setPrompt] = useState<string>('');
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<string>('Belum dijalankan');
  const [isRunningAi, setIsRunningAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiChatResult | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [workflowStreamEntries, setWorkflowStreamEntries] = useState<WorkflowStreamEntry[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [copiedPromptEntryId, setCopiedPromptEntryId] = useState<string | null>(null);
  const [selectedStreamTable, setSelectedStreamTable] = useState<SelectedStreamTable | null>(null);
  const [selectedStreamChart, setSelectedStreamChart] = useState<SelectedStreamChart | null>(null);
  const [selectedDashboardBlockId, setSelectedDashboardBlockId] = useState<string | null>(null);
  const [activeStreamDataEntryId, setActiveStreamDataEntryId] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});
  const [currentSessionKey, setCurrentSessionKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'senti-1.0'>('senti-1.0');
  const { runHistory, setRunHistory } = useRunHistory();

  // Shared refs (passed into sub-hooks)
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const requestAbortControllerRef = useRef<AbortController | null>(null);
  const workflowStreamEntriesRef = useRef<WorkflowStreamEntry[]>([]);
  const selectedStreamTableRef = useRef<SelectedStreamTable | null>(null);
  const selectedStreamChartRef = useRef<SelectedStreamChart | null>(null);
  const activePromptDraftRef = useRef('');

  // Sub-hook: attachments
  const attachment = useAttachmentHandler();

  // Derived state (needed before panel/session/pin sub-hooks)
  const dashboardVisualizationBlocks = useMemo(
    () => buildDashboardVisualizationBlocks(aiResult ?? null),
    [aiResult],
  );
  const activeDashboardBlock = useMemo(
    () =>
      dashboardVisualizationBlocks.find((item) => item.id === selectedDashboardBlockId) ??
      dashboardVisualizationBlocks[0] ??
      null,
    [dashboardVisualizationBlocks, selectedDashboardBlockId],
  );
  const previewStreamTable = activeDashboardBlock?.table ?? selectedStreamTable;
  const previewStreamChart = activeDashboardBlock?.chart ?? selectedStreamChart;
  const hasChartPanel = Boolean(previewStreamChart || previewStreamTable);
  const isAttachmentAnswer =
    aiResult?.workflow_mode === 'attachment' || aiResult?.data_source === 'attachment_context';

  // Sub-hook: result derived (chart/table computations)
  const resultDerived = useResultDerived(aiResult, previewStreamChart, previewStreamTable);

  // Sub-hook: panel resize
  const panelResize = usePanelResize(hasChartPanel, isRunningAi, workflowStreamEntries.length);
  const { restoreRightPanelWidth, scrollLeftPanelToBottom } = panelResize;

  // Navigation helper
  const navigateToSession = (sessionId: string | null) => {
    const nextPath = sessionId ? `/app/senti-ai/${sessionId}` : '/app/senti-ai';
    setActiveSessionRouteId(sessionId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ sessionId }, '', nextPath);
    }
  };

  const handleOpenHistoryRun = (item: RunHistoryItem, closeDialog = true) => {
    if (item.sessionKey) setCurrentSessionKey(item.sessionKey);
    if (item.sessionId) navigateToSession(item.sessionId);
    setSubmittedPrompt(item.prompt);
    setSubmittedAt(item.time);
    setAiResult(item.result ?? null);
    setAiError(item.error ?? null);
    setWorkflowStreamEntries(item.streamEntries ?? []);
    setSelectedStreamTable(item.table ?? null);
    setSelectedStreamChart(item.chart ?? null);
    setCurrentRequestId(item.requestId ?? null);
    attachment.setSubmittedAttachments([]);
    if (item.table || item.chart) restoreRightPanelWidth();
    setResultView(item.chart ? 'chart' : 'table');
    setIsRunningAi(false);
    sessionHistory.setIsRestoringSession(false);
    void closeDialog;
  };

  // Sub-hook: session history
  const sessionHistory = useSessionHistory({
    activeSessionRouteId,
    currentSessionKey,
    runHistory,
    navigateToSession,
    handleOpenHistoryRun,
  });
  const { activeHistorySession, refreshHistoryAfterRun } = sessionHistory;

  // activePinQueryResult for pin widget
  const { queryResultColumns, queryResultRows } = resultDerived;
  const activePinQueryResult = useMemo((): PinQueryResult | null => {
    if (aiResult?.query_results?.length && activeDashboardBlock?.id) {
      const viz = aiResult.visualizations?.find((v) => v.id === activeDashboardBlock.id);
      return viz ? (aiResult.query_results.find((r) => r.query_id === viz.query_id && r.success) ?? null) : null;
    }
    if (aiResult?.query_result?.sql && previewStreamTable) {
      return { query_id: 'primary', sql: aiResult.query_result.sql, success: true, error_message: null,
        row_count: aiResult.query_result.row_count, columns: aiResult.query_result.columns, rows: aiResult.query_result.rows } satisfies PinQueryResult;
    }
    return null;
  }, [activeDashboardBlock?.id, aiResult, previewStreamTable]);

  const activePinWidgetTitle =
    activeDashboardBlock?.title ??
    previewStreamChart?.title ??
    previewStreamTable?.title ??
    'Pinned Widget';
  const canPinActiveWidget = Boolean(
    activePinQueryResult?.sql && (previewStreamChart || previewStreamTable),
  );

  // Sub-hook: pin widget
  const pinWidget = usePinWidget({
    activePinWidgetTitle,
    activePinQueryResult,
    previewStreamChart,
    previewStreamTable,
    activeDashboardBlock,
    resultView,
    submittedPrompt,
    canPinActiveWidget,
  });

  // Sub-hook: AI workflow (SSE + handleRunAtm + cancelActiveRequest)
  const aiWorkflow = useAiWorkflow({
    prompt,
    attachments: attachment.attachments,
    attachmentFiles: attachment.attachmentFiles,
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
    setAttachments: attachment.setAttachments,
    setAttachmentFiles: attachment.setAttachmentFiles,
    setSubmittedAttachments: attachment.setSubmittedAttachments,
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
  });

  const hasSubmittedPrompt =
    submittedAt !== 'Belum dijalankan' && submittedPrompt.trim().length > 0;
  const isWelcomeState = workflowStreamEntries.length === 0 && !isRunningAi;

  // Local handlers
  const startNewSession = () => {
    setPrompt('');
    attachment.setAttachments((current) => { current.forEach((att) => revokeAttachmentPreviewUrl(att)); return []; });
    attachment.setAttachmentFiles([]);
    attachment.setSubmittedAttachments([]);
    setSubmittedPrompt('');
    setSubmittedAt('Belum dijalankan');
    setAiError(null);
    setAiResult(null);
    setWorkflowSteps(buildWorkflowSteps(0));
    setWorkflowStreamEntries([]);
    setSelectedStreamTable(null);
    setSelectedStreamChart(null);
    setSelectedDashboardBlockId(null);
    setCurrentRequestId(null);
    setCurrentSessionKey(null);
    sessionHistory.setSelectedHistorySessionId(null);
    sessionHistory.setIsRestoringSession(false);
    setResultView('chart');
    navigateToSession(null);
    window.requestAnimationFrame(() => { promptTextareaRef.current?.focus(); });
  };

  const togglePromptExpanded = useCallback((key: string) => {
    setExpandedPrompts((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }, []);

  const handleCopyPromptEntry = useCallback(async (entryId: string, promptValue: string) => {
    const ok = await copyTextToClipboard(normalizeCopiedText(promptValue)).catch(() => false);
    if (ok) {
      setCopiedPromptEntryId(entryId);
      window.setTimeout(() => setCopiedPromptEntryId((c) => (c === entryId ? null : c)), 1800);
    } else {
      setCopiedPromptEntryId(null);
    }
  }, []);

  const { handleOpenStreamDataTable } = useStreamTableSelector({
    activeStreamDataEntryId,
    setActiveStreamDataEntryId,
    setSelectedStreamTable,
    setSelectedStreamChart,
    setSelectedDashboardBlockId,
    setResultView,
    restoreRightPanelWidth,
  });

  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape' && isRunningAi) { event.preventDefault(); aiWorkflow.cancelActiveRequest(); return; }
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    if (!isRunningAi && !attachment.isPreparingAttachments && prompt.trim()) void aiWorkflow.handleRunAtm();
  };

  const handlePromptPaste = useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (await attachment.handlePasteAttachments(event.clipboardData?.items ?? null)) event.preventDefault();
  }, [attachment.handlePasteAttachments]);

  // Effects — sync refs
  useEffect(() => { attachment.attachmentsRef.current = attachment.attachments; }, [attachment.attachments]);
  useEffect(() => { workflowStreamEntriesRef.current = workflowStreamEntries; }, [workflowStreamEntries]);
  useEffect(() => { selectedStreamTableRef.current = selectedStreamTable; }, [selectedStreamTable]);
  useEffect(() => { selectedStreamChartRef.current = selectedStreamChart; }, [selectedStreamChart]);

  // Route/navigation effects
  useEffect(() => { setActiveSessionRouteId(routeSessionId); }, [routeSessionId]);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/app\/senti-ai\/([^/]+)$/);
      setActiveSessionRouteId(match?.[1] ?? null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Focus textarea on mount; cleanup attachment URLs on unmount; auto-resize textarea
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { promptTextareaRef.current?.focus(); });
    return () => { window.cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => () => {
    attachment.attachmentsRef.current.forEach((att) => revokeAttachmentPreviewUrl(att));
  }, []);
  useEffect(() => {
    const el = promptTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [prompt]);

  // Sync dashboard block selection when blocks change
  useEffect(() => {
    if (!dashboardVisualizationBlocks.length) {
      setSelectedDashboardBlockId(null);
      return;
    }
    setSelectedDashboardBlockId((current) =>
      current && dashboardVisualizationBlocks.some((item) => item.id === current)
        ? current
        : (dashboardVisualizationBlocks[0]?.id ?? null),
    );
  }, [dashboardVisualizationBlocks]);

  return {
    // Core state
    prompt, setPrompt,
    selectedModel, setSelectedModel,
    submittedPrompt, isRunningAi, aiError, workflowStreamEntries,
    copiedPromptEntryId, expandedPrompts, activeStreamDataEntryId,
    resultView, setResultView,
    // Attachment (from sub-hook — expose flat)
    attachments: attachment.attachments,
    submittedAttachments: attachment.submittedAttachments,
    isPreparingAttachments: attachment.isPreparingAttachments,
    isDraggingAttachment: attachment.isDraggingAttachment,
    setIsDraggingAttachment: attachment.setIsDraggingAttachment,
    attachmentInputRef: attachment.attachmentInputRef,
    handleSelectAttachments: attachment.handleSelectAttachments,
    handleDropAttachments: attachment.handleDropAttachments,
    removeAttachment: attachment.removeAttachment,
    // Session history (spread public subset)
    isSessionSidebarExpanded: sessionHistory.isSessionSidebarExpanded,
    setIsSessionSidebarExpanded: sessionHistory.setIsSessionSidebarExpanded,
    isSessionSearchOpen: sessionHistory.isSessionSearchOpen,
    setIsSessionSearchOpen: sessionHistory.setIsSessionSearchOpen,
    sessionSearchQuery: sessionHistory.sessionSearchQuery,
    setSessionSearchQuery: sessionHistory.setSessionSearchQuery,
    isRestoringSession: sessionHistory.isRestoringSession,
    deletingHistorySessionId: sessionHistory.deletingHistorySessionId,
    historySessionPendingDelete: sessionHistory.historySessionPendingDelete,
    setHistorySessionPendingDelete: sessionHistory.setHistorySessionPendingDelete,
    historySessionPendingRename: sessionHistory.historySessionPendingRename,
    historySessionRenameTitle: sessionHistory.historySessionRenameTitle,
    setHistorySessionRenameTitle: sessionHistory.setHistorySessionRenameTitle,
    isRenamingHistorySession: sessionHistory.isRenamingHistorySession,
    selectedHistorySessionId: sessionHistory.selectedHistorySessionId,
    isHistorySessionsLoading: sessionHistory.isHistorySessionsLoading,
    normalizedSessionSearchQuery: sessionHistory.normalizedSessionSearchQuery,
    filteredHistorySessions: sessionHistory.filteredHistorySessions,
    sessionSidebarVisibleRange: sessionHistory.sessionSidebarVisibleRange,
    sessionSearchInputRef: sessionHistory.sessionSearchInputRef,
    sessionSidebarScrollRef: sessionHistory.sessionSidebarScrollRef,
    setSessionSidebarScrollTop: sessionHistory.setSessionSidebarScrollTop,
    startRenameHistorySession: sessionHistory.startRenameHistorySession,
    cancelRenameHistorySession: sessionHistory.cancelRenameHistorySession,
    handleRenameHistorySession: sessionHistory.handleRenameHistorySession,
    handleDeleteHistorySession: sessionHistory.handleDeleteHistorySession,
    handleSelectHistorySession: sessionHistory.handleSelectHistorySession,
    // Pin widget (spread public subset)
    ...pinWidget,
    // Panel resize (spread public subset)
    leftPanelWidth: panelResize.leftPanelWidth,
    isResizingPanels: panelResize.isResizingPanels,
    showLeftPanelBottomButton: panelResize.showLeftPanelBottomButton,
    isRightPanelCollapsed: panelResize.isRightPanelCollapsed,
    leftPanelDesktopWidth: panelResize.leftPanelDesktopWidth,
    leftPanelScrollRef: panelResize.leftPanelScrollRef,
    splitLayoutRef: panelResize.splitLayoutRef,
    splitHandleRef: panelResize.splitHandleRef,
    scrollLeftPanelToBottom: panelResize.scrollLeftPanelToBottom,
    startPanelResize: panelResize.startPanelResize,
    MIN_PANEL_WIDTH_PERCENT: panelResize.MIN_PANEL_WIDTH_PERCENT,
    MAX_PANEL_WIDTH_PERCENT: panelResize.MAX_PANEL_WIDTH_PERCENT,
    // Result derived
    ...resultDerived,
    // Computed
    hasSubmittedPrompt, isWelcomeState, isAttachmentAnswer, hasChartPanel,
    dashboardVisualizationBlocks, activeDashboardBlock, setSelectedDashboardBlockId,
    previewStreamTable, previewStreamChart, activePinWidgetTitle, canPinActiveWidget,
    // Local refs
    promptTextareaRef,
    // AI workflow actions
    cancelActiveRequest: aiWorkflow.cancelActiveRequest,
    handleRunAtm: aiWorkflow.handleRunAtm,
    // Local handlers
    startNewSession,
    handlePromptKeyDown, handlePromptPaste, handleCopyPromptEntry,
    togglePromptExpanded, handleOpenStreamDataTable,
  };
}
