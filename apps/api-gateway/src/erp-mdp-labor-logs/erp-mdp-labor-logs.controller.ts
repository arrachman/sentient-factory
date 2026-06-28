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
import { CreateLaborLogDto } from './dto/create-labor-log.dto';
import { QueryLaborLogDto } from './dto/query-labor-log.dto';
import { UpdateLaborLogDto } from './dto/update-labor-log.dto';
import { ErpMdpLaborLogsService } from './erp-mdp-labor-logs.service';

@ApiTags('MDP Labor Logs')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/labor-logs')
export class ErpMdpLaborLogsController {
  constructor(private readonly service: ErpMdpLaborLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Record labor log (clock-in/out)' })
  create(@Body() dto: CreateLaborLogDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List labor logs' })
  findAll(@Query() query: QueryLaborLogDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one labor log' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update labor log' })
  update(@Param('id') id: string, @Body() dto: UpdateLaborLogDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete labor log (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
