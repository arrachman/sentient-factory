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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateErpSysMenuDto } from './dto/create-erp-sys-menu.dto';
import { QueryErpSysMenuDto } from './dto/query-erp-sys-menu.dto';
import { UpdateErpSysMenuDto } from './dto/update-erp-sys-menu.dto';
import { ErpSysMenusService } from './erp-sys-menus.service';

@ApiTags('ERP Sys Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('erp/sys-menus')
export class ErpSysMenusController {
  constructor(private readonly service: ErpSysMenusService) {}

  @Post()
  @ApiOperation({ summary: 'Create ERP menu item' })
  @ApiResponse({ status: 201, description: 'ERP menu created' })
  create(@Body() dto: CreateErpSysMenuDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List ERP menus (flat)' })
  @ApiResponse({ status: 200, description: 'Flat list of ERP menus' })
  findAll(@Query() query: QueryErpSysMenuDto) {
    return this.service.findAll(query);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get ERP menu tree (nested)' })
  @ApiResponse({ status: 200, description: 'Nested menu tree' })
  getTree() {
    return this.service.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one ERP menu' })
  @ApiResponse({ status: 200, description: 'ERP menu detail' })
  @ApiResponse({ status: 404, description: 'ERP menu not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ERP menu' })
  @ApiResponse({ status: 200, description: 'ERP menu updated' })
  update(@Param('id') id: string, @Body() dto: UpdateErpSysMenuDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete ERP menu' })
  @ApiResponse({ status: 200, description: 'ERP menu deleted' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
