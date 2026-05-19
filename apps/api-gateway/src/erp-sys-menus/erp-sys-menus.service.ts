import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ErpMenu } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpSysMenuDto } from './dto/create-erp-sys-menu.dto';
import { QueryErpSysMenuDto } from './dto/query-erp-sys-menu.dto';
import { UpdateErpSysMenuDto } from './dto/update-erp-sys-menu.dto';

type MenuNode = ErpMenu & { children: MenuNode[] };

function buildTree(items: ErpMenu[], parentId: bigint | null = null): MenuNode[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({ ...item, children: buildTree(items, item.id) }));
}

/**
 * Remove ITEM nodes not in allowedIds; drop GROUP that become empty.
 * MODULE selalu dipertahankan (stub kosong = "coming soon" placeholder di sidebar).
 */
function pruneTree(nodes: MenuNode[], allowedIds: Set<bigint> | null): MenuNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'ITEM') {
      return allowedIds === null || allowedIds.has(node.id) ? [node] : [];
    }
    const prunedChildren = pruneTree(node.children, allowedIds);
    if (node.type === 'MODULE') {
      return [{ ...node, children: prunedChildren }];
    }
    return prunedChildren.length > 0 ? [{ ...node, children: prunedChildren }] : [];
  });
}

@Injectable()
export class ErpSysMenusService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateErpSysMenuDto, actorId?: string) {
    const existing = await this.prisma.erpMenu.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      if (existing.deletedAt) {
        throw new BadRequestException(
          `Menu code "${dto.code}" already exists (soft-deleted). Restore or use a different code.`,
        );
      }
      throw new BadRequestException(`Menu code "${dto.code}" already exists`);
    }

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    const created = await this.prisma.erpMenu.create({
      data: {
        code: dto.code,
        title: dto.title,
        path: dto.path,
        icon: dto.icon,
        type: dto.type,
        parentId: dto.parentId ? BigInt(dto.parentId) : null,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
        createdById: actorBigInt,
        updatedById: actorBigInt,
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryErpSysMenuDto) {
    const where: {
      deletedAt: null;
      type?: typeof query.type;
      parentId?: bigint | null;
      isActive?: boolean;
    } = { deletedAt: null };

    if (query.type) where.type = query.type;
    if (query.parentId === 'null') {
      where.parentId = null;
    } else if (query.parentId) {
      where.parentId = BigInt(query.parentId);
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const items = await this.prisma.erpMenu.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });

    return { success: true, data: items };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.erpMenu.findFirst({
      where: { id, deletedAt: null },
      include: { children: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!item) throw new NotFoundException('ERP menu not found');
    return { success: true, data: item };
  }

  async getTree() {
    const all = await this.prisma.erpMenu.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });
    return { success: true, data: buildTree(all) };
  }

  /**
   * Return only the menus the requesting user may see:
   * - CENTRAL level → all active menus (no role filter)
   * - Other levels  → ITEMs where user's roles have canView=true; MODULE/GROUP
   *                   containers included automatically if they have visible children
   */
  async getMyMenus(userId: string, erpLevel: string) {
    let allowedIds: Set<bigint> | null = null; // null = no filter

    if (erpLevel !== 'CENTRAL') {
      const userRoles = await this.prisma.erpUserRole.findMany({
        where: { userId: BigInt(userId) },
        select: { roleId: true },
      });
      const roleIds = userRoles.map((r) => r.roleId);

      const roleMenus = await this.prisma.erpRoleMenu.findMany({
        where: { roleId: { in: roleIds }, canView: true },
        select: { menuId: true },
      });
      allowedIds = new Set(roleMenus.map((rm) => rm.menuId));
    }

    const all = await this.prisma.erpMenu.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });

    const tree = buildTree(all);
    const data = pruneTree(tree, allowedIds);
    return { success: true, data };
  }

  async update(id: bigint, dto: UpdateErpSysMenuDto, actorId?: string) {
    const existing = await this.prisma.erpMenu.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('ERP menu not found');

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.erpMenu.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true },
      });
      if (duplicate) throw new BadRequestException(`Menu code "${dto.code}" already exists`);
    }

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    const updated = await this.prisma.erpMenu.update({
      where: { id },
      data: {
        code: dto.code,
        title: dto.title,
        path: dto.path,
        icon: dto.icon,
        type: dto.type,
        parentId: dto.parentId !== undefined ? (dto.parentId ? BigInt(dto.parentId) : null) : undefined,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
        updatedById: actorBigInt,
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpMenu.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('ERP menu not found');

    const actorBigInt = toAuditUserId(actorId) ? BigInt(toAuditUserId(actorId) as number) : undefined;

    await this.prisma.erpMenu.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'ERP menu deleted' };
  }
}
