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
import { CreateErpReportDto } from './dto/create-report.dto';
import { ExecuteSqlDto } from './dto/execute-sql.dto';
import { QueryErpReportDto } from './dto/query-report.dto';
import { UpdateErpReportDto } from './dto/update-report.dto';
import { ErpReportsService } from './erp-reports.service';

@ApiTags('ERP Reports')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/reports')
export class ErpReportsController {
  constructor(private readonly service: ErpReportsService) {}

  @Get()
  @ApiOperation({ summary: 'List report templates' })
  findAll(@Query() query: QueryErpReportDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one report template' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create report template' })
  create(@Body() dto: CreateErpReportDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update report template' })
  update(@Param('id') id: string, @Body() dto: UpdateErpReportDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete report template' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }

  @Post('execute-sql')
  @ApiOperation({ summary: 'Execute a read-only SQL query (SELECT only)' })
  executeSql(@Body() dto: ExecuteSqlDto) {
    return this.service.executeSql(dto);
  }
}
