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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicPsikologService } from './clinic-psikolog.service';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';

@ApiTags('Clinic — Psikolog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/psikolog')
export class ClinicPsikologController {
  constructor(private readonly service: ClinicPsikologService) {}

  @Post()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create psikolog (User + ClinicPsikologProfile)' })
  @ApiResponse({ status: 201, description: 'Psikolog created' })
  create(@Body() dto: CreatePsikologDto, @Request() req: any) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles('clinic-admin', 'clinic-psikolog', 'clinic-owner', 'clinic-resepsionis', 'clinic-marketing')
  @ApiOperation({ summary: 'List psikolog (paginated)' })
  @ApiResponse({ status: 200, description: 'List of psikolog' })
  findAll(@Query() query: QueryPsikologDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles('clinic-admin', 'clinic-psikolog', 'clinic-owner', 'clinic-resepsionis', 'clinic-marketing')
  @ApiOperation({ summary: 'Get one psikolog detail' })
  @ApiResponse({ status: 200, description: 'Psikolog detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Update psikolog' })
  @ApiResponse({ status: 200, description: 'Psikolog updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePsikologDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete(':id')
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Soft delete psikolog' })
  @ApiResponse({ status: 200, description: 'Psikolog deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id);
  }
}
