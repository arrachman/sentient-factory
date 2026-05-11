import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicSettingsService } from './clinic-settings.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';

@ApiTags('Clinic — Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/settings')
export class ClinicSettingsController {
  constructor(private readonly service: ClinicSettingsService) {}

  @Get()
  @Roles('clinic-admin', 'clinic-owner')
  @ApiOperation({ summary: 'Get clinic settings (single row)' })
  get() {
    return this.service.get();
  }

  @Patch()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Update clinic settings (partial)' })
  update(@Body() dto: UpdateSettingsDto, @Request() req: AuthRequest) {
    return this.service.update(dto, req.user?.sub ?? req.user?.id);
  }
}
