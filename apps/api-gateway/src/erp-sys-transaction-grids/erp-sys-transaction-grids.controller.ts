import { Body, Controller, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { SaveGridColumnsDto } from './dto/save-grid-columns.dto';
import { ErpSysTransactionGridsService } from './erp-sys-transaction-grids.service';

@ApiTags('ERP Transaction Grids (Kustomisasi Grid)')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/transaction-grids')
export class ErpSysTransactionGridsController {
  constructor(private readonly service: ErpSysTransactionGridsService) {}

  @Get('types')
  @ApiOperation({ summary: 'List transaction types (module→transaction tree)' })
  listTypes() {
    return this.service.listTypes();
  }

  @Get(':code/columns')
  @ApiOperation({ summary: 'Get grid columns for a transaction type' })
  getColumns(@Param('code') code: string) {
    return this.service.getColumns(code);
  }

  @Put(':code/columns')
  @ApiOperation({ summary: 'Replace grid columns for a transaction type' })
  saveColumns(
    @Param('code') code: string,
    @Body() dto: SaveGridColumnsDto,
    @Request() req: any,
  ) {
    return this.service.saveColumns(code, dto, req.user?.id);
  }
}
