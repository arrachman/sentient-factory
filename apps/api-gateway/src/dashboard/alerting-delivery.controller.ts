import {
  Body,
  Controller,
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
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class AlertingDeliveryController {
  constructor(private readonly dashboardService: DashboardService) {}

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

  @Post('alerting/scheduler/run')
  @ApiOperation({ summary: 'Execute due alert rules through scheduler cycle' })
  @ApiResponse({ status: 200, description: 'Alert scheduler cycle result' })
  runAlertingSchedulerCycle(
    @Req() req: Request & { user?: { username?: string; email?: string } },
  ) {
    return this.dashboardService.runAlertingSchedulerCycle(
      req.user?.username || req.user?.email || 'system',
    );
  }

  @Post('alerting/delivery/run')
  @ApiOperation({ summary: 'Execute queued alert delivery logs' })
  @ApiResponse({ status: 200, description: 'Alert delivery worker result' })
  runAlertDeliveryCycle(@Req() req: Request & { user?: { username?: string; email?: string } }) {
    return this.dashboardService.runAlertDeliveryCycle(
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
}
