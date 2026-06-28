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
import { CreateQmsInspectionDto } from './dto/create-inspection.dto';
import { QueryQmsInspectionDto } from './dto/query-inspection.dto';
import { UpdateQmsInspectionDto } from './dto/update-inspection.dto';
import { ErpMdpQmsInspectionsService } from './erp-mdp-qms-inspections.service';

@ApiTags('MDP QMS Inspections')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/inspections')
export class ErpMdpQmsInspectionsController {
  constructor(private readonly service: ErpMdpQmsInspectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create inspection' })
  create(@Body() dto: CreateQmsInspectionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List inspections' })
  findAll(@Query() query: QueryQmsInspectionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one inspection' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inspection' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsInspectionDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inspection (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
