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
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { QueryWorkCenterDto } from './dto/query-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';
import { ErpMdpWorkCentersService } from './erp-mdp-work-centers.service';

@ApiTags('MDP Work Centers')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/work-centers')
export class ErpMdpWorkCentersController {
  constructor(private readonly service: ErpMdpWorkCentersService) {}

  @Post()
  @ApiOperation({ summary: 'Create work center' })
  create(@Body() dto: CreateWorkCenterDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List work centers' })
  findAll(@Query() query: QueryWorkCenterDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one work center' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work center' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkCenterDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work center (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
