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
import { CreateEhsAuditDto } from './dto/create-audit.dto';
import { QueryEhsAuditDto } from './dto/query-audit.dto';
import { UpdateEhsAuditDto } from './dto/update-audit.dto';
import { ErpMdpEhsAuditsService } from './erp-mdp-ehs-audits.service';

@ApiTags('MDP IMS Audits')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/ehs/audits')
export class ErpMdpEhsAuditsController {
  constructor(private readonly service: ErpMdpEhsAuditsService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit' })
  create(@Body() dto: CreateEhsAuditDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List audits' })
  findAll(@Query() query: QueryEhsAuditDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one audit' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update audit' })
  update(@Param('id') id: string, @Body() dto: UpdateEhsAuditDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete audit (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
