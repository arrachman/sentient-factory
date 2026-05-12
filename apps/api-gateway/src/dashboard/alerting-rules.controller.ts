import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardAlertingFacadeService } from './dashboard-alerting-facade.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class AlertingRulesController {
  constructor(private readonly dashboardService: DashboardAlertingFacadeService) {}

  // ── Metrics ───────────────────────────────────────────────────────────────

  @Get('alerting/business-metrics')
  @ApiOperation({ summary: 'List business metrics for alerting' })
  @ApiResponse({ status: 200, description: 'Business metrics payload' })
  alertingBusinessMetrics(@Query('module') moduleKey?: string) {
    return this.dashboardService.alertingBusinessMetrics(moduleKey);
  }

  @Get('alerting/system-metrics')
  @ApiOperation({ summary: 'List system metrics for alerting' })
  @ApiResponse({ status: 200, description: 'System metrics payload' })
  alertingSystemMetrics(@Query('module') moduleKey?: string) {
    return this.dashboardService.alertingSystemMetrics(moduleKey);
  }

  @Get('alerting/metric-builder-context')
  @ApiOperation({ summary: 'Get alerting metric builder context' })
  @ApiResponse({ status: 200, description: 'Metric builder context payload' })
  alertingMetricBuilderContext(
    @Query('module') moduleKey?: string,
    @Query('metricKey') metricKey?: string,
  ) {
    return this.dashboardService.alertingMetricBuilderContext(moduleKey, metricKey);
  }

  // ── Insights & saved queries ──────────────────────────────────────────────

  @Get('alerting/insights')
  @ApiOperation({ summary: 'List metric insight snapshots for alert center' })
  @ApiResponse({ status: 200, description: 'Metric insight snapshot payload' })
  alertingInsights(@Query('module') moduleKey?: string, @Query('snapshotId') snapshotId?: string) {
    return this.dashboardService.alertingInsights(moduleKey, snapshotId);
  }

  @Get('alerting/saved-queries')
  @ApiOperation({ summary: 'List saved AI queries for alerting' })
  @ApiResponse({ status: 200, description: 'Saved query payload' })
  alertingSavedQueries(@Query('channel') channel?: string, @Query('limit') limit?: string) {
    return this.dashboardService.alertingSavedQueries(channel, limit);
  }

  // ── Rules ─────────────────────────────────────────────────────────────────

  @Get('alerting/rules')
  @ApiOperation({ summary: 'List alert rules' })
  @ApiResponse({ status: 200, description: 'Alert rule payload' })
  alertingRules(@Query('module') moduleKey?: string) {
    return this.dashboardService.alertingRules(moduleKey);
  }

  @Get('alerting/rules/:ruleId')
  @ApiOperation({ summary: 'Get alert rule detail' })
  @ApiResponse({ status: 200, description: 'Alert rule detail payload' })
  alertingRuleDetail(@Param('ruleId') ruleId: string) {
    return this.dashboardService.alertingRuleDetail(ruleId);
  }

  @Post('alerting/rules/:ruleId/run')
  @ApiOperation({ summary: 'Execute alert rule manually' })
  @ApiResponse({ status: 200, description: 'Alert rule run result' })
  runAlertingRule(
    @Param('ruleId') ruleId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.runAlertingRule(
      ruleId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/rules')
  @ApiOperation({ summary: 'Create alert rule' })
  @ApiResponse({ status: 200, description: 'Alert rule create result' })
  createAlertingRule(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingRule(
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/rules/:ruleId')
  @ApiOperation({ summary: 'Update alert rule' })
  @ApiResponse({ status: 200, description: 'Alert rule update result' })
  updateAlertingRule(
    @Param('ruleId') ruleId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingRule(
      ruleId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/rules/:ruleId/state')
  @ApiOperation({ summary: 'Toggle alert rule active state' })
  @ApiResponse({ status: 200, description: 'Alert rule state update result' })
  updateAlertingRuleState(
    @Param('ruleId') ruleId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingRuleState(
      ruleId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Delete('alerting/rules/:ruleId')
  @ApiOperation({ summary: 'Delete alert rule' })
  @ApiResponse({ status: 200, description: 'Alert rule delete result' })
  deleteAlertingRule(
    @Param('ruleId') ruleId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.deleteAlertingRule(
      ruleId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  // ── Events ────────────────────────────────────────────────────────────────

  @Get('alerting/events')
  @ApiOperation({ summary: 'List alert events' })
  @ApiResponse({ status: 200, description: 'Alert event payload' })
  alertingEvents(@Query('module') moduleKey?: string, @Query('eventId') eventId?: string) {
    return this.dashboardService.alertingEvents(moduleKey, eventId);
  }

  @Patch('alerting/events/:eventId')
  @ApiOperation({ summary: 'Update alert event status' })
  @ApiResponse({ status: 200, description: 'Alert event update result' })
  updateAlertingEvent(
    @Param('eventId') eventId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: { status?: string },
  ) {
    return this.dashboardService.updateAlertingEvent(
      eventId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }
}
