import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, QueryRoomDto, UpdateRoomDto } from './dto/clinic-room.dto';

@Injectable()
export class ClinicRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto, actorId?: number) {
    const existing = await this.prisma.clinicRoom.findFirst({
      where: { name: dto.name, deletedAt: null },
      select: { id: true },
    });
    if (existing) throw new ConflictException(`Room '${dto.name}' sudah ada.`);
    const created = await this.prisma.clinicRoom.create({
      data: { ...dto, isActive: dto.isActive ?? true, createdBy: actorId, updatedBy: actorId },
    });
    return { success: true, data: created, message: 'Room created' };
  }

  async findAll(query: QueryRoomDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.ClinicRoomWhereInput = { deletedAt: null };
    if (query.type) where.type = query.type;
    if (typeof query.isActive === 'boolean') where.isActive = query.isActive;
    if (query.search?.trim()) {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { description: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicRoom.findMany({
        where,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicRoom.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const room = await this.prisma.clinicRoom.findFirst({ where: { id, deletedAt: null } });
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return { success: true, data: room };
  }

  async update(id: number, dto: UpdateRoomDto, actorId?: number) {
    await this.findOne(id);
    const updated = await this.prisma.clinicRoom.update({
      where: { id },
      data: { ...dto, updatedBy: actorId },
    });
    return { success: true, data: updated, message: 'Room updated' };
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id);
    const bookingCount = await this.prisma.clinicBooking.count({
      where: { roomId: id, deletedAt: null },
    });
    if (bookingCount > 0) {
      throw new ConflictException(
        `Ruangan ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif".`,
      );
    }
    await this.prisma.clinicRoom.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
    });
    return { success: true, message: 'Room deleted' };
  }
}
