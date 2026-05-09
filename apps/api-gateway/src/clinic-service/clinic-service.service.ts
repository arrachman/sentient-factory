import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './dto/clinic-service.dto';

@Injectable()
export class ClinicServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto, actorId?: number) {
    const existing = await this.prisma.clinicService.findFirst({
      where: { name: dto.name, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(`Service '${dto.name}' sudah ada.`);
    }
    const created = await this.prisma.clinicService.create({
      data: {
        ...dto,
        basePrice: new Prisma.Decimal(dto.basePrice),
        isActive: dto.isActive ?? true,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
    return { success: true, data: created, message: 'Service created' };
  }

  async findAll(query: QueryServiceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.ClinicServiceWhereInput = { deletedAt: null };
    if (query.category) where.category = query.category;
    if (typeof query.isActive === 'boolean') where.isActive = query.isActive;
    if (query.search?.trim()) {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { description: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicService.findMany({
        where,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicService.count({ where }),
    ]);

    // Enrich dengan bookedThisMonth per service (single groupBy query)
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const ids = items.map((s) => s.id);
    const bookedAgg =
      ids.length === 0
        ? []
        : await this.prisma.clinicBooking.groupBy({
            by: ['serviceId'],
            where: {
              serviceId: { in: ids },
              status: { not: 'cancelled' },
              deletedAt: null,
              scheduledStart: { gte: monthStart },
            },
            _count: { _all: true },
          });
    const bookedMap = new Map<number, number>(
      bookedAgg.map((row) => [row.serviceId, row._count._all]),
    );
    const enriched = items.map((s) => ({
      ...s,
      bookedThisMonth: bookedMap.get(s.id) ?? 0,
    }));

    return {
      success: true,
      data: enriched,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const service = await this.prisma.clinicService.findFirst({
      where: { id, deletedAt: null },
    });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return { success: true, data: service };
  }

  async update(id: number, dto: UpdateServiceDto, actorId?: number) {
    await this.findOne(id);
    const data: Prisma.ClinicServiceUpdateInput = {
      ...dto,
      updatedBy: actorId,
    };
    if (dto.basePrice !== undefined) data.basePrice = new Prisma.Decimal(dto.basePrice);
    const updated = await this.prisma.clinicService.update({ where: { id }, data });
    return { success: true, data: updated, message: 'Service updated' };
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id);
    await this.prisma.clinicService.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
    });
    return { success: true, message: 'Service deleted' };
  }
}
