import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { enrichPriceAdjustments } from './inv-price-adjustment-enrich';
import { CreateInvPriceAdjustmentDto, ErpCostingMethodDto } from './dto/create-inv-price-adjustment.dto';
import { QueryInvPriceAdjustmentsDto } from './dto/query-inv-price-adjustments.dto';
import { toBigInt, buildPriceAdjWhere, genDocNumber } from './inv-price-adjustment.helpers';

@Injectable()
export class ErpInvPriceAdjustmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolvePeriod(
    tx: Prisma.TransactionClient,
    fiscalPeriodId: string | undefined,
    date: string,
  ): Promise<bigint> {
    if (fiscalPeriodId) return BigInt(fiscalPeriodId);
    const d = new Date(date);
    const period = await tx.erpFiscalPeriod.findFirst({
      where: { deletedAt: null, startDate: { lte: d }, endDate: { gte: d } },
      select: { id: true },
    });
    if (!period) {
      throw new BadRequestException(`Tidak ada periode fiskal yang memuat tanggal ${date}.`);
    }
    return period.id;
  }

  private async findRaw(id: bigint) {
    const row = await this.prisma.erpInvCostRecalculation.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Price adjustment tidak ditemukan');
    return row;
  }

  private async one(id: bigint) {
    const row = await this.findRaw(id);
    const [enriched] = await enrichPriceAdjustments(this.prisma, [row]);
    return { success: true, data: enriched };
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async create(dto: CreateInvPriceAdjustmentDto, actorId?: string) {
    const actor = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.$transaction(async (tx) => {
      const fiscalPeriodId = await this.resolvePeriod(tx, dto.fiscalPeriodId, dto.fromDate);
      const docNumber = dto.docNumber ?? (await genDocNumber(tx, 'PA'));

      const row = await tx.erpInvCostRecalculation.create({
        data: {
          docNumber,
          costingMethod: (dto.costingMethod ?? ErpCostingMethodDto.AVG) as never,
          triggerType: 'MANUAL',
          itemId: toBigInt(dto.itemId),
          warehouseId: toBigInt(dto.warehouseId),
          fromDate: new Date(dto.fromDate),
          toDate: dto.toDate ? new Date(dto.toDate) : null,
          fiscalPeriodId,
          status: 'PENDING',
          notes: dto.notes ?? null,
          legacyCode: dto.legacyCode ?? null,
          createdById: actor,
          updatedById: actor,
        },
        select: { id: true },
      });
      return row;
    });
    return this.one(created.id);
  }

  async findAll(query: QueryInvPriceAdjustmentsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = buildPriceAdjWhere(query);

    const sortBy = query.sortBy ?? 'fromDate';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpInvCostRecalculation.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.erpInvCostRecalculation.count({ where }),
    ]);

    return {
      success: true,
      data: await enrichPriceAdjustments(this.prisma, items),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  findOne(id: bigint) {
    return this.one(id);
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.findRaw(id);
    if (existing.status !== 'PENDING' && existing.status !== 'FAILED') {
      throw new BadRequestException(
        `Hanya price adjustment berstatus PENDING atau FAILED yang bisa dihapus.`,
      );
    }
    const actor = actorId ? BigInt(actorId) : null;
    await this.prisma.erpInvCostRecalculation.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actor },
    });
    return { success: true, message: 'Price adjustment dihapus' };
  }
}
