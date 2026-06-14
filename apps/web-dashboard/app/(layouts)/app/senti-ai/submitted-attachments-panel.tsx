'use client';

import { getAttachmentIcon } from './attachment-file-tile';
import { formatAttachmentSize } from './_utils-format';
import type { PromptAttachment } from './attachment-utils';

export interface SubmittedAttachmentsPanelProps {
  submittedAttachments: PromptAttachment[];
  isAttachmentAnswer: boolean;
}

export function SubmittedAttachmentsPanel({ submittedAttachments, isAttachmentAnswer }: SubmittedAttachmentsPanelProps) {
  return (
    <div className="mx-auto w-full max-w-[820px] lg:max-w-[860px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800/80">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Attachment Context
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              File yang ikut diproses bersama prompt ini.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {submittedAttachments.length} file
            </span>
            {isAttachmentAnswer ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                OCR processed
              </span>
            ) : null}
          </div>
        </div>
        <div className="space-y-3 px-4 py-4">
          {submittedAttachments.map((attachment) => {
            const AttachmentIcon = getAttachmentIcon(attachment);
            return (
              <div
                key={attachment.id}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                    <AttachmentIcon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {attachment.name}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        {attachment.status}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        {formatAttachmentSize(attachment.size)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {attachment.preview}
                    </div>
                    {attachment.warning ? (
                      <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        {attachment.warning}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
