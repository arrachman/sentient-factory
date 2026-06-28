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
import { CreateQmsNonconformanceDto } from './dto/create-nonconformance.dto';
import { QueryQmsNonconformanceDto } from './dto/query-nonconformance.dto';
import { UpdateQmsNonconformanceDto } from './dto/update-nonconformance.dto';
import { ErpMdpQmsNonconformancesService } from './erp-mdp-qms-nonconformances.service';

@ApiTags('MDP QMS Nonconformances')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/nonconformances')
export class ErpMdpQmsNonconformancesController {
  constructor(private readonly service: ErpMdpQmsNonconformancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create nonconformance' })
  create(@Body() dto: CreateQmsNonconformanceDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List nonconformances' })
  findAll(@Query() query: QueryQmsNonconformanceDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one nonconformance' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update nonconformance' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsNonconformanceDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete nonconformance (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
