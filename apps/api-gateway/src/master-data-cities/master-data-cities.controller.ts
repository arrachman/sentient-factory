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
import { CreateMasterDataCityDto } from './dto/create-master-data-city.dto';
import { QueryMasterDataCityDto } from './dto/query-master-data-city.dto';
import { UpdateMasterDataCityDto } from './dto/update-master-data-city.dto';
import { MasterDataCitiesService } from './master-data-cities.service';

@ApiTags('Master Data Cities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-cities')
export class MasterDataCitiesController {
  constructor(private readonly service: MasterDataCitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data city' })
  @ApiResponse({ status: 201, description: 'Master data city created' })
  create(@Body() dto: CreateMasterDataCityDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data city list' })
  @ApiResponse({ status: 200, description: 'List of master data cities' })
  findAll(@Query() query: QueryMasterDataCityDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data city' })
  @ApiResponse({ status: 200, description: 'Master data city detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data city' })
  @ApiResponse({ status: 200, description: 'Master data city updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataCityDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data city (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data city deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
