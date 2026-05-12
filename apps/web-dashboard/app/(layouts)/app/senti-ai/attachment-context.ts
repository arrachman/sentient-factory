'use client';

import type { PromptAttachment } from './attachment-utils';

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildAttachmentContext(attachments: PromptAttachment[]) {
  const activeAttachments = attachments.filter((attachment) => attachment.status !== 'failed');
  if (activeAttachments.length === 0) {
    return '';
  }

  return activeAttachments
    .map((attachment, index) => {
      const metadataLines = Object.entries(attachment.metadata)
        .map(([key, value]) => `- ${key}: ${String(value)}`)
        .join('\n');
      const warningLine = attachment.warning ? `\nWarning: ${attachment.warning}` : '';

      return [
        `Lampiran ${index + 1}: ${attachment.name}`,
        `Tipe: ${attachment.type || attachment.extension || 'unknown'}`,
        `Ukuran: ${formatBytes(attachment.size)}`,
        `Status ekstraksi: ${attachment.status}`,
        metadataLines,
        warningLine.trim(),
        attachment.content ? `Konten:\n${attachment.content}` : 'Konten: tidak ada teks yang berhasil diekstrak.',
      ]
        .filter((line) => line.trim().length > 0)
        .join('\n');
    })
    .join('\n\n');
}
