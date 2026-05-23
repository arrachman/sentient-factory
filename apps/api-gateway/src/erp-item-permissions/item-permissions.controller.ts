import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { BulkErpItemPermissionDto } from './dto/bulk-item-permissions.dto';
import { CreateErpItemPermissionDto } from './dto/create-item-permission.dto';
import { QueryErpItemPermissionDto } from './dto/query-item-permission.dto';
import { UpdateErpItemPermissionDto } from './dto/update-item-permission.dto';
import { ErpItemPermissionsService } from './item-permissions.service';

@ApiTags('ERP Item Permissions')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/item-permissions')
export class ErpItemPermissionsController {
  constructor(private readonly service: ErpItemPermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create / upsert Item Permission' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateErpItemPermissionDto, @Request() req: any) { return this.service.create(dto, req.user?.id); }

  @Get()
  @ApiOperation({ summary: 'List Item Permissions' })
  findAll(@Query() query: QueryErpItemPermissionDto) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get Item Permission by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(BigInt(id)); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Item Permission' })
  update(@Param('id') id: string, @Body() dto: UpdateErpItemPermissionDto, @Request() req: any) { return this.service.update(BigInt(id), dto, req.user?.id); }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update status (placeholder)' })
  bulkUpdateStatus(@Body() dto: BulkErpItemPermissionDto, @Request() req: any) { return this.service.bulkUpdateStatus(dto, req.user?.id); }

  @Delete('bulk')
  @ApiOperation({ summary: 'Bulk soft-delete' })
  bulkDelete(@Body() dto: BulkErpItemPermissionDto, @Request() req: any) { return this.service.bulkDelete(dto, req.user?.id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete Item Permission' })
  remove(@Param('id') id: string, @Request() req: any) { return this.service.remove(BigInt(id), req.user?.id); }
}
