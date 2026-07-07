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
import { CreateWmsMovementDto } from './dto/create-wms-movement.dto';
import { QueryWmsMovementDto } from './dto/query-wms-movement.dto';
import { UpdateWmsMovementDto } from './dto/update-wms-movement.dto';
import { ErpMdpWmsMovementsService } from './erp-mdp-wms-movements.service';

@ApiTags('MDP WMS Movements')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/wms/movements')
export class ErpMdpWmsMovementsController {
  constructor(private readonly service: ErpMdpWmsMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create movement (emitted to ERP inv_ later — decision #3)' })
  create(@Body() dto: CreateWmsMovementDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List movements' })
  findAll(@Query() query: QueryWmsMovementDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one movement' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update movement' })
  update(@Param('id') id: string, @Body() dto: UpdateWmsMovementDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete movement (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
