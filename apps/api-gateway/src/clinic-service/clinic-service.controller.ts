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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicServiceService } from './clinic-service.service';
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './dto/clinic-service.dto';

@ApiTags('Clinic — Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/service')
export class ClinicServiceController {
  constructor(private readonly service: ClinicServiceService) {}

  @Post()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create service' })
  create(@Body() dto: CreateServiceDto, @Request() req: any) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles(
    'clinic-admin',
    'clinic-psikolog',
    'clinic-owner',
    'clinic-resepsionis',
    'clinic-marketing',
  )
  @ApiOperation({ summary: 'List services' })
  findAll(@Query() query: QueryServiceDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(
    'clinic-admin',
    'clinic-psikolog',
    'clinic-owner',
    'clinic-resepsionis',
    'clinic-marketing',
  )
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('clinic-admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete(':id')
  @Roles('clinic-admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id);
  }
}
