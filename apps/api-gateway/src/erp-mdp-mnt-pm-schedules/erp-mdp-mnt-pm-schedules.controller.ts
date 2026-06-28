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
import { CreateMntPmScheduleDto } from './dto/create-pm-schedule.dto';
import { QueryMntPmScheduleDto } from './dto/query-pm-schedule.dto';
import { UpdateMntPmScheduleDto } from './dto/update-pm-schedule.dto';
import { ErpMdpMntPmSchedulesService } from './erp-mdp-mnt-pm-schedules.service';

@ApiTags('MDP CMMS PM Schedules')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/mnt/pm-schedules')
export class ErpMdpMntPmSchedulesController {
  constructor(private readonly service: ErpMdpMntPmSchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create pm schedule' })
  create(@Body() dto: CreateMntPmScheduleDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List pm schedules' })
  findAll(@Query() query: QueryMntPmScheduleDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one pm schedule' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pm schedule' })
  update(@Param('id') id: string, @Body() dto: UpdateMntPmScheduleDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pm schedule (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
