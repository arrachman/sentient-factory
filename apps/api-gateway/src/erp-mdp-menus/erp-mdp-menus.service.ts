import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

const CODE_TARGETS = ['code', 'mdp_menus_code_key'];

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

export interface MenuRow {
  id: bigint;
  parentId: bigint | null;
  code: string;
  name: string;
  path: string | null;
  icon: string | null;
  moduleKey: string | null;
  sequence: number;
}

export interface MenuTreeNode extends MenuRow {
  children: MenuTreeNode[];
}

/** Builds a sequenced parent→children tree from a flat menu list. */
function buildMenuTree(rows: MenuRow[]): MenuTreeNode[] {
  const nodes = new Map<bigint, MenuTreeNode>();
  for (const r of rows) {
    nodes.set(r.id, {
      id: r.id,
      parentId: r.parentId,
      code: r.code,
      name: r.name,
      path: r.path,
      icon: r.icon,
      moduleKey: r.moduleKey,
      sequence: r.sequence,
      children: [],
    });
  }
  const roots: MenuTreeNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  const sortRec = (list: MenuTreeNode[]) => {
    list.sort((a, b) => a.sequence - b.sequence);
    list.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

@Injectable()
export class ErpMdpMenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto, actorId?: string) {
    const existing = await this.prisma.mdpMenu.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Menu code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpMenu.create({
        data: {
          code: dto.code,
          name: dto.name,
          parentId: toBig(dto.parentId),
          path: dto.path,
          icon: dto.icon,
          moduleKey: dto.moduleKey,
          sequence: dto.sequence ?? 0,
          isActive: dto.isActive ?? true,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Menu code', value: dto.code });
      }
      throw error;
    }
  }

  async findAll(query: QueryMenuDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMenuWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.moduleKey) where.moduleKey = query.moduleKey;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortBy = query.sortBy ?? 'sequence';
    const sortDir = query.sortDir ?? 'asc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMenu.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { parent: { select: { id: true, code: true, name: true } } },
      }),
      this.prisma.mdpMenu.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  /**
   * Role-filtered navigation tree for the MDP shell. Resolves the user's ERP
   * roles (adm_user_roles) → mdp_role_menus → visible menu ids, then returns a
   * sequenced tree. Fallback: if the user has NO role→menu mappings yet, return
   * the full active menu tree (so the shell is never empty during rollout).
   */
  async nav(userId?: string) {
    const menus = await this.prisma.mdpMenu.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: [{ sequence: 'asc' }],
    });

    let allowedIds: Set<bigint> | null = null;
    if (userId) {
      const roles = await this.prisma.erpUserRole.findMany({
        where: { userId: BigInt(userId) },
        select: { roleId: true },
      });
      if (roles.length > 0) {
        const mappings = await this.prisma.mdpRoleMenu.findMany({
          where: { deletedAt: null, canView: true, roleId: { in: roles.map((r) => r.roleId) } },
          select: { menuId: true },
        });
        if (mappings.length > 0) {
          // visible set = mapped menus + all their ancestors (so parents render)
          const byId = new Map(menus.map((m) => [m.id, m]));
          const visible = new Set<bigint>();
          for (const { menuId } of mappings) {
            let cur = byId.get(menuId);
            while (cur && !visible.has(cur.id)) {
              visible.add(cur.id);
              cur = cur.parentId ? byId.get(cur.parentId) : undefined;
            }
          }
          allowedIds = visible;
        }
      }
    }

    const filtered = allowedIds ? menus.filter((m) => allowedIds!.has(m.id)) : menus;
    return { success: true, data: buildMenuTree(filtered) };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMenu.findFirst({
      where: { id, deletedAt: null },
      include: { parent: { select: { id: true, code: true, name: true } } },
    });
    if (!item) throw new NotFoundException('Menu not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMenuDto, actorId?: string) {
    const existing = await this.prisma.mdpMenu.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Menu not found');

    if (dto.parentId && BigInt(dto.parentId) === id) {
      throw new BadRequestException('Menu cannot be its own parent');
    }

    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpMenu.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup) {
        throwDuplicate({
          fieldLabel: 'Menu code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
      }
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const updated = await this.prisma.mdpMenu.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          parentId: dto.parentId !== undefined ? toBig(dto.parentId) : undefined,
          path: dto.path,
          icon: dto.icon,
          moduleKey: dto.moduleKey,
          sequence: dto.sequence,
          isActive: dto.isActive,
          updatedById: actor,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Menu code', value: dto.code ?? existing.code });
      }
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMenu.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Menu not found');
    await this.prisma.mdpMenu.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Menu deleted' };
  }
}
