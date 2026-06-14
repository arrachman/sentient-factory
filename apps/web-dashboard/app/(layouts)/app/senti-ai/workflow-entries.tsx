'use client';

import { ArrowRight, Check, ChevronDown, ChevronUp, Copy, X } from 'lucide-react';
import { useMemo } from 'react';
import type { WorkflowStreamEntry } from './_types';
import { applyNormalizedClipboardCopy, formatPromptPreview, isCodeLikeText } from './_utils-format';
import { extractWorkflowDisplayText, getWorkflowStreamDisplayPayload } from './_utils-workflow';
import { renderRichTextMarkdown } from './_utils-result';

export interface WorkflowEntriesProps {
  workflowStreamEntries: WorkflowStreamEntry[];
  expandedPrompts: Record<string, boolean>;
  copiedPromptEntryId: string | null;
  activeStreamDataEntryId: string | null;
  handleCopyPromptEntry: (entryId: string, promptValue: string) => Promise<void>;
  togglePromptExpanded: (key: string) => void;
  handleOpenStreamDataTable: (entryId: string, payload: string) => void;
}

export function WorkflowEntries({
  workflowStreamEntries,
  expandedPrompts,
  copiedPromptEntryId,
  activeStreamDataEntryId,
  handleCopyPromptEntry,
  togglePromptExpanded,
  handleOpenStreamDataTable,
}: WorkflowEntriesProps) {
  const rendered = useMemo(
    () =>
      workflowStreamEntries.map((entry, index) => (
        <div key={entry.id}>
          {entry.kind === 'user' ? (
            <div className="mx-auto mt-5 flex w-full max-w-[900px] justify-end">
              {(() => {
                const expanded = expandedPrompts[entry.id] ?? false;
                const preview = expanded ? entry.payload : formatPromptPreview(entry.payload, 220);
                const isLongPrompt = formatPromptPreview(entry.payload, 220) !== entry.payload;

                return (
                  <div className="group flex w-fit items-start gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopyPromptEntry(entry.id, entry.payload)}
                      className={`mt-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-[#7E8299] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.04)] transition hover:border-sky-200 hover:text-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-sky-500/40 dark:hover:text-sky-300 ${
                        copiedPromptEntryId === entry.id
                          ? 'opacity-100'
                          : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
                      }`}
                      aria-label="Copy prompt"
                      title={copiedPromptEntryId === entry.id ? 'Copied' : 'Copy prompt'}
                    >
                      {copiedPromptEntryId === entry.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                    <div
                      className="w-full rounded-[12px_12px_0px_12px] bg-[#009EF7] px-4 py-3 text-[15px] font-normal leading-6 text-white shadow-[0px_10px_24px_-12px_rgba(0,158,247,0.55)] dark:bg-[#1B84FF] dark:shadow-[0px_10px_24px_-12px_rgba(27,132,255,0.45)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, preview);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>{preview}</div>
                        {isLongPrompt ? (
                          <button
                            type="button"
                            onClick={() => togglePromptExpanded(entry.id)}
                            className="cursor-pointer rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                            aria-label={expanded ? 'Collapse prompt' : 'Expand prompt'}
                          >
                            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (() => {
              if (entry.event === 'completed') {
                const hasPriorInsight = workflowStreamEntries
                  .slice(0, index)
                  .some((candidate) => {
                    if (candidate.kind !== 'event' || candidate.event !== 'ai_insight_completed') {
                      return false;
                    }
                    return extractWorkflowDisplayText(candidate.payload) === extractWorkflowDisplayText(entry.payload);
                  });

                if (hasPriorInsight) {
                  return null;
                }
              }

              const display = getWorkflowStreamDisplayPayload(entry.payload);

              if (display.kind === 'none') {
                return null;
              }
              return (
                <div className="mx-auto mt-4 w-full max-w-[820px] lg:max-w-[860px]">
                  {display.kind === 'data' ? (
                    (() => {
                      const isActiveDataEntry = activeStreamDataEntryId === entry.id;

                      return (
                        <div className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]">
                          <div className="border-s-4 border-[#009EF7] px-5 py-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-[#3F4254] dark:text-slate-100">
                                  {display.text}
                                </div>
                              </div>
                              <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleOpenStreamDataTable(entry.id, entry.payload)}
                                className="shrink-0 cursor-pointer text-sm font-medium text-[#009EF7] transition hover:text-[#1B84FF] dark:text-indigo-300 dark:hover:text-indigo-200"
                              >
                                {isActiveDataEntry ? (
                                  <span className="inline-flex items-center gap-1">
                                    <X className="size-3.5" />
                                    Tutup hasil
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1">
                                    <ArrowRight className="size-3.5" />
                                    Lihat tabel / dashboard
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : display.kind === 'insight' ? (
                    <div
                      className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                    >
                      <div className="border-s-4 border-[#009EF7] bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] px-3 py-3 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.94)_0%,_rgba(15,23,42,0.92)_100%)]">
                        <div className="text-[15px] leading-8 text-[#3F4254] dark:text-slate-100">
                          {renderRichTextMarkdown(display.text)}
                        </div>
                      </div>
                    </div>
                  ) : display.kind === 'explanation' ? (
                    <div
                      className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                    >
                      <div className="border-s-4 border-[#FFA800] bg-[linear-gradient(180deg,_#ffffff_0%,_#fffaf3_100%)] px-3 py-3 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.94)_0%,_rgba(30,20,5,0.9)_100%)]">
                        <div className="text-[15px] leading-8 text-[#3F4254] dark:text-slate-100">
                          {renderRichTextMarkdown(display.text)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <pre
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                      className={`overflow-x-auto whitespace-pre-wrap break-words rounded-xl border px-4 py-4 text-[13px] font-normal leading-6 text-[#3F4254] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:text-slate-300 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)] ${
                        isCodeLikeText(display.text)
                          ? 'border-[#E4E6EF] bg-slate-900 font-mono text-[12px] text-slate-100 dark:border-slate-800 dark:bg-slate-950'
                          : 'border-[#E4E6EF] bg-white dark:border-slate-800 dark:bg-slate-950'
                      }`}
                    >
                      {display.text}
                    </pre>
                  )}
                </div>
              );
            })()}
        </div>
      )),
    [
      activeStreamDataEntryId,
      copiedPromptEntryId,
      expandedPrompts,
      handleCopyPromptEntry,
      handleOpenStreamDataTable,
      togglePromptExpanded,
      workflowStreamEntries,
    ],
  );

  return <>{rendered}</>;
}
