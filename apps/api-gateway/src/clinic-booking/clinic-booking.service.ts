import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotesService } from './booking-notes.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingPackageService } from './booking-package.service';
import { BookingValidationService } from './booking-validation.service';
import {
  type BookingStatus,
  CancelBookingDto,
  CreateBookingDto,
  CreatePackageBookingDto,
  QueryBookingDto,
  RescheduleBookingDto,
  UpdateBookingDto,
} from './dto/clinic-booking.dto';
import { VALID_TRANSITIONS } from './booking-state-machine';

/**
 * Booking domain orchestrator. Handles CRUD + state machine + reschedule.
 *
 * Sub-concerns delegated:
 * - {@link BookingValidationService} — FK exist + conflict + operating hours
 * - {@link BookingNotificationService} — WA dispatch (notify + manual reminder)
 * - {@link BookingNotesService} — clinical notes CRUD
 * - {@link BookingEventsService} — SSE pub-sub untuk realtime UI
 */
@Injectable()
export class ClinicBookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: BookingValidationService,
    private readonly notifier: BookingNotificationService,
    private readonly notes: BookingNotesService,
    private readonly packageService: BookingPackageService,
    private readonly events: BookingEventsService,
  ) {}

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

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

    // Room conflict selalu dicek — bufferOverride tidak boleh bypass ruangan fisik
    await this.validation.assertNoRoomConflict({
      roomId: dto.roomId,
      scheduledStart: start,
      scheduledEnd: end,
      excludeBookingId: null,
    });

    if (!dto.bufferOverride) {
      await this.validation.assertNoConflict({
        psikologUserId: dto.psikologUserId,
        roomId: dto.roomId,
        scheduledStart: start,
        scheduledEnd: end,
        excludeBookingId: null,
      });
    }

    if (!dto.createdViaWalkIn && !dto.bufferOverride) {
      await this.validation.assertSlotMatch(start, end);
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
        status: dto.createdViaWalkIn ? 'confirmed' : 'awaiting_dp',
        bufferOverride: dto.bufferOverride ?? false,
        createdViaWalkIn: dto.createdViaWalkIn ?? false,
        confirmedAt: dto.createdViaWalkIn ? new Date() : null,
        notes: dto.notes,
        createdBy: actorId,
        updatedBy: actorId,
      },
      include: this.includeRelations(),
    });

    // Slice 9: WA event trigger
    if (booking.status === 'confirmed') {
      void this.notifier.notify(booking, 'Konfirmasi Booking');
      void this.notifier.notifyPsikologInfo(booking);
    }

    // Slice 11: SSE event untuk realtime updates di resepsionis dashboard
    this.events.emit({ type: 'created', bookingId: booking.id, status: booking.status });

    return { success: true, data: booking, message: 'Booking created' };
  }

  /**
   * Create N bookings sekaligus untuk multi-session package.
   * Delegated ke {@link BookingPackageService} — logic 100+ baris dengan
   * cross-session validation, dipisah supaya orchestrator tetap focused.
   */
  createPackage(dto: CreatePackageBookingDto, actorId?: number) {
    return this.packageService.create(dto, actorId);
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
    if (query.date) {
      const day = new Date(query.date);
      if (isNaN(day.getTime())) throw new BadRequestException('date harus YYYY-MM-DD');
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      where.scheduledStart = { gte: dayStart, lte: dayEnd };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicBooking.findMany({
        where,
        include: this.includeRelations(),
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
      include: this.includeRelations(),
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
    if (dto.bufferOverride !== undefined) data.bufferOverride = dto.bufferOverride;
    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
    return { success: true, data: updated, message: 'Booking updated' };
  }

  // ---------------------------------------------------------------------------
  // State transitions
  // ---------------------------------------------------------------------------

  async transition(id: number, target: BookingStatus, actorId?: number) {
    const existing = await this.findOne(id);
    const current = existing.data.status as BookingStatus;
    const allowed = VALID_TRANSITIONS[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Transisi ${current} → ${target} tidak valid. Allowed: [${allowed.join(', ')}]`,
      );
    }
    const now = new Date();
    const data: Prisma.ClinicBookingUpdateInput = { status: target, updatedBy: actorId };
    if (target === 'confirmed') data.confirmedAt = now;
    if (target === 'checked_in') data.checkedInAt = now;
    if (target === 'in_progress') data.startedAt = now;
    if (target === 'completed') data.completedAt = now;
    if (target === 'cancelled') data.cancelledAt = now;

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });

    // Slice 9: WA event triggers per status
    if (target === 'confirmed') {
      void this.notifier.notify(updated, 'Konfirmasi Booking');
      void this.notifier.notifyPsikologInfo(updated);
    } else if (target === 'completed') {
      void this.notifier.notify(updated, 'Follow-up Post Session');
    }

    this.events.emit({ type: 'transition', bookingId: id, status: target });

    return { success: true, data: updated, message: `Booking → ${target}` };
  }

  async confirm(id: number, actorId?: number) {
    return this.transition(id, 'confirmed', actorId);
  }
  async checkIn(id: number, actorId?: number) {
    return this.transition(id, 'checked_in', actorId);
  }
  async start(id: number, actorId?: number) {
    return this.transition(id, 'in_progress', actorId);
  }
  async complete(id: number, actorId?: number) {
    return this.transition(id, 'completed', actorId);
  }

  async cancel(id: number, dto: CancelBookingDto, actorId?: number) {
    const existing = await this.findOne(id);
    const current = existing.data.status as BookingStatus;
    if (!VALID_TRANSITIONS[current].includes('cancelled')) {
      throw new BadRequestException(`Booking sudah ${current}, tidak bisa cancel`);
    }
    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: dto.reason,
        updatedBy: actorId,
      },
      include: this.includeRelations(),
    });

    void this.notifier.notify(updated, 'Cancel Booking', { alasan: dto.reason ?? '-' });

    return { success: true, data: updated, message: 'Booking cancelled' };
  }

  async reschedule(id: number, dto: RescheduleBookingDto, actorId?: number) {
    const existing = await this.findOne(id);
    const current = existing.data.status as BookingStatus;
    if (current === 'cancelled' || current === 'completed' || current === 'in_progress') {
      throw new BadRequestException(`Booking ${current}, tidak bisa di-reschedule`);
    }

    const newStart = new Date(dto.scheduledStart);
    const newEnd = new Date(dto.scheduledEnd);
    if (!(newStart.getTime() < newEnd.getTime())) {
      throw new BadRequestException('scheduledStart harus sebelum scheduledEnd');
    }

    const newPsikologUserId = dto.psikologUserId ?? existing.data.psikologUserId;
    const newRoomId = dto.roomId ?? existing.data.roomId;

    // Room conflict selalu dicek — bufferOverride tidak boleh bypass ruangan fisik
    await this.validation.assertNoRoomConflict({
      roomId: newRoomId,
      scheduledStart: newStart,
      scheduledEnd: newEnd,
      excludeBookingId: id,
    });

    if (!dto.bufferOverride) {
      await this.validation.assertNoConflict({
        psikologUserId: newPsikologUserId,
        roomId: newRoomId,
        scheduledStart: newStart,
        scheduledEnd: newEnd,
        excludeBookingId: id,
      });
    }

    const history = (existing.data.rescheduleHistory as unknown[]) || [];
    history.push({
      from: {
        start: existing.data.scheduledStart,
        end: existing.data.scheduledEnd,
        roomId: existing.data.roomId,
        psikologUserId: existing.data.psikologUserId,
      },
      to: {
        start: newStart,
        end: newEnd,
        roomId: newRoomId,
        psikologUserId: newPsikologUserId,
      },
      reason: dto.reason ?? null,
      by: actorId ?? null,
      at: new Date(),
    });

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data: {
        scheduledStart: newStart,
        scheduledEnd: newEnd,
        psikologUserId: newPsikologUserId,
        roomId: newRoomId,
        rescheduleHistory: history as Prisma.InputJsonValue,
        updatedBy: actorId,
      },
      include: this.includeRelations(),
    });

    void this.notifier.notify(updated, 'Reschedule Booking', {
      tanggal_lama: existing.data.scheduledStart.toISOString(),
      waktu_lama: existing.data.scheduledStart.toISOString().slice(11, 16),
      tanggal_baru: newStart.toISOString(),
      waktu_baru: newStart.toISOString().slice(11, 16),
      alasan: dto.reason ?? '-',
    });

    return { success: true, data: updated, message: 'Booking rescheduled' };
  }

  // ---------------------------------------------------------------------------
  // Notes (delegated)
  // ---------------------------------------------------------------------------

  addNote(bookingId: number, noteText: string, actorId?: number) {
    return this.notes.addNote(bookingId, noteText, actorId);
  }

  listNotes(bookingId: number) {
    return this.notes.listNotes(bookingId);
  }

  // ---------------------------------------------------------------------------
  // Manual WA reminder (delegated)
  // ---------------------------------------------------------------------------

  /**
   * Manual reminder dispatch — admin/resepsionis kirim ulang reminder
   * kalau klien belum baca atau ingin remind ulang.
   */
  async sendReminder(id: number, templateName: string, actorId?: number) {
    const booking = await this.findOne(id);
    void actorId;
    const result = await this.notifier.sendManualReminder(booking.data, templateName);
    return { success: true, data: result, message: `Reminder '${templateName}' dispatched` };
  }

  // ---------------------------------------------------------------------------
  // Internal
  // ---------------------------------------------------------------------------

  private includeRelations() {
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
          clinicPsikologProfile: { select: { title: true, color: true, specialty: true, license: true } },
        },
      },
      room: { select: { id: true, name: true, type: true } },
    } satisfies Prisma.ClinicBookingInclude;
  }
}
