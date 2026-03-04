import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataRoleDto } from './dto/create-master-data-role.dto';
import { QueryMasterDataRoleDto } from './dto/query-master-data-role.dto';
import { UpdateMasterDataRoleDto } from './dto/update-master-data-role.dto';
import { UpdateRoleMenusDto } from './dto/update-role-menus.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Injectable()
export class MasterDataRolesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataRoleDto, actorId?: string | number) {
    const normalizedName = dto.name.trim();
    const existing = await this.prisma.role.findFirst({
      where: { name: normalizedName },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      throwDuplicate({
        fieldLabel: 'Role name',
        value: normalizedName,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const created = await this.prisma.role.create({
      data: {
        name: normalizedName,
        description: dto.description?.trim() || null,
        isSystem: dto.isSystem ?? false,
        createdBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataRoleDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const q = query.search?.trim();
    const includeSystem = query.includeSystem ?? true;

    const where = {
      deletedAt: null as Date | null,
      ...(includeSystem ? {} : { isSystem: false }),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where,
        include: {
          permissions: {
            where: { deletedAt: null },
            select: { permissionId: true },
          },
          menus: {
            where: { deletedAt: null, canView: true },
            select: { menuId: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      success: true,
      data: items.map((item) => ({
        ...item,
        permissionCount: item.permissions.length,
        menuCount: item.menus.length,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      include: {
        permissions: {
          where: { deletedAt: null },
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                module: true,
                action: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Master data role not found');
    }

    return {
      success: true,
      data: {
        ...item,
        permissions: item.permissions.map((row) => row.permission),
      },
    };
  }

  async update(id: number, dto: UpdateMasterDataRoleDto, actorId?: string | number) {
    const existing = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, name: true, isSystem: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data role not found');
    }

    const nextName = dto.name?.trim();
    if (nextName && nextName !== existing.name) {
      const duplicate = await this.prisma.role.findFirst({
        where: { name: nextName, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Role name',
          value: nextName,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    if (existing.isSystem && dto.isSystem === false) {
      throw new BadRequestException('System role cannot be downgraded.');
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: {
        name: nextName,
        description: dto.description?.trim() ?? dto.description,
        isSystem: dto.isSystem,
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, isSystem: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data role not found');
    }

    if (existing.isSystem) {
      throw new BadRequestException('System role cannot be deleted.');
    }

    const activeUsers = await this.prisma.userRole.count({
      where: { roleId: id, deletedAt: null },
    });
    if (activeUsers > 0) {
      throw new BadRequestException(
        'Role masih dipakai user. Lepaskan role dari user terlebih dahulu.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.rolePermission.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: this.toActor(actorId),
          updatedBy: this.toActor(actorId),
        },
      }),
      this.prisma.roleMenu.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: this.toActor(actorId),
          updatedBy: this.toActor(actorId),
        },
      }),
      this.prisma.role.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: this.toActor(actorId),
          updatedBy: this.toActor(actorId),
        },
      }),
    ]);

    return { success: true, message: 'Master data role deleted' };
  }

  async getRolePermissions(id: number) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException('Master data role not found');
    }

    const rows = await this.prisma.rolePermission.findMany({
      where: {
        roleId: id,
        deletedAt: null,
        permission: {
          deletedAt: null,
        },
      },
      select: { permissionId: true },
      orderBy: { permissionId: 'asc' },
    });

    return {
      success: true,
      data: {
        roleId: id,
        permissionIds: rows.map((row) => row.permissionId),
      },
    };
  }

  async updateRolePermissions(
    id: number,
    dto: UpdateRolePermissionsDto,
    actorId?: string | number,
  ) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException('Master data role not found');
    }

    const nextPermissionIds = Array.from(new Set(dto.permissionIds ?? []));
    if (nextPermissionIds.length > 0) {
      const availablePermissions = await this.prisma.permission.findMany({
        where: { id: { in: nextPermissionIds }, deletedAt: null },
        select: { id: true },
      });
      if (availablePermissions.length !== nextPermissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid.');
      }
    }

    const currentRows = await this.prisma.rolePermission.findMany({
      where: { roleId: id },
      select: { id: true, permissionId: true, deletedAt: true },
    });

    const currentByPermissionId = new Map<number, { id: number; deletedAt: Date | null }>();
    currentRows.forEach((row) => {
      currentByPermissionId.set(row.permissionId, { id: row.id, deletedAt: row.deletedAt });
    });

    const now = new Date();
    const toActivate = nextPermissionIds.filter((permissionId) => {
      const found = currentByPermissionId.get(permissionId);
      return !found || Boolean(found.deletedAt);
    });
    const toDeactivate = currentRows
      .filter((row) => !row.deletedAt && !nextPermissionIds.includes(row.permissionId))
      .map((row) => row.permissionId);

    await this.prisma.$transaction(async (tx) => {
      for (const permissionId of toActivate) {
        const existing = currentByPermissionId.get(permissionId);
        if (!existing) {
          await tx.rolePermission.create({
            data: {
              roleId: id,
              permissionId,
              createdBy: this.toActor(actorId),
              updatedBy: this.toActor(actorId),
            },
          });
          continue;
        }

        await tx.rolePermission.update({
          where: { id: existing.id },
          data: {
            deletedAt: null,
            deletedBy: null,
            updatedAt: now,
            updatedBy: this.toActor(actorId),
          },
        });
      }

      for (const permissionId of toDeactivate) {
        const existing = currentByPermissionId.get(permissionId);
        if (!existing) {
          continue;
        }
        await tx.rolePermission.update({
          where: { id: existing.id },
          data: {
            deletedAt: now,
            deletedBy: this.toActor(actorId),
            updatedBy: this.toActor(actorId),
          },
        });
      }
    });

    return this.getRolePermissions(id);
  }

  async getRoleMenus(id: number) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException('Master data role not found');
    }

    const rows = await this.prisma.roleMenu.findMany({
      where: {
        roleId: id,
        deletedAt: null,
        menu: {
          deletedAt: null,
        },
      },
      select: { menuId: true },
      orderBy: { menuId: 'asc' },
    });

    return {
      success: true,
      data: {
        roleId: id,
        menuIds: rows.map((row) => row.menuId),
      },
    };
  }

  async updateRoleMenus(id: number, dto: UpdateRoleMenusDto, actorId?: string | number) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException('Master data role not found');
    }

    const nextMenuIds = Array.from(new Set(dto.menuIds ?? []));
    if (nextMenuIds.length > 0) {
      const availableMenus = await this.prisma.menu.findMany({
        where: { id: { in: nextMenuIds }, deletedAt: null },
        select: { id: true },
      });
      if (availableMenus.length !== nextMenuIds.length) {
        throw new BadRequestException('One or more menu IDs are invalid.');
      }
    }

    const currentRows = await this.prisma.roleMenu.findMany({
      where: { roleId: id },
      select: { id: true, menuId: true, deletedAt: true },
    });

    const currentByMenuId = new Map<number, { id: number; deletedAt: Date | null }>();
    currentRows.forEach((row) => {
      currentByMenuId.set(row.menuId, { id: row.id, deletedAt: row.deletedAt });
    });

    const now = new Date();
    const toActivate = nextMenuIds.filter((menuId) => {
      const found = currentByMenuId.get(menuId);
      return !found || Boolean(found.deletedAt);
    });
    const toDeactivate = currentRows
      .filter((row) => !row.deletedAt && !nextMenuIds.includes(row.menuId))
      .map((row) => row.menuId);

    await this.prisma.$transaction(async (tx) => {
      for (const menuId of toActivate) {
        const existing = currentByMenuId.get(menuId);
        if (!existing) {
          await tx.roleMenu.create({
            data: {
              roleId: id,
              menuId,
              canView: true,
              createdBy: this.toActor(actorId),
              updatedBy: this.toActor(actorId),
            },
          });
          continue;
        }

        await tx.roleMenu.update({
          where: { id: existing.id },
          data: {
            canView: true,
            deletedAt: null,
            deletedBy: null,
            updatedAt: now,
            updatedBy: this.toActor(actorId),
          },
        });
      }

      for (const menuId of toDeactivate) {
        const existing = currentByMenuId.get(menuId);
        if (!existing) {
          continue;
        }
        await tx.roleMenu.update({
          where: { id: existing.id },
          data: {
            canView: false,
            deletedAt: now,
            deletedBy: this.toActor(actorId),
            updatedBy: this.toActor(actorId),
          },
        });
      }
    });

    return this.getRoleMenus(id);
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
