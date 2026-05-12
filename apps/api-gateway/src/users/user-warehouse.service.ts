import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseMeta, serializeUser } from './user-admin.utils';

@Injectable()
export class UserWarehouseService {
  constructor(private prisma: PrismaService) {}

  async ensureWarehouseExists(warehouseId: number): Promise<void> {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: {
        id: warehouseId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  async ensureRolesExist(roleIds: number[]): Promise<void> {
    if (roleIds.length === 0) {
      return;
    }
    const roles = await this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
        deletedAt: null,
      },
      select: { id: true },
    });
    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles are invalid');
    }
  }

  async syncRoles(
    userId: number,
    roleIds: number[],
    actorId?: string | number,
  ): Promise<void> {
    const auditActor = toAuditUserId(actorId);
    const now = new Date();
    const roleIdSet = new Set(roleIds);

    await this.prisma.$transaction(async (tx) => {
      const existingRows = await tx.userRole.findMany({
        where: { userId },
        select: { id: true, roleId: true, deletedAt: true },
      });
      const existingByRoleId = new Map<number, { id: number; deletedAt: Date | null }>();
      existingRows.forEach((row) => {
        existingByRoleId.set(row.roleId, { id: row.id, deletedAt: row.deletedAt });
      });

      for (const nextRoleId of roleIds) {
        const existing = existingByRoleId.get(nextRoleId);
        if (!existing) {
          await tx.userRole.create({
            data: {
              userId,
              roleId: nextRoleId,
              createdBy: auditActor,
              updatedBy: auditActor,
            },
          });
          continue;
        }

        if (existing.deletedAt) {
          await tx.userRole.update({
            where: { id: existing.id },
            data: {
              deletedAt: null,
              deletedBy: null,
              updatedBy: auditActor,
            },
          });
        }
      }

      if (roleIds.length === 0) {
        await tx.userRole.updateMany({
          where: {
            userId,
            deletedAt: null,
          },
          data: {
            deletedAt: now,
            deletedBy: auditActor,
            updatedBy: auditActor,
          },
        });
      } else {
        await tx.userRole.updateMany({
          where: {
            userId,
            deletedAt: null,
            roleId: {
              notIn: [...roleIdSet],
            },
          },
          data: {
            deletedAt: now,
            deletedBy: auditActor,
            updatedBy: auditActor,
          },
        });
      }
    });
  }

  async getCurrentWarehouseId(userId: string | number): Promise<number | null> {
    const id = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(id)) return null;
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { warehouseId: true },
    });
    return user?.warehouseId ?? null;
  }

  async setWarehouseId(userId: number, warehouseId: number | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { warehouseId },
    });
  }

  async getWarehouseMapByUserIds(
    userIds: number[],
  ): Promise<Record<string, WarehouseMeta>> {
    if (userIds.length === 0) {
      return {};
    }

    const rows = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        warehouseId: true,
        warehouse: { select: { name: true } },
      },
    });

    const map: Record<string, WarehouseMeta> = {};
    for (const row of rows) {
      map[String(row.id)] = {
        warehouseId: row.warehouseId,
        warehouseName: row.warehouse?.name ?? null,
      };
    }
    return map;
  }

  async serializeUsersWithWarehouse(
    users: Array<
      User & {
        roles?: Array<{
          role: {
            id: number;
            name: string;
          };
        }>;
      }
    >,
  ) {
    const warehouseMap = await this.getWarehouseMapByUserIds(users.map((item) => item.id));
    return users.map((user) => serializeUser(user, warehouseMap[String(user.id)]));
  }
}
