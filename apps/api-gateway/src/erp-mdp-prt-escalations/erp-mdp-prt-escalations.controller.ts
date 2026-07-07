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
import { CreatePrtEscalationDto } from './dto/create-escalation.dto';
import { QueryPrtEscalationDto } from './dto/query-escalation.dto';
import { UpdatePrtEscalationDto } from './dto/update-escalation.dto';
import { ErpMdpPrtEscalationsService } from './erp-mdp-prt-escalations.service';

@ApiTags('MDP PRTS Escalations')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/prt/escalations')
export class ErpMdpPrtEscalationsController {
  constructor(private readonly service: ErpMdpPrtEscalationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create escalation' })
  create(@Body() dto: CreatePrtEscalationDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List escalations' })
  findAll(@Query() query: QueryPrtEscalationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one escalation' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update escalation' })
  update(@Param('id') id: string, @Body() dto: UpdatePrtEscalationDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete escalation (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
