import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log' })
  @ApiResponse({ status: 201, description: 'Audit log created' })
  create(@Body() dto: CreateAuditLogDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  findAll(@Query() query: QueryAuditLogDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one audit log' })
  @ApiResponse({ status: 200, description: 'Audit log detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update audit log' })
  @ApiResponse({ status: 200, description: 'Audit log updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuditLogDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete audit log (soft delete)' })
  @ApiResponse({ status: 200, description: 'Audit log deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
