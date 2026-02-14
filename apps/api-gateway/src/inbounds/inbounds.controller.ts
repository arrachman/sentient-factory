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
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';
import { InboundsService } from './inbounds.service';

@ApiTags('Inbounds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inbounds')
export class InboundsController {
  constructor(private readonly service: InboundsService) {}

  @Post()
  @ApiOperation({ summary: 'Create inbound with detail batches' })
  @ApiResponse({ status: 201, description: 'Inbound created' })
  create(@Body() dto: CreateInboundDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get inbounds' })
  @ApiResponse({ status: 200, description: 'List of inbounds' })
  findAll(@Query() query: QueryInboundDto) {
    return this.service.findAll(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get one inbound' })
  @ApiResponse({ status: 200, description: 'Inbound detail' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update inbound' })
  @ApiResponse({ status: 200, description: 'Inbound updated' })
  update(@Param('uuid') uuid: string, @Body() dto: UpdateInboundDto, @Request() req: any) {
    return this.service.update(uuid, dto, req.user?.id);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete inbound (soft delete)' })
  @ApiResponse({ status: 200, description: 'Inbound deleted' })
  remove(@Param('uuid') uuid: string, @Request() req: any) {
    return this.service.remove(uuid, req.user?.id);
  }
}
