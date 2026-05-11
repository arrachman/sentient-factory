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
import { ClinicRoomService } from './clinic-room.service';
import { CreateRoomDto, QueryRoomDto, UpdateRoomDto } from './dto/clinic-room.dto';

const ALL_ROLES = [
  'clinic-admin',
  'clinic-psikolog',
  'clinic-owner',
  'clinic-resepsionis',
  'clinic-marketing',
];

@ApiTags('Clinic — Room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/room')
export class ClinicRoomController {
  constructor(private readonly service: ClinicRoomService) {}

  @Post()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create room' })
  create(@Body() dto: CreateRoomDto, @Request() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles(...ALL_ROLES)
  findAll(@Query() query: QueryRoomDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('clinic-admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
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
