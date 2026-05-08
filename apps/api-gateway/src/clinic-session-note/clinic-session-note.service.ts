import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSessionNoteDto,
  QuerySessionNoteDto,
  UpdateSessionNoteDto,
} from './dto/clinic-session-note.dto';

@Injectable()
export class ClinicSessionNoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSessionNoteDto, actorId?: number, actorRoles: string[] = []) {
    // Validate booking exists
    const booking = await this.prisma.clinicBooking.findFirst({
      where: { id: dto.bookingId, deletedAt: null },
      select: { id: true, psikologUserId: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${dto.bookingId} not found`);
    }

    // Only psikolog assigned to booking (or admin) can write notes
    const isAdmin = actorRoles.includes('clinic-admin');
    if (!isAdmin && actorId !== booking.psikologUserId) {
      throw new ForbiddenException(
        'Hanya psikolog yang assigned ke booking (atau admin) yang bisa menulis catatan',
      );
    }

    const note = await this.prisma.clinicSessionNote.create({
      data: {
        bookingId: dto.bookingId,
        psikologUserId: booking.psikologUserId,
        noteText: dto.noteText,
        isPrivate: dto.isPrivate ?? true,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
    return { success: true, data: note, message: 'Note created' };
  }

  async findAll(query: QuerySessionNoteDto, actorId?: number, actorRoles: string[] = []) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const isAdmin = actorRoles.includes('clinic-admin');

    const where: Prisma.ClinicSessionNoteWhereInput = { deletedAt: null };
    if (query.bookingId) where.bookingId = query.bookingId;
    if (query.psikologUserId) where.psikologUserId = query.psikologUserId;
    if (typeof query.isPrivate === 'boolean') where.isPrivate = query.isPrivate;

    // Privacy filter: non-admin only sees own notes OR public notes from others
    if (!isAdmin && actorId) {
      where.OR = [
        { psikologUserId: actorId },
        { isPrivate: false },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicSessionNote.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicSessionNote.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByBooking(bookingId: number, actorId?: number, actorRoles: string[] = []) {
    const isAdmin = actorRoles.includes('clinic-admin');
    const where: Prisma.ClinicSessionNoteWhereInput = {
      bookingId,
      deletedAt: null,
    };
    if (!isAdmin && actorId) {
      where.OR = [{ psikologUserId: actorId }, { isPrivate: false }];
    }
    const notes = await this.prisma.clinicSessionNote.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
    });
    return { success: true, data: notes };
  }

  async findOne(id: number, actorId?: number, actorRoles: string[] = []) {
    const note = await this.prisma.clinicSessionNote.findFirst({
      where: { id, deletedAt: null },
    });
    if (!note) throw new NotFoundException(`Note ${id} not found`);

    const isAdmin = actorRoles.includes('clinic-admin');
    if (!isAdmin && note.isPrivate && note.psikologUserId !== actorId) {
      throw new ForbiddenException('Catatan private — hanya psikolog yang menulis bisa lihat');
    }
    return { success: true, data: note };
  }

  async update(
    id: number,
    dto: UpdateSessionNoteDto,
    actorId?: number,
    actorRoles: string[] = [],
  ) {
    const existing = await this.findOne(id, actorId, actorRoles);

    const isAdmin = actorRoles.includes('clinic-admin');
    if (!isAdmin && existing.data.psikologUserId !== actorId) {
      throw new ForbiddenException('Hanya psikolog penulis (atau admin) yang bisa edit');
    }

    const updated = await this.prisma.clinicSessionNote.update({
      where: { id },
      data: {
        noteText: dto.noteText ?? undefined,
        isPrivate: dto.isPrivate ?? undefined,
        updatedBy: actorId,
      },
    });
    return { success: true, data: updated, message: 'Note updated' };
  }

  async remove(id: number, actorId?: number, actorRoles: string[] = []) {
    const existing = await this.findOne(id, actorId, actorRoles);

    const isAdmin = actorRoles.includes('clinic-admin');
    if (!isAdmin && existing.data.psikologUserId !== actorId) {
      throw new ForbiddenException('Hanya psikolog penulis (atau admin) yang bisa hapus');
    }

    await this.prisma.clinicSessionNote.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, updatedBy: actorId },
    });
    return { success: true, message: 'Note deleted' };
  }
}
