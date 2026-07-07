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
import { CreateWmsHandlingUnitDto } from './dto/create-wms-handling-unit.dto';
import { QueryWmsHandlingUnitDto } from './dto/query-wms-handling-unit.dto';
import { UpdateWmsHandlingUnitDto } from './dto/update-wms-handling-unit.dto';
import { ErpMdpWmsHandlingUnitsService } from './erp-mdp-wms-handling-units.service';

@ApiTags('MDP WMS Handling Units')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/wms/handling-units')
export class ErpMdpWmsHandlingUnitsController {
  constructor(private readonly service: ErpMdpWmsHandlingUnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create handling unit' })
  create(@Body() dto: CreateWmsHandlingUnitDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List handling units' })
  findAll(@Query() query: QueryWmsHandlingUnitDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one handling unit' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update handling unit' })
  update(@Param('id') id: string, @Body() dto: UpdateWmsHandlingUnitDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete handling unit (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
