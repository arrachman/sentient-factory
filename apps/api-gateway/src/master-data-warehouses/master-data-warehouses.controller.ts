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

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data warehouse' })
  @ApiResponse({ status: 200, description: 'Master data warehouse detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data warehouse' })
  @ApiResponse({ status: 200, description: 'Master data warehouse updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataWarehouseDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data warehouse (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data warehouse deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
