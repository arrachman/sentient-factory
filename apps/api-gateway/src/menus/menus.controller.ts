import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuSortBatchDto } from './dto/update-menu-sort-batch.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';

@ApiTags('Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: 'Create menu' })
  @ApiResponse({ status: 201, description: 'Menu created' })
  create(@Body() dto: CreateMenuDto, @Request() req: any) {
    return this.menusService.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get menu list' })
  @ApiResponse({ status: 200, description: 'List of menus' })
  findAll(@Query() query: QueryMenuDto) {
    return this.menusService.findAll(query);
  }

  @Get('sidebar')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get one menu' })
  @ApiResponse({ status: 200, description: 'Menu detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.findOne(id);
  }

  @Patch('sort-batch')
  @ApiOperation({ summary: 'Batch update menu sort order' })
  @ApiResponse({ status: 200, description: 'Menu sort order updated' })
  updateSortBatch(@Body() dto: UpdateMenuSortBatchDto, @Request() req: any) {
    return this.menusService.updateSortBatch(dto, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: 200, description: 'Menu updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto, @Request() req: any) {
    return this.menusService.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu (soft delete)' })
  @ApiResponse({ status: 200, description: 'Menu deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.menusService.remove(id, req.user?.id);
  }
}
