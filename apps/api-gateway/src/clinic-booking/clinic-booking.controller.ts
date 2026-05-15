import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { ClinicBookingService } from './clinic-booking.service';
import {
  CancelBookingDto,
  CreateBookingDto,
  CreatePackageBookingDto,
  QueryBookingDto,
  RescheduleBookingDto,
  UpdateBookingDto,
} from './dto/clinic-booking.dto';
import { AuditAction } from '../clinic-audit/decorators/audit-action.decorator';

const READ_ROLES = ['clinic-admin', 'clinic-psikolog', 'clinic-resepsionis', 'clinic-owner'];
const WRITE_ROLES = ['clinic-admin', 'clinic-resepsionis'];

@ApiTags('Clinic — Booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/booking')
export class ClinicBookingController {
  constructor(private readonly service: ClinicBookingService) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @UseInterceptors(IdempotencyInterceptor)
  @ApiOperation({ summary: 'Create booking (supports Idempotency-Key header)' })
  create(@Body() dto: CreateBookingDto, @Request() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Post('package')
  @Roles(...WRITE_ROLES)
  @UseInterceptors(IdempotencyInterceptor)
  @AuditAction('create-package')
  @ApiOperation({ summary: 'Create multi-session package booking (atomic, all-or-nothing)' })
  createPackage(@Body() dto: CreatePackageBookingDto, @Request() req: AuthRequest) {
    return this.service.createPackage(dto, req.user?.sub ?? req.user?.id);
  }

  // Dashboard fires N parallel list calls (today/week-range/by-psikolog,
  // dll). JWT-protected read-only — skip throttle supaya tidak 429.
  @Get()
  @Roles(...READ_ROLES)
  @SkipThrottle()
  findAll(@Query() query: QueryBookingDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(...READ_ROLES)
  @SkipThrottle()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(...WRITE_ROLES)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/start')
  @Roles('clinic-admin', 'clinic-psikolog')
  @AuditAction('start')
  @ApiOperation({ summary: 'Mark session started (psikolog)' })
  start(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.start(id, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/complete')
  @Roles('clinic-admin', 'clinic-psikolog')
  @AuditAction('complete')
  @ApiOperation({ summary: 'Mark session complete (psikolog)' })
  complete(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.complete(id, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/cancel')
  @Roles(...WRITE_ROLES)
  @AuditAction('cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelBookingDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.cancel(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/reschedule')
  @Roles(...WRITE_ROLES)
  @AuditAction('reschedule')
  @ApiOperation({ summary: 'Reschedule booking (slot/psikolog/room)' })
  reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RescheduleBookingDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.reschedule(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Post(':id/note')
  @Roles('clinic-admin', 'clinic-psikolog')
  @AuditAction('note')
  @ApiOperation({ summary: 'Tambah clinical note untuk booking (psikolog only)' })
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { noteText: string },
    @Request() req: AuthRequest,
  ) {
    return this.service.addNote(id, dto.noteText, req.user?.sub ?? req.user?.id);
  }

  @Get(':id/note')
  @Roles('clinic-admin', 'clinic-psikolog')
  @ApiOperation({ summary: 'List clinical notes untuk booking' })
  listNotes(@Param('id', ParseIntPipe) id: number) {
    return this.service.listNotes(id);
  }

  @Post(':id/send-reminder')
  @Roles(...WRITE_ROLES)
  @AuditAction('send_reminder')
  @ApiOperation({
    summary: 'Send manual WA reminder ke klien (template Pengingat H-1 atau 30-min)',
  })
  sendReminder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { templateName?: string },
    @Request() req: AuthRequest,
  ) {
    return this.service.sendReminder(
      id,
      dto?.templateName ?? 'Pengingat H-1',
      req.user?.sub ?? req.user?.id,
    );
  }
}
