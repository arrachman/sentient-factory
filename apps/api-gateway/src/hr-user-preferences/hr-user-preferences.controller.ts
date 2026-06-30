import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateHrUserPreferencesDto } from './dto/update-hr-user-preferences.dto';
import { HrUserPreferencesService } from './hr-user-preferences.service';

@ApiTags('HR User Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/user-preferences')
export class HrUserPreferencesController {
  constructor(private readonly service: HrUserPreferencesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user appearance preferences (null if not yet saved)' })
  @ApiResponse({ status: 200 })
  getMine(@Request() req: any) {
    return this.service.findForUser(req.user?.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Upsert current user appearance preferences' })
  @ApiResponse({ status: 200 })
  updateMine(@Body() dto: UpdateHrUserPreferencesDto, @Request() req: any) {
    return this.service.upsertForUser(req.user?.id, dto);
  }
}
