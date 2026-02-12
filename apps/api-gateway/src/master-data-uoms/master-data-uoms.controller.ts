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
import { CreateMasterDataUomDto } from './dto/create-master-data-uom.dto';
import { QueryMasterDataUomDto } from './dto/query-master-data-uom.dto';
import { UpdateMasterDataUomDto } from './dto/update-master-data-uom.dto';
import { MasterDataUomsService } from './master-data-uoms.service';

@ApiTags('Master Data UOM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-uoms')
export class MasterDataUomsController {
  constructor(private readonly service: MasterDataUomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data UOM' })
  @ApiResponse({ status: 201, description: 'Master data UOM created' })
  create(@Body() dto: CreateMasterDataUomDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data UOM list' })
  @ApiResponse({ status: 200, description: 'List of master data UOM' })
  findAll(@Query() query: QueryMasterDataUomDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data UOM' })
  @ApiResponse({ status: 200, description: 'Master data UOM detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data UOM' })
  @ApiResponse({ status: 200, description: 'Master data UOM updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataUomDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data UOM (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data UOM deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
