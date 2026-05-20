import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { BulkErpItemLocationDto, BulkStatusErpItemLocationDto } from './dto/bulk-item-locations.dto';
import { CreateErpItemLocationDto } from './dto/create-item-locations.dto';
import { QueryErpItemLocationDto } from './dto/query-item-locations.dto';
import { UpdateErpItemLocationDto } from './dto/update-item-locations.dto';
import { ErpItemLocationsService } from './item-locations.service';

@ApiTags('ERP Item Locations')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/item-locations')
export class ErpItemLocationsController {
  constructor(private readonly service: ErpItemLocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Item Location' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateErpItemLocationDto, @Request() req: any) { return this.service.create(dto, req.user?.id); }

  @Get()
  @ApiOperation({ summary: 'List Item Location' })
  findAll(@Query() query: QueryErpItemLocationDto) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get Item Location' })
  findOne(@Param('id') id: string) { return this.service.findOne(BigInt(id)); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Item Location' })
  update(@Param('id') id: string, @Body() dto: UpdateErpItemLocationDto, @Request() req: any) { return this.service.update(BigInt(id), dto, req.user?.id); }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk activate/deactivate' })
  bulkUpdateStatus(@Body() dto: BulkStatusErpItemLocationDto, @Request() req: any) { return this.service.bulkUpdateStatus(dto, req.user?.id); }

  @Delete('bulk')
  @ApiOperation({ summary: 'Bulk soft-delete' })
  bulkDelete(@Body() dto: BulkErpItemLocationDto, @Request() req: any) { return this.service.bulkDelete(dto, req.user?.id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete Item Location' })
  remove(@Param('id') id: string, @Request() req: any) { return this.service.remove(BigInt(id), req.user?.id); }
}
