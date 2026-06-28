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
import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { QueryRoleMenuDto } from './dto/query-role-menu.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';
import { ErpMdpRoleMenusService } from './erp-mdp-role-menus.service';

@ApiTags('MDP Role Menus')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/role-menus')
export class ErpMdpRoleMenusController {
  constructor(private readonly service: ErpMdpRoleMenusService) {}

  @Post()
  @ApiOperation({ summary: 'Map a role to a menu' })
  create(@Body() dto: CreateRoleMenuDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List role→menu mappings' })
  findAll(@Query() query: QueryRoleMenuDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one role→menu mapping' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission flags' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleMenuDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove role→menu mapping (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
