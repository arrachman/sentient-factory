import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { parseIntStrict } from './inbound-transaction.utils';

/**
 * Resolves the effective warehouse ID for an actor and validates access rights.
 *
 * Rules:
 * - super_admin / admin → can access all warehouses; may override via requestedWarehouseId.
 * - Other users → scoped to their mapped warehouseId, or the first warehouse they created.
 */
@Injectable()
export class InboundWarehouseResolverService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the warehouse ID to use for write operations (create / update).
   * Always returns a concrete number; throws if no warehouse can be resolved.
   */
  async resolveForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
  ): Promise<number> {
    const actor = await this.getActorAccess(actorId);
    if (actor.canAccessAllWarehouses && requestedWarehouseId?.trim()) {
      return parseIntStrict(requestedWarehouseId, 'Warehouse ID');
    }

    if (actor.warehouseId && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: { deletedAt: null, createdBy: toAuditUserId(actorId) },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (!ownedWarehouse) {
      throw new BadRequestException('Warehouse untuk user login belum terdaftar');
    }
    return ownedWarehouse.id;
  }

  /**
   * Returns the warehouse ID to use as a read-query filter, or `undefined`
   * when the actor may see all warehouses without an explicit filter.
   */
  async resolveFilterForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
  ): Promise<number | undefined> {
    const actor = await this.getActorAccess(actorId);

    if (actor.canAccessAllWarehouses) {
      return requestedWarehouseId?.trim()
        ? parseIntStrict(requestedWarehouseId, 'Warehouse ID')
        : undefined;
    }

    if (actor.warehouseId && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: { deletedAt: null, createdBy: toAuditUserId(actorId) },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (!ownedWarehouse) {
      throw new BadRequestException('Warehouse untuk user login belum terdaftar');
    }
    return ownedWarehouse.id;
  }

  private async getActorAccess(actorId?: string | number) {
    if (!actorId) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const actorUserId = parseIntStrict(String(actorId), 'User ID');
    const actor = await this.prisma.user.findFirst({
      where: { id: actorUserId, deletedAt: null },
      select: {
        warehouseId: true,
        roles: {
          where: { deletedAt: null },
          select: { role: { select: { name: true, deletedAt: true } } },
        },
      },
    });

    const roleNames = (actor?.roles ?? []).map((item) =>
      String(item.role?.name ?? '').trim().toLowerCase(),
    );

    const canAccessAllWarehouses = roleNames.some(
      (r) => r === 'super_admin' || r === 'admin',
    );

    return { warehouseId: actor?.warehouseId, canAccessAllWarehouses };
  }
}
