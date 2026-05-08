import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, QueryClientDto, UpdateClientDto } from './dto/clinic-client.dto';

@Injectable()
export class ClinicClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto, actorId?: number) {
    if (dto.medicalRecordNumber) {
      const existing = await this.prisma.clinicClient.findFirst({
        where: { medicalRecordNumber: dto.medicalRecordNumber, deletedAt: null },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException(`MRN ${dto.medicalRecordNumber} sudah dipakai.`);
      }
    }
    const created = await this.prisma.clinicClient.create({
      data: { ...dto, waOptedOut: dto.waOptedOut ?? false, createdBy: actorId, updatedBy: actorId },
    });
    return { success: true, data: created, message: 'Client created' };
  }

  async findAll(query: QueryClientDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.ClinicClientWhereInput = { deletedAt: null };
    if (query.gender) where.gender = query.gender;
    if (typeof query.waOptedOut === 'boolean') where.waOptedOut = query.waOptedOut;
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phoneWa: { contains: q, mode: 'insensitive' } },
        { medicalRecordNumber: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicClient.findMany({ where, orderBy: [{ name: 'asc' }], skip, take: limit }),
      this.prisma.clinicClient.count({ where }),
    ]);
    return { success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const client = await this.prisma.clinicClient.findFirst({ where: { id, deletedAt: null } });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return { success: true, data: client };
  }

  async update(id: number, dto: UpdateClientDto, actorId?: number) {
    await this.findOne(id);
    const updated = await this.prisma.clinicClient.update({
      where: { id },
      data: { ...dto, updatedBy: actorId },
    });
    return { success: true, data: updated, message: 'Client updated' };
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id);
    await this.prisma.clinicClient.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, updatedBy: actorId },
    });
    return { success: true, message: 'Client deleted' };
  }
}
