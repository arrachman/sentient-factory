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
import { CreateMasterDataContactDto } from './dto/create-master-data-contact.dto';
import { QueryMasterDataContactDto } from './dto/query-master-data-contact.dto';
import { UpdateMasterDataContactDto } from './dto/update-master-data-contact.dto';
import { MasterDataContactsService } from './master-data-contacts.service';

@ApiTags('Master Data Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-contacts')
export class MasterDataContactsController {
  constructor(private readonly service: MasterDataContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data contact' })
  @ApiResponse({ status: 201, description: 'Master data contact created' })
  create(@Body() dto: CreateMasterDataContactDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data contacts' })
  @ApiResponse({ status: 200, description: 'List of master data contacts' })
  findAll(@Query() query: QueryMasterDataContactDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data contact' })
  @ApiResponse({ status: 200, description: 'Master data contact detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data contact' })
  @ApiResponse({ status: 200, description: 'Master data contact updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataContactDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data contact (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data contact deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
