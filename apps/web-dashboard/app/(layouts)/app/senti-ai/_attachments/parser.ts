/**
 * Main parser entry point untuk PromptAttachment.
 *
 * Strategy:
 *   - File > 15MB → fail early
 *   - Text/CSV/JSON/MD/XML/HTML → langsung file.text()
 *   - XLSX/XLSM → extractTextFromSpreadsheet
 *   - DOCX → extractTextFromDocx
 *   - PDF → extractTextFromPdf (best-effort, no OCR client-side)
 *   - Image → extract dimensi saja (OCR di server)
 *   - DOC/XLS legacy → metadata-only
 *   - Else → metadata-only fallback
 *
 * `parsePromptAttachmentOffMainThread` mencoba Web Worker dulu untuk file
 * besar (xlsx/docx/pdf) supaya UI tidak freeze; fallback ke main thread.
 */
import {
  extractImageMetadata,
  extractTextFromDocx,
  extractTextFromPdf,
  extractTextFromSpreadsheet,
} from './extractors';
import {
  buildPreview,
  clampText,
  createAttachmentId,
  formatBytes,
  getExtension,
} from './format';
import {
  MAX_ATTACHMENT_BYTES,
  type ParsedAttachmentPayload,
  type PromptAttachment,
} from './types';

function canUseAttachmentParserWorker(file: File, extension: string) {
  if (typeof window === 'undefined') {
    return false;
  }
  if (
    file.type.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(extension)
  ) {
    return false;
  }
  return (
    file.type.startsWith('text/') ||
    ['txt', 'csv', 'json', 'md', 'xml', 'html', 'xlsx', 'xlsm', 'docx', 'pdf'].includes(extension) ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/pdf'
  );
}

async function parsePromptAttachmentWithWorker(
  file: File,
  attachmentId: string,
): Promise<PromptAttachment> {
  const { parsePromptAttachment } = await import('../attachment-parser');
  const parsed = (await parsePromptAttachment(
    file,
    attachmentId,
  )) as ParsedAttachmentPayload;
  return { ...parsed, previewUrl: null };
}

export function buildAttachmentContext(attachments: PromptAttachment[]) {
  const activeAttachments = attachments.filter(
    (attachment) => attachment.status !== 'failed',
  );
  if (activeAttachments.length === 0) {
    return '';
  }

  return activeAttachments
    .map((attachment, index) => {
      const metadataLines = Object.entries(attachment.metadata)
        .map(([key, value]) => `- ${key}: ${String(value)}`)
        .join('\n');
      const warningLine = attachment.warning
        ? `\nWarning: ${attachment.warning}`
        : '';

      return [
        `Lampiran ${index + 1}: ${attachment.name}`,
        `Tipe: ${attachment.type || attachment.extension || 'unknown'}`,
        `Ukuran: ${formatBytes(attachment.size)}`,
        `Status ekstraksi: ${attachment.status}`,
        metadataLines,
        warningLine.trim(),
        attachment.content
          ? `Konten:\n${attachment.content}`
          : 'Konten: tidak ada teks yang berhasil diekstrak.',
      ]
        .filter((line) => line.trim().length > 0)
        .join('\n');
    })
    .join('\n\n');
}

export async function parsePromptAttachment(
  file: File,
  attachmentId?: string,
): Promise<PromptAttachment> {
  const extension = getExtension(file);
  const base = {
    id: attachmentId ?? createAttachmentId(),
    name: file.name,
    type: file.type || extension || 'application/octet-stream',
    size: file.size,
    extension,
    addedAt: Date.now(),
    previewUrl: file.type.startsWith('image/')
      ? URL.createObjectURL(file)
      : null,
  };

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return {
      ...base,
      status: 'failed',
      content: '',
      preview: 'Maks. 15 MB.',
      warning: 'Maks. 15 MB.',
      metadata: {},
    };
  }

  try {
    return await parseByType(file, base, extension);
  } catch (error) {
    return {
      ...base,
      status: 'failed',
      content: '',
      preview: 'File gagal diproses.',
      warning: error instanceof Error ? error.message : 'File gagal diproses.',
      metadata: {},
    };
  }
}

