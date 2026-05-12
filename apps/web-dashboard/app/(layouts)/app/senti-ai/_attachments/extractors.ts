/**
 * Content extraction dari berbagai tipe file:
 *   - xlsx/xlsm via exceljs
 *   - docx via JSZip + XML strip
 *   - pdf via best-effort literal string regex (browser-side, no OCR)
 *   - image via dimensi naturalWidth/Height
 */
import { decodePdfLiteralString, stripXml } from './format';
import { PRINTABLE_TEXT_PATTERN } from './types';

export async function extractTextFromSpreadsheet(file: File) {
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
          if (
            typeof value === 'object' &&
            'text' in value &&
            typeof value.text === 'string'
          ) {
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
    metadata: { sheet_count: sheetCount, row_count: rowCount },
  };
}

export async function extractTextFromDocx(file: File) {
  const JSZip = await import('jszip');
  const zip = await JSZip.default.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file('word/document.xml')?.async('text');
  const headerFiles = Object.keys(zip.files).filter((key) =>
    /word\/header\d+\.xml$/i.test(key),
  );
  const footerFiles = Object.keys(zip.files).filter((key) =>
    /word\/footer\d+\.xml$/i.test(key),
  );
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

export async function extractTextFromPdf(file: File) {
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

export async function extractImageMetadata(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        image.onload = () =>
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        image.onerror = () =>
          reject(new Error('Gagal membaca dimensi gambar.'));
      },
    );
    image.src = objectUrl;
    return await loaded;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
