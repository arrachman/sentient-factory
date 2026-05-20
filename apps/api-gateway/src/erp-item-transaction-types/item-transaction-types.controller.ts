import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { BulkErpItemTransactionTypeDto, BulkStatusErpItemTransactionTypeDto } from './dto/bulk-item-transaction-types.dto';
import { CreateErpItemTransactionTypeDto } from './dto/create-item-transaction-types.dto';
import { QueryErpItemTransactionTypeDto } from './dto/query-item-transaction-types.dto';
import { UpdateErpItemTransactionTypeDto } from './dto/update-item-transaction-types.dto';
import { ErpItemTransactionTypesService } from './item-transaction-types.service';

@ApiTags('ERP Item Transaction Types')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/item-transaction-types')
export class ErpItemTransactionTypesController {
  constructor(private readonly service: ErpItemTransactionTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Item Transaction Type' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateErpItemTransactionTypeDto, @Request() req: any) { return this.service.create(dto, req.user?.id); }

  @Get()
  @ApiOperation({ summary: 'List Item Transaction Type' })
  findAll(@Query() query: QueryErpItemTransactionTypeDto) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get Item Transaction Type' })
  findOne(@Param('id') id: string) { return this.service.findOne(BigInt(id)); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Item Transaction Type' })
  update(@Param('id') id: string, @Body() dto: UpdateErpItemTransactionTypeDto, @Request() req: any) { return this.service.update(BigInt(id), dto, req.user?.id); }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk activate/deactivate' })
  bulkUpdateStatus(@Body() dto: BulkStatusErpItemTransactionTypeDto, @Request() req: any) { return this.service.bulkUpdateStatus(dto, req.user?.id); }

  @Delete('bulk')
  @ApiOperation({ summary: 'Bulk soft-delete' })
  bulkDelete(@Body() dto: BulkErpItemTransactionTypeDto, @Request() req: any) { return this.service.bulkDelete(dto, req.user?.id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete Item Transaction Type' })
  remove(@Param('id') id: string, @Request() req: any) { return this.service.remove(BigInt(id), req.user?.id); }
}
