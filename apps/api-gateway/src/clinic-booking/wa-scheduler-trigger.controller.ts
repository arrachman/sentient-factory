import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiPropertyOptional, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthRequest } from '../auth/types/auth-request';
import { PrismaService } from '../prisma/prisma.service';
import { BookingReminderScheduler, ReminderRunResult } from './booking-reminder.scheduler';
import { localDateAtMidnight, localPartsInTimezone } from './timezone.util';
import { normalizePhoneId } from '../common/utils/phone.util';

export class TriggerSchedulerDto {
  @ApiProperty({ enum: ['h1', 'm30', 'feedback_h1'], description: 'Tipe reminder yang akan dijalankan' })
  @IsIn(['h1', 'm30', 'feedback_h1'])
  type!: 'h1' | 'm30' | 'feedback_h1';

  @ApiPropertyOptional({
    description: 'Nomor WA test (format +62xxx / 08xxx). Bila diisi, buat test client + booking otomatis sesuai tipe.',
    example: '+6285123456789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  testPhone?: string;

  @ApiPropertyOptional({
    description: 'Untuk tipe m30: override window center (menit dari sekarang). Default 30.',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  windowCenterMinutes?: number;

  @ApiPropertyOptional({ description: 'Dry run: temukan kandidat tanpa kirim WA.' })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}

@ApiTags('Clinic — WhatsApp')
@ApiBearerAuth()
@Controller('clinic/wa/scheduler')
export class WaSchedulerTriggerController {
  private readonly TZ = 'Asia/Jakarta';

  constructor(
    private readonly scheduler: BookingReminderScheduler,
    private readonly prisma: PrismaService,
  ) {}

  @Post('run')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Trigger scheduler reminder manual (admin only). Opsional buat test booking + client.' })
  async trigger(@Body() dto: TriggerSchedulerDto, @Request() _req: AuthRequest) {
    let testBookingId: number | undefined;

    if (dto.testPhone) {
      testBookingId = await this.createTestBooking(dto.testPhone, dto.type);
    }

    let result: ReminderRunResult;
    if (dto.dryRun) {
      result = await this.dryRunScan(dto.type, dto.windowCenterMinutes);
    } else {
      result = await this.runScheduler(dto.type, dto.windowCenterMinutes);
    }

    return {
      success: true,
      data: {
        ...result,
        testBookingId,
        dryRun: dto.dryRun ?? false,
      },
    };
  }

  private async runScheduler(type: TriggerSchedulerDto['type'], windowCenterMinutes?: number): Promise<ReminderRunResult> {
    switch (type) {
      case 'h1':
        return this.scheduler.dispatchH1Reminders();
      case 'm30':
        return this.scheduler.dispatch30mReminders(windowCenterMinutes ?? 30);
      case 'feedback_h1':
        return this.scheduler.dispatchFeedbackH1();
    }
  }

  /** Preview: hitung kandidat tanpa kirim. */
  private async dryRunScan(type: TriggerSchedulerDto['type'], windowCenterMinutes?: number): Promise<ReminderRunResult> {
    const tz = this.TZ;
    const now = new Date();

    if (type === 'h1') {
      const { dateStr } = localPartsInTimezone(now, tz);
      const todayMid = localDateAtMidnight(dateStr, tz);
      const tomorrowStart = new Date(todayMid.getTime() + 86400000);
      const tomorrowEnd = new Date(tomorrowStart.getTime() + 86400000 - 1);
      const bookings = await this.prisma.clinicBooking.findMany({
        where: {
          deletedAt: null,
          status: { in: ['confirmed', 'checked_in'] },
          scheduledStart: { gte: tomorrowStart, lte: tomorrowEnd },
          client: { waOptedOut: false },
        },
        select: { id: true },
      });
      return { type: 'h1', dispatched: 0, skipped: bookings.length, bookingIds: bookings.map((b) => b.id) };
    }

    if (type === 'm30') {
      const center = windowCenterMinutes ?? 30;
      const start = new Date(now.getTime() + (center - 5) * 60000);
      const end = new Date(now.getTime() + (center + 5) * 60000);
      const bookings = await this.prisma.clinicBooking.findMany({
        where: {
          deletedAt: null,
          status: { in: ['confirmed', 'checked_in'] },
          scheduledStart: { gte: start, lte: end },
          client: { waOptedOut: false },
        },
        select: { id: true },
      });
      return { type: 'm30', dispatched: 0, skipped: bookings.length, bookingIds: bookings.map((b) => b.id) };
    }

    // feedback_h1
    const { dateStr } = localPartsInTimezone(now, tz);
    const todayMid = localDateAtMidnight(dateStr, tz);
    const yesterdayStart = new Date(todayMid.getTime() - 86400000);
    const yesterdayEnd = new Date(todayMid.getTime() - 1);
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: 'completed',
        completedAt: { gte: yesterdayStart, lte: yesterdayEnd },
        client: { waOptedOut: false },
      },
      select: { id: true },
    });
    return { type: 'feedback_h1', dispatched: 0, skipped: bookings.length, bookingIds: bookings.map((b) => b.id) };
  }

  /**
   * Buat test client + booking agar scheduler punya kandidat real saat trigger.
   * - Upsert ClinicClient dengan phoneWa = testPhone (name "Test WA Scheduler")
   * - Ambil psikolog, service, room pertama yang aktif
   * - Buat booking dengan scheduledStart sesuai tipe:
   *     h1         → besok jam 09:00 WIB
   *     m30        → sekarang + 30 menit
   *     feedback_h1→ kemarin 14:00 WIB, status 'completed', completedAt kemarin 14:30 WIB
   * Returns booking.id
   */
  private async createTestBooking(rawPhone: string, type: TriggerSchedulerDto['type']): Promise<number> {
    const tz = this.TZ;
    const phone = normalizePhoneId(rawPhone) ?? rawPhone;

    // Upsert test client
    let client = await this.prisma.clinicClient.findFirst({
      where: { phoneWa: phone, deletedAt: null },
    });
    if (!client) {
      client = await this.prisma.clinicClient.create({
        data: {
          name: 'Test WA Scheduler',
          gender: 'L',
          phoneWa: phone,
          waOptedOut: false,
          isActive: true,
        },
      });
    }

    // Find first active psikolog with a profile
    const psikologProfile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { isActive: true },
      select: { userId: true },
    });
    if (!psikologProfile) throw new Error('Tidak ada psikolog aktif untuk test booking');

