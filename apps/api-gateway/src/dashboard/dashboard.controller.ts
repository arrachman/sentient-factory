import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AskM2InsightDto } from './dto/ask-m2-insight.dto';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
import { QueryDashboardInsightHistoryDto } from './dto/query-dashboard-insight-history.dto';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
import { QueryDashboardTableDto } from './dto/query-dashboard-table.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('domains')
  @ApiOperation({ summary: 'List supported dashboard domains' })
  @ApiResponse({ status: 200, description: 'Supported domains list' })
  listDomains() {
    return this.dashboardService.listDomains();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check dashboard templates and MySQL connectivity' })
  @ApiResponse({ status: 200, description: 'Dashboard health status' })
  health() {
    return this.dashboardService.health();
  }

  @Get('manager/kpis')
  @ApiOperation({ summary: 'Get manager dashboard KPI cards' })
  @ApiResponse({ status: 200, description: 'Manager KPI payload' })
  managerKpis() {
    return this.dashboardService.managerKpis();
  }

  @Get(':domain/metadata')
  @ApiOperation({ summary: 'Get dashboard metadata (tables, columns, effective allow-list)' })
  @ApiResponse({ status: 200, description: 'Dashboard metadata payload' })
  metadata(@Param('domain') domain: string) {
    return this.dashboardService.metadata(domain);
  }

  @Get(':domain/summary')
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: 200, description: 'Summary payload' })
  summary(@Param('domain') domain: string, @Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.summary(domain, query);
  }

  @Get(':domain/trends')
  @ApiOperation({ summary: 'Get dashboard trends' })
  @ApiResponse({ status: 200, description: 'Trends payload' })
  trends(@Param('domain') domain: string, @Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.trends(domain, query);
  }

  @Get(':domain/breakdown')
  @ApiOperation({ summary: 'Get dashboard breakdown' })
  @ApiResponse({ status: 200, description: 'Breakdown payload' })
  breakdown(@Param('domain') domain: string, @Query() query: QueryDashboardBreakdownDto) {
    return this.dashboardService.breakdown(domain, query);
  }

  @Get('so/breakdown/status')
  @ApiOperation({ summary: 'Get SO breakdown by status' })
  @ApiResponse({ status: 200, description: 'SO status breakdown payload' })
  breakdownSoStatus(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownStatus(query);
  }

  @Get('so/breakdown/realisasi')
  @ApiOperation({ summary: 'Get SO breakdown by realization status' })
  @ApiResponse({ status: 200, description: 'SO realization breakdown payload' })
  breakdownSoRealisasi(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownRealisasi(query);
  }

  @Get('so/breakdown/salesman')
  @ApiOperation({ summary: 'Get SO breakdown by salesman key' })
  @ApiResponse({ status: 200, description: 'SO salesman breakdown payload' })
  breakdownSoSalesman(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownSalesman(query);
  }

  @Get('so/breakdown/customer')
  @ApiOperation({ summary: 'Get SO breakdown by customer key' })
  @ApiResponse({ status: 200, description: 'SO customer breakdown payload' })
  breakdownSoCustomer(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownCustomer(query);
  }

  @Get('m2/breakdown/status')
  @ApiOperation({ summary: 'Get m2 breakdown by status' })
  @ApiResponse({ status: 200, description: 'm2 status breakdown payload' })
  breakdownM2Status(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownM2Status(query);
  }

  @Get('m2/breakdown/cashflow')
  @ApiOperation({ summary: 'Get m2 cashflow breakdown' })
  @ApiResponse({ status: 200, description: 'm2 cashflow breakdown payload' })
  breakdownM2Cashflow(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownM2Cashflow(query);
  }

  @Get('m2/breakdown/branch')
  @ApiOperation({ summary: 'Get m2 branch breakdown' })
  @ApiResponse({ status: 200, description: 'm2 branch breakdown payload' })
  breakdownM2Branch(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownM2Branch(query);
  }

  @Get('m2/insight')
  @ApiOperation({ summary: 'Get AI insight for m2 dashboard' })
  @ApiResponse({ status: 200, description: 'm2 insight payload' })
  insightM2(
    @Req() req: Request & { user?: { id?: number | string } },
    @Query() query: QueryDashboardRangeDto,
  ) {
    return this.dashboardService.insightM2(query, req.user?.id);
  }

  @Get('m2/cr/summary')
  @ApiOperation({ summary: 'Get m2_cr cash-in summary' })
  @ApiResponse({ status: 200, description: 'm2_cr summary payload' })
  summaryM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.summaryM2Cr(query);
  }

  @Get('m2/cr/trends')
  @ApiOperation({ summary: 'Get m2_cr cash-in trends' })
  @ApiResponse({ status: 200, description: 'm2_cr trends payload' })
  trendsM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.trendsM2Cr(query);
  }

  @Get('m2/cr/breakdown/source')
  @ApiOperation({ summary: 'Get m2_cr breakdown by source' })
  @ApiResponse({ status: 200, description: 'm2_cr source breakdown payload' })
  breakdownSourceM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownSourceM2Cr(query);
  }

  @Get('m2/cr/breakdown/status-bayar')
  @ApiOperation({ summary: 'Get m2_cr breakdown by payment status' })
  @ApiResponse({ status: 200, description: 'm2_cr payment status breakdown payload' })
  breakdownStatusBayarM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.breakdownStatusBayarM2Cr(query);
  }

  @Get('m2/cr/top-contacts')
  @ApiOperation({ summary: 'Get m2_cr top contacts by nominal cash-in' })
  @ApiResponse({ status: 200, description: 'm2_cr top contacts payload' })
  topContactsM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.topContactsM2Cr(query);
  }

  @Get('m2/cr/top-outstanding-contacts')
  @ApiOperation({ summary: 'Get m2_cr top contacts by outstanding amount' })
  @ApiResponse({ status: 200, description: 'm2_cr top outstanding contacts payload' })
  topOutstandingContactsM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.topOutstandingContactsM2Cr(query);
  }

  @Get('m2/cr/top-branches')
  @ApiOperation({ summary: 'Get m2_cr top branches by nominal cash-in' })
  @ApiResponse({ status: 200, description: 'm2_cr top branches payload' })
  topBranchesM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.topBranchesM2Cr(query);
  }

  @Get('m2/cr/contact-drilldown')
  @ApiOperation({ summary: 'Get m2_cr drill-down detail by contact for outstanding follow up' })
  @ApiResponse({ status: 200, description: 'm2_cr contact drill-down payload' })
  contactDrilldownM2Cr(@Query() query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardService.contactDrilldownM2Cr(query);
  }

  @Get('m2/sm/top-contacts')
  @ApiOperation({ summary: 'Get m2_sm top contacts by nominal bank payment' })
  @ApiResponse({ status: 200, description: 'm2_sm top contacts payload' })
  topContactsM2Sm(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.topContactsM2Sm(query);
  }

  @Get('m2/sm/contact-drilldown')
  @ApiOperation({ summary: 'Get m2_sm drill-down detail by contact for follow up' })
  @ApiResponse({ status: 200, description: 'm2_sm contact drill-down payload' })
  contactDrilldownM2Sm(@Query() query: QueryDashboardRangeDto & { kontakId?: string }) {
    return this.dashboardService.contactDrilldownM2Sm(query);
  }

  @Get('m2/cr/table')
  @ApiOperation({ summary: 'Get m2_cr transaction table' })
  @ApiResponse({ status: 200, description: 'm2_cr table payload' })
  tableM2Cr(@Query() query: QueryDashboardTableDto) {
    return this.dashboardService.tableM2Cr(query);
  }

  @Get('m2/cr/insight')
  @ApiOperation({ summary: 'Get AI insight for m2_cr dashboard' })
  @ApiResponse({ status: 200, description: 'm2_cr insight payload' })
  insightM2Cr(@Query() query: QueryDashboardRangeDto) {
    return this.dashboardService.insightM2Cr(query);
  }

  @Post('m2/insight/ask')
  @ApiOperation({ summary: 'Ask AI for m2 dashboard context' })
  @ApiResponse({ status: 200, description: 'm2 ask insight payload' })
  askInsightM2(
    @Req() req: Request & { user?: { id?: number | string } },
    @Body() dto: AskM2InsightDto,
  ) {
    return this.dashboardService.askInsightM2(dto, req.user?.id);
  }

  @Get('m2/insight/history')
  @ApiOperation({ summary: 'Get m2 insight history (audit trail)' })
  @ApiResponse({ status: 200, description: 'm2 insight history payload' })
  insightHistoryM2(
    @Req() req: Request & { user?: { id?: number | string } },
    @Query() query: QueryDashboardInsightHistoryDto,
  ) {
    return this.dashboardService.insightHistoryM2(query, req.user?.id);
  }

  @Get(':domain/table')
  @ApiOperation({ summary: 'Get dashboard table' })
  @ApiResponse({ status: 200, description: 'Table payload' })
  table(@Param('domain') domain: string, @Query() query: QueryDashboardTableDto) {
    return this.dashboardService.table(domain, query);
  }
}
