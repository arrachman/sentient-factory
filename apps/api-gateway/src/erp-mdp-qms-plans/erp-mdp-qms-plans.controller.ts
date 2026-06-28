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
import { CreateQmsPlanDto } from './dto/create-plan.dto';
import { QueryQmsPlanDto } from './dto/query-plan.dto';
import { UpdateQmsPlanDto } from './dto/update-plan.dto';
import { ErpMdpQmsPlansService } from './erp-mdp-qms-plans.service';

@ApiTags('MDP QMS Inspection Plans')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/plans')
export class ErpMdpQmsPlansController {
  constructor(private readonly service: ErpMdpQmsPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create inspection plan' })
  create(@Body() dto: CreateQmsPlanDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List inspection plans' })
  findAll(@Query() query: QueryQmsPlanDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one inspection plan' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inspection plan' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsPlanDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inspection plan (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
