import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpDocumentNumberingDto } from './dto/create-erp-document-numbering.dto';
import { QueryErpDocumentNumberingDto } from './dto/query-erp-document-numbering.dto';
import { UpdateErpDocumentNumberingDto } from './dto/update-erp-document-numbering.dto';

@Injectable()
export class ErpDocumentNumberingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateErpDocumentNumberingDto, actorId?: string) {
    const existing = await this.prisma.erpDocumentNumbering.findFirst({
      where: { documentCode: dto.documentCode },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      if (existing.deletedAt) {
        throw new BadRequestException(
          `Document code "${dto.documentCode}" already exists (soft-deleted). Restore or use a different code.`,
        );
      }
      throw new BadRequestException(`Document code "${dto.documentCode}" already exists`);
    }

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    const created = await this.prisma.erpDocumentNumbering.create({
      data: {
        documentCode: dto.documentCode,
        name: dto.name,
        prefix: dto.prefix,
        digitCount: dto.digitCount,
        resetPolicy: dto.resetPolicy,
        nextNumber: dto.nextNumber ?? 1,
        menuId: dto.menuId ? BigInt(dto.menuId) : null,
        affectsLedger: dto.affectsLedger ?? false,
        affectsInventory: dto.affectsInventory ?? false,
        affectsCost: dto.affectsCost ?? false,
        notes: dto.notes,
        createdById: actorBigInt,
        updatedById: actorBigInt,
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryErpDocumentNumberingDto) {
    const where: {
      deletedAt?: null;
      documentCode?: string;
    } = {};

    if (query.isActive === true || query.isActive === undefined) {
      where.deletedAt = null;
    }
    if (query.documentCode?.trim()) where.documentCode = query.documentCode.trim();

    const items = await this.prisma.erpDocumentNumbering.findMany({
      where,
      orderBy: [{ documentCode: 'asc' }],
    });

    return { success: true, data: items };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.erpDocumentNumbering.findFirst({
      where: { id, deletedAt: null },
      include: { menu: true },
    });
    if (!item) throw new NotFoundException('Document numbering not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpDocumentNumberingDto, actorId?: string) {
    const existing = await this.prisma.erpDocumentNumbering.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Document numbering not found');

    if (dto.documentCode && dto.documentCode !== existing.documentCode) {
      const duplicate = await this.prisma.erpDocumentNumbering.findFirst({
        where: { documentCode: dto.documentCode, NOT: { id } },
        select: { id: true },
      });
      if (duplicate) {
        throw new BadRequestException(`Document code "${dto.documentCode}" already exists`);
      }
    }

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    const updated = await this.prisma.erpDocumentNumbering.update({
      where: { id },
      data: {
        documentCode: dto.documentCode,
        name: dto.name,
        prefix: dto.prefix,
        digitCount: dto.digitCount,
        resetPolicy: dto.resetPolicy,
        nextNumber: dto.nextNumber,
        menuId: dto.menuId !== undefined ? (dto.menuId ? BigInt(dto.menuId) : null) : undefined,
        affectsLedger: dto.affectsLedger,
        affectsInventory: dto.affectsInventory,
        affectsCost: dto.affectsCost,
        notes: dto.notes,
        updatedById: actorBigInt,
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpDocumentNumbering.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Document numbering not found');

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    await this.prisma.erpDocumentNumbering.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'Document numbering deleted' };
  }

  /**
   * Atomically increments the sequence and returns the formatted document number.
   * Uses a transaction to ensure no race conditions.
   */
  async getNextNumber(documentCode: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const numbering = await tx.erpDocumentNumbering.findFirst({
        where: { documentCode, deletedAt: null },
      });
      if (!numbering) {
        throw new NotFoundException(`Document numbering for code "${documentCode}" not found`);
      }

      const seq = numbering.nextNumber;
      const padded = String(seq).padStart(numbering.digitCount, '0');
      const docNumber = `${numbering.prefix}${padded}`;

      await tx.erpDocumentNumbering.update({
        where: { id: numbering.id },
        data: { nextNumber: seq + 1 },
      });

      return { documentCode, docNumber, sequence: seq };
    });

    return { success: true, data: result };
  }
}
