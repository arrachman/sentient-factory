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
import { CreateQmsCharacteristicDto } from './dto/create-characteristic.dto';
import { QueryQmsCharacteristicDto } from './dto/query-characteristic.dto';
import { UpdateQmsCharacteristicDto } from './dto/update-characteristic.dto';
import { ErpMdpQmsCharacteristicsService } from './erp-mdp-qms-characteristics.service';

@ApiTags('MDP QMS Inspection Characteristics')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/characteristics')
export class ErpMdpQmsCharacteristicsController {
  constructor(private readonly service: ErpMdpQmsCharacteristicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create characteristic' })
  create(@Body() dto: CreateQmsCharacteristicDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List characteristics' })
  findAll(@Query() query: QueryQmsCharacteristicDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one characteristic' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update characteristic' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsCharacteristicDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete characteristic (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
