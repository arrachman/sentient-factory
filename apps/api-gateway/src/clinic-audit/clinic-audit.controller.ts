import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAudit } from './decorators/skip-audit.decorator';
import { ClinicAuditService, type QueryAuditDto } from './clinic-audit.service';

@ApiTags('Clinic — Audit Log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/audit')
@SkipAudit()
export class ClinicAuditController {
  constructor(private readonly service: ClinicAuditService) {}

  @Get()
  @Roles('clinic-admin', 'clinic-owner')
  findAll(@Query() query: QueryAuditDto) {
    return this.service.findAll(query);
  }
}
