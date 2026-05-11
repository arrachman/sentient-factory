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
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicClientService } from './clinic-client.service';
import { CreateClientDto, QueryClientDto, UpdateClientDto } from './dto/clinic-client.dto';

@ApiTags('Clinic — Client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/client')
export class ClinicClientController {
  constructor(private readonly service: ClinicClientService) {}

  @Post()
  @Roles('clinic-admin', 'clinic-resepsionis')
  @ApiOperation({ summary: 'Create client (intake form)' })
  create(@Body() dto: CreateClientDto, @Request() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles('clinic-admin', 'clinic-psikolog', 'clinic-resepsionis')
  findAll(@Query() query: QueryClientDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles('clinic-admin', 'clinic-psikolog', 'clinic-resepsionis')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('clinic-admin', 'clinic-resepsionis')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete(':id')
  @Roles('clinic-admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id);
  }
}
