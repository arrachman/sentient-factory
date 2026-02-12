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

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data province' })
  @ApiResponse({ status: 200, description: 'Master data province detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data province' })
  @ApiResponse({ status: 200, description: 'Master data province updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataProvinceDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data province (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data province deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
