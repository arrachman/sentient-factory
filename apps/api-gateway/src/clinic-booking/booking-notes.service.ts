import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Clinical notes per booking. Diisi psikolog saat / setelah sesi.
 *
 * Extracted dari ClinicBookingService — note CRUD adalah domain berbeda
 * dari booking lifecycle (status transitions). Pisah supaya:
 * - Easier untuk inject di future psikolog-specific endpoint
 * - Tidak nge-bloat ClinicBookingService
 */
@Injectable()
export class BookingNotesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tambah clinical note untuk booking. Booking harus exist + belum deleted.
   * Note bisa disimpan kapan saja (sebelum/saat/setelah sesi).
   *
   * Default psikologUserId = actorId (user yang login). Fallback ke
   * booking.psikologUserId kalau actorId tidak ada (mis. system call).
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
}
