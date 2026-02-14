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

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data city SLA' })
  @ApiResponse({ status: 200, description: 'Master data city SLA detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data city SLA' })
  @ApiResponse({ status: 200, description: 'Master data city SLA updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataCitySlaDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data city SLA (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data city SLA deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
