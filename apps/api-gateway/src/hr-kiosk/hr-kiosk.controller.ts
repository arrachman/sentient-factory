import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrKioskService } from './hr-kiosk.service';
import { KioskClockDto, SetKioskPinDto } from './dto/kiosk.dto';

type AuthUser = { id: number; roles?: string[] };

@ApiTags('HR Kiosk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/kiosk')
export class HrKioskController {
  constructor(private readonly service: HrKioskService) {}

  @Get('roster')
  @ApiOperation({ summary: 'Active employee roster for kiosk picker (privileged)' })
  getRoster(@Request() req: { user: AuthUser }) {
    return this.service.getRoster(req.user);
  }

  @Put('pin/:appUserId')
  @ApiOperation({ summary: 'Set/reset an employee kiosk PIN (privileged)' })
  setPin(
    @Request() req: { user: AuthUser },
    @Param('appUserId', ParseIntPipe) appUserId: number,
    @Body() dto: SetKioskPinDto,
  ) {
    return this.service.setPin(req.user, appUserId, dto);
  }

  @Delete('pin/:appUserId')
  @ApiOperation({ summary: 'Remove an employee kiosk PIN (privileged)' })
  clearPin(
    @Request() req: { user: AuthUser },
    @Param('appUserId', ParseIntPipe) appUserId: number,
  ) {
    return this.service.clearPin(req.user, appUserId);
  }

  @Post('clock')
  @ApiOperation({ summary: 'Clock an employee in/out via PIN or face (privileged device)' })
  clock(@Request() req: { user: AuthUser }, @Body() dto: KioskClockDto) {
    return this.service.clock(req.user, dto);
  }
}
