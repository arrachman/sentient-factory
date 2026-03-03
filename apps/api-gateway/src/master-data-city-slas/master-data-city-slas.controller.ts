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
import { CreateMasterDataCitySlaDto } from './dto/create-master-data-city-sla.dto';
import { QueryMasterDataCitySlaDto } from './dto/query-master-data-city-sla.dto';
import { UpdateMasterDataCitySlaDto } from './dto/update-master-data-city-sla.dto';
import { MasterDataCitySlasService } from './master-data-city-slas.service';

@ApiTags('Master Data City SLA')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-city-slas')
export class MasterDataCitySlasController {
  constructor(private readonly service: MasterDataCitySlasService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data city SLA' })
  @ApiResponse({ status: 201, description: 'Master data city SLA created' })
  create(@Body() dto: CreateMasterDataCitySlaDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data city SLA list' })
  @ApiResponse({ status: 200, description: 'List of master data city SLA' })
  findAll(@Query() query: QueryMasterDataCitySlaDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data city SLA' })
  @ApiResponse({ status: 200, description: 'Master data city SLA detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data city SLA' })
  @ApiResponse({ status: 200, description: 'Master data city SLA updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMasterDataCitySlaDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data city SLA (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data city SLA deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
