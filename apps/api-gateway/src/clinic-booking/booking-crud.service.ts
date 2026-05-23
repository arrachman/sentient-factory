import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingValidationService } from './booking-validation.service';
import {
  CreateBookingDto,
  QueryBookingDto,
  UpdateBookingDto,
} from './dto/clinic-booking.dto';
import { localDateAtMidnight } from './timezone.util';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function addDaysIso(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function buildIncludeRelations(): Prisma.ClinicBookingInclude {
  return {
    client: { select: { id: true, name: true, gender: true, phoneWa: true } },
    service: {
      select: {
        id: true,
        name: true,
        category: true,
        sessionCount: true,
        durationMinutes: true,
        basePrice: true,
      },
    },
    psikolog: {
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        phone: true,
        clinicPsikologProfile: { select: { title: true, color: true, specialty: true, license: true } },
      },
    },
    room: { select: { id: true, name: true, type: true } },
  } satisfies Prisma.ClinicBookingInclude;
}

@Injectable()
export class BookingCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: BookingValidationService,
    private readonly notifier: BookingNotificationService,
    private readonly events: BookingEventsService,
  ) {}

  async create(dto: CreateBookingDto, actorId?: number) {
    const start = new Date(dto.scheduledStart);
    const end = new Date(dto.scheduledEnd);
    if (!(start.getTime() < end.getTime())) {
      throw new BadRequestException('scheduledStart harus sebelum scheduledEnd');
    }

    await this.validation.assertEntitiesExist(
      dto.clientId,
      dto.serviceId,
      dto.psikologUserId,
      dto.roomId,
    );

    await this.validation.assertNoRoomConflict({
      roomId: dto.roomId,
      scheduledStart: start,
      scheduledEnd: end,
      excludeBookingId: null,
    });

    await this.validation.assertNoConflict({
      psikologUserId: dto.psikologUserId,
      roomId: dto.roomId,
      scheduledStart: start,
      scheduledEnd: end,
      excludeBookingId: null,
    });

    if (!dto.createdViaWalkIn) {
      await this.validation.assertSlotMatch(start, end, dto.serviceId);
      await this.validation.assertPsikologAvailable(dto.psikologUserId, start);
    }

    const booking = await this.prisma.clinicBooking.create({
      data: {
        clientId: dto.clientId,
        serviceId: dto.serviceId,
        psikologUserId: dto.psikologUserId,
        roomId: dto.roomId,
        scheduledStart: start,
        scheduledEnd: end,
        sessionN: dto.sessionN ?? 1,
        sessionTotal: dto.sessionTotal ?? 1,
        packageGroupId:
          dto.packageGroupId ?? (dto.sessionTotal && dto.sessionTotal > 1 ? randomUUID() : null),
        status: 'checked_in',
        createdViaWalkIn: dto.createdViaWalkIn ?? false,
        checkedInAt: new Date(),
        notes: dto.notes,
        createdBy: actorId,
        updatedBy: actorId,
      },
      include: buildIncludeRelations(),
    });

    // Slice 11: SSE event untuk realtime updates di resepsionis dashboard
    this.events.emit({ type: 'created', bookingId: booking.id, status: booking.status });

    // Info Psikolog: kirim profil psikolog ke klien hanya saat booking PERTAMA klien itu.
    const priorBookings = await this.prisma.clinicBooking.count({
      where: { clientId: dto.clientId, id: { not: booking.id }, deletedAt: null },
    });
    if (priorBookings === 0) {
      void this.notifier.notifyPsikologInfo(booking);
    }

    // Konfirmasi Booking
    void this.notifier.notify(booking, 'Konfirmasi Booking');

    return { success: true, data: booking, message: 'Booking created' };
  }

  async findAll(query: QueryBookingDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.ClinicBookingWhereInput = { deletedAt: null };
    if (!query.includeCancelled) where.status = { not: 'cancelled' };
    if (query.status) where.status = query.status;
    if (query.psikologUserId) where.psikologUserId = query.psikologUserId;
    if (query.clientId) where.clientId = query.clientId;
    if (query.roomId) where.roomId = query.roomId;
    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    const tz = settings?.timezone || 'Asia/Jakarta';
    if (query.date) {
      if (!ISO_DATE_RE.test(query.date)) throw new BadRequestException('date harus YYYY-MM-DD');
      const dayStart = localDateAtMidnight(query.date, tz);
      const dayEnd = localDateAtMidnight(addDaysIso(query.date, 1), tz);
      where.scheduledStart = { gte: dayStart, lt: dayEnd };
    } else if (query.dateFrom || query.dateTo) {
      const range: { gte?: Date; lt?: Date } = {};
      if (query.dateFrom) {
        if (!ISO_DATE_RE.test(query.dateFrom))
          throw new BadRequestException('dateFrom harus YYYY-MM-DD');
        range.gte = localDateAtMidnight(query.dateFrom, tz);
      }
      if (query.dateTo) {
        if (!ISO_DATE_RE.test(query.dateTo))
          throw new BadRequestException('dateTo harus YYYY-MM-DD');
        range.lt = localDateAtMidnight(addDaysIso(query.dateTo, 1), tz);
      }
      where.scheduledStart = range;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicBooking.findMany({
        where,
        include: buildIncludeRelations(),
        orderBy: [{ scheduledStart: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicBooking.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const booking = await this.prisma.clinicBooking.findFirst({
      where: { id, deletedAt: null },
      include: buildIncludeRelations(),
    });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return { success: true, data: booking };
  }

  async update(id: number, dto: UpdateBookingDto, actorId?: number) {
    const existing = await this.findOne(id);
    if (existing.data.status === 'cancelled' || existing.data.status === 'completed') {
      throw new BadRequestException(`Booking sudah ${existing.data.status}, tidak bisa update`);
    }
    const data: Prisma.ClinicBookingUpdateInput = { updatedBy: actorId };
    if (dto.notes !== undefined) data.notes = dto.notes;
    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: buildIncludeRelations(),
    });
    return { success: true, data: updated, message: 'Booking updated' };
  }
}