    // Find first active service
    const service = await this.prisma.clinicService.findFirst({
      where: { isActive: true, deletedAt: null },
      select: { id: true, durationMinutes: true },
    });
    if (!service) throw new Error('Tidak ada layanan aktif untuk test booking');

    // Find first active room
    const room = await this.prisma.clinicRoom.findFirst({
      where: { isActive: true, deletedAt: null },
      select: { id: true },
    });
    if (!room) throw new Error('Tidak ada ruangan aktif untuk test booking');

    const durationMs = service.durationMinutes * 60000;
    const now = new Date();

    let scheduledStart: Date;
    let scheduledEnd: Date;
    let status = 'confirmed';
    let completedAt: Date | undefined;

    if (type === 'h1') {
      // Besok jam 09:00 WIB
      const { dateStr } = localPartsInTimezone(now, tz);
      const todayMid = localDateAtMidnight(dateStr, tz);
      const tomorrowMid = new Date(todayMid.getTime() + 86400000);
      scheduledStart = new Date(tomorrowMid.getTime() + 9 * 3600000); // 09:00 WIB
      scheduledEnd = new Date(scheduledStart.getTime() + durationMs);
    } else if (type === 'm30') {
      // Sekarang + 30 menit
      scheduledStart = new Date(now.getTime() + 30 * 60000);
      scheduledEnd = new Date(scheduledStart.getTime() + durationMs);
    } else {
      // feedback_h1: kemarin 14:00 WIB, status completed
      const { dateStr } = localPartsInTimezone(now, tz);
      const todayMid = localDateAtMidnight(dateStr, tz);
      const yesterdayMid = new Date(todayMid.getTime() - 86400000);
      scheduledStart = new Date(yesterdayMid.getTime() + 14 * 3600000); // 14:00 WIB kemarin
      scheduledEnd = new Date(scheduledStart.getTime() + durationMs);
      status = 'completed';
      completedAt = new Date(scheduledEnd.getTime() + 5 * 60000); // 5 menit setelah selesai
    }

    const booking = await this.prisma.clinicBooking.create({
      data: {
        clientId: client.id,
        serviceId: service.id,
        psikologUserId: psikologProfile.userId,
        roomId: room.id,
        scheduledStart,
        scheduledEnd,
        status,
        completedAt,
        confirmedAt: status === 'confirmed' || status === 'completed' ? new Date() : undefined,
        notes: '[TEST] Dibuat otomatis oleh scheduler trigger admin',
        bufferOverride: true,
      },
    });

    return booking.id;
  }
}
