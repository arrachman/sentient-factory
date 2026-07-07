import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrPolicyService } from './hr-policy.service';
import { UpdateOvertimePolicyDto } from './dto/overtime-policy.dto';

@ApiTags('HR Policy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/policy')
export class HrPolicyController {
  constructor(private readonly service: HrPolicyService) {}

  @Get('overtime')
  @ApiOperation({ summary: 'Get overtime & break policy' })
  getOvertime() {
    return this.service.getOvertimePolicy();
  }

  @Put('overtime')
  @ApiOperation({ summary: 'Update overtime & break policy (privileged)' })
  updateOvertime(@Request() req: any, @Body() dto: UpdateOvertimePolicyDto) {
    return this.service.updateOvertimePolicy(req.user, dto);
  }
}
