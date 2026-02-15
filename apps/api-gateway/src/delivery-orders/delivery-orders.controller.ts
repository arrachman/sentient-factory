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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { QueryDeliveryOrderDto } from './dto/query-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { DeliveryOrdersService } from './delivery-orders.service';

@ApiTags('Delivery Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery-orders')
export class DeliveryOrdersController {
  constructor(private readonly service: DeliveryOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create delivery order with batch details' })
  @ApiResponse({ status: 201, description: 'Delivery order created' })
  create(@Body() dto: CreateDeliveryOrderDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get delivery orders' })
  @ApiResponse({ status: 200, description: 'List of delivery orders' })
  findAll(@Query() query: QueryDeliveryOrderDto) {
    return this.service.findAll(query);
  }

  @Get('batch-options')
  @ApiOperation({ summary: 'Get batch options by item for delivery order form' })
  @ApiResponse({ status: 200, description: 'Batch options' })
  getBatchOptions(@Query('itemId') itemId: string) {
    return this.service.getBatchOptions(itemId);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one delivery order' })
  @ApiResponse({ status: 200, description: 'Delivery order detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update delivery order' })
  @ApiResponse({ status: 200, description: 'Delivery order updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateDeliveryOrderDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete delivery order (soft delete)' })
  @ApiResponse({ status: 200, description: 'Delivery order deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
