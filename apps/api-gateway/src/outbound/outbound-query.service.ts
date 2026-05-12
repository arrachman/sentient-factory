import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { isMissingWarehouseColumnError, parseId } from './outbound-helpers';
import { OutboundValidatorsService } from './outbound-validators.service';

@Injectable()
export class OutboundQueryService {
  constructor(
    private prisma: PrismaService,
    private validators: OutboundValidatorsService,
  ) {}

  async findAll(query: QueryOutboundDto, actorId?: string | number) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DeliveryOrderWhereInput = { deletedAt: null };
    const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(
      actorId,
      query.warehouseId,
    );

    if (typeof scopedWarehouseId === 'number') {
      where.warehouseId = scopedWarehouseId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.customerId?.trim()) {
      where.customerId = parseId(query.customerId, 'customerId');
    }

    if (query.doDateFrom || query.doDateTo) {
      where.doDate = {
        gte: query.doDateFrom ? new Date(query.doDateFrom) : undefined,
        lte: query.doDateTo ? new Date(query.doDateTo) : undefined,
      };
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { doNumber: { contains: q, mode: 'insensitive' } },
        { bu: { contains: q, mode: 'insensitive' } },
        { customer: { code: { contains: q, mode: 'insensitive' } } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
        { warehouse: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    let items: Array<any> = [];
    let total = 0;
    try {
      const result = await this.prisma.$transaction([
        this.prisma.deliveryOrder.findMany({
          where,
          include: {
            customer: { select: { id: true, code: true, name: true, type: true } },
            warehouse: { select: { id: true, name: true, locationName: true } },
            destinationCity: { select: { id: true, name: true, postalCode: true } },
            _count: { select: { details: { where: { deletedAt: null } } } },
            details: {
              where: { deletedAt: null },
              select: {
                qtyKg: true,
                batches: {
                  where: { deletedAt: null },
                  select: { id: true },
                },
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.deliveryOrder.count({ where }),
      ]);
      [items, total] = result;
    } catch (error) {
      if (isMissingWarehouseColumnError(error)) {
        throw new BadRequestException(
          'Schema database outbound belum update. Jalankan migration terbaru (warehouse_id pada m2_outbound).',
        );
      }
      throw error;
    }

    const data = items.map((item) => {
      const totalItemTypes = item._count?.details ?? 0;
      const totalBatches = item.details.reduce(
        (sum: number, detail: { batches: Array<unknown> }) => sum + detail.batches.length,
        0,
      );
      const totalKg = item.details.reduce((sum: number, detail: { qtyKg?: number | string }) => {
        const qtyKg = Number(detail.qtyKg ?? 0);
        return sum + (Number.isFinite(qtyKg) ? qtyKg : 0);
      }, 0);

      return {
        ...item,
        totalItemTypes,
        totalBatches,
        totalKg,
      };
    });

    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number, actorId?: string | number) {
    const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
    const item = await this.prisma.deliveryOrder.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      include: {
        customer: { select: { id: true, code: true, name: true, type: true } },
        destinationCity: {
          select: {
            id: true,
            name: true,
            postalCode: true,
            province: { select: { id: true, name: true, isoCode: true } },
          },
        },
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          include: {
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
            },
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
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('outbound not found');
    }

    return { success: true, data: item };
  }
}
