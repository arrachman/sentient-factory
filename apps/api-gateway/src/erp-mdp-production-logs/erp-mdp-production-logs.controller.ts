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
import { CreateProductionLogDto } from './dto/create-production-log.dto';
import { QueryProductionLogDto } from './dto/query-production-log.dto';
import { UpdateProductionLogDto } from './dto/update-production-log.dto';
import { ErpMdpProductionLogsService } from './erp-mdp-production-logs.service';

@ApiTags('MDP Production Logs')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/production-logs')
export class ErpMdpProductionLogsController {
  constructor(private readonly service: ErpMdpProductionLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Record production log (good/scrap)' })
  create(@Body() dto: CreateProductionLogDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List production logs' })
  findAll(@Query() query: QueryProductionLogDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one production log' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update production log' })
  update(@Param('id') id: string, @Body() dto: UpdateProductionLogDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete production log (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
