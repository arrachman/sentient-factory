import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuSortBatchDto } from './dto/update-menu-sort-batch.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuSidebarService } from './menu-sidebar.service';
import {
  assertNoCircularHierarchy,
  resolveDescendantIds,
  serializeMenu,
  SidebarMenuItem,
} from './menu-tree.utils';

@Injectable()
export class MenusService {
  constructor(
    private prisma: PrismaService,
    private sidebarService: MenuSidebarService,
  ) {}

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

    await this.sidebarService.assignMenuToAdminRole(created.id, actorId);

    return { success: true, data: serializeMenu(created) };
  }

  async findAll(query: QueryMenuDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const keyword = query.search?.trim();
    const includeInactive = query.includeInactive ?? false;
    const parentFilter = query.parentId?.trim();
    const groupFilter = query.groupId?.trim();
    const normalizedParentId =
      parentFilter && parentFilter !== 'null' ? Number(parentFilter) : undefined;
    const normalizedGroupId = groupFilter ? Number(groupFilter) : undefined;
    const hasParentFilter =
      parentFilter === 'null' ||
      (Number.isInteger(normalizedParentId) && Number(normalizedParentId) > 0);
    const hasGroupFilter = Number.isInteger(normalizedGroupId) && Number(normalizedGroupId) > 0;

    const groupMenuIds = hasGroupFilter
      ? await this.resolveGroupMenuIds(Number(normalizedGroupId))
      : null;

    const where = {
      deletedAt: null as Date | null,
      ...(includeInactive ? {} : { isActive: true }),
      ...(groupMenuIds ? { id: { in: groupMenuIds } } : {}),
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
      data: items.map((item) => serializeMenu(item)),
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

    return { success: true, data: serializeMenu(item) };
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

    return { success: true, data: serializeMenu(updated) };
  }

  async updateSortBatch(dto: UpdateMenuSortBatchDto, actorId?: string | number) {
    const ids = dto.items.map((item) => item.id);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== ids.length) {
      throw new BadRequestException('Duplicate menu ID in batch update');
    }

    const existingMenus = await this.prisma.menu.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingMenus.length !== ids.length) {
      throw new NotFoundException('One or more menus were not found');
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.menu.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            path: item.path === undefined ? undefined : item.path || null,
            updatedBy: this.toActor(actorId),
          },
        }),
      ),
    );

    return { success: true, message: 'Menu list updated' };
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
    return this.sidebarService.getSidebarByUserId(userId);
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
    const allMenus = await this.prisma.menu.findMany({
      where: { deletedAt: null },
      select: { id: true, parentId: true },
    });
    assertNoCircularHierarchy(allMenus, id, candidateParentId);
  }

  private async resolveGroupMenuIds(groupId: number): Promise<number[]> {
    const allMenus = await this.prisma.menu.findMany({
      where: { deletedAt: null },
      select: { id: true, parentId: true },
    });
    return resolveDescendantIds(allMenus, groupId);
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
