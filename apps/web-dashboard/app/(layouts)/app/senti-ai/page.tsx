'use client';

import { ArrowDown, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { SubmittedAttachmentsPanel } from './submitted-attachments-panel';
import { SessionSidebar } from './session-sidebar';
import { RenameDialog, DeleteDialog } from './ai-dialogs';
import { ResultPanel } from './result-panel';
import { PromptComposer } from './prompt-composer';
import { WelcomeScreen, promptSuggestions } from './welcome-screen';
import { WorkflowEntries } from './workflow-entries';
import { useManagerDashboard } from './use-manager-dashboard';

export default function ManagerDashboardPage() {
  const params = useParams<{ sessionId?: string }>();
  const routeSessionId =
    params && typeof params.sessionId === 'string' && params.sessionId.trim().length > 0
      ? params.sessionId
      : null;

  const {
    prompt,
    setPrompt,
    attachments,
    submittedAttachments,
    isPreparingAttachments,
    isDraggingAttachment,
    setIsDraggingAttachment,
    selectedModel,
    setSelectedModel,
    isRunningAi,
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
    resultView,
    setResultView,
    selectedHistorySessionId,
    isHistorySessionsLoading,
    leftPanelWidth,
    showLeftPanelBottomButton,
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
    canPinActiveWidget,
    queryResultColumns,
    queryResultRows,
    selectedTableRightAlignedColumns,
    queryResultRightAlignedColumns,
    managerChartData,
    managerChartSeries,
    managerChartStatusItems,
    managerTopRows,
    promptTextareaRef,
    attachmentInputRef,
    leftPanelScrollRef,
    splitLayoutRef,
    splitHandleRef,
    sessionSearchInputRef,
    sessionSidebarScrollRef,
    setSessionSidebarScrollTop,
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
    MIN_PANEL_WIDTH_PERCENT,
    MAX_PANEL_WIDTH_PERCENT,
  } = useManagerDashboard(routeSessionId);

  return (
    <div
      className="w-full space-y-3 bg-[#F5F8FA] px-6 py-4 dark:bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Inter", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div
        className={`grid gap-3 ${
          isRestoringSession ? '' : 'transition-[grid-template-columns] duration-300 ease-out'
        } ${
          isSessionSidebarExpanded
            ? 'xl:grid-cols-[320px_minmax(0,1fr)]'
            : 'xl:grid-cols-[64px_minmax(0,1fr)]'
        }`}
      >
        <SessionSidebar
          isSessionSidebarExpanded={isSessionSidebarExpanded}
          setIsSessionSidebarExpanded={setIsSessionSidebarExpanded}
          isSessionSearchOpen={isSessionSearchOpen}
          setIsSessionSearchOpen={setIsSessionSearchOpen}
          sessionSearchQuery={sessionSearchQuery}
          setSessionSearchQuery={setSessionSearchQuery}
          filteredHistorySessions={filteredHistorySessions}
          sessionSidebarVisibleRange={sessionSidebarVisibleRange}
          selectedHistorySessionId={selectedHistorySessionId}
          isHistorySessionsLoading={isHistorySessionsLoading}
          isRestoringSession={isRestoringSession}
          normalizedSessionSearchQuery={normalizedSessionSearchQuery}
          startNewSession={startNewSession}
          handleSelectHistorySession={handleSelectHistorySession}
          startRenameHistorySession={startRenameHistorySession}
          setHistorySessionPendingDelete={setHistorySessionPendingDelete}
          deletingHistorySessionId={deletingHistorySessionId}
          sessionSearchInputRef={sessionSearchInputRef}
          sessionSidebarScrollRef={sessionSidebarScrollRef}
          setSessionSidebarScrollTop={setSessionSidebarScrollTop}
        />

        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl bg-transparent lg:flex lg:h-[calc(100dvh-8rem)] lg:flex-col">
            <div
              ref={splitLayoutRef}
              className="relative flex min-h-0 flex-1 flex-col gap-0 lg:flex-row"
              style={{ ['--left-panel-width' as string]: `${leftPanelWidth}%` }}
            >
              <div
                className={`flex min-h-0 min-w-0 w-full flex-col border-b border-slate-200/80 bg-transparent dark:border-slate-800/80 lg:min-h-0 ${
                  isRestoringSession ? '' : 'transition-[width] duration-500 ease-out'
                } ${
                  hasChartPanel
                    ? 'lg:flex-none lg:shrink-0 lg:border-b-0 lg:border-r'
                    : 'flex-1 lg:border-b-0 lg:w-full'
                }`}
                style={hasChartPanel ? { width: leftPanelDesktopWidth } : undefined}
              >
                <div className="flex min-h-0 flex-1 flex-col">
                  <div ref={leftPanelScrollRef} className="flex min-h-0 flex-1 flex-col overflow-auto p-3 pb-4">
                    <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-400 text-white shadow-[0_12px_24px_-12px_rgba(59,130,246,0.9)] dark:shadow-[0_16px_28px_-16px_rgba(56,189,248,0.55)]">
                            ∞
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Senti Agent</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Factory intelligence workspace</div>
                          </div>
                        </div>
                      </div>
                      <RenameDialog
                        historySessionPendingRename={historySessionPendingRename}
                        historySessionRenameTitle={historySessionRenameTitle}
                        setHistorySessionRenameTitle={setHistorySessionRenameTitle}
                        isRenamingHistorySession={isRenamingHistorySession}
                        handleRenameHistorySession={handleRenameHistorySession}
                        cancelRenameHistorySession={cancelRenameHistorySession}
                      />
                      <DeleteDialog
                        historySessionPendingDelete={historySessionPendingDelete}
                        setHistorySessionPendingDelete={setHistorySessionPendingDelete}
                        deletingHistorySessionId={deletingHistorySessionId}
                        handleDeleteHistorySession={handleDeleteHistorySession}
                      />

                      {isRunningAi && workflowStreamEntries.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center py-6 text-sm text-slate-500 dark:text-slate-400">
                          Menunggu event pertama dari SSE stream...
                        </div>
                      ) : (
                        <div className={isWelcomeState ? 'flex flex-1 items-center justify-center' : 'space-y-5'}>
                          {isWelcomeState ? (
                            <WelcomeScreen
                              onSelectSuggestion={(label) => {
                                setPrompt(label);
                                window.requestAnimationFrame(() => {
                                  promptTextareaRef.current?.focus();
                                });
                              }}
                            />
                          ) : (
                            <>
                              <h2 className="max-w-xl text-right text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                {hasSubmittedPrompt ? '' : 'Ask anything to start your analysis.'}
                              </h2>
                              {!hasSubmittedPrompt ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                  {promptSuggestions.map((suggestion) => (
                                    <button
                                      key={suggestion.label}
                                      type="button"
                                      onClick={() => {
                                        setPrompt(suggestion.label);
                                        window.requestAnimationFrame(() => {
                                          promptTextareaRef.current?.focus();
                                        });
                                      }}
                                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-600 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] transition hover:-translate-y-0.5 hover:border-[#009EF7] hover:bg-[#F1FAFF] hover:text-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:bg-slate-900 dark:hover:text-sky-300"
                                    >
                                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1FAFF] text-[#009EF7] dark:bg-sky-500/10 dark:text-sky-300">
                                        <suggestion.icon className="size-4" />
                                      </span>
                                      <span>{suggestion.label}</span>
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </>
                          )}
                          {submittedAttachments.length > 0 ? (
                            <SubmittedAttachmentsPanel
                              submittedAttachments={submittedAttachments}
                              isAttachmentAnswer={isAttachmentAnswer}
                            />
                          ) : null}
                          <WorkflowEntries
                            workflowStreamEntries={workflowStreamEntries}
                            expandedPrompts={expandedPrompts}
                            copiedPromptEntryId={copiedPromptEntryId}
                            activeStreamDataEntryId={activeStreamDataEntryId}
                            handleCopyPromptEntry={handleCopyPromptEntry}
                            togglePromptExpanded={togglePromptExpanded}
                            handleOpenStreamDataTable={handleOpenStreamDataTable}
                          />
                          {isRunningAi ? (
                            <div className="mx-auto mt-3 flex w-full max-w-[820px] items-center gap-2 px-1 text-sm text-slate-500 lg:max-w-[860px] dark:text-slate-400">
                              <LoaderCircle className="size-4 animate-spin text-[#009EF7]" />
                              <span>Senti sedang memproses jawaban...</span>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {showLeftPanelBottomButton ? (
                      <div className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={scrollLeftPanelToBottom}
                          className="ml-auto flex gap-2 rounded-xl px-3 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                        >
                          <ArrowDown className="size-4" />
                          Bottom
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                ref={splitHandleRef}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize panels"
                aria-valuemin={MIN_PANEL_WIDTH_PERCENT}
                aria-valuemax={MAX_PANEL_WIDTH_PERCENT}
                aria-valuenow={Math.round(leftPanelWidth)}
                onPointerDown={startPanelResize}
                onMouseDown={startPanelResize}
                className={`group absolute inset-y-0 z-20 hidden w-5 cursor-col-resize touch-none select-none items-center justify-center bg-transparent lg:flex ${
                  isRestoringSession ? '' : 'transition-all duration-500 ease-out'
                } ${
                  hasChartPanel ? 'lg:opacity-100' : 'lg:pointer-events-none lg:opacity-0'
                }`}
                style={
                  hasChartPanel
                    ? {
                        left: isRightPanelCollapsed
                          ? 'calc(100% - 0.625rem)'
                          : `calc(${leftPanelWidth}% - 0.625rem)`,
                      }
                    : undefined
                }
              >
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2" />
                <div className="pointer-events-none flex h-full w-full items-center justify-center">
                  <div className="h-full w-px bg-slate-200 transition group-hover:w-0.5 group-hover:bg-[#009EF7] dark:bg-slate-800 dark:group-hover:bg-sky-400" />
                </div>
              </div>

              <div
                className={`min-w-0 overflow-auto bg-transparent ${
                  isRestoringSession ? '' : 'transition-all duration-500 ease-out'
                } ${
                  hasChartPanel && !isRightPanelCollapsed
                    ? 'flex-1 translate-x-0 opacity-100 p-3'
                    : 'max-lg:hidden lg:max-w-0 lg:flex-none lg:translate-x-4 lg:overflow-hidden lg:opacity-0 lg:p-0 lg:pointer-events-none'
                }`}
              >
                <ResultPanel
                  resultView={resultView}
                  setResultView={setResultView}
                  hasSubmittedPrompt={hasSubmittedPrompt}
                  previewStreamChart={previewStreamChart}
                  previewStreamTable={previewStreamTable}
                  dashboardVisualizationBlocks={dashboardVisualizationBlocks}
                  activeDashboardBlock={activeDashboardBlock}
                  setSelectedDashboardBlockId={setSelectedDashboardBlockId}
                  selectedTableRightAlignedColumns={selectedTableRightAlignedColumns}
                  queryResultColumns={queryResultColumns}
                  queryResultRows={queryResultRows}
                  queryResultRightAlignedColumns={queryResultRightAlignedColumns}
                  managerChartData={managerChartData}
                  managerChartSeries={managerChartSeries}
                  managerChartStatusItems={managerChartStatusItems}
                  managerTopRows={managerTopRows}
                  openPinDialog={openPinDialog}
                  canPinActiveWidget={canPinActiveWidget}
                  pinDialogProps={pinDialogProps}
                />
              </div>
            </div>

            <PromptComposer
              prompt={prompt}
              setPrompt={setPrompt}
              attachments={attachments}
              isPreparingAttachments={isPreparingAttachments}
              isDraggingAttachment={isDraggingAttachment}
              setIsDraggingAttachment={setIsDraggingAttachment}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              isRunningAi={isRunningAi}
              promptTextareaRef={promptTextareaRef}
              attachmentInputRef={attachmentInputRef}
              handlePromptKeyDown={handlePromptKeyDown}
              handlePromptPaste={handlePromptPaste}
              handleDropAttachments={handleDropAttachments}
              handleSelectAttachments={handleSelectAttachments}
              removeAttachment={removeAttachment}
              cancelActiveRequest={cancelActiveRequest}
              handleRunAtm={handleRunAtm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

