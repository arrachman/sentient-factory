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
import { CreateDmsDocumentDto } from './dto/create-document.dto';
import { QueryDmsDocumentDto } from './dto/query-document.dto';
import { UpdateDmsDocumentDto } from './dto/update-document.dto';
import { ErpMdpDmsDocumentsService } from './erp-mdp-dms-documents.service';

@ApiTags('MDP DMS Documents')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/dms/documents')
export class ErpMdpDmsDocumentsController {
  constructor(private readonly service: ErpMdpDmsDocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document' })
  create(@Body() dto: CreateDmsDocumentDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List documents' })
  findAll(@Query() query: QueryDmsDocumentDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one document' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  update(@Param('id') id: string, @Body() dto: UpdateDmsDocumentDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
