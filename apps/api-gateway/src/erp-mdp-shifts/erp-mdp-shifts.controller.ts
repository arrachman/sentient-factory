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
import { CreateShiftDto } from './dto/create-shift.dto';
import { QueryShiftDto } from './dto/query-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ErpMdpShiftsService } from './erp-mdp-shifts.service';

@ApiTags('MDP Shifts')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/shifts')
export class ErpMdpShiftsController {
  constructor(private readonly service: ErpMdpShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Create shift' })
  create(@Body() dto: CreateShiftDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List shifts' })
  findAll(@Query() query: QueryShiftDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one shift' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shift' })
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shift (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
