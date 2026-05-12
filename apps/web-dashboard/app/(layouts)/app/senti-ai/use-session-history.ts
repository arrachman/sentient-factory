'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { HistoryPromptDetail, HistoryPromptItem, HistorySessionItem, RunHistoryItem } from './_types';
import { buildRunHistoryFromPromptDetail } from './_utils-result';

const SESSION_SIDEBAR_ROW_HEIGHT = 72;
const SESSION_SIDEBAR_OVERSCAN = 6;

export interface SessionHistoryState {
  historySessions: HistorySessionItem[];
  setHistorySessions: React.Dispatch<React.SetStateAction<HistorySessionItem[]>>;
  selectedHistorySessionId: string | null;
  setSelectedHistorySessionId: React.Dispatch<React.SetStateAction<string | null>>;
  isHistorySessionsLoading: boolean;
  isSessionSidebarExpanded: boolean;
  setIsSessionSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSessionSearchOpen: boolean;
  setIsSessionSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sessionSearchQuery: string;
  setSessionSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isRestoringSession: boolean;
  setIsRestoringSession: React.Dispatch<React.SetStateAction<boolean>>;
  deletingHistorySessionId: string | null;
  historySessionPendingDelete: HistorySessionItem | null;
  setHistorySessionPendingDelete: React.Dispatch<React.SetStateAction<HistorySessionItem | null>>;
  historySessionPendingRename: HistorySessionItem | null;
  historySessionRenameTitle: string;
  setHistorySessionRenameTitle: React.Dispatch<React.SetStateAction<string>>;
  isRenamingHistorySession: boolean;
  sessionSearchInputRef: React.RefObject<HTMLInputElement | null>;
  sessionSidebarScrollRef: React.RefObject<HTMLDivElement | null>;
  setSessionSidebarScrollTop: React.Dispatch<React.SetStateAction<number>>;
  normalizedSessionSearchQuery: string;
  filteredHistorySessions: HistorySessionItem[];
  sessionSidebarVisibleRange: {
    topSpacerHeight: number;
    bottomSpacerHeight: number;
    items: HistorySessionItem[];
  };
  activeHistorySession: HistorySessionItem | null;
  skipNextRouteSessionRestoreRef: React.RefObject<boolean>;
  fetchHistorySessions: (preferredSessionKey?: string | null) => Promise<HistorySessionItem[]>;
  handleDeleteHistorySession: (sessionId: string) => Promise<void>;
  handleRenameHistorySession: (session: HistorySessionItem) => Promise<void>;
  handleSelectHistorySession: (session: HistorySessionItem) => void;
  startRenameHistorySession: (session: HistorySessionItem) => void;
  cancelRenameHistorySession: () => void;
  refreshHistoryAfterRun: (sessionKeyOverride?: string | null) => Promise<void>;
}

interface SessionHistoryOptions {
  activeSessionRouteId: string | null;
  currentSessionKey: string | null;
  runHistory: RunHistoryItem[];
  navigateToSession: (sessionId: string | null) => void;
  handleOpenHistoryRun: (item: RunHistoryItem, closeDialog?: boolean) => void;
}

export function useSessionHistory({
  activeSessionRouteId,
  currentSessionKey,
  runHistory,
  navigateToSession,
  handleOpenHistoryRun,
}: SessionHistoryOptions): SessionHistoryState {
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
  const [isRenamingHistorySession, setIsRenamingHistorySession] = useState(false);
  const [sessionSidebarViewportHeight, setSessionSidebarViewportHeight] = useState(0);
  const [sessionSidebarScrollTop, setSessionSidebarScrollTop] = useState(0);

  const sessionSearchInputRef = useRef<HTMLInputElement | null>(null);
  const sessionSidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const skipNextRouteSessionRestoreRef = useRef(false);

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

  // Sync viewport height and scroll for virtual list
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

  // Focus search input when opened
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

  // Clear search query when closed
  useEffect(() => {
    if (isSessionSearchOpen) {
      return;
    }
    setSessionSearchQuery('');
  }, [isSessionSearchOpen]);

  // Sync selectedHistorySessionId when activeSessionRouteId changes
  useEffect(() => {
    if (!activeSessionRouteId) {
      return;
    }
    setSelectedHistorySessionId(activeSessionRouteId);
  }, [activeSessionRouteId, historySessions]);

  // Restore session content from route
  useEffect(() => {
    if (!activeSessionRouteId) {
      setIsRestoringSession(false);
      return;
    }
    const selectedSession = historySessions.find((item) => item.id === activeSessionRouteId);
    if (
      skipNextRouteSessionRestoreRef.current &&
      selectedSession?.session_key === currentSessionKey
    ) {
      skipNextRouteSessionRestoreRef.current = false;
      setIsRestoringSession(false);
      return;
    }
    let cancelled = false;
    setIsRestoringSession(true);
    void (async () => {
      try {
        const pr = await fetch(`/api/ai/history/sessions/${activeSessionRouteId}/prompts`, { cache: 'no-store' });
        const pp = (await pr.json().catch(() => null)) as { success?: boolean; data?: HistoryPromptItem[] } | null;
        if (!pr.ok || !pp?.success || !Array.isArray(pp.data) || pp.data.length === 0 || cancelled) return;
        const latest = pp.data[pp.data.length - 1];
        const dr = await fetch(`/api/ai/history/prompts/${latest.id}`, { cache: 'no-store' });
        const dp = (await dr.json().catch(() => null)) as { success?: boolean; data?: HistoryPromptDetail } | null;
        if (!dr.ok || !dp?.success || !dp.data?.prompt || cancelled) return;
        handleOpenHistoryRun(
          buildRunHistoryFromPromptDetail(dp.data, selectedSession?.session_key || null, selectedSession?.mode || 'ask'),
          false,
        );
      } finally {
        if (!cancelled) setIsRestoringSession(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeSessionRouteId, currentSessionKey, historySessions]);

  // Initial load
  useEffect(() => {
    void fetchHistorySessions();
  }, []);

  return {
    historySessions,
    setHistorySessions,
    selectedHistorySessionId,
    setSelectedHistorySessionId,
    isHistorySessionsLoading,
    isSessionSidebarExpanded,
    setIsSessionSidebarExpanded,
    isSessionSearchOpen,
    setIsSessionSearchOpen,
    sessionSearchQuery,
    setSessionSearchQuery,
    isRestoringSession,
    setIsRestoringSession,
    deletingHistorySessionId,
    historySessionPendingDelete,
    setHistorySessionPendingDelete,
    historySessionPendingRename,
    historySessionRenameTitle,
    setHistorySessionRenameTitle,
    isRenamingHistorySession,
    sessionSearchInputRef,
    sessionSidebarScrollRef,
    setSessionSidebarScrollTop,
    normalizedSessionSearchQuery,
    filteredHistorySessions,
    sessionSidebarVisibleRange,
    activeHistorySession,
    skipNextRouteSessionRestoreRef,
    fetchHistorySessions,
    handleDeleteHistorySession,
    handleRenameHistorySession,
    handleSelectHistorySession,
    startRenameHistorySession,
    cancelRenameHistorySession,
    refreshHistoryAfterRun,
  };
}
