import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { hashPassword } from '../auth/password-hasher';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type WarehouseMeta = {
  warehouseId: number | null;
  warehouseName: string | null;
};

@Injectable()
export class UserAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          roles: {
            where: { deletedAt: null },
            include: {
              role: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const serializedItems = await this.serializeUsersWithWarehouse(items);

    return {
      success: true,
      data: serializedItems,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('User not found');
    }

    const [serialized] = await this.serializeUsersWithWarehouse([item]);

    return {
      success: true,
      data: serialized,
    };
  }

  async createFromAdmin(dto: CreateUserDto, actorId?: string) {
    const duplicate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
      select: { email: true, username: true, deletedAt: true },
    });

    if (duplicate?.email === dto.email) {
      throwDuplicate({
        fieldLabel: 'Email',
        value: dto.email,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
    if (duplicate?.username === dto.username) {
      throwDuplicate({
        fieldLabel: 'Username',
        value: dto.username,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }

    const passwordHash = await hashPassword(dto.password);
    const nextIsActive = dto.isActive ?? true;
    const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);
    const normalizedRoleIds = this.normalizeRoleIds(dto.roleIds, dto.roleId);

    if (nextIsActive && !normalizedWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }
    if (normalizedWarehouseId) {
      await this.ensureWarehouseExists(normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.ensureRolesExist(normalizedRoleIds);
    }

    let created;
    try {
      created = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash,
          fullName: dto.fullName ?? null,
          isActive: dto.isActive ?? true,
          warehouseId: normalizedWarehouseId ?? null,
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['email'])) {
        throwDuplicate({ fieldLabel: 'Email', value: dto.email });
      }
      if (isUniqueViolation(error, ['username'])) {
        throwDuplicate({ fieldLabel: 'Username', value: dto.username });
      }
      throw error;
    }

    if (normalizedRoleIds !== undefined) {
      await this.syncRoles(created.id, normalizedRoleIds, actorId);
    }
    const refreshed = await this.prisma.user.findFirst({
      where: { id: created.id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });
    if (!refreshed) {
      throw new NotFoundException('User not found');
    }
    const [serialized] = await this.serializeUsersWithWarehouse([refreshed]);

    return {
      success: true,
      data: serialized,
    };
  }

  async update(id: number, dto: UpdateUserDto, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, email: true, username: true, isActive: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (emailExists) {
        throwDuplicate({
          fieldLabel: 'Email',
          value: dto.email,
          isSoftDeleted: Boolean(emailExists.deletedAt),
        });
      }
    }

    if (dto.username && dto.username !== existing.username) {
      const usernameExists = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (usernameExists) {
        throwDuplicate({
          fieldLabel: 'Username',
          value: dto.username,
          isSoftDeleted: Boolean(usernameExists.deletedAt),
        });
      }
    }

    const passwordHash = dto.password ? await hashPassword(dto.password) : undefined;
    const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);
    const normalizedRoleIds = this.normalizeRoleIds(dto.roleIds, dto.roleId);

    if (normalizedWarehouseId) {
      await this.ensureWarehouseExists(normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.ensureRolesExist(normalizedRoleIds);
    }

    const nextIsActive = dto.isActive ?? existing.isActive;
    const nextWarehouseId =
      normalizedWarehouseId !== undefined
        ? normalizedWarehouseId
        : await this.getCurrentWarehouseId(id);

    if (nextIsActive && !nextWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          email: dto.email,
          username: dto.username,
          fullName: dto.fullName,
          isActive: dto.isActive,
          passwordHash,
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          roles: {
            where: { deletedAt: null },
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['email'])) {
        throwDuplicate({ fieldLabel: 'Email', value: dto.email ?? existing.email });
      }
      if (isUniqueViolation(error, ['username'])) {
        throwDuplicate({ fieldLabel: 'Username', value: dto.username ?? existing.username });
      }
      throw error;
    }

    if (normalizedWarehouseId !== undefined) {
      await this.setWarehouseId(id, normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.syncRoles(id, normalizedRoleIds, actorId);
    }

    const refreshed = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });
    if (!refreshed) {
      throw new NotFoundException('User not found');
    }

    const [serialized] = await this.serializeUsersWithWarehouse([refreshed]);
    return {
      success: true,
      data: serialized,
    };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return {
      success: true,
      message: 'User deleted',
    };
  }

  private normalizeWarehouseId(warehouseId?: string): number | null | undefined {
    if (warehouseId === undefined) {
      return undefined;
    }
    const normalized = warehouseId.trim();
    if (!normalized.length) return null;
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('Warehouse ID is invalid');
    }
    return parsed;
  }

  private normalizeRoleIds(roleIds?: string[], roleId?: string): number[] | undefined {
    if (Array.isArray(roleIds)) {
      const parsed = roleIds.map((value) => {
        const normalized = String(value ?? '').trim();
        const roleIdNumber = Number(normalized);
        if (!normalized.length || !Number.isInteger(roleIdNumber)) {
          throw new BadRequestException('Role IDs are invalid');
        }
        return roleIdNumber;
      });
      return Array.from(new Set(parsed));
    }

    if (roleId === undefined) {
      return undefined;
    }

    const normalized = roleId.trim();
    if (!normalized.length) {
      return [];
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('Role ID is invalid');
    }
    return [parsed];
  }

  private async ensureWarehouseExists(warehouseId: number): Promise<void> {
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

  private async ensureRolesExist(roleIds: number[]): Promise<void> {
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

  private async syncRoles(
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

  private async getCurrentWarehouseId(userId: string | number): Promise<number | null> {
    const id = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(id)) return null;
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { warehouseId: true },
    });
    return user?.warehouseId ?? null;
  }

  private async setWarehouseId(userId: number, warehouseId: number | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { warehouseId },
    });
  }

  private async getWarehouseMapByUserUuids(
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

  private async serializeUsersWithWarehouse(
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
    const warehouseMap = await this.getWarehouseMapByUserUuids(users.map((item) => item.id));
    return users.map((user) => this.serializeUser(user, warehouseMap[String(user.id)]));
  }

  private serializeUser(
    user: User & {
      roles?: Array<{
        role: {
          id: number;
          name: string;
        };
      }>;
    },
    warehouseMeta?: WarehouseMeta,
  ) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
      ...safe,
      warehouseId: warehouseMeta?.warehouseId ?? null,
      warehouseName: warehouseMeta?.warehouseName ?? null,
      roleIds: user.roles?.map((item) => item.role.id) ?? [],
      roleId: user.roles?.[0]?.role?.id ?? null,
      roles: user.roles?.map((item) => item.role.name) ?? [],
      role: user.roles?.[0]?.role?.name ?? null,
    };
  }
}
