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

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data item' })
  @ApiResponse({ status: 200, description: 'Master data item detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data item' })
  @ApiResponse({ status: 200, description: 'Master data item updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDataItemDto, @Request() req: any) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data item (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data item deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
