import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateInboundDetailDto } from './dto/create-inbound-detail.dto';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';
import { buildInboundDetailCreateInput } from './inbound-detail.mapper';
import { InboundLedgerSyncService } from './inbound-ledger-sync.service';
import { InboundStockGuardService } from './inbound-stock-guard.service';
import {
  NormalizedInboundDetail,
  normalizeAndValidateDetails,
} from './inbound-transaction.utils';
import { InboundWarehouseResolverService } from './inbound-warehouse-resolver.service';
import {
  ensureSupplierExists,
  ensureTransactionNoAvailable,
  ensureWarehouseExists,
  getActiveItems,
  parseInboundId,
  resolveTransactionNo,
} from './inbound.utils';

// ─── Prisma include constants ─────────────────────────────────────────────────

const INBOUND_LIST_INCLUDE = {
  supplier: { select: { id: true, code: true, name: true, type: true } },
  warehouse: {
    select: {
      id: true,
      name: true,
      locationName: true,
      city: { select: { id: true, name: true, postalCode: true } },
    },
  },
  details: {
    where: { deletedAt: null as null },
    select: { _count: { select: { batches: { where: { deletedAt: null as null } } } } },
  },
  _count: { select: { details: { where: { deletedAt: null as null } } } },
} satisfies Prisma.InboundInclude;

