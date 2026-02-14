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
import { CreateMasterDataDivisionDto } from './dto/create-master-data-division.dto';
import { QueryMasterDataDivisionDto } from './dto/query-master-data-division.dto';
import { UpdateMasterDataDivisionDto } from './dto/update-master-data-division.dto';
import { MasterDataDivisionsService } from './master-data-divisions.service';

@ApiTags('Master Data Division')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-divisions')
export class MasterDataDivisionsController {
  constructor(private readonly service: MasterDataDivisionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data division' })
  @ApiResponse({ status: 201, description: 'Master data division created' })
  create(@Body() dto: CreateMasterDataDivisionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data division list' })
  @ApiResponse({ status: 200, description: 'List of master data division' })
  findAll(@Query() query: QueryMasterDataDivisionDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data division' })
  @ApiResponse({ status: 200, description: 'Master data division detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data division' })
  @ApiResponse({ status: 200, description: 'Master data division updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataDivisionDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data division (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data division deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
