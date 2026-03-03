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
import { CreateMasterDataPermissionDto } from './dto/create-master-data-permission.dto';
import { QueryMasterDataPermissionDto } from './dto/query-master-data-permission.dto';
import { UpdateMasterDataPermissionDto } from './dto/update-master-data-permission.dto';
import { MasterDataPermissionsService } from './master-data-permissions.service';

@ApiTags('Master Data Permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-data-permissions')
export class MasterDataPermissionsController {
  constructor(private readonly service: MasterDataPermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create master data permission' })
  @ApiResponse({ status: 201, description: 'Master data permission created' })
  create(@Body() dto: CreateMasterDataPermissionDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get master data permission list' })
  @ApiResponse({ status: 200, description: 'List of master data permission' })
  findAll(@Query() query: QueryMasterDataPermissionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one master data permission' })
  @ApiResponse({ status: 200, description: 'Master data permission detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update master data permission' })
  @ApiResponse({ status: 200, description: 'Master data permission updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMasterDataPermissionDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master data permission (soft delete)' })
  @ApiResponse({ status: 200, description: 'Master data permission deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.id);
  }
}
