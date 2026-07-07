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
import { CreateWmsTaskDto } from './dto/create-wms-task.dto';
import { QueryWmsTaskDto } from './dto/query-wms-task.dto';
import { UpdateWmsTaskDto } from './dto/update-wms-task.dto';
import { ErpMdpWmsTasksService } from './erp-mdp-wms-tasks.service';

@ApiTags('MDP WMS Tasks')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/wms/tasks')
export class ErpMdpWmsTasksController {
  constructor(private readonly service: ErpMdpWmsTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create WMS task' })
  create(@Body() dto: CreateWmsTaskDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List WMS tasks' })
  findAll(@Query() query: QueryWmsTaskDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one WMS task' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update WMS task' })
  update(@Param('id') id: string, @Body() dto: UpdateWmsTaskDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete WMS task (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
