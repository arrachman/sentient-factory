import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ErpMdpMenusService } from './erp-mdp-menus.service';

@ApiTags('MDP Menus')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/menus')
export class ErpMdpMenusController {
  constructor(private readonly service: ErpMdpMenusService) {}

  @Post()
  @ApiOperation({ summary: 'Create menu' })
  create(@Body() dto: CreateMenuDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List menus' })
  findAll(@Query() query: QueryMenuDto) {
    return this.service.findAll(query);
  }

  @Get('nav')
  @ApiOperation({ summary: 'Role-filtered navigation tree for current user' })
  nav(@Request() req: any) {
    return this.service.nav(req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one menu' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
