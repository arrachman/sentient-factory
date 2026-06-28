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
import { CreateMntWorkOrderDto } from './dto/create-work-order.dto';
import { QueryMntWorkOrderDto } from './dto/query-work-order.dto';
import { UpdateMntWorkOrderDto } from './dto/update-work-order.dto';
import { ErpMdpMntWorkOrdersService } from './erp-mdp-mnt-work-orders.service';

@ApiTags('MDP CMMS Work Orders')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/mnt/work-orders')
export class ErpMdpMntWorkOrdersController {
  constructor(private readonly service: ErpMdpMntWorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create work order' })
  create(@Body() dto: CreateMntWorkOrderDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List work orders' })
  findAll(@Query() query: QueryMntWorkOrderDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one work order' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work order' })
  update(@Param('id') id: string, @Body() dto: UpdateMntWorkOrderDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
