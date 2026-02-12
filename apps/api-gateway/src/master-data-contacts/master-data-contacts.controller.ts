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

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data contact' })
  @ApiResponse({ status: 200, description: 'Master data contact detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data contact' })
  @ApiResponse({ status: 200, description: 'Master data contact updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataContactDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data contact (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data contact deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
