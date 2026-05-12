'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  buildAttachmentContext,
  parsePromptAttachmentOffMainThread,
  type PromptAttachment,
} from './attachment-utils';
import type {
  AiChatResult,
  DashboardPinTarget,
  DashboardVisualizationBlock,
  HistoryPromptDetail,
  HistoryPromptItem,
  HistorySessionItem,
  PromptAttachmentFile,
  ResultViewKey,
  RunHistoryItem,
  SelectedStreamChart,
  SelectedStreamTable,
  WorkflowEventName,
  WorkflowStep,
  WorkflowStreamEntry,
  WorkflowStreamPayload,
} from './_types';
import {
  RUN_HISTORY_LIMIT,
  formatAttachmentSize,
  formatCompactNumber,
  formatPromptPreview,
  getChartLabelInitials,
  isRightAlignedColumn,
  limitChartEntries,
  normalizeCopiedText,
  upsertRunHistory,
  createManagerSessionKey,
} from './_utils-format';
import { detectMode, detectSchemaKey } from './_utils-detect';
import {
  APP_TIME_ZONE,
  applyWorkflowEventToSteps,
  buildWorkflowSteps,
  createUserPromptEntry,
  createWorkflowStreamEntry,
  formatWorkflowStreamPayload,
} from './_utils-workflow';
import { extractAiResultFromWorkflowPayload, parseStreamDataChart, parseStreamDataTable } from './_utils-stream';
import {
  buildDashboardVisualizationBlocks,
  buildRunHistoryFromPromptDetail,
} from './_utils-result';
import { revokeAttachmentPreviewUrl } from './attachment-file-tile';
import type { PinDialogProps } from './ai-dialogs';

const RUN_HISTORY_STORAGE_KEY = 'manager-dashboard-ai-history';
const MIN_PANEL_WIDTH_PERCENT = 32;
const MAX_PANEL_WIDTH_PERCENT = 100;
const MIN_RIGHT_PANEL_WIDTH_PX = 300;
const SESSION_SIDEBAR_ROW_HEIGHT = 72;
const SESSION_SIDEBAR_OVERSCAN = 6;

