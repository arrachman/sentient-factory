import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDmsDocumentDto } from './dto/create-document.dto';
import { QueryDmsDocumentDto } from './dto/query-document.dto';
import { UpdateDmsDocumentDto } from './dto/update-document.dto';

const CODE_TARGETS = ['code', 'dms_documents_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpDmsDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateDmsDocumentDto | UpdateDmsDocumentDto, partial: boolean) {
    const d: Prisma.MdpDmsDocumentUncheckedCreateInput | Prisma.MdpDmsDocumentUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      category: dto.category as any,
      status: dto.status as any,
      currentRevision: dto.currentRevision,
      description: dto.description,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('ownerId', dto.ownerId);
    if (!partial || dto.effectiveAt !== undefined) (d as any).effectiveAt = dto.effectiveAt ? new Date(dto.effectiveAt) : null;
    return d;
  }

  async create(dto: CreateDmsDocumentDto, actorId?: string) {
    const existing = await this.prisma.mdpDmsDocument.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Document code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpDmsDocument.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpDmsDocumentUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Document code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryDmsDocumentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpDmsDocumentWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpDmsDocument.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpDmsDocument.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpDmsDocument.findFirst({
      where: { id, deletedAt: null },
      include: { revisions: { where: { deletedAt: null } }, acknowledgements: { where: { deletedAt: null } } },
    });
    if (!item) throw new NotFoundException('Document not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateDmsDocumentDto, actorId?: string) {
    const existing = await this.prisma.mdpDmsDocument.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Document not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpDmsDocument.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Document code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpDmsDocument.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpDmsDocumentUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Document code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpDmsDocument.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Document not found');
    await this.prisma.mdpDmsDocument.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Document deleted' };
  }
}
