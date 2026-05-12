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

@ApiTags('alerting-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class AlertingConfigController {
  constructor(private readonly dashboardService: DashboardAlertingFacadeService) {}

  // ── Templates ────────────────────────────────────────────────────────────

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
    return this.dashboardService.createAlertingTemplate(
      body,
      req.user?.username || req.user?.email || 'system',
    );
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

  // ── Channels ─────────────────────────────────────────────────────────────

  @Get('alerting/channels')
  @ApiOperation({ summary: 'List persisted alert notification channels' })
  @ApiResponse({ status: 200, description: 'Alert notification channels payload' })
  alertingChannels(@Query('channelType') channelType?: string) {
    return this.dashboardService.alertingChannels(channelType);
  }

  @Post('alerting/channels')
  @ApiOperation({ summary: 'Create alert notification channel' })
  @ApiResponse({ status: 200, description: 'Alert notification channel create result' })
  createAlertingChannel(
    @Req() req: Request & { user?: { username?: string; email?: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.dashboardService.createAlertingChannel(
      body,
      req.user?.username || req.user?.email || 'system',
    );
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

  // ── Settings ─────────────────────────────────────────────────────────────

  @Get('alerting/settings')
  @ApiOperation({ summary: 'List alert runtime settings' })
  @ApiResponse({ status: 200, description: 'Alert runtime settings payload' })
  alertingSettings() {
    return this.dashboardService.alertingSettings();
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

  // ── Escalation Policies ──────────────────────────────────────────────────

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

  // ── Triage Saved Views ───────────────────────────────────────────────────

  @Get('alerting/triage-saved-views')
  @ApiOperation({ summary: 'List triage saved views' })
  @ApiResponse({ status: 200, description: 'Triage saved view payload' })
  alertingTriageSavedViews(@Req() req: Request & { user?: { username?: string; email?: string } }) {
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
}
