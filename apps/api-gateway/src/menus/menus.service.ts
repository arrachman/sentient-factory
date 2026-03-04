import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

type SidebarMenuItem = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  sortOrder: number;
  children: SidebarMenuItem[];
};

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMenuDto, actorId?: string | number) {
    const existing = await this.prisma.menu.findFirst({
      where: { key: dto.key },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      throwDuplicate({
        fieldLabel: 'Menu key',
        value: dto.key,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    if (dto.parentId) {
      await this.ensureParentExists(dto.parentId);
    }

    const created = await this.prisma.menu.create({
      data: {
        key: dto.key,
        title: dto.title,
        path: dto.path ?? null,
        icon: dto.icon ?? null,
        type: dto.type ?? 'ITEM',
        parentId: dto.parentId ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
        isActive: dto.isActive ?? true,
        permissionName: dto.permissionName ?? null,
        createdBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    await this.assignMenuToAdminRole(created.id, actorId);

    return { success: true, data: this.serializeMenu(created) };
  }

  async findAll(query: QueryMenuDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const keyword = query.search?.trim();
    const includeInactive = query.includeInactive ?? false;
    const parentFilter = query.parentId?.trim();
    const normalizedParentId =
      parentFilter && parentFilter !== 'null' ? Number(parentFilter) : undefined;
    const hasParentFilter =
      parentFilter === 'null' ||
      (Number.isInteger(normalizedParentId) && Number(normalizedParentId) > 0);

    const where = {
      deletedAt: null as Date | null,
      ...(includeInactive ? {} : { isActive: true }),
      ...(hasParentFilter
        ? {
            parentId: parentFilter === 'null' ? null : Number(normalizedParentId),
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { key: { contains: keyword, mode: 'insensitive' as const } },
              { title: { contains: keyword, mode: 'insensitive' as const } },
              { path: { contains: keyword, mode: 'insensitive' as const } },
              { icon: { contains: keyword, mode: 'insensitive' as const } },
              { permissionName: { contains: keyword, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menu.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.menu.count({ where }),
    ]);

    return {
      success: true,
      data: items.map((item) => this.serializeMenu(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.menu.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Menu not found');
    }

    return { success: true, data: this.serializeMenu(item) };
  }

  async update(id: number, dto: UpdateMenuDto, actorId?: string | number) {
    const existing = await this.prisma.menu.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, key: true },
    });
    if (!existing) {
      throw new NotFoundException('Menu not found');
    }

    if (dto.key && dto.key !== existing.key) {
      const duplicate = await this.prisma.menu.findFirst({
        where: { key: dto.key, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Menu key',
          value: dto.key,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('Menu cannot be its own parent');
      }
      if (dto.parentId !== null) {
        await this.ensureParentExists(dto.parentId);
        await this.ensureParentNotDescendant(id, dto.parentId);
      }
    }

    const updated = await this.prisma.menu.update({
      where: { id },
      data: {
        key: dto.key,
        title: dto.title,
        path: dto.path,
        icon: dto.icon,
        type: dto.type,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
        isActive: dto.isActive,
        permissionName: dto.permissionName,
        updatedBy: this.toActor(actorId),
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { success: true, data: this.serializeMenu(updated) };
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.menu.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Menu not found');
    }

    const activeChildren = await this.prisma.menu.count({
      where: {
        parentId: id,
        deletedAt: null,
      },
    });
    if (activeChildren > 0) {
      throw new BadRequestException('Menu has child items. Remove children first.');
    }

    await this.prisma.menu.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, message: 'Menu deleted' };
  }

  async getSidebarByUserId(userId: number | string): Promise<SidebarMenuItem[]> {
    if (!userId) {
      return [];
    }
    const normalizedUserId = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(normalizedUserId)) {
      return [];
    }
    await this.ensureAdministratorRoleMenu();

    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: normalizedUserId,
        deletedAt: null,
        role: {
          deletedAt: null,
        },
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = userRoles.map((item) => item.roleId);
    if (roleIds.length === 0) {
      return [];
    }

    const roleMenus = await this.prisma.roleMenu.findMany({
      where: {
        roleId: { in: roleIds },
        canView: true,
        deletedAt: null,
        menu: {
          deletedAt: null,
          isActive: true,
          isVisible: true,
        },
      },
      include: {
        menu: {
          select: {
            id: true,
            key: true,
            title: true,
            path: true,
            icon: true,
            type: true,
            parentId: true,
            sortOrder: true,
          },
        },
      },
      orderBy: {
        menu: {
          sortOrder: 'asc',
        },
      },
    });

    const dedupedMap = new Map<number, SidebarMenuItem>();
    for (const row of roleMenus) {
      const menu = row.menu;
      if (!dedupedMap.has(menu.id)) {
        dedupedMap.set(menu.id, {
          id: menu.id,
          key: menu.key,
          title: menu.title,
          path: menu.path,
          icon: menu.icon,
          type: menu.type,
          parentId: menu.parentId,
          sortOrder: menu.sortOrder,
          children: [],
        });
      }
    }

    const items = Array.from(dedupedMap.values());
    const byId = new Map(items.map((item) => [item.id, item]));
    const roots: SidebarMenuItem[] = [];

    for (const item of items) {
      if (item.parentId && byId.has(item.parentId)) {
        byId.get(item.parentId)!.children.push(item);
      } else {
        roots.push(item);
      }
    }

    const sortRecursively = (list: SidebarMenuItem[]) => {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
      for (const entry of list) {
        sortRecursively(entry.children);
      }
    };

    sortRecursively(roots);
    return roots;
  }

  private async ensureAdministratorRoleMenu() {
    const administratorParent = await this.prisma.menu.upsert({
      where: { key: 'administrator' },
      update: {
        title: 'Administrator',
        path: null,
        icon: 'ShieldUser',
        type: 'COLLAPSE',
        parentId: null,
        isVisible: true,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: 'administrator',
        title: 'Administrator',
        path: null,
        icon: 'ShieldUser',
        type: 'COLLAPSE',
        parentId: null,
        sortOrder: 50,
        isVisible: true,
        isActive: true,
      },
      select: { id: true },
    });

    const roleMenu = await this.prisma.menu.upsert({
      where: { key: 'administrator-role' },
      update: {
        title: 'Role',
        path: '/app/administrator/role',
        icon: 'ShieldCheck',
        type: 'ITEM',
        parentId: administratorParent.id,
        sortOrder: 34,
        isVisible: true,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: 'administrator-role',
        title: 'Role',
        path: '/app/administrator/role',
        icon: 'ShieldCheck',
        type: 'ITEM',
        parentId: administratorParent.id,
        sortOrder: 34,
        isVisible: true,
        isActive: true,
      },
      select: { id: true },
    });

    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'admin', deletedAt: null },
      select: { id: true },
    });
    if (!adminRole) {
      return;
    }

    const existingRoleMenu = await this.prisma.roleMenu.findFirst({
      where: { roleId: adminRole.id, menuId: roleMenu.id },
      select: { id: true, deletedAt: true },
    });

    if (!existingRoleMenu) {
      await this.prisma.roleMenu.create({
        data: {
          roleId: adminRole.id,
          menuId: roleMenu.id,
          canView: true,
        },
      });
      return;
    }

    if (existingRoleMenu.deletedAt) {
      await this.prisma.roleMenu.update({
        where: { id: existingRoleMenu.id },
        data: {
          canView: true,
          deletedAt: null,
          deletedBy: null,
        },
      });
    }
  }

  private async ensureParentExists(parentId: number) {
    const parent = await this.prisma.menu.findFirst({
      where: { id: parentId, deletedAt: null },
      select: { id: true },
    });
    if (!parent) {
      throw new NotFoundException('Parent menu not found');
    }
  }

  private async ensureParentNotDescendant(id: number, candidateParentId: number) {
    const children = await this.prisma.menu.findMany({
      where: { deletedAt: null },
      select: { id: true, parentId: true },
    });

    const parentMap = new Map<number, number | null>(
      children.map((item) => [item.id, item.parentId]),
    );
    let cursor: number | null = candidateParentId;
    while (cursor !== null) {
      if (cursor === id) {
        throw new BadRequestException('Invalid parent menu. Circular hierarchy detected.');
      }
      cursor = parentMap.get(cursor) ?? null;
    }
  }

  private async assignMenuToAdminRole(menuId: number, actorId?: string | number) {
    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'admin', deletedAt: null },
      select: { id: true },
    });
    if (!adminRole) {
      return;
    }

    const existingRoleMenu = await this.prisma.roleMenu.findFirst({
      where: { roleId: adminRole.id, menuId },
      select: { id: true, deletedAt: true },
    });

    if (!existingRoleMenu) {
      await this.prisma.roleMenu.create({
        data: {
          roleId: adminRole.id,
          menuId,
          canView: true,
          createdBy: this.toActor(actorId),
          updatedBy: this.toActor(actorId),
        },
      });
      return;
    }

    if (existingRoleMenu.deletedAt) {
      await this.prisma.roleMenu.update({
        where: { id: existingRoleMenu.id },
        data: {
          canView: true,
          deletedAt: null,
          deletedBy: null,
          updatedBy: this.toActor(actorId),
        },
      });
      return;
    }

    await this.prisma.roleMenu.update({
      where: { id: existingRoleMenu.id },
      data: {
        canView: true,
        updatedBy: this.toActor(actorId),
      },
    });
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }

  private serializeMenu(item: {
    id: number;
    key: string;
    title: string;
    path: string | null;
    icon: string | null;
    type: string;
    parentId: number | null;
    sortOrder: number;
    isVisible: boolean;
    isActive: boolean;
    permissionName: string | null;
    createdAt: Date;
    updatedAt: Date;
    parent?: {
      id: number;
      title: string;
    } | null;
  }) {
    return {
      id: item.id,
      key: item.key,
      title: item.title,
      path: item.path,
      icon: item.icon,
      type: item.type,
      parentId: item.parentId,
      parentTitle: item.parent?.title ?? null,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
      isActive: item.isActive,
      permissionName: item.permissionName,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
