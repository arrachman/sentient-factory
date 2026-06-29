/**
 * HR report exporters. Both consume the uniform HrReportDataset and return a
 * downloadable artifact { buffer, contentType, filename }.
 *  - CSV: RFC-4180 quoting, title + generated-at preamble, header, rows, summary.
 *  - XLSX: exceljs, merged title, frozen bold header, per-type number formats,
 *    autofilter, summary block, auto column widths.
 */
import { Workbook, Worksheet } from 'exceljs';
import { HrReportDataset, HrReportFormat } from './report-types';
import {
  alignFor,
  buildFilename,
  excelNumFmt,
  formatCellValue,
  formatGeneratedAt,
  formatSummaryValue,
  isNumericType,
  rawNumber,
} from './report-format';

export interface ExportResult {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

const CSV_MIME = 'text/csv; charset=utf-8';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const HEADER_FILL = 'FFE9ECEF';
const SUMMARY_FILL = 'FFF1F3F5';

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function renderCsv(dataset: HrReportDataset): Buffer {
  const lines: string[] = [];
  lines.push(csvCell(dataset.title));
  lines.push(csvCell(`Dibuat: ${formatGeneratedAt(dataset.generatedAt)}`));
  lines.push('');
  lines.push(dataset.columns.map((c) => csvCell(c.header)).join(','));
  for (const row of dataset.rows) {
    lines.push(
      dataset.columns.map((c) => csvCell(formatCellValue(row[c.key], c.type))).join(','),
    );
  }
  if (dataset.summary.length > 0) {
    lines.push('');
    lines.push(csvCell('Ringkasan'));
    for (const item of dataset.summary) {
      lines.push(`${csvCell(item.label)},${csvCell(formatSummaryValue(item))}`);
    }
  }
  // BOM so Excel opens UTF-8 CSV with correct encoding.
  return Buffer.from(`﻿${lines.join('\r\n')}`, 'utf8');
}

function sheetName(key: string): string {
  return key.replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || 'Report';
}

async function renderXlsx(dataset: HrReportDataset): Promise<Buffer> {
  const wb = new Workbook();
  wb.creator = 'Sentient Factory HR';
  wb.created = new Date(dataset.generatedAt) || new Date();
  const ws: Worksheet = wb.addWorksheet(sheetName(dataset.key), {
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  const colCount = dataset.columns.length || 1;
  const lastCol = ws.getColumn(colCount).letter;

  ws.mergeCells(`A1:${lastCol}1`);
  const titleCell = ws.getCell('A1');
  titleCell.value = dataset.title;
  titleCell.font = { bold: true, size: 14 };

  ws.mergeCells(`A2:${lastCol}2`);
  const genCell = ws.getCell('A2');
  genCell.value = `Dibuat: ${formatGeneratedAt(dataset.generatedAt)}`;
  genCell.font = { italic: true, size: 9 };

  const headerRowIdx = 4;
  const headerRow = ws.getRow(headerRowIdx);
  dataset.columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
    cell.alignment = { horizontal: alignFor(col), vertical: 'middle' };
    cell.border = { bottom: { style: 'thin' } };
  });
  headerRow.commit();

  let rowIdx = headerRowIdx + 1;
  for (const row of dataset.rows) {
    const r = ws.getRow(rowIdx);
    dataset.columns.forEach((col, i) => {
      const cell = r.getCell(i + 1);
      if (isNumericType(col.type)) {
        const n = rawNumber(row[col.key]);
        cell.value = n === null ? '' : n;
        const fmt = excelNumFmt(col.type);
        if (fmt) cell.numFmt = fmt;
      } else {
        cell.value = formatCellValue(row[col.key], col.type);
      }
      cell.alignment = { horizontal: alignFor(col) };
    });
    r.commit();
    rowIdx += 1;
  }
  const lastDataRow = rowIdx - 1;

  if (dataset.columns.length > 0 && dataset.rows.length > 0) {
    ws.autoFilter = {
      from: { row: headerRowIdx, column: 1 },
      to: { row: lastDataRow, column: colCount },
    };
  }

  if (dataset.summary.length > 0) {
    rowIdx += 1;
    const sumHeader = ws.getRow(rowIdx);
    sumHeader.getCell(1).value = 'Ringkasan';
    sumHeader.getCell(1).font = { bold: true };
    rowIdx += 1;
    for (const item of dataset.summary) {
      const r = ws.getRow(rowIdx);
      const labelCell = r.getCell(1);
      labelCell.value = item.label;
      labelCell.font = { bold: true };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SUMMARY_FILL } };
      const valueCell = r.getCell(2);
      if (item.type && isNumericType(item.type)) {
        const n = rawNumber(item.value);
        valueCell.value = n === null ? formatSummaryValue(item) : n;
        const fmt = excelNumFmt(item.type);
        if (fmt) valueCell.numFmt = fmt;
        valueCell.alignment = { horizontal: 'right' };
      } else {
        valueCell.value = formatSummaryValue(item);
      }
      valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SUMMARY_FILL } };
      r.commit();
      rowIdx += 1;
    }
  }

  dataset.columns.forEach((col, i) => {
    let max = col.header.length;
    for (const row of dataset.rows) {
      const disp = formatCellValue(row[col.key], col.type);
      if (disp.length > max) max = disp.length;
    }
    ws.getColumn(i + 1).width = Math.min(Math.max(max + 2, 10), 50);
  });

  const out = await wb.xlsx.writeBuffer();
  return Buffer.from(out as ArrayBuffer);
}

export async function renderReport(
  dataset: HrReportDataset,
  format: HrReportFormat,
): Promise<ExportResult> {
  if (format === 'csv') {
    return {
      buffer: renderCsv(dataset),
      contentType: CSV_MIME,
      filename: buildFilename(dataset.key, dataset.generatedAt, 'csv'),
    };
  }
  return {
    buffer: await renderXlsx(dataset),
    contentType: XLSX_MIME,
    filename: buildFilename(dataset.key, dataset.generatedAt, 'xlsx'),
  };
}
