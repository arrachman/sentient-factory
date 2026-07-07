import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { QueryRoleMenuDto } from './dto/query-role-menu.dto';
import { SetRoleMenusDto } from './dto/set-role-menus.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';

const MENU_INCLUDE = {
  menu: { select: { id: true, code: true, name: true, path: true } },
} as const;

@Injectable()
export class ErpMdpRoleMenusService {
  constructor(private readonly prisma: PrismaService) {}

  /** Read-only list of ERP roles (adm_roles) — drives the access-map admin UI. */
  async listRoles() {
    const data = await this.prisma.erpRole.findMany({
      where: { deletedAt: null },
      select: { id: true, code: true, name: true, isActive: true },
      orderBy: [{ name: 'asc' }],
    });
    return { success: true, data };
  }

  /**
   * Atomically reconcile a role's full menu access set against `dto.entries`:
   * create missing mappings, update present ones, and soft-delete live mappings
   * not in the list. Unknown menu ids are ignored (no cross-FK error).
   */
  async setForRole(roleIdRaw: string, dto: SetRoleMenusDto, actorId?: string) {
    const roleId = BigInt(roleIdRaw);
    const actor = actorId ? BigInt(actorId) : null;

    const validMenus = await this.prisma.mdpMenu.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const valid = new Set(validMenus.map((m) => m.id.toString()));
    const desired = new Map(
      (dto.entries ?? [])
        .filter((e) => valid.has(String(e.menuId)))
        .map((e) => [String(e.menuId), e]),
    );

    const data = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.mdpRoleMenu.findMany({ where: { roleId } });
      const byMenu = new Map(existing.map((e) => [e.menuId.toString(), e]));

      for (const [menuId, entry] of desired) {
        const found = byMenu.get(menuId);
        const flags = { canView: entry.canView ?? true, canEdit: entry.canEdit ?? false };
        if (found) {
          await tx.mdpRoleMenu.update({
            where: { id: found.id },
            data: { ...flags, deletedAt: null, updatedById: actor },
          });
        } else {
          await tx.mdpRoleMenu.create({
            data: {
              roleId,
              menuId: BigInt(menuId),
              ...flags,
              createdById: actor,
              updatedById: actor,
            },
          });
        }
      }

      for (const e of existing) {
        if (!e.deletedAt && !desired.has(e.menuId.toString())) {
          await tx.mdpRoleMenu.update({
            where: { id: e.id },
            data: { deletedAt: new Date(), updatedById: actor },
          });
        }
      }

      return tx.mdpRoleMenu.findMany({
        where: { roleId, deletedAt: null },
        include: MENU_INCLUDE,
      });
    });

    return { success: true, data };
  }

  async create(dto: CreateRoleMenuDto, actorId?: string) {
    const roleId = BigInt(dto.roleId);
    const menuId = BigInt(dto.menuId);

    const menu = await this.prisma.mdpMenu.findFirst({
      where: { id: menuId, deletedAt: null },
      select: { id: true },
    });
    if (!menu) throw new NotFoundException('Menu not found');

    const existing = await this.prisma.mdpRoleMenu.findFirst({
      where: { roleId, menuId },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      // Re-activate a previously soft-deleted mapping instead of erroring.
      if (existing.deletedAt) {
        const restored = await this.prisma.mdpRoleMenu.update({
          where: { id: existing.id },
          data: {
            deletedAt: null,
            canView: dto.canView ?? true,
            canEdit: dto.canEdit ?? false,
            updatedById: actorId ? BigInt(actorId) : null,
          },
        });
        return { success: true, data: restored };
      }
      throw new ConflictException('Role already mapped to this menu');
    }

    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpRoleMenu.create({
      data: {
        roleId,
        menuId,
        canView: dto.canView ?? true,
        canEdit: dto.canEdit ?? false,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryRoleMenuDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpRoleMenuWhereInput = { deletedAt: null };
    if (query.roleId) where.roleId = BigInt(query.roleId);
    if (query.menuId) where.menuId = BigInt(query.menuId);

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpRoleMenu.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { menu: { select: { id: true, code: true, name: true, path: true } } },
      }),
      this.prisma.mdpRoleMenu.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpRoleMenu.findFirst({
      where: { id, deletedAt: null },
      include: { menu: { select: { id: true, code: true, name: true, path: true } } },
    });
    if (!item) throw new NotFoundException('Role menu mapping not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateRoleMenuDto, actorId?: string) {
    const existing = await this.prisma.mdpRoleMenu.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Role menu mapping not found');

    const updated = await this.prisma.mdpRoleMenu.update({
      where: { id },
      data: {
        canView: dto.canView,
        canEdit: dto.canEdit,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpRoleMenu.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Role menu mapping not found');
    await this.prisma.mdpRoleMenu.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Role menu mapping deleted' };
  }
}
