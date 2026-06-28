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
import { CreateQmsResultDto } from './dto/create-result.dto';
import { QueryQmsResultDto } from './dto/query-result.dto';
import { UpdateQmsResultDto } from './dto/update-result.dto';
import { ErpMdpQmsResultsService } from './erp-mdp-qms-results.service';

@ApiTags('MDP QMS Inspection Results')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/results')
export class ErpMdpQmsResultsController {
  constructor(private readonly service: ErpMdpQmsResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create result' })
  create(@Body() dto: CreateQmsResultDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List results' })
  findAll(@Query() query: QueryQmsResultDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one result' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update result' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsResultDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete result (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
