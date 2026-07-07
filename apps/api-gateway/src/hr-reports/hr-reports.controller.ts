import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrReportsService } from './hr-reports.service';
import { renderReport } from './report-export';
import { ExportHrReportDto, QueryHrReportDto } from './dto/query-hr-report.dto';
import type { HrReportFilters } from './report-types';

type AuthUser = { id: number; roles?: string[] };

@ApiTags('HR Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/reports')
export class HrReportsController {
  constructor(private readonly service: HrReportsService) {}

  private toFilters(q: QueryHrReportDto): HrReportFilters {
    return {
      dateFrom: q.dateFrom,
      dateTo: q.dateTo,
      userId: q.userId,
      projectId: q.projectId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List report catalog (privileged)' })
  async getCatalog(@Request() req: { user: AuthUser }) {
    await this.service.ensurePrivileged(req.user);
    return { success: true, data: this.service.getCatalog() };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Resolve a report dataset as JSON (privileged)' })
  async getReport(
    @Request() req: { user: AuthUser },
    @Param('key') key: string,
    @Query() q: QueryHrReportDto,
  ) {
    await this.service.ensurePrivileged(req.user);
    const dataset = await this.service.getReport(key, this.toFilters(q));
    return { success: true, data: dataset };
  }

  @Get(':key/export')
  @ApiOperation({ summary: 'Download a report as CSV or XLSX (privileged)' })
  async exportReport(
    @Request() req: { user: AuthUser },
    @Param('key') key: string,
    @Query() q: ExportHrReportDto,
    @Res() res: Response,
  ) {
    await this.service.ensurePrivileged(req.user);
    const dataset = await this.service.getReport(key, this.toFilters(q));
    const out = await renderReport(dataset, q.format === 'csv' ? 'csv' : 'xlsx');
    res.setHeader('Content-Type', out.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
    res.end(out.buffer);
  }
}
