import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrtEscalationDto } from './dto/create-escalation.dto';
import { QueryPrtEscalationDto } from './dto/query-escalation.dto';
import { UpdatePrtEscalationDto } from './dto/update-escalation.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpPrtEscalationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePrtEscalationDto, actorId?: string) {
    const parent = await this.prisma.mdpPrtIssue.findFirst({
      where: { id: BigInt(dto.issueId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Issue not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpPrtEscalation.create({
      data: {
        issueId: BigInt(dto.issueId),
        level: dto.level,
        escalatedToId: toBig(dto.escalatedToId),
        escalatedAt: new Date(dto.escalatedAt),
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        status: dto.status as any,
        reason: dto.reason,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryPrtEscalationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpPrtEscalationWhereInput = { deletedAt: null };
    if (query.issueId) where.issueId = BigInt(query.issueId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpPrtEscalation.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpPrtEscalation.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpPrtEscalation.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Escalation not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdatePrtEscalationDto, actorId?: string) {
    const existing = await this.prisma.mdpPrtEscalation.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Escalation not found');
    const updated = await this.prisma.mdpPrtEscalation.update({
      where: { id },
      data: {
        level: dto.level,
        escalatedToId: dto.escalatedToId !== undefined ? toBig(dto.escalatedToId) : undefined,
        escalatedAt: dto.escalatedAt !== undefined ? new Date(dto.escalatedAt) : undefined,
        dueAt: dto.dueAt !== undefined ? (dto.dueAt ? new Date(dto.dueAt) : null) : undefined,
        status: dto.status as any,
        reason: dto.reason,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpPrtEscalation.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Escalation not found');
    await this.prisma.mdpPrtEscalation.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Escalation deleted' };
  }
}
