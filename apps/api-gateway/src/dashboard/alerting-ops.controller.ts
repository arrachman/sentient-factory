import {
  Body,
  Controller,
  Get,
  Post,
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
export class AlertingOpsController {
  constructor(private readonly dashboardService: DashboardAlertingFacadeService) {}

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
}
