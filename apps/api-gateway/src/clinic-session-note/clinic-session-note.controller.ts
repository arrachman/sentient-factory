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
import { ClinicSessionNoteService } from './clinic-session-note.service';
import {
  CreateSessionNoteDto,
  QuerySessionNoteDto,
  UpdateSessionNoteDto,
} from './dto/clinic-session-note.dto';

@ApiTags('Clinic — Session Notes (Clinical)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/session-note')
export class ClinicSessionNoteController {
  constructor(private readonly service: ClinicSessionNoteService) {}

  @Post()
  @Roles('clinic-admin', 'clinic-psikolog')
  @ApiOperation({ summary: 'Create clinical session note' })
  create(@Body() dto: CreateSessionNoteDto, @Request() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
  }

  @Get()
  @Roles('clinic-admin', 'clinic-psikolog')
  @ApiOperation({ summary: 'List session notes (privacy-filtered)' })
  findAll(@Query() query: QuerySessionNoteDto, @Request() req: AuthRequest) {
    return this.service.findAll(query, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
  }

  @Get('booking/:bookingId')
  @Roles('clinic-admin', 'clinic-psikolog')
  @ApiOperation({ summary: 'Get all notes for a booking' })
  findByBooking(@Param('bookingId', ParseIntPipe) bookingId: number, @Request() req: AuthRequest) {
    return this.service.findByBooking(
      bookingId,
      req.user?.sub ?? req.user?.id,
      req.user?.roles ?? [],
    );
  }

  @Get(':id')
  @Roles('clinic-admin', 'clinic-psikolog')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.findOne(id, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
  }

  @Patch(':id')
  @Roles('clinic-admin', 'clinic-psikolog')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionNoteDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
  }

  @Delete(':id')
  @Roles('clinic-admin', 'clinic-psikolog')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id, req.user?.roles ?? []);
  }
}
