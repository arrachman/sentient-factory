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
import { CreateMasterDataWarehouseDto } from './dto/create-master-data-warehouse.dto';
import { QueryMasterDataWarehouseDto } from './dto/query-master-data-warehouse.dto';
import { UpdateMasterDataWarehouseDto } from './dto/update-master-data-warehouse.dto';
import { MasterDataWarehousesService } from './master-data-warehouses.service';

@ApiTags('Master Data Warehouse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-warehouses')
export class MasterDataWarehousesController {
  constructor(private readonly service: MasterDataWarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data warehouse' })
  @ApiResponse({ status: 201, description: 'Master data warehouse created' })
  create(@Body() dto: CreateMasterDataWarehouseDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data warehouse list' })
  @ApiResponse({ status: 200, description: 'List of master data warehouse' })
  findAll(@Query() query: QueryMasterDataWarehouseDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data warehouse' })
  @ApiResponse({ status: 200, description: 'Master data warehouse detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data warehouse' })
  @ApiResponse({ status: 200, description: 'Master data warehouse updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataWarehouseDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data warehouse (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data warehouse deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
