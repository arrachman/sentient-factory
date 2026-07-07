// hr-sys-menus — endpoint menu sidebar HR.
// Guard = JwtAuthGuard (cookie sf_token, platform auth) — SAMA dengan controller
// hr-attendance yang ada (BUKAN ErpJwtAuthGuard yang baca erp_token). req.user =
// { id (appUserId), email, username, fullName, roles }.
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrSysMenusService } from './hr-sys-menus.service';

@ApiTags('HR Sys Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/sys-menus')
export class HrSysMenusController {
  constructor(private readonly service: HrSysMenusService) {}

  @Get('my-menus')
  @ApiOperation({ summary: 'Get HR menus accessible to the current user (role-filtered)' })
  @ApiResponse({ status: 200, description: 'HR menu tree filtered by user role' })
  getMyMenus(@Request() req: any) {
    return this.service.getMyMenus({ id: req.user.id, roles: req.user.roles });
  }
}
