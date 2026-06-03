import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportDocument, ReportFormat } from './report-types';
import { renderXlsx } from './report-export.xlsx';
import { renderPdf } from './report-export.pdf';
import { renderDoc } from './report-export.doc';

export interface RenderedReport {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

@Injectable()
export class ReportExportService {
  async render(doc: ReportDocument, format: ReportFormat): Promise<RenderedReport> {
    switch (format) {
      case 'xlsx': {
        const buffer = await renderXlsx(doc);
        return {
          buffer,
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          filename: `${doc.key}.xlsx`,
        };
      }
      case 'pdf': {
        const buffer = await renderPdf(doc);
        return { buffer, contentType: 'application/pdf', filename: `${doc.key}.pdf` };
      }
      case 'docx': {
        const buffer = renderDoc(doc);
        return { buffer, contentType: 'application/msword', filename: `${doc.key}.doc` };
      }
      default:
        throw new BadRequestException(`Unsupported export format: ${format}`);
    }
  }
}
