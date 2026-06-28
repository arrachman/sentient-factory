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
import { CreateMntSparePartDto } from './dto/create-spare-part.dto';
import { QueryMntSparePartDto } from './dto/query-spare-part.dto';
import { UpdateMntSparePartDto } from './dto/update-spare-part.dto';
import { ErpMdpMntSparePartsService } from './erp-mdp-mnt-spare-parts.service';

@ApiTags('MDP CMMS Spare Parts')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/mnt/spare-parts')
export class ErpMdpMntSparePartsController {
  constructor(private readonly service: ErpMdpMntSparePartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create spare part' })
  create(@Body() dto: CreateMntSparePartDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List spare parts' })
  findAll(@Query() query: QueryMntSparePartDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one spare part' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update spare part' })
  update(@Param('id') id: string, @Body() dto: UpdateMntSparePartDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete spare part (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
