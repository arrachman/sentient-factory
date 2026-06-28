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
import { CreateMaterialConsumptionDto } from './dto/create-material-consumption.dto';
import { QueryMaterialConsumptionDto } from './dto/query-material-consumption.dto';
import { UpdateMaterialConsumptionDto } from './dto/update-material-consumption.dto';
import { ErpMdpMaterialConsumptionsService } from './erp-mdp-material-consumptions.service';

@ApiTags('MDP Material Consumptions')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/material-consumptions')
export class ErpMdpMaterialConsumptionsController {
  constructor(private readonly service: ErpMdpMaterialConsumptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Record material consumption' })
  create(@Body() dto: CreateMaterialConsumptionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List material consumptions' })
  findAll(@Query() query: QueryMaterialConsumptionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one material consumption' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update material consumption' })
  update(@Param('id') id: string, @Body() dto: UpdateMaterialConsumptionDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete material consumption (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
