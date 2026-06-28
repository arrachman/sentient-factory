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
import { CreateWmsPickDto } from './dto/create-wms-pick.dto';
import { QueryWmsPickDto } from './dto/query-wms-pick.dto';
import { UpdateWmsPickDto } from './dto/update-wms-pick.dto';
import { ErpMdpWmsPicksService } from './erp-mdp-wms-picks.service';

@ApiTags('MDP WMS Picks')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/wms/picks')
export class ErpMdpWmsPicksController {
  constructor(private readonly service: ErpMdpWmsPicksService) {}

  @Post()
  @ApiOperation({ summary: 'Create pick line' })
  create(@Body() dto: CreateWmsPickDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List pick lines' })
  findAll(@Query() query: QueryWmsPickDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one pick line' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pick line' })
  update(@Param('id') id: string, @Body() dto: UpdateWmsPickDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pick line (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
