import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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

  @Get('custom-db/pin-targets')
  @ApiOperation({ summary: 'List custom dashboard pin targets' })
  @ApiResponse({ status: 200, description: 'Custom dashboard pin targets payload' })
  customDbPinTargets() {
    return this.dashboardService.customDbPinTargets();
  }

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

  @Get('alerting/insights')
  @ApiOperation({ summary: 'List metric insight snapshots for alert center' })
  @ApiResponse({ status: 200, description: 'Metric insight snapshot payload' })
  alertingInsights(
    @Query('module') moduleKey?: string,
    @Query('snapshotId') snapshotId?: string,
  ) {
    return this.dashboardService.alertingInsights(moduleKey, snapshotId);
  }

  @Get('alerting/saved-queries')
  @ApiOperation({ summary: 'List saved AI queries for alerting' })
  @ApiResponse({ status: 200, description: 'Saved query payload' })
  alertingSavedQueries(
    @Query('channel') channel?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.alertingSavedQueries(channel, limit);
  }

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
    return this.dashboardService.runAlertingRule(ruleId, req.user?.username || req.user?.email || 'system');
  }

  @Post('alerting/scheduler/run')
  @ApiOperation({ summary: 'Execute due alert rules through scheduler cycle' })
  @ApiResponse({ status: 200, description: 'Alert scheduler cycle result' })
  runAlertingSchedulerCycle(
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.runAlertingSchedulerCycle(req.user?.username || req.user?.email || 'system');
  }

  @Post('alerting/delivery/run')
  @ApiOperation({ summary: 'Execute queued alert delivery logs' })
  @ApiResponse({ status: 200, description: 'Alert delivery worker result' })
  runAlertDeliveryCycle(
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.runAlertDeliveryCycle(req.user?.username || req.user?.email || 'system');
  }

  @Post('alerting/rules')
  @ApiOperation({ summary: 'Create alert rule' })
  @ApiResponse({ status: 200, description: 'Alert rule create result' })
  createAlertingRule(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingRule(body, req.user?.username || req.user?.email || 'system');
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

  @Get('alerting/events')
  @ApiOperation({ summary: 'List alert events' })
  @ApiResponse({ status: 200, description: 'Alert event payload' })
  alertingEvents(@Query('module') moduleKey?: string, @Query('eventId') eventId?: string) {
    return this.dashboardService.alertingEvents(moduleKey, eventId);
  }

  @Get('alerting/delivery-logs')
  @ApiOperation({ summary: 'List alert delivery logs' })
  @ApiResponse({ status: 200, description: 'Alert delivery log payload' })
  alertingDeliveryLogs(@Query('eventId') eventId?: string) {
    return this.dashboardService.alertingDeliveryLogs(eventId);
  }

  @Post('alerting/delivery-logs/:deliveryId/requeue')
  @ApiOperation({ summary: 'Requeue failed or dead-lettered delivery log' })
  @ApiResponse({ status: 200, description: 'Alert delivery requeue result' })
  requeueAlertingDeliveryLog(
    @Param('deliveryId') deliveryId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.requeueAlertingDeliveryLog(
      deliveryId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Get('alerting/dead-letter-triage')
  @ApiOperation({ summary: 'List dead-letter triage items' })
  @ApiResponse({ status: 200, description: 'Dead-letter triage payload' })
  alertingDeadLetterTriage(@Query() query: Record<string, unknown>) {
    return this.dashboardService.alertingDeadLetterTriage(query);
  }

  @Patch('alerting/dead-letter-triage/:deliveryId')
  @ApiOperation({ summary: 'Update dead-letter triage item' })
  @ApiResponse({ status: 200, description: 'Dead-letter triage update result' })
  updateAlertingDeadLetterTriage(
    @Param('deliveryId') deliveryId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingDeadLetterTriage(
      deliveryId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/triage/escalation/run')
  @ApiOperation({ summary: 'Execute dead-letter triage auto-escalation cycle' })
  @ApiResponse({ status: 200, description: 'Dead-letter triage escalation cycle result' })
  runAlertingTriageEscalationCycle(
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.runAlertingTriageEscalationCycle(
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Get('alerting/analytics')
  @ApiOperation({ summary: 'Get alerting analytics summary' })
  @ApiResponse({ status: 200, description: 'Alert analytics payload' })
  alertingAnalytics() {
    return this.dashboardService.alertingAnalytics();
  }

  @Get('alerting/delivery-observability')
  @ApiOperation({ summary: 'Get delivery observability summary' })
  @ApiResponse({ status: 200, description: 'Alert delivery observability payload' })
  alertingDeliveryObservability() {
    return this.dashboardService.alertingDeliveryObservability();
  }

  @Get('alerting/ops')
  @ApiOperation({ summary: 'Get alerting ops overview' })
  @ApiResponse({ status: 200, description: 'Alert ops overview payload' })
  alertingOpsOverview() {
    return this.dashboardService.alertingOpsOverview();
  }

  @Get('alerting/delivery-status')
  @ApiOperation({ summary: 'Get alert delivery provider readiness' })
  @ApiResponse({ status: 200, description: 'Alert delivery provider readiness payload' })
  alertingDeliveryStatus() {
    return this.dashboardService.alertingDeliveryStatus();
  }

  @Get('alerting/provider-health')
  @ApiOperation({ summary: 'Get alert delivery provider health details' })
  @ApiResponse({ status: 200, description: 'Alert delivery provider health payload' })
  alertingProviderHealth() {
    return this.dashboardService.alertingProviderHealth();
  }

  @Post('alerting/provider-health/baileys/pairing')
  @ApiOperation({ summary: 'Start Baileys pairing flow and return pairing code or QR token' })
  @ApiResponse({ status: 200, description: 'Baileys pairing payload' })
  alertingBaileysPairing(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: { phoneNumber?: string; phone_number?: string },
  ) {
    return this.dashboardService.alertingBaileysPairing(
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Get('alerting/channels')
  @ApiOperation({ summary: 'List persisted alert notification channels' })
  @ApiResponse({ status: 200, description: 'Alert notification channels payload' })
  alertingChannels(@Query('channelType') channelType?: string) {
    return this.dashboardService.alertingChannels(channelType);
  }

  @Get('alerting/templates')
  @ApiOperation({ summary: 'List persisted alert templates' })
  @ApiResponse({ status: 200, description: 'Alert template payload' })
  alertingTemplates(@Query('module') module?: string) {
    return this.dashboardService.alertingTemplates(module);
  }

  @Post('alerting/templates')
  @ApiOperation({ summary: 'Create alert template' })
  @ApiResponse({ status: 200, description: 'Alert template create result' })
  createAlertingTemplate(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingTemplate(body, req.user?.username || req.user?.email || 'system');
  }

  @Get('alerting/templates/:templateId')
  @ApiOperation({ summary: 'Get alert template detail' })
  @ApiResponse({ status: 200, description: 'Alert template detail payload' })
  alertingTemplateDetail(@Param('templateId') templateId: string) {
    return this.dashboardService.alertingTemplateDetail(templateId);
  }

  @Patch('alerting/templates/:templateId')
  @ApiOperation({ summary: 'Update alert template' })
  @ApiResponse({ status: 200, description: 'Alert template update result' })
  updateAlertingTemplate(
    @Param('templateId') templateId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingTemplate(
      templateId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/templates/:templateId/state')
  @ApiOperation({ summary: 'Toggle alert template active state' })
  @ApiResponse({ status: 200, description: 'Alert template state update result' })
  updateAlertingTemplateState(
    @Param('templateId') templateId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingTemplateState(
      templateId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Delete('alerting/templates/:templateId')
  @ApiOperation({ summary: 'Delete alert template' })
  @ApiResponse({ status: 200, description: 'Alert template delete result' })
  deleteAlertingTemplate(
    @Param('templateId') templateId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.deleteAlertingTemplate(
      templateId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/channels')
  @ApiOperation({ summary: 'Create alert notification channel' })
  @ApiResponse({ status: 200, description: 'Alert notification channel create result' })
  createAlertingChannel(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingChannel(body, req.user?.username || req.user?.email || 'system');
  }

  @Patch('alerting/channels/:channelId')
  @ApiOperation({ summary: 'Update alert notification channel' })
  @ApiResponse({ status: 200, description: 'Alert notification channel update result' })
  updateAlertingChannel(
    @Param('channelId') channelId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingChannel(
      channelId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/channels/:channelId/state')
  @ApiOperation({ summary: 'Toggle alert notification channel active state' })
  @ApiResponse({ status: 200, description: 'Alert notification channel state update result' })
  updateAlertingChannelState(
    @Param('channelId') channelId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingChannelState(
      channelId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Delete('alerting/channels/:channelId')
  @ApiOperation({ summary: 'Delete alert notification channel' })
  @ApiResponse({ status: 200, description: 'Alert notification channel delete result' })
  deleteAlertingChannel(
    @Param('channelId') channelId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.deleteAlertingChannel(
      channelId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/channels/:channelId/test-send')
  @ApiOperation({ summary: 'Send a test notification to a channel' })
  @ApiResponse({ status: 200, description: 'Alert channel test send result' })
  testAlertingChannel(
    @Param('channelId') channelId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.testAlertingChannel(
      channelId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Get('alerting/settings')
  @ApiOperation({ summary: 'List alert runtime settings' })
  @ApiResponse({ status: 200, description: 'Alert runtime settings payload' })
  alertingSettings() {
    return this.dashboardService.alertingSettings();
  }

  @Get('alerting/escalation-policies')
  @ApiOperation({ summary: 'List triage escalation policies' })
  @ApiResponse({ status: 200, description: 'Triage escalation policy payload' })
  alertingEscalationPolicies(
    @Query('module') module?: string,
    @Query('targetType') targetType?: string,
  ) {
    return this.dashboardService.alertingEscalationPolicies(module, targetType);
  }

  @Post('alerting/escalation-policies')
  @ApiOperation({ summary: 'Create triage escalation policy' })
  @ApiResponse({ status: 200, description: 'Triage escalation policy create result' })
  createAlertingEscalationPolicy(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingEscalationPolicy(
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/escalation-policies/:policyId')
  @ApiOperation({ summary: 'Update triage escalation policy' })
  @ApiResponse({ status: 200, description: 'Triage escalation policy update result' })
  updateAlertingEscalationPolicy(
    @Param('policyId') policyId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingEscalationPolicy(
      policyId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/escalation-policies/:policyId/state')
  @ApiOperation({ summary: 'Toggle triage escalation policy active state' })
  @ApiResponse({ status: 200, description: 'Triage escalation policy state update result' })
  updateAlertingEscalationPolicyState(
    @Param('policyId') policyId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingEscalationPolicyState(
      policyId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Delete('alerting/escalation-policies/:policyId')
  @ApiOperation({ summary: 'Delete triage escalation policy' })
  @ApiResponse({ status: 200, description: 'Triage escalation policy delete result' })
  deleteAlertingEscalationPolicy(
    @Param('policyId') policyId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.deleteAlertingEscalationPolicy(
      policyId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Get('alerting/triage-saved-views')
  @ApiOperation({ summary: 'List triage saved views' })
  @ApiResponse({ status: 200, description: 'Triage saved view payload' })
  alertingTriageSavedViews(
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.alertingTriageSavedViews(
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/triage-saved-views')
  @ApiOperation({ summary: 'Create triage saved view' })
  @ApiResponse({ status: 200, description: 'Triage saved view create result' })
  createAlertingTriageSavedView(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingTriageSavedView(
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/triage-saved-views/:viewId')
  @ApiOperation({ summary: 'Update triage saved view' })
  @ApiResponse({ status: 200, description: 'Triage saved view update result' })
  updateAlertingTriageSavedView(
    @Param('viewId') viewId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingTriageSavedView(
      viewId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/triage-saved-views/:viewId/state')
  @ApiOperation({ summary: 'Toggle triage saved view active state' })
  @ApiResponse({ status: 200, description: 'Triage saved view state update result' })
  updateAlertingTriageSavedViewState(
    @Param('viewId') viewId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingTriageSavedViewState(
      viewId,
      body,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Delete('alerting/triage-saved-views/:viewId')
  @ApiOperation({ summary: 'Delete triage saved view' })
  @ApiResponse({ status: 200, description: 'Triage saved view delete result' })
  deleteAlertingTriageSavedView(
    @Param('viewId') viewId: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.deleteAlertingTriageSavedView(
      viewId,
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Patch('alerting/settings/:settingKey')
  @ApiOperation({ summary: 'Update alert runtime setting' })
  @ApiResponse({ status: 200, description: 'Alert runtime setting update result' })
  updateAlertingSetting(
    @Param('settingKey') settingKey: string,
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.updateAlertingSetting(
      settingKey,
      body,
      req.user?.username || req.user?.email || 'system',
    );
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

  @Get('custom-db/:dashboardKey')
  @ApiOperation({ summary: 'Get custom dashboard catalog' })
  @ApiResponse({ status: 200, description: 'Custom dashboard catalog payload' })
  customDbCatalog(@Param('dashboardKey') dashboardKey: string) {
    return this.dashboardService.customDbCatalog(dashboardKey);
  }

  @Patch('custom-db/:dashboardKey')
  @ApiOperation({ summary: 'Update custom dashboard metadata' })
  @ApiResponse({ status: 200, description: 'Custom dashboard update result' })
  updateCustomDbCatalog(
    @Param('dashboardKey') dashboardKey: string,
    @Body() body: { title?: string; description?: string | null },
  ) {
    return this.dashboardService.updateCustomDbCatalog(dashboardKey, body);
  }

  @Post('custom-db/:dashboardKey/query/:queryKey')
  @ApiOperation({ summary: 'Execute custom dashboard widget query' })
  @ApiResponse({ status: 200, description: 'Custom dashboard query result' })
  executeCustomDbQuery(
    @Param('dashboardKey') dashboardKey: string,
    @Param('queryKey') queryKey: string,
    @Body() body: { params?: Record<string, unknown> },
  ) {
    return this.dashboardService.executeCustomDbQuery(dashboardKey, queryKey, body?.params || {});
  }

  @Post('custom-db/pin')
  @ApiOperation({ summary: 'Pin a widget into a custom dashboard' })
  @ApiResponse({ status: 200, description: 'Custom dashboard pin result' })
  pinCustomDbWidget(
    @Body()
    body: {
      dashboardKey?: string;
      title?: string;
      description?: string | null;
      widgetKind?: string;
      chartType?: string | null;
      spanClassName?: string | null;
      sqlTemplate?: string;
      outputColumns?: string[];
      queryLabel?: string;
    },
  ) {
    return this.dashboardService.pinCustomDbWidget(body);
  }

  @Patch('custom-db/widget/:widgetId')
  @ApiOperation({ summary: 'Update custom dashboard widget' })
  @ApiResponse({ status: 200, description: 'Custom dashboard widget update result' })
  updateCustomDbWidget(
    @Param('widgetId') widgetId: string,
    @Body()
    body: {
      title?: string;
      description?: string | null;
      spanClassName?: string | null;
      widgetOrder?: number | null;
      chartType?: string | null;
      defaultLimit?: number | null;
    },
  ) {
    return this.dashboardService.updateCustomDbWidget(widgetId, body);
  }

  @Post('custom-db/widget/:widgetId/duplicate')
  @ApiOperation({ summary: 'Duplicate custom dashboard widget' })
  @ApiResponse({ status: 200, description: 'Custom dashboard widget duplicate result' })
  duplicateCustomDbWidget(@Param('widgetId') widgetId: string) {
    return this.dashboardService.duplicateCustomDbWidget(widgetId);
  }

  @Delete('custom-db/widget/:widgetId')
  @ApiOperation({ summary: 'Delete custom dashboard widget' })
  @ApiResponse({ status: 200, description: 'Custom dashboard widget delete result' })
  deleteCustomDbWidget(@Param('widgetId') widgetId: string) {
    return this.dashboardService.deleteCustomDbWidget(widgetId);
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
