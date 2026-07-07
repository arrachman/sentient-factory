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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { CreateLmsCompetencyDto } from './dto/create-competency.dto';
import { QueryLmsCompetencyDto } from './dto/query-competency.dto';
import { UpdateLmsCompetencyDto } from './dto/update-competency.dto';
import { ErpMdpLmsCompetenciesService } from './erp-mdp-lms-competencies.service';

@ApiTags('MDP LMS Competencies')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/lms/competencies')
export class ErpMdpLmsCompetenciesController {
  constructor(private readonly service: ErpMdpLmsCompetenciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create competency' })
  create(@Body() dto: CreateLmsCompetencyDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List competencys' })
  findAll(@Query() query: QueryLmsCompetencyDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one competency' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update competency' })
  update(@Param('id') id: string, @Body() dto: UpdateLmsCompetencyDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete competency (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
