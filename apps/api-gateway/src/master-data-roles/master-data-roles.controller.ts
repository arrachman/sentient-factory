import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMasterDataRoleDto } from './dto/create-master-data-role.dto';
import { QueryMasterDataRoleDto } from './dto/query-master-data-role.dto';
import { UpdateMasterDataRoleDto } from './dto/update-master-data-role.dto';
import { UpdateRoleMenusDto } from './dto/update-role-menus.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { MasterDataRolesService } from './master-data-roles.service';

@ApiTags('Master Data Role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-roles')
export class MasterDataRolesController {
  constructor(private readonly service: MasterDataRolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data role' })
  @ApiResponse({ status: 201, description: 'Master data role created' })
  create(@Body() dto: CreateMasterDataRoleDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data role list' })
  @ApiResponse({ status: 200, description: 'List of master data role' })
  findAll(@Query() query: QueryMasterDataRoleDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data role' })
  @ApiResponse({ status: 200, description: 'Master data role detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data role' })
  @ApiResponse({ status: 200, description: 'Master data role updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMasterDataRoleDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data role (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data role deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get assigned permission IDs by role' })
  @ApiResponse({ status: 200, description: 'Assigned permission IDs' })
  getPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRolePermissions(id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Assign/unassign permissions by role (sync)' })
  @ApiResponse({ status: 200, description: 'Role permissions updated' })
  updatePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolePermissionsDto,
    @Request() req: any,
  ) {
    return this.service.updateRolePermissions(id, dto, req.user?.id);
  }

  @Get(':id/menus')
  @ApiOperation({ summary: 'Get assigned menu IDs by role' })
  @ApiResponse({ status: 200, description: 'Assigned menu IDs' })
  getMenus(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRoleMenus(id);
  }

  @Put(':id/menus')
  @ApiOperation({ summary: 'Assign/unassign menus by role (sync)' })
  @ApiResponse({ status: 200, description: 'Role menus updated' })
  updateMenus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleMenusDto,
    @Request() req: any,
  ) {
    return this.service.updateRoleMenus(id, dto, req.user?.id);
  }
}
