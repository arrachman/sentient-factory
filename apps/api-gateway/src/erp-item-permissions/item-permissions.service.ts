import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ErpAuditService } from '../erp-audit/erp-audit.service';
import { diffFields } from '../erp-common/utils/diff-fields.util';
import { BulkErpItemPermissionDto } from './dto/bulk-item-permissions.dto';
import { CreateErpItemPermissionDto } from './dto/create-item-permission.dto';
import { QueryErpItemPermissionDto } from './dto/query-item-permission.dto';
import { UpdateErpItemPermissionDto } from './dto/update-item-permission.dto';

const ENTITY = 'ErpItemPermission';
const LABEL_ID = 'ItemPermission';

@Injectable()
export class ErpItemPermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: ErpAuditService,
  ) {}

  async create(dto: CreateErpItemPermissionDto, actorId?: string) {
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const itemId = BigInt(dto.itemId);
    const roleId = BigInt(dto.roleId);
    const created = await this.prisma.erpItemPermission.upsert({
      where: { itemId_roleId: { itemId, roleId } },
      update: {
        canView: dto.canView ?? true,
        canSell: dto.canSell ?? true,
        canBuy: dto.canBuy ?? true,
        updatedById: actorBigInt,
      },
      create: {
        itemId,
        roleId,
        canView: dto.canView ?? true,
        canSell: dto.canSell ?? true,
        canBuy: dto.canBuy ?? true,
        createdById: actorBigInt,
        updatedById: actorBigInt,
      },
    });
    this.audit.log({
      action: 'CREATE', entityName: ENTITY, entityId: created.id,
      summary: `${LABEL_ID} itemId=${itemId} roleId=${roleId} dibuat/diperbarui`, actorId: actorBigInt ?? undefined,
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryErpItemPermissionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: Prisma.ErpItemPermissionWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { legacyCode: { contains: q, mode: 'insensitive' } },
      ];
    }
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpItemPermission.findMany({ where, orderBy: [{ [sortBy]: sortDir }], skip, take: limit }),
      this.prisma.erpItemPermission.count({ where }),
    ]);
    return { success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.erpItemPermission.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException(`${ENTITY} not found`);
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpItemPermissionDto, actorId?: string) {
    const existing = await this.prisma.erpItemPermission.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException(`${ENTITY} not found`);
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const updated = await this.prisma.erpItemPermission.update({
      where: { id },
      data: {
        canView: dto.canView,
        canSell: dto.canSell,
        canBuy: dto.canBuy,
        updatedById: actorBigInt,
      },
    });
    const changes = diffFields(existing as unknown as Record<string, unknown>, updated as unknown as Record<string, unknown>);
    this.audit.log({
      action: 'UPDATE', entityName: ENTITY, entityId: id, changes,
      summary: `${LABEL_ID} id=${id} diperbarui`, actorId: actorBigInt ?? undefined,
    });
    return { success: true, data: updated };
  }

  async bulkUpdateStatus(_dto: BulkErpItemPermissionDto, _actorId?: string) {
    return { success: true, affected: 0 };
  }

  async bulkDelete(dto: BulkErpItemPermissionDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpItemPermission.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpItemPermission.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
    if (!existing) throw new NotFoundException(`${ENTITY} not found`);
    const actorBigInt = actorId ? BigInt(actorId) : null;
    await this.prisma.erpItemPermission.update({ where: { id }, data: { deletedAt: new Date(), updatedById: actorBigInt } });
    this.audit.log({ action: 'DELETE', entityName: ENTITY, entityId: id, summary: `${LABEL_ID} id=${id} dihapus`, actorId: actorBigInt ?? undefined });
    return { success: true, message: `${ENTITY} deleted` };
  }
}
