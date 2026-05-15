import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingValidationService } from './booking-validation.service';
import { CreatePackageBookingDto } from './dto/clinic-booking.dto';

/**
 * Multi-session (paket) booking creation.
 *
 * Diekstrak dari ClinicBookingService karena:
 * - Logic 100+ baris berbeda dari single booking — ada session validation
 *   loop, cross-session overlap check, atomic transaction
 * - Hanya dipakai oleh 1 endpoint (`POST /clinic/booking/package`),
 *   tidak diperlukan logic sharing dengan create biasa
 *
 * Use case: paket "Terapi Anak Lengkap (10 sesi)" — admin pilih client +
 * service + base psikolog/room, lalu input N jadwal. Semua sesi divalidasi
 * (FK + conflict + operating hours + cross-overlap) sebelum any insert.
 * Kalau salah satu fail, transaction rollback.
 */
@Injectable()
export class BookingPackageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: BookingValidationService,
    private readonly events: BookingEventsService,
  ) {}

  async create(dto: CreatePackageBookingDto, actorId?: number) {
    if (dto.sessions.length < 2) {
      throw new BadRequestException('Package booking butuh minimal 2 sesi');
    }

    // Default FKs (client/service/psikolog/room)
    await this.validation.assertEntitiesExist(
      dto.clientId,
      dto.serviceId,
      dto.psikologUserId,
      dto.roomId,
    );

    // Validate service is multi-session + matches sessions count
    const service = await this.prisma.clinicService.findFirst({
      where: { id: dto.serviceId, deletedAt: null, isActive: true },
      select: { id: true, sessionCount: true, name: true, durationMinutes: true },
    });
    if (!service) throw new NotFoundException(`Service ${dto.serviceId} not found`);
    if (service.sessionCount < 2) {
      throw new BadRequestException(
        `Service '${service.name}' adalah single-session (sessionCount=${service.sessionCount}). Pakai POST /clinic/booking biasa.`,
      );
    }
    if (dto.sessions.length !== service.sessionCount) {
      throw new BadRequestException(
        `Jumlah sesi (${dto.sessions.length}) harus = service.sessionCount (${service.sessionCount})`,
      );
    }

    const parsedSessions = this.parseSessions(dto);
    await this.validateSessions(dto, parsedSessions);
    this.assertNoCrossSessionOverlap(parsedSessions);

    return this.persistAndEmit(dto, parsedSessions, actorId);
  }

  // ------ private helpers ------

  private parseSessions(dto: CreatePackageBookingDto) {
    return dto.sessions.map((s, idx) => {
      const start = new Date(s.scheduledStart);
      const end = new Date(s.scheduledEnd);
      if (!(start.getTime() < end.getTime())) {
        throw new BadRequestException(`Sesi ${idx + 1}: scheduledStart harus sebelum scheduledEnd`);
      }
      return {
        index: idx,
        start,
        end,
        psikologUserId: s.psikologUserId ?? dto.psikologUserId,
        roomId: s.roomId ?? dto.roomId,
      };
    });
  }

  private async validateSessions(
    dto: CreatePackageBookingDto,
    sessions: ReturnType<BookingPackageService['parseSessions']>,
  ) {
    for (const s of sessions) {
      // Per-session FK only kalau override default
      if (s.psikologUserId !== dto.psikologUserId || s.roomId !== dto.roomId) {
        await this.validation.assertEntitiesExist(
          dto.clientId,
          dto.serviceId,
          s.psikologUserId,
          s.roomId,
        );
      }
      await this.validation.assertNoRoomConflict({
        roomId: s.roomId,
        scheduledStart: s.start,
        scheduledEnd: s.end,
        excludeBookingId: null,
      });

      await this.validation.assertNoConflict({
        psikologUserId: s.psikologUserId,
        roomId: s.roomId,
        scheduledStart: s.start,
        scheduledEnd: s.end,
        excludeBookingId: null,
      });
      await this.validation.assertSlotMatch(s.start, s.end);
      await this.validation.assertPsikologAvailable(s.psikologUserId, s.start);
    }
  }

  private assertNoCrossSessionOverlap(
    sessions: ReturnType<BookingPackageService['parseSessions']>,
  ) {
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const a = sessions[i];
        const b = sessions[j];
        if (
          (a.psikologUserId === b.psikologUserId || a.roomId === b.roomId) &&
          a.start < b.end &&
          a.end > b.start
        ) {
          throw new ConflictException({
            message: `Sesi ${a.index + 1} dan ${b.index + 1} dalam paket ini overlap`,
            conflictType: a.psikologUserId === b.psikologUserId ? 'psikolog' : 'room',
          });
        }
      }
    }
  }

  private async persistAndEmit(
    dto: CreatePackageBookingDto,
    sessions: ReturnType<BookingPackageService['parseSessions']>,
    actorId: number | undefined,
  ) {
    const packageGroupId = randomUUID();
    const created = await this.prisma.$transaction(
      sessions.map((s) =>
        this.prisma.clinicBooking.create({
          data: {
            clientId: dto.clientId,
            serviceId: dto.serviceId,
            psikologUserId: s.psikologUserId,
            roomId: s.roomId,
            scheduledStart: s.start,
            scheduledEnd: s.end,
            sessionN: s.index + 1,
            sessionTotal: sessions.length,
            packageGroupId,
            status: 'checked_in',
            createdViaWalkIn: false,
            notes: dto.notes,
            createdBy: actorId,
            updatedBy: actorId,
          },
          include: this.includeRelations(),
        }),
      ),
    );

    for (const b of created) {
      this.events.emit({ type: 'created', bookingId: b.id, status: b.status });
    }

    return {
      success: true,
      data: { packageGroupId, sessionCount: created.length, bookings: created },
      message: `Package created: ${created.length} sessions`,
    };
  }

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
          avatarUrl: true,
          clinicPsikologProfile: { select: { title: true, color: true } },
        },
      },
      room: { select: { id: true, name: true, type: true } },
    } satisfies Prisma.ClinicBookingInclude;
  }
}