export async function parsePromptAttachmentOffMainThread(
  file: File,
  attachmentId?: string,
): Promise<PromptAttachment> {
  const nextAttachmentId = attachmentId ?? createAttachmentId();
  const extension = getExtension(file);

  if (!canUseAttachmentParserWorker(file, extension)) {
    return parsePromptAttachment(file, nextAttachmentId);
  }

  try {
    return await parsePromptAttachmentWithWorker(file, nextAttachmentId);
  } catch {
    return parsePromptAttachment(file, nextAttachmentId);
  }
}

// =====================================================================
// Internal dispatcher per file type
// =====================================================================

type AttachmentBase = Omit<PromptAttachment, 'status' | 'content' | 'preview' | 'metadata' | 'warning'>;

async function parseByType(
  file: File,
  base: AttachmentBase,
  extension: string,
): Promise<PromptAttachment> {
  if (
    file.type.startsWith('text/') ||
    ['txt', 'csv', 'json', 'md', 'xml', 'html'].includes(extension)
  ) {
    const text = clampText(await file.text());
    return {
      ...base,
      status: 'ready',
      content: text,
      preview: buildPreview(text),
      metadata: {},
    };
  }

  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    ['xlsx', 'xlsm'].includes(extension)
  ) {
    const extracted = await extractTextFromSpreadsheet(file);
    const text = clampText(extracted.text);
    return {
      ...base,
      status: text ? 'ready' : 'metadata-only',
      content: text,
      preview: buildPreview(text),
      metadata: extracted.metadata,
      warning: text
        ? null
        : 'Workbook terbaca tetapi tidak menghasilkan teks yang berarti.',
    };
  }

  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    const extracted = await extractTextFromDocx(file);
    const text = clampText(extracted.text);
    return {
      ...base,
      status: text ? 'ready' : 'metadata-only',
      content: text,
      preview: buildPreview(text),
      metadata: extracted.metadata,
      warning: text
        ? null
        : 'Dokumen Word terbaca tetapi tidak menghasilkan teks yang berarti.',
    };
  }

  if (file.type === 'application/pdf' || extension === 'pdf') {
    const extracted = await extractTextFromPdf(file);
    const text = clampText(extracted.text);
    return {
      ...base,
      status: text ? 'ready' : 'metadata-only',
      content: text,
      preview: buildPreview(text),
      metadata: extracted.metadata,
      warning: text
        ? 'Preview PDF di browser bersifat best-effort. Saat dikirim, server akan mencoba ekstraksi/OCR lagi.'
        : 'Preview browser tidak menemukan teks PDF. Saat dikirim, server akan mencoba OCR.',
    };
  }

  if (
    file.type.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(extension)
  ) {
    const image = await extractImageMetadata(file);
    const content = `Gambar ${file.name} berukuran ${image.width}x${image.height}. OCR belum tersedia, jadi hanya metadata gambar yang ikut dikirim sebagai konteks.`;
    return {
      ...base,
      status: 'metadata-only',
      content,
      preview: content,
      warning:
        'Preview browser belum OCR. Saat dikirim, server akan menjalankan OCR pada gambar.',
      metadata: { width: image.width, height: image.height },
    };
  }

  if (extension === 'doc') {
    const content = `Dokumen Word legacy ${file.name} diterima, tetapi parsing .doc belum tersedia.`;
    return {
      ...base,
      status: 'metadata-only',
      content,
      preview: content,
      warning:
        'Format .doc belum bisa diekstrak. Gunakan .docx agar isi dokumen ikut terbaca.',
      metadata: {},
    };
  }

  if (extension === 'xls') {
    const content = `Workbook Excel legacy ${file.name} diterima, tetapi parsing .xls belum tersedia.`;
    return {
      ...base,
      status: 'metadata-only',
      content,
      preview: content,
      warning:
        'Format .xls belum bisa diekstrak. Gunakan .xlsx agar isi sheet ikut terbaca.',
      metadata: {},
    };
  }

  return {
    ...base,
    status: 'metadata-only',
    content: `File ${file.name} diterima sebagai lampiran, tetapi tipe file ini belum punya parser khusus.`,
    preview: `File ${file.name} diterima tanpa ekstraksi isi.`,
    warning:
      'Tipe file belum didukung untuk ekstraksi konten. Hanya metadata file yang dikirim.',
    metadata: {},
  };
}
