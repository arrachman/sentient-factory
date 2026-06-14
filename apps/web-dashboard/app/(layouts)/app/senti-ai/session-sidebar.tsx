'use client';

import { EllipsisVertical, PanelLeft, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { HistorySessionItem } from './_types';
import { WordSafeSingleLineText } from './word-safe-text';

interface SessionSidebarVisibleRange {
  topSpacerHeight: number;
  bottomSpacerHeight: number;
  items: HistorySessionItem[];
}

export interface SessionSidebarProps {
  isSessionSidebarExpanded: boolean;
  setIsSessionSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSessionSearchOpen: boolean;
  setIsSessionSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sessionSearchQuery: string;
  setSessionSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredHistorySessions: HistorySessionItem[];
  sessionSidebarVisibleRange: SessionSidebarVisibleRange;
  selectedHistorySessionId: string | null;
  isHistorySessionsLoading: boolean;
  isRestoringSession: boolean;
  normalizedSessionSearchQuery: string;
  startNewSession: () => void;
  handleSelectHistorySession: (session: HistorySessionItem) => void;
  startRenameHistorySession: (session: HistorySessionItem) => void;
  setHistorySessionPendingDelete: React.Dispatch<React.SetStateAction<HistorySessionItem | null>>;
  deletingHistorySessionId: string | null;
  sessionSearchInputRef: React.RefObject<HTMLInputElement | null>;
  sessionSidebarScrollRef: React.RefObject<HTMLDivElement | null>;
  setSessionSidebarScrollTop: React.Dispatch<React.SetStateAction<number>>;
}

export function SessionSidebar({
  isSessionSidebarExpanded,
  setIsSessionSidebarExpanded,
  isSessionSearchOpen,
  setIsSessionSearchOpen,
  sessionSearchQuery,
  setSessionSearchQuery,
  filteredHistorySessions,
  sessionSidebarVisibleRange,
  selectedHistorySessionId,
  isHistorySessionsLoading,
  isRestoringSession,
  normalizedSessionSearchQuery,
  startNewSession,
  handleSelectHistorySession,
  startRenameHistorySession,
  setHistorySessionPendingDelete,
  deletingHistorySessionId,
  sessionSearchInputRef,
  sessionSidebarScrollRef,
  setSessionSidebarScrollTop,
}: SessionSidebarProps) {
  return (
    <aside className="min-h-0">
      <div className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)] xl:sticky xl:top-4 xl:h-[calc(100dvh-8rem)] ${
        isRestoringSession ? '' : 'transition-all duration-300 ease-out'
      }`}>
        <div className="flex h-full flex-col">
          <div
            className={`border-b border-slate-200 px-4 py-4 dark:border-slate-800 ${
              isRestoringSession ? '' : 'transition-all duration-300 ease-out'
            } ${
              isSessionSidebarExpanded ? '' : 'px-2 py-3'
            }`}
          >
            <div className="space-y-3">
              <div className={`flex ${isSessionSidebarExpanded ? 'items-center justify-between gap-2' : 'flex-col items-center gap-2'}`}>
                <button
                  type="button"
                  onClick={() => setIsSessionSidebarExpanded((current) => !current)}
                  className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 ${
                    isSessionSidebarExpanded ? 'size-10' : 'size-11'
                  }`}
                  aria-label={isSessionSidebarExpanded ? 'Collapse sessions sidebar' : 'Expand sessions sidebar'}
                  title={isSessionSidebarExpanded ? 'Collapse' : 'Expand'}
                >
                  <PanelLeft className={isSessionSidebarExpanded ? 'size-5' : 'size-6'} />
                </button>
                <div className={`flex ${isSessionSidebarExpanded ? 'items-center gap-1' : 'flex-col items-center gap-2'}`}>
                  <button
                    type="button"
                    onClick={startNewSession}
                    className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                    aria-label="Start new session"
                    title="New chat"
                  >
                    <Plus className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSessionSidebarExpanded) {
                        setIsSessionSidebarExpanded(true);
                        setIsSessionSearchOpen(true);
                        return;
                      }
                      setIsSessionSearchOpen((current) => !current);
                    }}
                    className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                    aria-label="Toggle session search"
                    title="Search sessions"
                  >
                    <Search className="size-5" />
                  </button>
                </div>
              </div>
              <div
                className={`overflow-hidden ${
                  isRestoringSession ? '' : 'transition-all duration-300 ease-out'
                } ${
                  isSessionSidebarExpanded
                    ? 'max-h-20 max-w-[220px] opacity-100 translate-x-0'
                    : 'max-h-0 max-w-0 opacity-0 -translate-x-2'
                }`}
              >
                <div>
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sessions</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Riwayat percakapan dikelompokkan per session.
                  </div>
                </div>
              </div>
              {isSessionSidebarExpanded && isSessionSearchOpen ? (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={sessionSearchInputRef}
                    value={sessionSearchQuery}
                    onChange={(event) => setSessionSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        event.preventDefault();
                        setIsSessionSearchOpen(false);
                      }
                    }}
                    placeholder="Search title or prompt"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                  {sessionSearchQuery.trim().length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSessionSearchQuery('');
                        window.requestAnimationFrame(() => {
                          sessionSearchInputRef.current?.focus();
                        });
                      }}
                      className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div
            ref={sessionSidebarScrollRef}
            onScroll={(event) => {
              setSessionSidebarScrollTop(event.currentTarget.scrollTop);
            }}
            className={`flex-1 overflow-y-auto ${isSessionSidebarExpanded ? 'p-4' : 'p-2'}`}
          >
            <div
              className={`space-y-2 ${
                isRestoringSession ? '' : 'transition-all duration-300 ease-out'
              } ${
                isSessionSidebarExpanded
                  ? 'pointer-events-auto opacity-100 translate-y-0'
                  : 'pointer-events-none opacity-0 translate-y-2'
              }`}
            >
              {isHistorySessionsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 rounded-lg" />
                ))
              ) : filteredHistorySessions.length > 0 ? (
                <>
                  {sessionSidebarVisibleRange.topSpacerHeight > 0 ? (
                    <div style={{ height: sessionSidebarVisibleRange.topSpacerHeight }} aria-hidden="true" />
                  ) : null}
                  {sessionSidebarVisibleRange.items.map((session) => (
                    <div
                      key={session.id}
                      className={`group rounded-xl border px-3 py-3 transition ${
                        selectedHistorySessionId === session.id
                          ? 'border-sky-200 bg-sky-50/80 text-sky-950 shadow-[0_12px_24px_-20px_rgba(14,165,233,0.9)] dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-50'
                          : 'border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectHistorySession(session)}
                          className="min-h-8 min-w-0 flex-1 cursor-pointer text-left"
                        >
                          <WordSafeSingleLineText
                            text={session.title || session.session_key}
                            className="block overflow-hidden whitespace-nowrap leading-normal text-[15px] font-semibold"
                          />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                              aria-label="Session actions"
                              title="Session actions"
                            >
                              <EllipsisVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => startRenameHistorySession(session)}>
                              <Pencil className="mr-2 size-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setHistorySessionPendingDelete(session)}
                              disabled={deletingHistorySessionId === session.id}
                              className="text-rose-600 focus:text-rose-600 dark:text-rose-300 dark:focus:text-rose-300"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {sessionSidebarVisibleRange.bottomSpacerHeight > 0 ? (
                    <div style={{ height: sessionSidebarVisibleRange.bottomSpacerHeight }} aria-hidden="true" />
                  ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  {normalizedSessionSearchQuery ? 'Tidak ada session yang cocok.' : 'Belum ada history session.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
