import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDmsAcknowledgementDto } from './dto/create-acknowledgement.dto';
import { QueryDmsAcknowledgementDto } from './dto/query-acknowledgement.dto';
import { UpdateDmsAcknowledgementDto } from './dto/update-acknowledgement.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpDmsAcknowledgementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDmsAcknowledgementDto, actorId?: string) {
    const parent = await this.prisma.mdpDmsDocument.findFirst({
      where: { id: BigInt(dto.documentId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Document not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpDmsAcknowledgement.create({
      data: {
        documentId: BigInt(dto.documentId),
        revisionId: toBig(dto.revisionId),
        userId: BigInt(dto.userId),
        acknowledgedAt: new Date(dto.acknowledgedAt),
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryDmsAcknowledgementDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpDmsAcknowledgementWhereInput = { deletedAt: null };
    if (query.documentId) where.documentId = BigInt(query.documentId);


    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpDmsAcknowledgement.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpDmsAcknowledgement.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpDmsAcknowledgement.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Acknowledgement not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateDmsAcknowledgementDto, actorId?: string) {
    const existing = await this.prisma.mdpDmsAcknowledgement.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Acknowledgement not found');
    const updated = await this.prisma.mdpDmsAcknowledgement.update({
      where: { id },
      data: {
        revisionId: dto.revisionId !== undefined ? toBig(dto.revisionId) : undefined,
        userId: dto.userId !== undefined ? BigInt(dto.userId) : undefined,
        acknowledgedAt: dto.acknowledgedAt !== undefined ? new Date(dto.acknowledgedAt) : undefined,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpDmsAcknowledgement.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Acknowledgement not found');
    await this.prisma.mdpDmsAcknowledgement.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Acknowledgement deleted' };
  }
}
