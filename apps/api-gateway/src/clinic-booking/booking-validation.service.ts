import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Validation helpers untuk booking operations.
 *
 * Extracted dari ClinicBookingService supaya:
 * - Single responsibility (validation logic terpisah dari CRUD/state)
 * - Reusable di package booking creation (yang juga butuh validate)
 * - Easier to mock di unit test (mock 1 service, bukan 4 prisma sub-clients)
 *
 * Throws NotFoundException / BadRequestException / ConflictException —
 * caller tinggal `await` tanpa cek return value.
 */
@Injectable()
export class BookingValidationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pastikan client/service/psikolog/room exist + active.
   * Parallel query untuk minimal latency.
   */
  async assertEntitiesExist(
    clientId: number,
    serviceId: number,
    psikologUserId: number,
    roomId: number,
  ): Promise<void> {
    const [client, service, psikolog, room] = await Promise.all([
      this.prisma.clinicClient.findFirst({
        where: { id: clientId, deletedAt: null },
        select: { id: true },
      }),
      this.prisma.clinicService.findFirst({
        where: { id: serviceId, deletedAt: null, isActive: true },
        select: { id: true },
      }),
      this.prisma.user.findFirst({
        where: {
          id: psikologUserId,
          deletedAt: null,
          isActive: true,
          roles: { some: { deletedAt: null, role: { name: 'clinic-psikolog' } } },
        },
        select: { id: true },
      }),
      this.prisma.clinicRoom.findFirst({
        where: { id: roomId, deletedAt: null, isActive: true },
        select: { id: true },
      }),
    ]);
    if (!client) throw new NotFoundException(`Client ${clientId} not found / deleted`);
    if (!service) throw new NotFoundException(`Service ${serviceId} not found / inactive`);
    if (!psikolog) {
      throw new NotFoundException(
        `Psikolog user ${psikologUserId} not found / not active clinic-psikolog`,
      );
    }
    if (!room) throw new NotFoundException(`Room ${roomId} not found / inactive`);
  }

  /**
   * Cek psikolog & room conflict dengan buffer (default 15 menit).
   *
   * Buffer diambil dari ClinicSettings.bufferMinutes — slot existing ±buffer
   * dianggap conflict supaya psikolog punya jeda istirahat / catatan.
   *
   * Throws ConflictException dengan detail konflik (tipe + bookingId existing).
   */
  async assertNoConflict(args: {
    psikologUserId: number;
    roomId: number;
    scheduledStart: Date;
    scheduledEnd: Date;
    excludeBookingId: number | null;
  }): Promise<void> {
    const { psikologUserId, roomId, scheduledStart, scheduledEnd, excludeBookingId } = args;

    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    const bufferMs = (settings?.bufferMinutes ?? 15) * 60 * 1000;
    const slotStart = new Date(scheduledStart.getTime() - bufferMs);
    const slotEnd = new Date(scheduledEnd.getTime() + bufferMs);

    const overlapWhere: Prisma.ClinicBookingWhereInput = {
      deletedAt: null,
      status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
      // Overlap test: existing.start < slotEnd AND existing.end > slotStart
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

  /**
   * Cek apakah booking di dalam jam operasional klinik + bukan tanggal libur.
   * Bisa di-bypass dengan `bufferOverride` di caller.
   */
  async assertWithinOperatingHours(start: Date, end: Date): Promise<void> {
    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    if (!settings) return; // no settings, allow

    const opHours = settings.operatingHours as Record<
      string,
      { open: string | null; close: string | null; isOpen: boolean }
    >;
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      start.getDay()
    ];
    const day = opHours?.[dayName];
    if (!day || !day.isOpen) {
      throw new BadRequestException(
        `Klinik tutup di hari ${dayName}. Pakai bufferOverride / walk-in untuk override.`,
      );
    }

    if (day.open && day.close) {
      const [oH, oM] = day.open.split(':').map(Number);
      const [cH, cM] = day.close.split(':').map(Number);
      const dayStart = new Date(start);
      dayStart.setHours(oH, oM, 0, 0);
      const dayEnd = new Date(start);
      dayEnd.setHours(cH, cM, 0, 0);
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
      throw new BadRequestException(
        `Tanggal ${dateStr} adalah hari libur. Pakai bufferOverride untuk override.`,
      );
    }
  }
}
