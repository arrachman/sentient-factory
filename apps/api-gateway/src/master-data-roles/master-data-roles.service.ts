import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataRoleDto } from './dto/create-master-data-role.dto';
import { QueryMasterDataRoleDto } from './dto/query-master-data-role.dto';
import { UpdateMasterDataRoleDto } from './dto/update-master-data-role.dto';
import { UpdateRoleMenusDto } from './dto/update-role-menus.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { RolePermissionsService } from './role-permissions.service';

@Injectable()
export class MasterDataRolesService {
  constructor(
    private prisma: PrismaService,
    private rolePermissionsService: RolePermissionsService,
  ) {}

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
    return this.rolePermissionsService.getRolePermissions(id);
  }

  async updateRolePermissions(
    id: number,
    dto: UpdateRolePermissionsDto,
    actorId?: string | number,
  ) {
    return this.rolePermissionsService.updateRolePermissions(id, dto, actorId);
  }

  async getRoleMenus(id: number) {
    return this.rolePermissionsService.getRoleMenus(id);
  }

  async updateRoleMenus(id: number, dto: UpdateRoleMenusDto, actorId?: string | number) {
    return this.rolePermissionsService.updateRoleMenus(id, dto, actorId);
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
