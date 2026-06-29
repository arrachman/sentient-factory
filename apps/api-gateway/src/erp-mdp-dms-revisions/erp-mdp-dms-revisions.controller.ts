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
import { CreateDmsRevisionDto } from './dto/create-revision.dto';
import { QueryDmsRevisionDto } from './dto/query-revision.dto';
import { UpdateDmsRevisionDto } from './dto/update-revision.dto';
import { ErpMdpDmsRevisionsService } from './erp-mdp-dms-revisions.service';

@ApiTags('MDP DMS Revisions')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/dms/revisions')
export class ErpMdpDmsRevisionsController {
  constructor(private readonly service: ErpMdpDmsRevisionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create revision' })
  create(@Body() dto: CreateDmsRevisionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List revisions' })
  findAll(@Query() query: QueryDmsRevisionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one revision' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update revision' })
  update(@Param('id') id: string, @Body() dto: UpdateDmsRevisionDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete revision (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
