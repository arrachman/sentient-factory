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
import { CreateDowntimeEventDto } from './dto/create-downtime-event.dto';
import { QueryDowntimeEventDto } from './dto/query-downtime-event.dto';
import { UpdateDowntimeEventDto } from './dto/update-downtime-event.dto';
import { ErpMdpDowntimeEventsService } from './erp-mdp-downtime-events.service';

@ApiTags('MDP Downtime Events')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/downtime-events')
export class ErpMdpDowntimeEventsController {
  constructor(private readonly service: ErpMdpDowntimeEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Record downtime event' })
  create(@Body() dto: CreateDowntimeEventDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List downtime events' })
  findAll(@Query() query: QueryDowntimeEventDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one downtime event' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update downtime event' })
  update(@Param('id') id: string, @Body() dto: UpdateDowntimeEventDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete downtime event (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
