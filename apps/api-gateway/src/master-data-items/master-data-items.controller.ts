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
import { CreateMasterDataItemDto } from './dto/create-master-data-item.dto';
import { QueryMasterDataItemDto } from './dto/query-master-data-item.dto';
import { UpdateMasterDataItemDto } from './dto/update-master-data-item.dto';
import { MasterDataItemsService } from './master-data-items.service';

@ApiTags('Master Data Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-items')
export class MasterDataItemsController {
  constructor(private readonly service: MasterDataItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data item' })
  @ApiResponse({ status: 201, description: 'Master data item created' })
  create(@Body() dto: CreateMasterDataItemDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data items' })
  @ApiResponse({ status: 200, description: 'List of master data items' })
  findAll(@Query() query: QueryMasterDataItemDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one master data item' })
  @ApiResponse({ status: 200, description: 'Master data item detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update master data item' })
  @ApiResponse({ status: 200, description: 'Master data item updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMasterDataItemDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete master data item (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data item deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
