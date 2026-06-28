import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { QueryRoleMenuDto } from './dto/query-role-menu.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';

@Injectable()
export class ErpMdpRoleMenusService {
  constructor(private readonly prisma: PrismaService) {}

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
