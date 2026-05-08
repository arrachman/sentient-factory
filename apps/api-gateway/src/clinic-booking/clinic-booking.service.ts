import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import {
  BOOKING_STATUSES,
  type BookingStatus,
  CancelBookingDto,
  CreateBookingDto,
  QueryBookingDto,
  RescheduleBookingDto,
  UpdateBookingDto,
} from './dto/clinic-booking.dto';

/**
 * State machine transitions yang valid:
 *   awaiting_dp → confirmed | cancelled
 *   confirmed   → checked_in | cancelled | rescheduled (back to confirmed dengan slot baru)
 *   checked_in  → in_progress | cancelled
 *   in_progress → completed | cancelled (rare)
 *   completed   → (terminal)
 *   cancelled   → (terminal)
 */
const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  awaiting_dp: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled'],
  checked_in: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

@Injectable()
export class ClinicBookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
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

    // Validate FKs exist
    await this.assertEntitiesExist(dto.clientId, dto.serviceId, dto.psikologUserId, dto.roomId);

    // Conflict detection (kecuali bufferOverride dan walk-in)
    if (!dto.bufferOverride) {
      await this.assertNoConflict({
        psikologUserId: dto.psikologUserId,
        roomId: dto.roomId,
        scheduledStart: start,
        scheduledEnd: end,
        excludeBookingId: null,
      });
    }

    // Operating hours check (skip kalau walk-in atau buffer override)
    if (!dto.createdViaWalkIn && !dto.bufferOverride) {
      await this.assertWithinOperatingHours(start, end);
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
        packageGroupId: dto.packageGroupId ?? (dto.sessionTotal && dto.sessionTotal > 1 ? randomUUID() : null),
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

    // Slice 9: WA event trigger — kirim konfirmasi kalau langsung confirmed (walk-in)
    if (booking.status === 'confirmed') {
      void this.notifyBookingEvent(booking, 'Konfirmasi Booking');
    }

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
    if (query.date) {
      const day = new Date(query.date);
      if (isNaN(day.getTime())) throw new BadRequestException('date harus YYYY-MM-DD');
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
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
      void this.notifyBookingEvent(updated, 'Konfirmasi Booking');
    } else if (target === 'completed') {
      void this.notifyBookingEvent(updated, 'Follow-up Post Session');
    }

    return { success: true, data: updated, message: `Booking → ${target}` };
  }

  async confirm(id: number, actorId?: number) { return this.transition(id, 'confirmed', actorId); }
  async checkIn(id: number, actorId?: number) { return this.transition(id, 'checked_in', actorId); }
  async start(id: number, actorId?: number) { return this.transition(id, 'in_progress', actorId); }
  async complete(id: number, actorId?: number) { return this.transition(id, 'completed', actorId); }

  /**
   * Slice 10: Tambah clinical note untuk booking. Linked ke psikolog yang login.
   * Booking harus exist dan tidak deleted. Note bisa disimpan kapan saja
   * (sebelum/saat/setelah sesi).
   */
  async addNote(bookingId: number, noteText: string, actorId?: number) {
    if (!noteText.trim()) {
      throw new BadRequestException('noteText tidak boleh kosong');
    }
    const booking = await this.prisma.clinicBooking.findFirst({
      where: { id: bookingId, deletedAt: null },
      select: { id: true, psikologUserId: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} tidak ditemukan`);
    }
    const note = await this.prisma.clinicSessionNote.create({
      data: {
        bookingId: booking.id,
        psikologUserId: actorId ?? booking.psikologUserId,
        noteText: noteText.trim(),
        isPrivate: true,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
    return { success: true, data: note, message: 'Note saved' };
  }

  async listNotes(bookingId: number) {
    const notes = await this.prisma.clinicSessionNote.findMany({
      where: { bookingId, deletedAt: null },
      orderBy: [{ createdAt: 'desc' }],
    });
    return { success: true, data: notes };
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

    void this.notifyBookingEvent(updated, 'Cancel Booking', { alasan: dto.reason ?? '-' });

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

    if (!dto.bufferOverride) {
      await this.assertNoConflict({
        psikologUserId: newPsikologUserId,
        roomId: newRoomId,
        scheduledStart: newStart,
        scheduledEnd: newEnd,
        excludeBookingId: id,
      });
    }

    const history = (existing.data.rescheduleHistory as unknown[]) || [];
    history.push({
      from: { start: existing.data.scheduledStart, end: existing.data.scheduledEnd, roomId: existing.data.roomId, psikologUserId: existing.data.psikologUserId },
      to: { start: newStart, end: newEnd, roomId: newRoomId, psikologUserId: newPsikologUserId },
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

    void this.notifyBookingEvent(updated, 'Reschedule Booking', {
      tanggal_lama: existing.data.scheduledStart.toISOString(),
      waktu_lama: existing.data.scheduledStart.toISOString().slice(11, 16),
      tanggal_baru: newStart.toISOString(),
      waktu_baru: newStart.toISOString().slice(11, 16),
      alasan: dto.reason ?? '-',
    });

    return { success: true, data: updated, message: 'Booking rescheduled' };
  }

  // ---------------------------------------------------------------------------
  // Validation helpers
  // ---------------------------------------------------------------------------

  private async assertEntitiesExist(clientId: number, serviceId: number, psikologUserId: number, roomId: number) {
    const [client, service, psikolog, room] = await Promise.all([
      this.prisma.clinicClient.findFirst({ where: { id: clientId, deletedAt: null }, select: { id: true } }),
      this.prisma.clinicService.findFirst({ where: { id: serviceId, deletedAt: null, isActive: true }, select: { id: true } }),
      this.prisma.user.findFirst({
        where: {
          id: psikologUserId,
          deletedAt: null,
          isActive: true,
          roles: { some: { deletedAt: null, role: { name: 'clinic-psikolog' } } },
        },
        select: { id: true },
      }),
      this.prisma.clinicRoom.findFirst({ where: { id: roomId, deletedAt: null, isActive: true }, select: { id: true } }),
    ]);
    if (!client) throw new NotFoundException(`Client ${clientId} not found / deleted`);
    if (!service) throw new NotFoundException(`Service ${serviceId} not found / inactive`);
    if (!psikolog) throw new NotFoundException(`Psikolog user ${psikologUserId} not found / not active clinic-psikolog`);
    if (!room) throw new NotFoundException(`Room ${roomId} not found / inactive`);
  }

  private async assertNoConflict(args: {
    psikologUserId: number;
    roomId: number;
    scheduledStart: Date;
    scheduledEnd: Date;
    excludeBookingId: number | null;
  }) {
    const { psikologUserId, roomId, scheduledStart, scheduledEnd, excludeBookingId } = args;

    // Buffer 15 menit (default) — overlap dengan +15 min margin
    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    const bufferMs = (settings?.bufferMinutes ?? 15) * 60 * 1000;
    const slotStart = new Date(scheduledStart.getTime() - bufferMs);
    const slotEnd = new Date(scheduledEnd.getTime() + bufferMs);

    const overlapWhere: Prisma.ClinicBookingWhereInput = {
      deletedAt: null,
      status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
      // Overlap: existing.scheduledStart < slotEnd AND existing.scheduledEnd > slotStart
      scheduledStart: { lt: slotEnd },
      scheduledEnd: { gt: slotStart },
    };
    if (excludeBookingId) overlapWhere.id = { not: excludeBookingId };

    const [psikologConflict, roomConflict] = await Promise.all([
      this.prisma.clinicBooking.findFirst({
        where: { ...overlapWhere, psikologUserId },
        select: { id: true, scheduledStart: true, scheduledEnd: true },
      }),
      this.prisma.clinicBooking.findFirst({
        where: { ...overlapWhere, roomId },
        select: { id: true, scheduledStart: true, scheduledEnd: true },
      }),
    ]);

    if (psikologConflict) {
      throw new ConflictException({
        message: 'Psikolog conflict',
        conflictType: 'psikolog',
        conflictBookingId: psikologConflict.id,
        scheduledStart: psikologConflict.scheduledStart,
        scheduledEnd: psikologConflict.scheduledEnd,
      });
    }
    if (roomConflict) {
      throw new ConflictException({
        message: 'Room conflict',
        conflictType: 'room',
        conflictBookingId: roomConflict.id,
        scheduledStart: roomConflict.scheduledStart,
        scheduledEnd: roomConflict.scheduledEnd,
      });
    }
  }

  private async assertWithinOperatingHours(start: Date, end: Date) {
    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    if (!settings) return; // no settings, allow

    const opHours = settings.operatingHours as Record<string, { open: string | null; close: string | null; isOpen: boolean }>;
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][start.getDay()];
    const day = opHours?.[dayName];
    if (!day || !day.isOpen) {
      throw new BadRequestException(`Klinik tutup di hari ${dayName}. Pakai bufferOverride / walk-in untuk override.`);
    }

    if (day.open && day.close) {
      const [oH, oM] = day.open.split(':').map(Number);
      const [cH, cM] = day.close.split(':').map(Number);
      const dayStart = new Date(start); dayStart.setHours(oH, oM, 0, 0);
      const dayEnd = new Date(start); dayEnd.setHours(cH, cM, 0, 0);
      if (start < dayStart || end > dayEnd) {
        throw new BadRequestException(
          `Booking di luar jam operasional ${day.open}-${day.close}. Pakai bufferOverride untuk override.`,
        );
      }
    }

    // Holiday check
    const holidays = (settings.holidays as string[]) || [];
    const dateStr = start.toISOString().slice(0, 10);
    if (holidays.includes(dateStr)) {
      throw new BadRequestException(`Tanggal ${dateStr} adalah hari libur. Pakai bufferOverride untuk override.`);
    }
  }

  private includeRelations() {
    return {
      client: { select: { id: true, name: true, gender: true, phoneWa: true } },
      service: { select: { id: true, name: true, category: true, sessionCount: true, durationMinutes: true, basePrice: true } },
      psikolog: {
        select: {
          id: true,
          email: true,
          fullName: true,
          clinicPsikologProfile: { select: { title: true, color: true } },
        },
      },
      room: { select: { id: true, name: true, type: true } },
    } satisfies Prisma.ClinicBookingInclude;
  }

  /**
   * Slice 9: WA event trigger helper. Fire-and-forget — error tidak block transition.
   * Resolve template name + send ke recipient (klien default, optional psikolog juga).
   */
  private async notifyBookingEvent(
    booking: {
      id: number;
      scheduledStart: Date;
      scheduledEnd: Date;
      client: { name: string; phoneWa: string };
      service: { name: string; basePrice: unknown };
      psikolog: { fullName: string | null };
      room: { name: string };
    },
    templateName: string,
    extraVars: Record<string, string | number> = {},
  ) {
    try {
      const variables = {
        nama_klien: booking.client.name,
        nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
        tanggal: booking.scheduledStart.toISOString().slice(0, 10),
        waktu: booking.scheduledStart.toISOString().slice(11, 16),
        ruang: booking.room.name,
        layanan: booking.service.name,
        total: String(booking.service.basePrice),
        ...extraVars,
      };
      // Send to klien
      await this.wa.dispatch({
        templateName,
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables,
        bookingId: booking.id,
      });
    } catch (err) {
      // Tidak boleh block transition — log saja
      console.error(`[notifyBookingEvent] template=${templateName} bookingId=${booking.id}:`, err);
    }
  }
}
