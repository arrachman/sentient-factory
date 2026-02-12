import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MenusService } from './menus.service';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @UseGuards(JwtAuthGuard)
  @Get('sidebar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sidebar menu tree by authenticated user roles' })
  @ApiResponse({ status: 200, description: 'Sidebar menu list' })
  async getSidebar(@Request() req: any): Promise<{ success: boolean; data: any[] }> {
    const userId = req.user?.id;
    const menus = await this.menusService.getSidebarByUserId(userId);

    return {
      success: true,
      data: menus,
    };
  }
}
