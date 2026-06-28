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
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { QueryProductionOrderDto } from './dto/query-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { ErpMdpProductionOrdersService } from './erp-mdp-production-orders.service';

@ApiTags('MDP Production Orders')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/production-orders')
export class ErpMdpProductionOrdersController {
  constructor(private readonly service: ErpMdpProductionOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create production order' })
  create(@Body() dto: CreateProductionOrderDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List production orders' })
  findAll(@Query() query: QueryProductionOrderDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one production order' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update production order' })
  update(@Param('id') id: string, @Body() dto: UpdateProductionOrderDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete production order (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
