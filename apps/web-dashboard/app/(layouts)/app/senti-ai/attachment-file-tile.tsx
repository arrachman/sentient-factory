'use client';

import type { ReactNode } from 'react';
import { FileImage, FileSpreadsheet, FileText } from 'lucide-react';
import type { PromptAttachment } from './attachment-utils';

export function getAttachmentIcon(attachment: PromptAttachment) {
  if (attachment.type.startsWith('image/')) {
    return FileImage;
  }
  if (
    attachment.type.includes('spreadsheet') ||
    ['xlsx', 'xls', 'xlsm', 'csv'].includes(attachment.extension)
  ) {
    return FileSpreadsheet;
  }
  return FileText;
}

export function getAttachmentVisualKind(attachment: PromptAttachment) {
  if (attachment.type === 'application/pdf' || attachment.extension === 'pdf') {
    return 'pdf';
  }
  if (
    attachment.type.includes('spreadsheet') ||
    ['xlsx', 'xls', 'xlsm', 'csv'].includes(attachment.extension)
  ) {
    return 'sheet';
  }
  if (
    attachment.type.includes('presentation') ||
    ['ppt', 'pptx', 'key'].includes(attachment.extension)
  ) {
    return 'slide';
  }
  if (
    attachment.type.includes('word') ||
    ['doc', 'docx', 'rtf', 'odt'].includes(attachment.extension)
  ) {
    return 'doc';
  }
  return 'file';
}

export function revokeAttachmentPreviewUrl(attachment: PromptAttachment) {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}

export function AttachmentFileTile({
  attachment,
  typeLabel,
}: {
  attachment: PromptAttachment;
  typeLabel: string;
}) {
  const kind = getAttachmentVisualKind(attachment);
  const styleByKind: Record<string, { body: string; fold: string; label: string; glyph: string }> = {
    pdf: {
      body: 'bg-[#f4f4f4] text-[#be3128] dark:bg-[#f3f4f6] dark:text-[#be3128]',
      fold: 'border-l-[#d8d8d8] border-t-[#d8d8d8]',
      label: 'bg-[#cf3e36] text-white',
      glyph: 'text-[#be3128]',
    },
    sheet: {
      body: 'bg-[#3e9a46] text-white dark:bg-[#3e9a46]',
      fold: 'border-l-[#74c474] border-t-[#74c474]',
      label: 'bg-[#2d7c35] text-white',
      glyph: 'text-white',
    },
    doc: {
      body: 'bg-[#3d77c3] text-white dark:bg-[#3d77c3]',
      fold: 'border-l-[#73a0db] border-t-[#73a0db]',
      label: 'bg-[#2358a8] text-white',
      glyph: 'text-white',
    },
    slide: {
      body: 'bg-[#f0b73f] text-white dark:bg-[#f0b73f]',
      fold: 'border-l-[#f6d47d] border-t-[#f6d47d]',
      label: 'bg-[#d99912] text-white',
      glyph: 'text-white',
    },
    file: {
      body: 'bg-[#64748b] text-white dark:bg-[#64748b]',
      fold: 'border-l-[#94a3b8] border-t-[#94a3b8]',
      label: 'bg-[#475569] text-white',
      glyph: 'text-white',
    },
  };
  const style = styleByKind[kind];

  const glyphByKind: Record<string, ReactNode> = {
    pdf: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M8 21c3-7 5-11 6-15 1 3 2 6 4 9 2 3 4 5 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 18c3-2 8-2 14-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    sheet: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <rect x="4.5" y="5" width="19" height="18" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4.5 11.5h19M4.5 17h19M11 5v18M17.5 5v18" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    doc: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M7 9.5h14M7 14h14M7 18.5h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    slide: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <rect x="5.5" y="6" width="17" height="14" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20v3M10 23h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    file: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M8 9.5h12M8 14h12M8 18.5h8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={`relative mt-0.5 h-11 w-9 shrink-0 overflow-hidden rounded-md shadow-sm ${style.body}`}>
      <div className={`absolute right-0 top-0 h-0 w-0 border-l-[12px] border-t-[12px] border-l-transparent ${style.fold}`} />
      <div className={`absolute left-1 top-1 rounded-[4px] px-1 py-[1px] text-[7px] font-bold uppercase tracking-[0.14em] ${style.label}`}>
        {typeLabel}
      </div>
      <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
        {glyphByKind[kind]}
      </div>
    </div>
  );
}