const INBOUND_DETAIL_INCLUDE = {
  supplier: { select: { id: true, code: true, name: true, type: true } },
  warehouse: {
    select: {
      id: true,
      name: true,
      locationName: true,
      addressDetail: true,
      city: {
        select: {
          id: true,
          name: true,
          postalCode: true,
          province: { select: { id: true, name: true, isoCode: true } },
        },
      },
    },
  },
  details: {
    where: { deletedAt: null as null },
    orderBy: [{ lineNo: 'asc' as const }],
    include: {
      item: {
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
          itemType: true,
          uom: { select: { id: true, code: true, name: true, type: true } },
        },
      },
      batches: {
        where: { deletedAt: null as null },
        orderBy: [{ lineNo: 'asc' as const }],
      },
    },
  },
} satisfies Prisma.InboundInclude;

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class InboundsService {
  constructor(
    private prisma: PrismaService,
    private stockGuard: InboundStockGuardService,
    private ledgerSync: InboundLedgerSyncService,
    private warehouseResolver: InboundWarehouseResolverService,
  ) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async create(dto: CreateInboundDto, actorId?: string | number) {
    const supplierId = parseInboundId(dto.supplierId, 'Supplier ID');
    await ensureSupplierExists(this.prisma, supplierId);
    const effectiveWarehouseId = await this.warehouseResolver.resolveForActor(
      actorId,
      dto.warehouseId,
    );
    await ensureWarehouseExists(this.prisma, effectiveWarehouseId);

    const detailPayload = normalizeAndValidateDetails(dto.details);
    const itemMap = await getActiveItems(this.prisma, detailPayload.map((d) => d.itemId));

    const created = await this.prisma.$transaction(async (tx) => {
      const transactionNo = await resolveTransactionNo(tx, this.prisma, dto.transactionNo);
      const header = await tx.inbound.create({
        data: {
          transactionNo,
          transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
          supplierId,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes ?? null,
          status: 'POSTED',
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });

      for (const [index, detail] of detailPayload.entries()) {
        await tx.inboundDetail.create({
          data: buildInboundDetailCreateInput(
            header.id,
            index + 1,
            detail,
            itemMap.get(detail.itemId)!,
            actorId,
          ),
        });
      }

      await this.ledgerSync.sync(tx, header.id, actorId);
      return header;
    });

    return this.findOne(created.id, actorId);
  }

  async findAll(query: QueryInboundDto, actorId?: string | number) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = await this.buildWhereFilter(query, actorId);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.inbound.findMany({
        where,
        include: INBOUND_LIST_INCLUDE,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.inbound.count({ where }),
    ]);

    return {
      success: true,
      data: items.map((item) => ({
        ...item,
        totalBatches: Array.isArray(item.details)
          ? item.details.reduce((sum, d) => sum + Number(d?._count?.batches ?? 0), 0)
          : 0,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: number, actorId?: string | number) {
    const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
    const item = await this.prisma.inbound.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      include: INBOUND_DETAIL_INCLUDE,
    });

    if (!item) {
      throw new NotFoundException('Inbound not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateInboundDto, actorId?: string | number) {
    const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
    const existing = await this.prisma.inbound.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      select: { id: true, transactionNo: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    if (dto.transactionNo && dto.transactionNo !== existing.transactionNo) {
      await ensureTransactionNoAvailable(this.prisma, dto.transactionNo, id);
    }

    if (dto.supplierId) {
      await ensureSupplierExists(this.prisma, parseInboundId(dto.supplierId, 'Supplier ID'));
    }

    const effectiveWarehouseId = await this.warehouseResolver.resolveForActor(
      actorId,
      dto.warehouseId,
    );
    await ensureWarehouseExists(this.prisma, effectiveWarehouseId);

    const detailsProvided = Array.isArray(dto.details);
    let detailPayload: NormalizedInboundDetail[] = [];
    let itemMap: Map<number, { id: number; code: string; name: string; uomId: number }> = new Map();

    if (detailsProvided) {
      detailPayload = normalizeAndValidateDetails(dto.details as CreateInboundDetailDto[]);
      itemMap = await getActiveItems(this.prisma, detailPayload.map((d) => d.itemId));
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.inbound.update({
        where: { id },
        data: {
          transactionNo: dto.transactionNo,
          transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
          supplierId: dto.supplierId ? parseInboundId(dto.supplierId, 'Supplier ID') : undefined,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes,
          status: dto.status,
          updatedBy: toAuditUserId(actorId),
        },
      });

      if (detailsProvided) {
        const existingDetails = await tx.inboundDetail.findMany({
          where: { inboundId: id },
          select: { id: true },
        });
        const detailIds = existingDetails.map((row) => row.id);
        if (detailIds.length > 0) {
          await tx.inboundDetailBatch.deleteMany({
            where: { inboundDetailId: { in: detailIds } },
          });
        }
        await tx.inboundDetail.deleteMany({ where: { inboundId: id } });

        for (const [index, detail] of detailPayload.entries()) {
          await tx.inboundDetail.create({
            data: buildInboundDetailCreateInput(
              id,
              index + 1,
              detail,
              itemMap.get(detail.itemId)!,
              actorId,
            ),
          });
        }
      }

      await this.ledgerSync.sync(tx, id, actorId);
    });

    return this.findOne(id, actorId);
  }

  async remove(id: number, actorId?: string | number) {
    const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(actorId);
    const existing = await this.prisma.inbound.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await this.stockGuard.ensureDeleteWillNotCauseNegativeStock(tx, id);

      await tx.inbound.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          status: 'CANCELLED',
          updatedBy: toAuditUserId(actorId),
        },
      });
      await tx.inboundDetail.updateMany({
        where: { inboundId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });
      await tx.inboundDetailBatch.updateMany({
        where: { inboundDetail: { inboundId: id }, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });

      await this.ledgerSync.sync(tx, id, actorId);
    });

    return { success: true, message: 'Inbound deleted' };
  }

  // ─── Filter builder ────────────────────────────────────────────────────────

  private async buildWhereFilter(
    query: QueryInboundDto,
    actorId?: string | number,
  ): Promise<Prisma.InboundWhereInput> {
    const where: Prisma.InboundWhereInput = { deletedAt: null };
    const scopedWarehouseId = await this.warehouseResolver.resolveFilterForActor(
      actorId,
      query.warehouseId,
    );

    if (typeof scopedWarehouseId === 'number') {
      where.warehouseId = scopedWarehouseId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.supplierId?.trim()) {
      where.supplierId = parseInboundId(query.supplierId.trim(), 'Supplier ID');
    }

    if (query.warehouseId?.trim() && typeof scopedWarehouseId !== 'number') {
      where.warehouseId = parseInboundId(query.warehouseId.trim(), 'Warehouse ID');
    }

    if (query.transactionDateFrom || query.transactionDateTo) {
      where.transactionDate = {
        gte: query.transactionDateFrom ? new Date(query.transactionDateFrom) : undefined,
        lte: query.transactionDateTo ? new Date(query.transactionDateTo) : undefined,
      };
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { transactionNo: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
        { supplier: { code: { contains: q, mode: 'insensitive' } } },
        { supplier: { name: { contains: q, mode: 'insensitive' } } },
        { warehouse: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    return where;
  }
}
