import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDmsRevisionDto } from './dto/create-revision.dto';
import { QueryDmsRevisionDto } from './dto/query-revision.dto';
import { UpdateDmsRevisionDto } from './dto/update-revision.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpDmsRevisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDmsRevisionDto, actorId?: string) {
    const parent = await this.prisma.mdpDmsDocument.findFirst({
      where: { id: BigInt(dto.documentId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Document not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpDmsRevision.create({
      data: {
        documentId: BigInt(dto.documentId),
        revisionCode: dto.revisionCode,
        status: dto.status as any,
        filePath: dto.filePath,
        changeSummary: dto.changeSummary,
        approvedById: toBig(dto.approvedById),
        approvedAt: dto.approvedAt ? new Date(dto.approvedAt) : null,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryDmsRevisionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpDmsRevisionWhereInput = { deletedAt: null };
    if (query.documentId) where.documentId = BigInt(query.documentId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpDmsRevision.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpDmsRevision.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpDmsRevision.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Revision not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateDmsRevisionDto, actorId?: string) {
    const existing = await this.prisma.mdpDmsRevision.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Revision not found');
    const updated = await this.prisma.mdpDmsRevision.update({
      where: { id },
      data: {
        revisionCode: dto.revisionCode,
        status: dto.status as any,
        filePath: dto.filePath,
        changeSummary: dto.changeSummary,
        approvedById: dto.approvedById !== undefined ? toBig(dto.approvedById) : undefined,
        approvedAt: dto.approvedAt !== undefined ? (dto.approvedAt ? new Date(dto.approvedAt) : null) : undefined,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpDmsRevision.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Revision not found');
    await this.prisma.mdpDmsRevision.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Revision deleted' };
  }
}
