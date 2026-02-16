import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data division' })
  @ApiResponse({ status: 200, description: 'Master data division detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data division' })
  @ApiResponse({ status: 200, description: 'Master data division updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataDivisionDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data division (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data division deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