const DEFAULT_DASHBOARD_PIN_TARGETS: DashboardPinTarget[] = [
  {
    dashboard_id: '0',
    dashboard_key: 'warehouse-operations',
    dashboard_title: 'Warehouse Operations',
    menu_id: '',
    menu_key: 'logistic-dashboard-warehouse',
    menu_title: 'Custom Dashboard 1',
    route_path: '/app/dashboard/custom-db-1',
  },
];

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fallback below for non-secure origins or denied clipboard permissions.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function useManagerDashboard(routeSessionId: string | null) {
  const [activeSessionRouteId, setActiveSessionRouteId] = useState<string | null>(routeSessionId);
  const [resultView, setResultView] = useState<ResultViewKey>('chart');
  const [prompt, setPrompt] = useState<string>('');
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<PromptAttachmentFile[]>([]);
  const [submittedAttachments, setSubmittedAttachments] = useState<PromptAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDraggingAttachment, setIsDraggingAttachment] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'senti-1.0'>('senti-1.0');
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<string>('Belum dijalankan');
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
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
  const [historySessions, setHistorySessions] = useState<HistorySessionItem[]>([]);
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null);
  const [isHistorySessionsLoading, setIsHistorySessionsLoading] = useState(false);
  const [isSessionSidebarExpanded, setIsSessionSidebarExpanded] = useState(true);
  const [isSessionSearchOpen, setIsSessionSearchOpen] = useState(false);
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [deletingHistorySessionId, setDeletingHistorySessionId] = useState<string | null>(null);
  const [historySessionPendingDelete, setHistorySessionPendingDelete] = useState<HistorySessionItem | null>(null);
  const [historySessionPendingRename, setHistorySessionPendingRename] = useState<HistorySessionItem | null>(null);
  const [historySessionRenameTitle, setHistorySessionRenameTitle] = useState('');
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinTargets, setPinTargets] = useState<DashboardPinTarget[]>([]);
  const [selectedPinTargetKey, setSelectedPinTargetKey] = useState('');
  const [isPinTargetsLoading, setIsPinTargetsLoading] = useState(false);
  const [isPinningWidget, setIsPinningWidget] = useState(false);
  const [pinDialogError, setPinDialogError] = useState<string | null>(null);
  const [pinDialogSuccess, setPinDialogSuccess] = useState<string | null>(null);
  const [pinWidgetTitle, setPinWidgetTitle] = useState('');
  const [pinWidgetSpan, setPinWidgetSpan] = useState('lg:col-span-6');
  const [pinTargetTitle, setPinTargetTitle] = useState('');
  const [sessionSidebarViewportHeight, setSessionSidebarViewportHeight] = useState(0);
  const [sessionSidebarScrollTop, setSessionSidebarScrollTop] = useState(0);
  const [isRenamingHistorySession, setIsRenamingHistorySession] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [splitLayoutWidth, setSplitLayoutWidth] = useState(0);
  const [isResizingPanels, setIsResizingPanels] = useState(false);
  const [showLeftPanelBottomButton, setShowLeftPanelBottomButton] = useState(false);

  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const leftPanelScrollRef = useRef<HTMLDivElement | null>(null);
  const splitLayoutRef = useRef<HTMLDivElement | null>(null);
  const splitHandleRef = useRef<HTMLDivElement | null>(null);
  const sessionSearchInputRef = useRef<HTMLInputElement | null>(null);
  const sessionSidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const runHistoryPersistTimeoutRef = useRef<number | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const requestAbortControllerRef = useRef<AbortController | null>(null);
  const workflowStreamEntriesRef = useRef<WorkflowStreamEntry[]>([]);
  const selectedStreamTableRef = useRef<SelectedStreamTable | null>(null);
  const selectedStreamChartRef = useRef<SelectedStreamChart | null>(null);
  const activePromptDraftRef = useRef('');
  const attachmentsRef = useRef<PromptAttachment[]>([]);
  const skipNextRouteSessionRestoreRef = useRef(false);

  // Derived state
  const hasSubmittedPrompt = submittedAt !== 'Belum dijalankan' && submittedPrompt.trim().length > 0;
  const isWelcomeState = workflowStreamEntries.length === 0 && !isRunningAi;

  const queryResultColumns = useMemo(() => aiResult?.query_result?.columns ?? [], [aiResult]);
  const queryResultRows = useMemo(() => aiResult?.query_result?.rows ?? [], [aiResult]);
  const dashboardVisualizationBlocks = useMemo(
    () => buildDashboardVisualizationBlocks(aiResult ?? null),
    [aiResult],
  );
  const isAttachmentAnswer = aiResult?.workflow_mode === 'attachment' || aiResult?.data_source === 'attachment_context';
  const activeDashboardBlock = useMemo(
    () =>
      dashboardVisualizationBlocks.find((item) => item.id === selectedDashboardBlockId) ??
      dashboardVisualizationBlocks[0] ??
      null,
    [dashboardVisualizationBlocks, selectedDashboardBlockId],
  );
  const previewStreamTable = activeDashboardBlock?.table ?? selectedStreamTable;
  const previewStreamChart = activeDashboardBlock?.chart ?? selectedStreamChart;
  const activePinQueryResult = useMemo(() => {
    if (aiResult?.query_results?.length && activeDashboardBlock?.id) {
      const visualization = aiResult.visualizations?.find((item) => item.id === activeDashboardBlock.id);
      if (!visualization) {
        return null;
      }
      return aiResult.query_results.find((item) => item.query_id === visualization.query_id && item.success) ?? null;
    }
    if (aiResult?.query_result?.sql && previewStreamTable) {
      return {
        query_id: 'primary',
        sql: aiResult.query_result.sql,
        success: true,
        error_message: null,
        row_count: aiResult.query_result.row_count,
        columns: aiResult.query_result.columns,
        rows: aiResult.query_result.rows,
      };
    }
    return null;
  }, [activeDashboardBlock?.id, aiResult, previewStreamTable]);

  const activePinWidgetTitle =
    activeDashboardBlock?.title ??
    previewStreamChart?.title ??
    previewStreamTable?.title ??
    'Pinned Widget';
  const canPinActiveWidget = Boolean(activePinQueryResult?.sql && (previewStreamChart || previewStreamTable));

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
        ? limitedChartEntries.map((entry) => ({
            date: entry.label.slice(0, 10),
            value: entry.value,
          }))
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
            color: ['#4f86f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'][index % 8],
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

  const hasChartPanel = Boolean(previewStreamChart || previewStreamTable);
  const rightPanelCollapseThresholdPercent = useMemo(() => {
    if (!hasChartPanel || splitLayoutWidth <= MIN_RIGHT_PANEL_WIDTH_PX) {
      return MAX_PANEL_WIDTH_PERCENT;
    }
    const threshold = ((splitLayoutWidth - MIN_RIGHT_PANEL_WIDTH_PX) / splitLayoutWidth) * 100;
    return Math.min(MAX_PANEL_WIDTH_PERCENT, Math.max(MIN_PANEL_WIDTH_PERCENT, threshold));
  }, [hasChartPanel, splitLayoutWidth]);
  const isRightPanelCollapsed = hasChartPanel && leftPanelWidth >= rightPanelCollapseThresholdPercent;

  const normalizedSessionSearchQuery = sessionSearchQuery.trim().toLowerCase();
  const filteredHistorySessions = useMemo(() => {
    if (!normalizedSessionSearchQuery) {
      return historySessions;
    }
    const matchedSessionKeysFromPrompts = new Set(
      runHistory
        .filter((item) => item.prompt.toLowerCase().includes(normalizedSessionSearchQuery))
        .map((item) => item.sessionKey)
        .filter((value): value is string => Boolean(value)),
    );
    return historySessions.filter((session) => {
      const matchesTitle = (session.title || session.session_key)
        .toLowerCase()
        .includes(normalizedSessionSearchQuery);
      const matchesMetadata = [session.session_key, session.status, session.mode, session.username ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedSessionSearchQuery);
      const matchesPrompt = matchedSessionKeysFromPrompts.has(session.session_key);
      return matchesTitle || matchesMetadata || matchesPrompt;
    });
  }, [historySessions, normalizedSessionSearchQuery, runHistory]);

  const sessionSidebarVisibleRange = useMemo(() => {
    if (filteredHistorySessions.length === 0) {
      return { topSpacerHeight: 0, bottomSpacerHeight: 0, items: [] as HistorySessionItem[] };
    }
    const viewportHeight = Math.max(sessionSidebarViewportHeight, SESSION_SIDEBAR_ROW_HEIGHT * 6);
    const visibleCount = Math.ceil(viewportHeight / SESSION_SIDEBAR_ROW_HEIGHT);
    const startIndex = Math.max(
      0,
      Math.floor(sessionSidebarScrollTop / SESSION_SIDEBAR_ROW_HEIGHT) - SESSION_SIDEBAR_OVERSCAN,
    );
    const endIndex = Math.min(
      filteredHistorySessions.length,
      startIndex + visibleCount + SESSION_SIDEBAR_OVERSCAN * 2,
    );
    return {
      topSpacerHeight: startIndex * SESSION_SIDEBAR_ROW_HEIGHT,
      bottomSpacerHeight: Math.max(0, filteredHistorySessions.length - endIndex) * SESSION_SIDEBAR_ROW_HEIGHT,
      items: filteredHistorySessions.slice(startIndex, endIndex),
    };
  }, [filteredHistorySessions, sessionSidebarScrollTop, sessionSidebarViewportHeight]);

  const activeHistorySession = useMemo(
    () =>
      historySessions.find((item) => item.id === activeSessionRouteId) ??
      historySessions.find((item) => item.id === selectedHistorySessionId) ??
      historySessions.find((item) => item.session_key === currentSessionKey) ??
      null,
    [activeSessionRouteId, currentSessionKey, historySessions, selectedHistorySessionId],
  );

  const leftPanelDesktopWidth = hasChartPanel ? `${leftPanelWidth}%` : '100%';

  // Navigation helper
  const navigateToSession = (sessionId: string | null) => {
    const nextPath = sessionId ? `/app/senti-ai/${sessionId}` : '/app/senti-ai';
    setActiveSessionRouteId(sessionId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ sessionId }, '', nextPath);
    }
  };

  const restoreRightPanelWidth = useCallback(() => {
    setLeftPanelWidth((current) =>
      current >= rightPanelCollapseThresholdPercent ? 58 : current,
    );
  }, [rightPanelCollapseThresholdPercent]);

  const clampPanelWidth = (value: number) => {
    if (value >= rightPanelCollapseThresholdPercent) {
      return MAX_PANEL_WIDTH_PERCENT;
    }
    return Math.min(MAX_PANEL_WIDTH_PERCENT, Math.max(MIN_PANEL_WIDTH_PERCENT, value));
  };

  const startPanelResize = (
    event: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    if (window.innerWidth < 1024 || !hasChartPanel) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if ('pointerId' in event) {
      splitHandleRef.current?.setPointerCapture?.(event.pointerId);
    }
    setIsResizingPanels(true);
  };

  const scrollLeftPanelToBottom = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  const syncLeftPanelBottomButton = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }
    setShowLeftPanelBottomButton(container.scrollHeight - container.clientHeight > 24);
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

  const openPinDialog = () => {
    setPinDialogError(null);
    setPinDialogSuccess(null);
    setPinWidgetTitle(activePinWidgetTitle);
    setPinWidgetSpan('lg:col-span-6');
    const matchedTarget = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey) ?? pinTargets[0];
    setPinTargetTitle(matchedTarget?.menu_title || matchedTarget?.dashboard_title || '');
    setIsPinDialogOpen(true);
  };

  const handlePinActiveWidget = async () => {
    if (!activePinQueryResult?.sql || !selectedPinTargetKey || !pinWidgetTitle.trim()) {
      setPinDialogError('Widget aktif belum punya query SQL yang bisa di-pin.');
      return;
    }
    setIsPinningWidget(true);
    setPinDialogError(null);
    setPinDialogSuccess(null);
    try {
      const matchedTargetBeforePin = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey);
      const existingTargetTitle = matchedTargetBeforePin?.dashboard_title || matchedTargetBeforePin?.menu_title || '';
      if (pinTargetTitle.trim() && pinTargetTitle.trim() !== existingTargetTitle) {
        const renameResponse = await fetch(`/api/dashboard/custom-db/${selectedPinTargetKey}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: pinTargetTitle.trim() }),
        });
        const renamePayload = await renameResponse.json().catch(() => null);
        if (!renameResponse.ok || !renamePayload?.success) {
          throw new Error(renamePayload?.message || 'Gagal rename dashboard target.');
        }
      }
      const response = await fetch('/api/dashboard/custom-db/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardKey: selectedPinTargetKey,
          title: pinWidgetTitle.trim(),
          description: `Pinned from Senti AI session${submittedPrompt ? `: ${formatPromptPreview(submittedPrompt, 96)}` : ''}`,
          widgetKind: resultView === 'chart' && previewStreamChart ? 'chart' : 'table',
          chartType:
            resultView === 'chart' && activeDashboardBlock && activeDashboardBlock.chartType !== 'table'
              ? activeDashboardBlock.chartType
              : null,
          spanClassName: pinWidgetSpan,
          sqlTemplate: activePinQueryResult.sql,
          outputColumns: activePinQueryResult.columns?.map((column) => column.name) ?? previewStreamTable?.columns ?? [],
          queryLabel: `${pinWidgetTitle.trim()} Query`,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Gagal pin widget ke dashboard.');
      }
      const matchedTarget = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey);
      if (pinTargetTitle.trim()) {
        setPinTargets((current) =>
          current.map((item) =>
            item.dashboard_key === selectedPinTargetKey
              ? { ...item, dashboard_title: pinTargetTitle.trim(), menu_title: item.menu_title || pinTargetTitle.trim() }
              : item,
          ),
        );
      }
      setPinDialogSuccess(
        matchedTarget?.route_path
          ? `Widget berhasil di-pin ke ${pinTargetTitle.trim() || matchedTarget.menu_title || matchedTarget.dashboard_title}.`
          : 'Widget berhasil di-pin ke dashboard.',
      );
    } catch (error) {
      setPinDialogError(error instanceof Error ? error.message : 'Gagal pin widget ke dashboard.');
    } finally {
      setIsPinningWidget(false);
    }
  };

  const handleSelectAttachments = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    setIsPreparingAttachments(true);
    try {
      const selectedFiles = Array.from(fileList).slice(0, 5).map((file) => ({
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        file,
      }));
      const parsedFiles: PromptAttachment[] = [];
      for (let index = 0; index < selectedFiles.length; index += 1) {
        const entry = selectedFiles[index];
        parsedFiles.push(await parsePromptAttachmentOffMainThread(entry.file, entry.id));
        if (index < selectedFiles.length - 1) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 0);
          });
        }
      }
      const validAttachmentIds = new Set(
        parsedFiles
          .filter((attachment) => attachment.status !== 'failed')
          .map((attachment) => attachment.id),
      );
      setAttachments((current) => {
        const nextMap = new Map(current.map((attachment) => [attachment.name, attachment]));
        parsedFiles.forEach((attachment) => {
          const existing = nextMap.get(attachment.name);
          if (existing && existing.previewUrl && existing.previewUrl !== attachment.previewUrl) {
            revokeAttachmentPreviewUrl(existing);
          }
          nextMap.set(attachment.name, attachment);
        });
        return Array.from(nextMap.values()).sort((left, right) => left.addedAt - right.addedAt);
      });
      setAttachmentFiles((current) => {
        const nextMap = new Map(current.map((entry) => [entry.file.name, entry]));
        selectedFiles.forEach((entry) => {
          if (validAttachmentIds.has(entry.id)) {
            nextMap.set(entry.file.name, entry);
          }
        });
        return Array.from(nextMap.values());
      });
    } finally {
      setIsPreparingAttachments(false);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
    }
  }, []);

  const handlePasteAttachments = useCallback(
    async (items: DataTransferItemList | null) => {
      if (!items || items.length === 0) {
        return false;
      }
      const pastedFiles: File[] = [];
      Array.from(items).forEach((item, index) => {
        if (item.kind !== 'file') {
          return;
        }
        const file = item.getAsFile();
        if (!file) {
          return;
        }
        const fallbackExtension = file.type.startsWith('image/') ? 'png' : 'bin';
        const hasExplicitName = file.name && file.name !== 'image.png';
        const nextFile = hasExplicitName
          ? file
          : new File([file], `pasted-${Date.now()}-${index}.${fallbackExtension}`, {
              type: file.type || 'application/octet-stream',
              lastModified: Date.now(),
            });
        pastedFiles.push(nextFile);
      });
      if (pastedFiles.length === 0) {
        return false;
      }
      const dataTransfer = new DataTransfer();
      pastedFiles.forEach((file) => dataTransfer.items.add(file));
      await handleSelectAttachments(dataTransfer.files);
      return true;
    },
    [handleSelectAttachments],
  );

  const handleDropAttachments = useCallback(
    async (files: FileList | null) => {
      setIsDraggingAttachment(false);
      await handleSelectAttachments(files);
    },
    [handleSelectAttachments],
  );

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === attachmentId);
      if (target) {
        revokeAttachmentPreviewUrl(target);
      }
      return current.filter((attachment) => attachment.id !== attachmentId);
    });
    setAttachmentFiles((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );
  }, []);

  const applyWorkflowEvent = (eventName: WorkflowEventName) => {
    setWorkflowSteps(applyWorkflowEventToSteps(eventName));
    if (eventName === 'completed' || eventName === 'failed') {
      setIsRunningAi(false);
    }
  };

  const startNewSession = () => {
    setPrompt('');
    setAttachments((current) => {
      current.forEach((attachment) => revokeAttachmentPreviewUrl(attachment));
      return [];
    });
    setAttachmentFiles([]);
    setSubmittedAttachments([]);
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
    setSelectedHistorySessionId(null);
    setIsRestoringSession(false);
    setResultView('chart');
    navigateToSession(null);
    window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });
  };

  const startRenameHistorySession = (session: HistorySessionItem) => {
    setHistorySessionPendingRename(session);
    setHistorySessionRenameTitle(session.title || session.session_key);
  };

  const cancelRenameHistorySession = () => {
    if (isRenamingHistorySession) {
      return;
    }
    setHistorySessionPendingRename(null);
    setHistorySessionRenameTitle('');
  };

  const togglePromptExpanded = useCallback((key: string) => {
    setExpandedPrompts((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }, []);

  const fetchHistorySessions = async (preferredSessionKey?: string | null) => {
    setIsHistorySessionsLoading(true);
    try {
      const response = await fetch('/api/ai/history/sessions?channel=manager_dashboard&limit=20', {
        cache: 'no-store',
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: HistorySessionItem[] }
        | null;
      if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
        throw new Error('Failed to load history sessions.');
      }
      const sessions = payload.data;
      setHistorySessions(sessions);
      const preferredSessionId =
        (preferredSessionKey
          ? sessions.find((item) => item.session_key === preferredSessionKey)?.id
          : null) ?? null;
      setSelectedHistorySessionId((current) =>
        preferredSessionId ?? current ?? sessions[0]?.id ?? null,
      );
      return sessions;
    } catch {
      setHistorySessions([]);
      return [];
    } finally {
      setIsHistorySessionsLoading(false);
    }
  };

  const handleDeleteHistorySession = async (sessionId: string) => {
    setDeletingHistorySessionId(sessionId);
    try {
      const response = await fetch(`/api/ai/history/sessions/${sessionId}`, { method: 'DELETE' });
      const payload = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !payload?.success) {
        throw new Error('Failed to delete history session.');
      }
      setHistorySessions((current) => {
        const next = current.filter((item) => item.id !== sessionId);
        setSelectedHistorySessionId((selected) =>
          selected === sessionId ? (next[0]?.id ?? null) : selected,
        );
        const deletedSession = current.find((item) => item.id === sessionId);
        if (deletedSession?.session_key && deletedSession.session_key === currentSessionKey) {
          setCurrentSessionKey(null);
        }
        return next;
      });
      if (activeSessionRouteId === sessionId) {
        navigateToSession(null);
      }
      setHistorySessionPendingDelete(null);
    } catch {
      return;
    } finally {
      setDeletingHistorySessionId(null);
    }
  };

  const handleRenameHistorySession = async (session: HistorySessionItem) => {
    const nextTitle = historySessionRenameTitle.trim();
    if (!nextTitle || nextTitle === (session.title || session.session_key)) {
      cancelRenameHistorySession();
      return;
    }
    setIsRenamingHistorySession(true);
    try {
      const response = await fetch(`/api/ai/history/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: nextTitle }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: HistorySessionItem }
        | null;
      if (!response.ok || !payload?.success) {
        throw new Error('Failed to rename history session.');
      }
      setHistorySessions((current) =>
        current.map((item) =>
          item.id === session.id ? { ...item, title: nextTitle } : item,
        ),
      );
      setHistorySessionPendingRename(null);
      setHistorySessionRenameTitle('');
    } catch {
      return;
    } finally {
      setIsRenamingHistorySession(false);
    }
  };

  const refreshHistoryAfterRun = async (sessionKeyOverride?: string | null) => {
    const sessionKey = sessionKeyOverride ?? currentSessionKey;
    if (!sessionKey) {
      return;
    }
    const sessions = await fetchHistorySessions(sessionKey);
    const currentSession =
      sessions.find((item) => item.session_key === sessionKey) ?? sessions[0];
    if (currentSession?.id) {
      skipNextRouteSessionRestoreRef.current = true;
      navigateToSession(currentSession.id);
    }
  };

  const handleSelectHistorySession = (session: HistorySessionItem) => {
    setIsRestoringSession(true);
    setSelectedHistorySessionId(session.id);
    navigateToSession(session.id);
  };

  const handleOpenHistoryRun = (item: RunHistoryItem, closeDialog = true) => {
    if (item.sessionKey) {
      setCurrentSessionKey(item.sessionKey);
    }
    if (item.sessionId) {
      navigateToSession(item.sessionId);
    }
    setSubmittedPrompt(item.prompt);
    setSubmittedAt(item.time);
    setAiResult(item.result ?? null);
    setAiError(item.error ?? null);
    setWorkflowStreamEntries(item.streamEntries ?? []);
    setSelectedStreamTable(item.table ?? null);
    setSelectedStreamChart(item.chart ?? null);
    setCurrentRequestId(item.requestId ?? null);
    setSubmittedAttachments([]);
    if (item.table || item.chart) {
      restoreRightPanelWidth();
    }
    setResultView(item.chart ? 'chart' : 'table');
    setIsRunningAi(false);
    setIsRestoringSession(false);
    void closeDialog;
  };

  const handleCopyPromptEntry = useCallback(async (entryId: string, promptValue: string) => {
    try {
      const copied = await copyTextToClipboard(normalizeCopiedText(promptValue));
      if (!copied) {
        throw new Error('Copy failed');
      }
      setCopiedPromptEntryId(entryId);
      window.setTimeout(() => {
        setCopiedPromptEntryId((current) => (current === entryId ? null : current));
      }, 1800);
    } catch {
      setCopiedPromptEntryId(null);
    }
  }, []);

  const handleOpenStreamDataTable = useCallback(
    (entryId: string, payload: string) => {
      if (activeStreamDataEntryId === entryId) {
        setActiveStreamDataEntryId(null);
        setSelectedStreamTable(null);
        setSelectedStreamChart(null);
        setSelectedDashboardBlockId(null);
        return;
      }
      const payloadResult = extractAiResultFromWorkflowPayload(payload);
      const payloadDashboardBlocks = buildDashboardVisualizationBlocks(payloadResult);
      const primaryDashboardBlock =
        payloadDashboardBlocks.find((block) => block.chart) ?? payloadDashboardBlocks[0] ?? null;
      if (primaryDashboardBlock) {
        setActiveStreamDataEntryId(entryId);
        setSelectedDashboardBlockId(primaryDashboardBlock.id);
        setSelectedStreamTable(primaryDashboardBlock.table);
        setSelectedStreamChart(primaryDashboardBlock.chart);
        if (primaryDashboardBlock.table || primaryDashboardBlock.chart) {
          restoreRightPanelWidth();
        }
        setResultView(primaryDashboardBlock.chart ? 'chart' : 'table');
        return;
      }
      const nextTable = parseStreamDataTable(payload);
      const nextChart = parseStreamDataChart(payload);
      if (!nextTable) {
        return;
      }
      setActiveStreamDataEntryId(entryId);
      setSelectedDashboardBlockId(null);
      setSelectedStreamTable(nextTable);
      setSelectedStreamChart(nextChart);
      if (nextTable || nextChart) {
        restoreRightPanelWidth();
      }
      setResultView(nextChart ? 'chart' : 'table');
    },
    [activeStreamDataEntryId, restoreRightPanelWidth],
  );

  const handleRunAtm = async () => {
    const runTime = new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextPrompt = prompt;
    const nextAttachments = attachments.filter((attachment) => attachment.status !== 'failed');
    const nextAttachmentFiles = attachmentFiles;
    const attachmentContext = buildAttachmentContext(nextAttachments);
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
          ? `${nextPrompt}\n\n[Attachment: ${nextAttachments.map((attachment) => attachment.name).join(', ')}]`
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
      const endpoint = '/api/ai/chat';
      const response =
        nextAttachmentFiles.length > 0
          ? await fetch(endpoint, {
              method: 'POST',
              signal: abortController.signal,
              body: (() => {
                const formData = new FormData();
                formData.append('question', nextPrompt);
                formData.append('include_schema', 'true');
                formData.append('include_samples', 'false');
                formData.append('execute_read_only_query', 'true');
                formData.append(
                  'response_mode',
                  promptDetection.mode === 'transform' ? 'dashboard' : 'single',
                );
                formData.append('schema_key', schemaKey);
                formData.append('session_key', sessionKey);
                formData.append('channel', 'manager_dashboard');
                formData.append('ui_mode', promptDetection.mode);
                nextAttachmentFiles.forEach((attachment) => {
                  formData.append('files', attachment.file, attachment.file.name);
                });
                return formData;
              })(),
            })
          : await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: abortController.signal,
              body: JSON.stringify({
                question: nextPrompt,
                include_schema: true,
                include_samples: false,
                execute_read_only_query: true,
                response_mode: promptDetection.mode === 'transform' ? 'dashboard' : 'single',
                schema_key: schemaKey,
                attachments: nextAttachments.map((attachment) => ({
                  name: attachment.name,
                  media_type: attachment.type,
                  size_bytes: attachment.size,
                  extension: attachment.extension,
                  extraction_status: attachment.status,
                  content: attachment.content,
                  preview: attachment.preview,
                  warning: attachment.warning,
                  metadata: attachment.metadata,
                })),
                attachment_context: attachmentContext,
                session_key: sessionKey,
                channel: 'manager_dashboard',
                ui_mode: promptDetection.mode,
              }),
            });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: { request_id?: string; status?: string } }
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

  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      if (!isRunningAi) {
        return;
      }
      event.preventDefault();
      cancelActiveRequest();
      return;
    }
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }
    event.preventDefault();
    if (isRunningAi || isPreparingAttachments || !prompt.trim()) {
      return;
    }
    void handleRunAtm();
  };

  const handlePromptPaste = useCallback(
    async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const consumed = await handlePasteAttachments(event.clipboardData?.items ?? null);
      if (consumed) {
        event.preventDefault();
      }
    },
    [handlePasteAttachments],
  );

  // Effects
  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    workflowStreamEntriesRef.current = workflowStreamEntries;
  }, [workflowStreamEntries]);

  useEffect(() => {
    selectedStreamTableRef.current = selectedStreamTable;
  }, [selectedStreamTable]);

  useEffect(() => {
    selectedStreamChartRef.current = selectedStreamChart;
  }, [selectedStreamChart]);

  useEffect(() => {
    let cancelled = false;

    async function loadPinTargets() {
      setIsPinTargetsLoading(true);
      setPinDialogError(null);
      try {
        const response = await fetch('/api/dashboard/custom-db/pin-targets', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);
        const targets =
          response.ok && payload?.success && Array.isArray(payload.data) && payload.data.length > 0
            ? (payload.data as DashboardPinTarget[])
            : DEFAULT_DASHBOARD_PIN_TARGETS;
        if (cancelled) {
          return;
        }
        setPinTargets(targets);
        setSelectedPinTargetKey((current) => current || targets[0]?.dashboard_key || '');
        setPinTargetTitle(targets[0]?.menu_title || targets[0]?.dashboard_title || '');
      } catch (error) {
        if (!cancelled) {
          setPinTargets(DEFAULT_DASHBOARD_PIN_TARGETS);
          setSelectedPinTargetKey((current) => current || DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_key || '');
          setPinTargetTitle(
            DEFAULT_DASHBOARD_PIN_TARGETS[0]?.menu_title ||
              DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_title ||
              '',
          );
          setPinDialogError(error instanceof Error ? error.message : 'Gagal memuat target dashboard.');
        }
      } finally {
        if (!cancelled) {
          setIsPinTargetsLoading(false);
        }
      }
    }

    void loadPinTargets();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = sessionSidebarScrollRef.current;
    if (!container) {
      return;
    }
    const syncViewport = () => {
      setSessionSidebarViewportHeight(container.clientHeight);
      setSessionSidebarScrollTop(container.scrollTop);
    };
    syncViewport();
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncViewport);
    });
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, [filteredHistorySessions.length, isSessionSidebarExpanded]);

  useEffect(() => {
    const stored = window.localStorage.getItem(RUN_HISTORY_STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as RunHistoryItem[];
      if (Array.isArray(parsed)) {
        setRunHistory(parsed.slice(0, RUN_HISTORY_LIMIT));
      }
    } catch {
      window.localStorage.removeItem(RUN_HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (runHistoryPersistTimeoutRef.current !== null) {
      window.clearTimeout(runHistoryPersistTimeoutRef.current);
    }
    runHistoryPersistTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(RUN_HISTORY_STORAGE_KEY, JSON.stringify(runHistory));
      runHistoryPersistTimeoutRef.current = null;
    }, 180);
    return () => {
      if (runHistoryPersistTimeoutRef.current !== null) {
        window.clearTimeout(runHistoryPersistTimeoutRef.current);
        runHistoryPersistTimeoutRef.current = null;
      }
    };
  }, [runHistory]);

  useEffect(() => {
    void fetchHistorySessions();
  }, []);

  useEffect(() => {
    if (!isSessionSearchOpen || !isSessionSidebarExpanded) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      sessionSearchInputRef.current?.focus();
      sessionSearchInputRef.current?.select();
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isSessionSearchOpen, isSessionSidebarExpanded]);

  useEffect(() => {
    if (isSessionSearchOpen) {
      return;
    }
    setSessionSearchQuery('');
  }, [isSessionSearchOpen]);

  useEffect(() => {
    setActiveSessionRouteId(routeSessionId);
  }, [routeSessionId]);

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

  useEffect(() => {
    if (!activeSessionRouteId) {
      return;
    }
    setSelectedHistorySessionId(activeSessionRouteId);
  }, [activeSessionRouteId, historySessions]);

  useEffect(() => {
    if (!activeSessionRouteId) {
      setIsRestoringSession(false);
      return;
    }
    const selectedSessionSnapshot = historySessions.find((item) => item.id === activeSessionRouteId);
    if (
      skipNextRouteSessionRestoreRef.current &&
      selectedSessionSnapshot?.session_key &&
      selectedSessionSnapshot.session_key === currentSessionKey
    ) {
      skipNextRouteSessionRestoreRef.current = false;
      setIsRestoringSession(false);
      return;
    }
    let cancelled = false;
    setIsRestoringSession(true);
    const loadSessionFromRoute = async () => {
      try {
        const promptsResponse = await fetch(
          `/api/ai/history/sessions/${activeSessionRouteId}/prompts`,
          { cache: 'no-store' },
        );
        const promptsPayload = (await promptsResponse.json().catch(() => null)) as
          | { success?: boolean; data?: HistoryPromptItem[] }
          | null;
        if (
          !promptsResponse.ok ||
          !promptsPayload?.success ||
          !Array.isArray(promptsPayload.data) ||
          promptsPayload.data.length === 0
        ) {
          return;
        }
        if (cancelled) {
          return;
        }
        const latestPrompt = promptsPayload.data[promptsPayload.data.length - 1];
        const detailResponse = await fetch(`/api/ai/history/prompts/${latestPrompt.id}`, {
          cache: 'no-store',
        });
        const detailPayload = (await detailResponse.json().catch(() => null)) as
          | { success?: boolean; data?: HistoryPromptDetail }
          | null;
        if (!detailResponse.ok || !detailPayload?.success || !detailPayload.data?.prompt || cancelled) {
          return;
        }
        handleOpenHistoryRun(
          buildRunHistoryFromPromptDetail(
            detailPayload.data,
            selectedSessionSnapshot?.session_key || null,
            selectedSessionSnapshot?.mode || 'ask',
          ),
          false,
        );
      } finally {
        if (!cancelled) {
          setIsRestoringSession(false);
        }
      }
    };
    void loadSessionFromRoute();
    return () => {
      cancelled = true;
    };
  }, [activeSessionRouteId, currentSessionKey, historySessions]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((attachment) => revokeAttachmentPreviewUrl(attachment));
    };
  }, []);

  useEffect(() => {
    const textarea = promptTextareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [prompt]);

  useEffect(() => {
    if (!currentRequestId) {
      return;
    }
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
          restoreRightPanelWidth();
        }
        setResultView(nextLiveChart ? 'chart' : 'table');
      }
      const eventName = payload.event ?? (rawEventName as WorkflowEventName);
      if (
        eventName !== 'started' &&
        eventName !== 'schema_selected' &&
        eventName !== 'query_execution_started' &&
        eventName !== 'query_execution_completed' &&
        eventName !== 'ai_insight_started' &&
        eventName !== 'ai_insight_completed' &&
        eventName !== 'analysis_started' &&
        eventName !== 'analysis_done' &&
        eventName !== 'draft_started' &&
        eventName !== 'draft_done' &&
        eventName !== 'review_started' &&
        eventName !== 'review_done' &&
        eventName !== 'completed' &&
        eventName !== 'failed'
      ) {
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
            restoreRightPanelWidth();
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
          scrollLeftPanelToBottom();
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

    const eventNames: WorkflowEventName[] = [
      'started',
      'schema_selected',
      'query_execution_started',
      'query_execution_completed',
      'ai_insight_started',
      'ai_insight_completed',
      'analysis_started',
      'analysis_done',
      'draft_started',
      'draft_done',
      'review_started',
      'review_done',
      'completed',
      'failed',
    ];
    eventNames.forEach((eventName) =>
      eventSource.addEventListener(eventName, handleWorkflowEvent as EventListener),
    );
    eventSource.onerror = () => {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }
      setWorkflowStreamEntries((current) => [
        ...current,
        createWorkflowStreamEntry(
          'error',
          JSON.stringify(
            { message: 'Event stream connection closed unexpectedly.', request_id: currentRequestId },
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
      eventNames.forEach((eventName) =>
        eventSource.removeEventListener(eventName, handleWorkflowEvent as EventListener),
      );
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
    };
  }, [currentRequestId]);

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

  useLayoutEffect(() => {
    if (!isRunningAi) {
      syncLeftPanelBottomButton();
      return;
    }
    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      scrollLeftPanelToBottom();
      syncLeftPanelBottomButton();
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isRunningAi, workflowStreamEntries]);

  useEffect(() => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }
    syncLeftPanelBottomButton();
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });
    observer.observe(container, { childList: true, subtree: true, characterData: true });
    resizeObserver.observe(container);
    const handleWindowResize = () => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const container = splitLayoutRef.current;
    if (!container) {
      return;
    }
    const syncSplitLayoutWidth = () => {
      setSplitLayoutWidth(container.getBoundingClientRect().width);
    };
    syncSplitLayoutWidth();
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncSplitLayoutWidth);
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', syncSplitLayoutWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncSplitLayoutWidth);
    };
  }, []);

  useEffect(() => {
    if (!isResizingPanels) {
      return;
    }
    const handlePointerMove = (event: PointerEvent) => {
      const container = splitLayoutRef.current;
      if (!container) {
        return;
      }
      const bounds = container.getBoundingClientRect();
      if (bounds.width <= 0) {
        return;
      }
      const widthPercentage = ((event.clientX - bounds.left) / bounds.width) * 100;
      setLeftPanelWidth(clampPanelWidth(widthPercentage));
    };
    const stopResizing = () => {
      setIsResizingPanels(false);
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [isResizingPanels]);

  const pinDialogProps: PinDialogProps = {
    isPinDialogOpen,
    setIsPinDialogOpen,
    isPinningWidget,
    activePinWidgetTitle,
    pinWidgetTitle,
    setPinWidgetTitle,
    selectedPinTargetKey,
    setSelectedPinTargetKey,
    pinTargets,
    setPinTargetTitle,
    isPinTargetsLoading,
    pinTargetTitle,
    setPinTargetTitleDirect: setPinTargetTitle,
    pinWidgetSpan,
    setPinWidgetSpan,
    pinDialogError,
    pinDialogSuccess,
    setPinDialogError,
    setPinDialogSuccess,
    canPinActiveWidget,
    handlePinActiveWidget,
  };

  return {
    // State
    prompt,
    setPrompt,
    attachments,
    submittedAttachments,
    isPreparingAttachments,
    isDraggingAttachment,
    setIsDraggingAttachment,
    selectedModel,
    setSelectedModel,
    submittedPrompt,
    isRunningAi,
    aiError,
    workflowStreamEntries,
    copiedPromptEntryId,
    expandedPrompts,
    activeStreamDataEntryId,
    isSessionSidebarExpanded,
    setIsSessionSidebarExpanded,
    isSessionSearchOpen,
    setIsSessionSearchOpen,
    sessionSearchQuery,
    setSessionSearchQuery,
    isRestoringSession,
    deletingHistorySessionId,
    historySessionPendingDelete,
    setHistorySessionPendingDelete,
    historySessionPendingRename,
    historySessionRenameTitle,
    setHistorySessionRenameTitle,
    isRenamingHistorySession,
    isPinDialogOpen,
    setIsPinDialogOpen,
    pinTargets,
    setPinTargets,
    selectedPinTargetKey,
    setSelectedPinTargetKey,
    isPinTargetsLoading,
    isPinningWidget,
    pinDialogError,
    setPinDialogError,
    pinDialogSuccess,
    setPinDialogSuccess,
    pinWidgetTitle,
    setPinWidgetTitle,
    pinWidgetSpan,
    setPinWidgetSpan,
    pinTargetTitle,
    setPinTargetTitle,
    resultView,
    setResultView,
    selectedHistorySessionId,
    isHistorySessionsLoading,
    leftPanelWidth,
    isResizingPanels,
    showLeftPanelBottomButton,
    // Derived
    hasSubmittedPrompt,
    isWelcomeState,
    isAttachmentAnswer,
    hasChartPanel,
    isRightPanelCollapsed,
    leftPanelDesktopWidth,
    normalizedSessionSearchQuery,
    filteredHistorySessions,
    sessionSidebarVisibleRange,
    dashboardVisualizationBlocks,
    activeDashboardBlock,
    setSelectedDashboardBlockId,
    previewStreamTable,
    previewStreamChart,
    activePinWidgetTitle,
    canPinActiveWidget,
    queryResultColumns,
    queryResultRows,
    selectedTableRightAlignedColumns,
    queryResultRightAlignedColumns,
    managerChartData,
    managerChartSeries,
    managerChartStatusItems,
    managerTopRows,
    // Refs
    promptTextareaRef,
    attachmentInputRef,
    leftPanelScrollRef,
    splitLayoutRef,
    splitHandleRef,
    sessionSearchInputRef,
    sessionSidebarScrollRef,
    setSessionSidebarScrollTop,
    // Actions
    startNewSession,
    startRenameHistorySession,
    cancelRenameHistorySession,
    handleRenameHistorySession,
    handleDeleteHistorySession,
    handleSelectHistorySession,
    cancelActiveRequest,
    openPinDialog,
    handlePinActiveWidget,
    pinDialogProps,
    handleSelectAttachments,
    handleDropAttachments,
    removeAttachment,
    handleRunAtm,
    handlePromptKeyDown,
    handlePromptPaste,
    handleCopyPromptEntry,
    togglePromptExpanded,
    handleOpenStreamDataTable,
    scrollLeftPanelToBottom,
    startPanelResize,
    // Panel state for resize handle
    MIN_PANEL_WIDTH_PERCENT,
    MAX_PANEL_WIDTH_PERCENT,
  };
}
