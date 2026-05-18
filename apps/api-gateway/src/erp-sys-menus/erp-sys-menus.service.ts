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
