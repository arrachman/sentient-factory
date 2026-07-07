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
import { CreateWorkCalendarDto } from './dto/create-work-calendar.dto';
import { QueryWorkCalendarDto } from './dto/query-work-calendar.dto';
import { UpdateWorkCalendarDto } from './dto/update-work-calendar.dto';
import { ErpMdpWorkCalendarsService } from './erp-mdp-work-calendars.service';

@ApiTags('MDP Work Calendars')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/work-calendars')
export class ErpMdpWorkCalendarsController {
  constructor(private readonly service: ErpMdpWorkCalendarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create work calendar' })
  create(@Body() dto: CreateWorkCalendarDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List work calendars' })
  findAll(@Query() query: QueryWorkCalendarDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one work calendar' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work calendar' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkCalendarDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work calendar (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
