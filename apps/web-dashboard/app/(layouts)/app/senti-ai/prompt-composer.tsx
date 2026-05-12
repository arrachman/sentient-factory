'use client';

import { AlertCircle, LoaderCircle, Paperclip, SearchCode, Send, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PromptAttachment } from './attachment-utils';
import { AttachmentFileTile, getAttachmentIcon } from './attachment-file-tile';
import { clampAttachmentName, formatAttachmentSize } from './_utils-format';

export interface PromptComposerProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  attachments: PromptAttachment[];
  isPreparingAttachments: boolean;
  isDraggingAttachment: boolean;
  setIsDraggingAttachment: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModel: 'senti-1.0';
  setSelectedModel: React.Dispatch<React.SetStateAction<'senti-1.0'>>;
  isRunningAi: boolean;
  promptTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  handlePromptKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handlePromptPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => Promise<void>;
  handleDropAttachments: (files: FileList | null) => Promise<void>;
  handleSelectAttachments: (fileList: FileList | null) => Promise<void>;
  removeAttachment: (attachmentId: string) => void;
  cancelActiveRequest: () => void;
  handleRunAtm: () => Promise<void>;
}

export function PromptComposer({
  prompt,
  setPrompt,
  attachments,
  isPreparingAttachments,
  isDraggingAttachment,
  setIsDraggingAttachment,
  selectedModel,
  setSelectedModel,
  isRunningAi,
  promptTextareaRef,
  attachmentInputRef,
  handlePromptKeyDown,
  handlePromptPaste,
  handleDropAttachments,
  handleSelectAttachments,
  removeAttachment,
  cancelActiveRequest,
  handleRunAtm,
}: PromptComposerProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-[#F5F8FA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F8FA]/90 dark:border-slate-800/80 dark:bg-slate-950/90 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="relative flex min-h-[118px] w-full flex-col justify-end bg-transparent px-3 py-3">
        <div
          className={`mx-auto mt-auto w-full max-w-[780px] rounded-[1.2rem] border bg-white px-4 pt-3.5 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.05)] transition focus-within:border-[#009EF7] focus-within:shadow-[0px_0px_20px_0px_rgba(0,158,247,0.10)] dark:bg-[#171c26] dark:shadow-[0_0_24px_0_rgba(2,6,23,0.5)] dark:focus-within:border-sky-500/50 ${
            isDraggingAttachment
              ? 'border-[#009EF7] bg-[#F1FAFF] shadow-[0px_0px_20px_0px_rgba(0,158,247,0.10)] dark:border-sky-500 dark:bg-slate-900'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDraggingAttachment(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isDraggingAttachment) {
              setIsDraggingAttachment(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            const currentTarget = event.currentTarget;
            const relatedTarget = event.relatedTarget;
            if (!relatedTarget || !(relatedTarget instanceof Node) || !currentTarget.contains(relatedTarget)) {
              setIsDraggingAttachment(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            void handleDropAttachments(event.dataTransfer?.files ?? null);
          }}
        >
          <input
            ref={attachmentInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.xlsx,.xls,.xlsm,.csv,.doc,.docx,.txt,.json,.md,.xml,.html,.png,.jpg,.jpeg,.webp,.gif,.bmp"
            onChange={(event) => {
              void handleSelectAttachments(event.target.files);
            }}
          />
          <Textarea
            ref={promptTextareaRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handlePromptKeyDown}
            onPaste={(event) => {
              void handlePromptPaste(event);
            }}
            className="min-h-[50px] resize-none overflow-hidden !border-0 !bg-transparent px-0 py-0 text-[15px] font-normal leading-relaxed text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Ask anything about finance, warehouse, purchase and sales"
          />

          {isDraggingAttachment ? (
            <div className="mt-3 rounded-2xl border border-dashed border-[#009EF7] bg-[#F1FAFF] px-4 py-3 text-sm font-medium text-[#009EF7] dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300">
              Lepas file di sini untuk menambah attachment ke prompt.
            </div>
          ) : null}

          {attachments.length > 0 ? (
            <div className="mt-3 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {attachments.map((attachment) => {
                  const isImageAttachment = attachment.type.startsWith('image/');
                  const isInvalidAttachment = attachment.status === 'failed';
                  const attachmentTypeLabel = attachment.extension
                    ? attachment.extension.toUpperCase()
                    : attachment.type || 'FILE';
                  return (
                    <div
                      key={attachment.id}
                      className={`group relative rounded-2xl border px-3 py-2 text-xs ${
                        isInvalidAttachment
                          ? 'border-rose-300 bg-rose-700 text-white dark:border-rose-500/50 dark:bg-rose-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300'
                      } ${
                        isInvalidAttachment
                          ? 'w-fit max-w-[280px]'
                          : isImageAttachment
                          ? 'w-[104px]'
                          : 'flex w-fit max-w-[320px] items-start gap-2'
                      }`}
                    >
                      {isInvalidAttachment ? (
                        <div className="min-w-0 pr-8">
                          <div className="truncate font-semibold text-white">
                            {clampAttachmentName(attachment.name)}
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-50/95">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {attachment.warning || attachment.preview || 'File tidak sesuai aturan dan tidak akan dimasukkan ke prompt.'}
                            </span>
                          </div>
                        </div>
                      ) : isImageAttachment ? (
                        <>
                          <div className="overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <Image
                              src={attachment.previewUrl ?? ''}
                              alt={attachment.name}
                              width={80}
                              height={52}
                              unoptimized
                              className={`h-[52px] w-full object-cover ${
                                isInvalidAttachment ? 'opacity-70' : ''
                              }`}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <AttachmentFileTile attachment={attachment} typeLabel={attachmentTypeLabel} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate pr-8 font-semibold text-slate-700 dark:text-slate-100">
                              {clampAttachmentName(attachment.name)}
                            </div>
                            <div className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                              {attachmentTypeLabel}
                            </div>
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className={`absolute z-10 cursor-pointer rounded-full border p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100 ${
                          isInvalidAttachment
                            ? 'right-2 top-2 border-rose-200/50 bg-white/15 text-white hover:bg-white/25 hover:text-white dark:border-rose-200/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                        } ${
                          isImageAttachment || isInvalidAttachment ? 'right-2 top-2' : 'right-3 top-1.5'
                        }`}
                        aria-label={`Remove ${attachment.name}`}
                      >
                        <X className="size-4.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-2.5 flex items-center justify-between gap-3 pb-3.5 text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Paperclip className="size-3.5" />
                {isPreparingAttachments ? 'Reading file...' : 'Attachment'}
              </button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <SearchCode className="size-3.5" />
                MyERPPlus
              </button>
              <div className="flex items-center gap-2 text-xs">
                {!isRunningAi ? <span>Paste image/file dengan Ctrl+V atau drag file ke composer.</span> : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={selectedModel}
                onValueChange={(value) => setSelectedModel(value as 'senti-1.0')}
              >
                <SelectTrigger className="h-9 min-w-[84px] rounded-full border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="senti-1.0">Senti 1.0</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                className={`h-9 min-w-9 rounded-full px-3 transition ${
                  isRunningAi
                    ? 'min-w-[100px] gap-2 bg-slate-900 text-white shadow-[0px_10px_24px_-12px_rgba(15,23,42,0.45)] hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                    : prompt.trim()
                      ? 'bg-[#009EF7] text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)] hover:bg-[#07a5ff] dark:hover:bg-[#3b97ff]'
                      : 'bg-slate-200 text-slate-500 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-800'
                } disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500`}
                onClick={() => {
                  if (isRunningAi) {
                    cancelActiveRequest();
                    return;
                  }
                  void handleRunAtm();
                }}
                disabled={!isRunningAi && (!prompt.trim() || isPreparingAttachments)}
                aria-label={isRunningAi ? 'Cancel AI request' : 'Send prompt'}
                title={isRunningAi ? 'Cancel request' : 'Send'}
              >
                {isRunningAi ? (
                  <>
                    <span className="relative inline-flex items-center justify-center">
                      <LoaderCircle className="size-4 animate-spin" />
                      <X className="absolute size-3.5" />
                    </span>
                    <span className="text-xs font-semibold">Stop</span>
                  </>
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
