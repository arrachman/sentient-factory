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
import { CreateEhsIncidentDto } from './dto/create-incident.dto';
import { QueryEhsIncidentDto } from './dto/query-incident.dto';
import { UpdateEhsIncidentDto } from './dto/update-incident.dto';
import { ErpMdpEhsIncidentsService } from './erp-mdp-ehs-incidents.service';

@ApiTags('MDP IMS Incidents')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/ehs/incidents')
export class ErpMdpEhsIncidentsController {
  constructor(private readonly service: ErpMdpEhsIncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create incident' })
  create(@Body() dto: CreateEhsIncidentDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List incidents' })
  findAll(@Query() query: QueryEhsIncidentDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one incident' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident' })
  update(@Param('id') id: string, @Body() dto: UpdateEhsIncidentDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
