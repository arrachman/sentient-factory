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
import { CreatePrtIssueDto } from './dto/create-issue.dto';
import { QueryPrtIssueDto } from './dto/query-issue.dto';
import { UpdatePrtIssueDto } from './dto/update-issue.dto';
import { ErpMdpPrtIssuesService } from './erp-mdp-prt-issues.service';

@ApiTags('MDP PRTS Issues')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/prt/issues')
export class ErpMdpPrtIssuesController {
  constructor(private readonly service: ErpMdpPrtIssuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create issue' })
  create(@Body() dto: CreatePrtIssueDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List issues' })
  findAll(@Query() query: QueryPrtIssueDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one issue' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update issue' })
  update(@Param('id') id: string, @Body() dto: UpdatePrtIssueDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete issue (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
