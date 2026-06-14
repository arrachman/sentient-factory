import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { parseId, parseOptionalActorId } from './outbound-helpers';

@Injectable()
export class OutboundValidatorsService {
  constructor(private prisma: PrismaService) {}

  async ensureDoNumberAvailable(doNumber: string, exceptId?: number) {
    const duplicate = await this.prisma.deliveryOrder.findFirst({
      where: {
        doNumber,
        NOT: exceptId ? { id: exceptId } : undefined,
      },
      select: { id: true, deletedAt: true },
    });

    if (duplicate) {
      throwDuplicate({
        fieldLabel: 'DO number',
        value: doNumber,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
  }

  async ensureCustomerExists(customerId: number) {
    const customer = await this.prisma.masterDataContact.findFirst({
      where: {
        id: customerId,
        type: 'customer',
        deletedAt: null,
      },
      select: { id: true, city: true },
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    return customer;
  }

  async ensureWarehouseExists(warehouseId: number) {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: { id: warehouseId, deletedAt: null },
      select: { id: true },
    });

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  async resolveDefaultsFromCustomerCity(customerCity?: string) {
    const normalizedCityName = String(customerCity ?? '').trim();
    if (!normalizedCityName) {
      return { destinationCityId: null as number | null };
    }

    const matchedCity = await this.prisma.masterDataCity.findFirst({
      where: {
        name: {
          equals: normalizedCityName,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return { destinationCityId: matchedCity?.id ?? null };
  }

  async findCitySlaByCityId(cityId: number) {
    return this.prisma.masterDataCitySla.findFirst({
      where: {
        cityId,
        deletedAt: null,
      },
      select: {
        stdLeadTimeDays: true,
        stdReturnDoDays: true,
      },
    });
  }

  async ensureCityExists(cityId: number) {
    const city = await this.prisma.masterDataCity.findFirst({
      where: { id: cityId, deletedAt: null },
      select: { id: true },
    });

    if (!city) {
      throw new BadRequestException('Destination city not found');
    }
  }

  async getActiveItems(itemIds: number[]) {
    const uniqueItemIds = [...new Set(itemIds)];

    const items = await this.prisma.masterDataItem.findMany({
      where: {
        id: { in: uniqueItemIds },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        code: true,
        name: true,
        uom: { select: { id: true, code: true } },
      },
    });

    if (items.length !== uniqueItemIds.length) {
      throw new BadRequestException('One or more items are not found or inactive');
    }

    return new Map(
      items.map((item) => [
        item.id,
        {
          id: item.id,
          code: item.code,
          name: item.name,
          uomId: item.uom.id,
          uom: { code: item.uom.code },
        },
      ]),
    );
  }

  async resolveWarehouseForActor(tx: Prisma.TransactionClient, actorId?: string | number) {
    const parsedActorId = this.parseOptionalActorUserId(actorId);
    if (!parsedActorId) {
      return undefined;
    }

    const actor = await tx.user.findFirst({
      where: {
        id: parsedActorId,
        deletedAt: null,
      },
      select: {
        warehouse: {
          select: {
            id: true,
          },
        },
      },
    });

    const mappedWarehouseId = actor?.warehouse?.id;
    if (!mappedWarehouseId || mappedWarehouseId <= 0) {
      return undefined;
    }

    return mappedWarehouseId;
  }

  async resolveActorUserId(tx: Prisma.TransactionClient, actorId?: string | number) {
    const parsedActorId = this.parseOptionalActorUserId(actorId);
    if (!parsedActorId) {
      return undefined;
    }

    const actor = await tx.user.findFirst({
      where: {
        id: parsedActorId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return actor?.id;
  }

  parseOptionalActorUserId(actorId?: string | number): number | undefined {
    if (typeof actorId === 'undefined' || actorId === null) {
      return undefined;
    }
    const normalized = String(actorId).trim();
    if (!normalized) {
      return undefined;
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return undefined;
    }
    return parsed;
  }

  async resolveWarehouseFilterForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
  ): Promise<number | undefined> {
    const actor = await this.getActorWarehouseAccess(actorId);
    if (actor.canAccessAllWarehouses) {
      if (requestedWarehouseId?.trim()) {
        return parseId(requestedWarehouseId, 'warehouseId');
      }
      return undefined;
    }

    if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    throw new BadRequestException('Warehouse untuk user login belum terdaftar');
  }

  async resolveInputWarehouseForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
    fallbackWarehouseId?: number,
  ): Promise<number> {
    const actor = await this.getActorWarehouseAccess(actorId);

    if (actor.canAccessAllWarehouses) {
      if (requestedWarehouseId?.trim()) {
        return parseId(requestedWarehouseId, 'warehouseId');
      }
      if (typeof fallbackWarehouseId === 'number' && fallbackWarehouseId > 0) {
        return fallbackWarehouseId;
      }
      if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
        return actor.warehouseId;
      }
      throw new BadRequestException('warehouseId is required');
    }

    if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    throw new BadRequestException('Warehouse untuk user login belum terdaftar');
  }

  async getActorWarehouseAccess(actorId?: string | number) {
    const actorUserId = parseOptionalActorId(actorId);
    if (!actorUserId) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const actor = await this.prisma.user.findFirst({
      where: {
        id: actorUserId,
        deletedAt: null,
      },
      select: {
        warehouseId: true,
        roles: {
          where: {
            deletedAt: null,
            role: { deletedAt: null },
          },
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!actor) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const roleNames = (actor.roles ?? [])
      .map((row) =>
        String(row.role?.name ?? '')
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean);

    const canAccessAllWarehouses = roleNames.some(
      (roleName) => roleName === 'admin' || roleName === 'super_admin',
    );

    return {
      warehouseId: actor.warehouseId,
      canAccessAllWarehouses,
    };
  }
}
