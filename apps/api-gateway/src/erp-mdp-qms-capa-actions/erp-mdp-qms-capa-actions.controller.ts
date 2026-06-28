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
import { CreateQmsCapaActionDto } from './dto/create-capa-action.dto';
import { QueryQmsCapaActionDto } from './dto/query-capa-action.dto';
import { UpdateQmsCapaActionDto } from './dto/update-capa-action.dto';
import { ErpMdpQmsCapaActionsService } from './erp-mdp-qms-capa-actions.service';

@ApiTags('MDP QMS CAPA Actions')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/qms/capa-actions')
export class ErpMdpQmsCapaActionsController {
  constructor(private readonly service: ErpMdpQmsCapaActionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create capa action' })
  create(@Body() dto: CreateQmsCapaActionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List capa actions' })
  findAll(@Query() query: QueryQmsCapaActionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one capa action' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update capa action' })
  update(@Param('id') id: string, @Body() dto: UpdateQmsCapaActionDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete capa action (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
