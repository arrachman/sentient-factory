import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryDashboardBreakdownDto } from './dto/query-dashboard-breakdown.dto';
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

  @Get(':domain/table')
  @ApiOperation({ summary: 'Get dashboard table' })
  @ApiResponse({ status: 200, description: 'Table payload' })
  table(@Param('domain') domain: string, @Query() query: QueryDashboardTableDto) {
    return this.dashboardService.table(domain, query);
  }
}
