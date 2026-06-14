/**
 * Renders any ReportDataset to a downloadable file: Excel (exceljs), PDF
 * (pdfmake — pure JS, no Chromium), or Word (docx). Column `type` drives
 * number/date/money formatting + alignment, identical to the on-screen table.
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportDataset, ReportFormat } from './report-types';
import { buildFilename } from './report-export.format';
import { renderXlsx } from './report-export.xlsx';
import { renderPdf } from './report-export.pdf';
import { renderDocx } from './report-export.docx';

export interface RenderedReport {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

const CONTENT_TYPE: Record<ReportFormat, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

@Injectable()
export class ReportExportService {
  async render(dataset: ReportDataset, format: ReportFormat): Promise<RenderedReport> {
    let buffer: Buffer;
    switch (format) {
      case 'xlsx':
        buffer = await renderXlsx(dataset);
        break;
      case 'pdf':
        buffer = await renderPdf(dataset);
        break;
      case 'docx':
        buffer = await renderDocx(dataset);
        break;
      default:
        throw new BadRequestException(`Format export tidak didukung: ${format}`);
    }

    return {
      buffer,
      contentType: CONTENT_TYPE[format],
      filename: buildFilename(dataset.key, dataset.generatedAt, format),
    };
  }
}
