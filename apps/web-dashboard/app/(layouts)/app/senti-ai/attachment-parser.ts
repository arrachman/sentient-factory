'use client';

export type PromptAttachmentStatus = 'ready' | 'metadata-only' | 'failed';

export type ParsedAttachmentPayload = {
  id: string;
  name: string;
  type: string;
  size: number;
  extension: string;
  addedAt: number;
  status: PromptAttachmentStatus;
  content: string;
  preview: string;
  warning?: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const PREVIEW_LIMIT = 240;
const CONTENT_LIMIT = 12_000;
const PRINTABLE_TEXT_PATTERN = /[A-Za-z0-9][A-Za-z0-9 \t.,:;!?()[\]{}"'/\\_+=@#%-]{20,}/g;

function clampText(value: string, limit = CONTENT_LIMIT) {
  const normalized = value.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit)}…`;
}

function buildPreview(value: string) {
  const normalized = clampText(value, PREVIEW_LIMIT);
  return normalized.length > 0 ? normalized : 'Tidak ada teks yang berhasil diekstrak.';
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripXml(value: string) {
  return decodeXmlEntities(value.replace(/<[^>]+>/g, ' '));
}

function decodePdfLiteralString(value: string) {
  return value
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\\/g, '\\');
}

function getExtension(file: File) {
  const segments = file.name.toLowerCase().split('.');
  return segments.length > 1 ? segments[segments.length - 1] ?? '' : '';
}

async function extractTextFromSpreadsheet(file: File) {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.default.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const lines: string[] = [];
  let sheetCount = 0;
  let rowCount = 0;

  workbook.eachSheet((worksheet) => {
    sheetCount += 1;
    lines.push(`Sheet: ${worksheet.name}`);
    worksheet.eachRow((row) => {
      const rowValues = Array.isArray(row.values) ? row.values.slice(1) : [];
      const values = rowValues
        .map((value) => {
          if (value == null) {
            return '';
          }
          if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
            return value.text;
          }
          return String(value);
        })
        .filter((value) => value.trim().length > 0);

      if (values.length > 0) {
        rowCount += 1;
        lines.push(values.join(' | '));
      }
    });
  });

  return {
    text: lines.join('\n'),
    metadata: {
      sheet_count: sheetCount,
      row_count: rowCount,
    },
  };
}

async function extractTextFromDocx(file: File) {
  const JSZip = await import('jszip');
  const zip = await JSZip.default.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file('word/document.xml')?.async('text');
  const headerFiles = Object.keys(zip.files).filter((key) => /word\/header\d+\.xml$/i.test(key));
  const footerFiles = Object.keys(zip.files).filter((key) => /word\/footer\d+\.xml$/i.test(key));
  const parts = [documentXml ?? ''];

  for (const key of [...headerFiles, ...footerFiles]) {
    const xml = await zip.file(key)?.async('text');
    if (xml) {
      parts.push(xml);
    }
  }

  return {
    text: parts.map((part) => stripXml(part)).join('\n'),
    metadata: {
      section_count: parts.filter((part) => part.trim().length > 0).length,
    },
  };
}

async function extractTextFromPdf(file: File) {
  const raw = new TextDecoder('latin1').decode(await file.arrayBuffer());
  const parts: string[] = [];
  const directPattern = /\(([^()]*(?:\\.[^()]*)*)\)\s*Tj/g;
  const arrayPattern = /\[([\s\S]*?)\]\s*TJ/gm;
  const tokenPattern = /\(([^()]*(?:\\.[^()]*)*)\)/g;

  let match: RegExpExecArray | null;
  while ((match = directPattern.exec(raw)) !== null) {
    const value = decodePdfLiteralString(match[1] ?? '').trim();
    if (value.length > 0) {
      parts.push(value);
    }
  }

  while ((match = arrayPattern.exec(raw)) !== null) {
    const content = match[1] ?? '';
    let token: RegExpExecArray | null;
    while ((token = tokenPattern.exec(content)) !== null) {
      const value = decodePdfLiteralString(token[1] ?? '').trim();
      if (value.length > 0) {
        parts.push(value);
      }
    }
    tokenPattern.lastIndex = 0;
  }

  if (parts.length === 0) {
    const printable = raw.match(PRINTABLE_TEXT_PATTERN) ?? [];
    parts.push(...printable.slice(0, 200));
  }

  return {
    text: parts.join('\n'),
    metadata: {
      extraction_mode: parts.length > 0 ? 'best-effort' : 'metadata-only',
    },
  };
}

export async function parsePromptAttachment(file: File, attachmentId: string): Promise<ParsedAttachmentPayload> {
  const extension = getExtension(file);
  const base = {
    id: attachmentId,
    name: file.name,
    type: file.type || extension || 'application/octet-stream',
    size: file.size,
    extension,
    addedAt: Date.now(),
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
    if (file.type.startsWith('text/') || ['txt', 'csv', 'json', 'md', 'xml', 'html'].includes(extension)) {
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
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
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
        warning: text ? null : 'Workbook terbaca tetapi tidak menghasilkan teks yang berarti.',
      };
    }

    if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
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
        warning: text ? null : 'Dokumen Word terbaca tetapi tidak menghasilkan teks yang berarti.',
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

    if (extension === 'doc') {
      const content = `Dokumen Word legacy ${file.name} diterima, tetapi parsing .doc belum tersedia.`;
      return {
        ...base,
        status: 'metadata-only',
        content,
        preview: content,
        warning: 'Format .doc belum bisa diekstrak. Gunakan .docx agar isi dokumen ikut terbaca.',
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
        warning: 'Format .xls belum bisa diekstrak. Gunakan .xlsx agar isi sheet ikut terbaca.',
        metadata: {},
      };
    }

    return {
      ...base,
      status: 'metadata-only',
      content: `File ${file.name} diterima sebagai lampiran, tetapi tipe file ini belum punya parser khusus.`,
      preview: `File ${file.name} diterima tanpa ekstraksi isi.`,
      warning: 'Tipe file belum didukung untuk ekstraksi konten. Hanya metadata file yang dikirim.',
      metadata: {},
    };
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
