import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { QueryReportDto } from './dto/query-report.dto';
import { ErpFinReportsService } from './erp-fin-reports.service';
import { ReportExportService } from './report-export.service';
import { ReportDocument, ReportFormat } from './report-types';

@ApiTags('ERP Fin Reports')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/fin/reports')
export class ErpFinReportsController {
  constructor(
    private readonly service: ErpFinReportsService,
    private readonly exporter: ReportExportService,
  ) {}

  @Get('trial-balance')
  @ApiOperation({ summary: 'Trial balance (Neraca Saldo)' })
  async trialBalance(@Query() q: QueryReportDto, @Res({ passthrough: false }) res: Response) {
    if (!q.from || !q.to) throw new BadRequestException('from and to are required');
    const doc = await this.service.buildTrialBalance(q.from, q.to, q.branchId);
    return this.respond(doc, q.format, res);
  }

  @Get('income-statement')
  @ApiOperation({ summary: 'Income statement (Laba Rugi)' })
  async incomeStatement(@Query() q: QueryReportDto, @Res({ passthrough: false }) res: Response) {
    if (!q.from || !q.to) throw new BadRequestException('from and to are required');
    const doc = await this.service.buildIncomeStatement(q.from, q.to, q.branchId);
    return this.respond(doc, q.format, res);
  }

  @Get('balance-sheet')
  @ApiOperation({ summary: 'Balance sheet (Neraca)' })
  async balanceSheet(@Query() q: QueryReportDto, @Res({ passthrough: false }) res: Response) {
    if (!q.asOf) throw new BadRequestException('asOf is required');
    const doc = await this.service.buildBalanceSheet(q.asOf, q.branchId);
    return this.respond(doc, q.format, res);
  }

  @Get('general-ledger')
  @ApiOperation({ summary: 'General ledger (Buku Besar)' })
  async generalLedger(@Query() q: QueryReportDto, @Res({ passthrough: false }) res: Response) {
    if (!q.from || !q.to) throw new BadRequestException('from and to are required');
    const doc = await this.service.buildGeneralLedger(q.from, q.to, q.accountId, q.branchId);
    return this.respond(doc, q.format, res);
  }

  private async respond(
    doc: ReportDocument,
    format: ReportFormat | undefined,
    res: Response,
  ): Promise<void> {
    if (!format || format === 'json') {
      res.json({ success: true, data: doc });
      return;
    }
    const { buffer, contentType, filename } = await this.exporter.render(doc, format);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(buffer);
  }
}
