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
import { CreateMasterDataProvinceDto } from './dto/create-master-data-province.dto';
import { QueryMasterDataProvinceDto } from './dto/query-master-data-province.dto';
import { UpdateMasterDataProvinceDto } from './dto/update-master-data-province.dto';
import { MasterDataProvincesService } from './master-data-provinces.service';

@ApiTags('Master Data Province')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-provinces')
export class MasterDataProvincesController {
  constructor(private readonly service: MasterDataProvincesService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data province' })
  @ApiResponse({ status: 201, description: 'Master data province created' })
  create(@Body() dto: CreateMasterDataProvinceDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data province list' })
  @ApiResponse({ status: 200, description: 'List of master data province' })
  findAll(@Query() query: QueryMasterDataProvinceDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data province' })
  @ApiResponse({ status: 200, description: 'Master data province detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data province' })
  @ApiResponse({ status: 200, description: 'Master data province updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataProvinceDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data province (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data province deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
