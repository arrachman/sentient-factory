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
import { CreateOutboundDto } from './dto/create-outbound.dto';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { UpdateOutboundDto } from './dto/update-outbound.dto';
import { OutboundService } from './outbound.service';

@ApiTags('Outbound')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('outbound')
export class OutboundController {
  constructor(private readonly service: OutboundService) {}

  @Post()
  @ApiOperation({ summary: 'Create outbound with batch details' })
  @ApiResponse({ status: 201, description: 'outbound created' })
  create(@Body() dto: CreateOutboundDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get outbounds' })
  @ApiResponse({ status: 200, description: 'List of outbounds' })
  findAll(@Query() query: QueryOutboundDto) {
    return this.service.findAll(query);
  }

  @Get('batch-options')
  @ApiOperation({ summary: 'Get batch options by item for outbound form' })
  @ApiResponse({ status: 200, description: 'Batch options' })
  getBatchOptions(@Query('itemId') itemId: string, @Query('excludeDoId') excludeDoId?: string) {
    return this.service.getBatchOptions(itemId, excludeDoId);
  }

  @Get('report-monitoring-do')
  @ApiOperation({ summary: 'Get monitoring DO and delivery report data' })
  @ApiResponse({ status: 200, description: 'Monitoring report data' })
  getMonitoringReport(@Query() query: QueryMonitoringOutboundDto) {
    return this.service.findMonitoringReport(query);
  }

  @Get('report-stock-batch')
  @ApiOperation({ summary: 'Get stock batch report data' })
  @ApiResponse({ status: 200, description: 'Stock batch report data' })
  getStockBatchReport(@Query() query: QueryStockBatchReportDto) {
    return this.service.findStockBatchReport(query);
  }

  @Get('report-stock-mutation')
  @ApiOperation({ summary: 'Get stock mutation report data' })
  @ApiResponse({ status: 200, description: 'Stock mutation report data' })
  getStockMutationReport(@Query() query: QueryStockMutationReportDto) {
    return this.service.findStockMutationReport(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one outbound' })
  @ApiResponse({ status: 200, description: 'outbound detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update outbound' })
  @ApiResponse({ status: 200, description: 'outbound updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOutboundDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete outbound (soft delete)' })
  @ApiResponse({ status: 200, description: 'outbound deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
