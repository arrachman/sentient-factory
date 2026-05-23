import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErpAuditService } from '../erp-audit/erp-audit.service';
import { diffFields } from '../erp-common/utils/diff-fields.util';
import { BulkErpItemPermissionDto } from './dto/bulk-item-permissions.dto';
import { CreateErpItemPermissionDto } from './dto/create-item-permission.dto';
import { QueryErpItemPermissionDto } from './dto/query-item-permission.dto';
import { UpdateErpItemPermissionDto } from './dto/update-item-permission.dto';

const ENTITY = 'ErpItemPermission';
const LABEL_ID = 'ItemPermission';

const SORT_MAP: Record<string, string> = {
  createdAt: 'p.created_at',
  itemCode: 'i.code',
  itemName: 'i.name',
  roleName: 'r.name',
};

type RawPermRow = {
  id: bigint; item_id: bigint; role_id: bigint;
  can_view: boolean; can_sell: boolean; can_buy: boolean;
  legacy_code: string | null; created_at: Date; updated_at: Date;
  item_code: string | null; item_name: string | null; role_name: string | null;
};

function mapRaw(r: RawPermRow) {
  return {
    id: r.id.toString(),
    itemId: r.item_id.toString(),
    roleId: r.role_id.toString(),
    canView: r.can_view,
    canSell: r.can_sell,
    canBuy: r.can_buy,
    legacyCode: r.legacy_code ?? null,
    itemCode: r.item_code ?? null,
    itemName: r.item_name ?? null,
    roleName: r.role_name ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

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
    const offset = (page - 1) * limit;
    const search = query.search?.trim() ?? '';
    const sortCol = SORT_MAP[query.sortBy ?? 'createdAt'] ?? 'p.created_at';
    const sortDir = query.sortDir === 'asc' ? 'ASC' : 'DESC';

    const JOIN = `
      FROM md_item_permissions p
      LEFT JOIN md_items i ON i.id = p.item_id AND i.deleted_at IS NULL
      LEFT JOIN adm_roles r ON r.id = p.role_id AND r.deleted_at IS NULL
    `;
    const SELECT = `
      SELECT p.id, p.item_id, p.role_id, p.can_view, p.can_sell, p.can_buy,
             p.legacy_code, p.created_at, p.updated_at,
             i.code AS item_code, i.name AS item_name, r.name AS role_name
      ${JOIN}
    `;

    let rows: RawPermRow[];
    let total: number;

    if (search) {
      const like = `%${search.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
      const WHERE = `WHERE p.deleted_at IS NULL AND (i.code ILIKE $1 OR i.name ILIKE $1 OR r.name ILIKE $1)`;
      rows = await this.prisma.$queryRawUnsafe<RawPermRow[]>(
        `${SELECT} ${WHERE} ORDER BY ${sortCol} ${sortDir} LIMIT $2 OFFSET $3`,
        like, limit, offset,
      );
      const [{ count }] = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count ${JOIN} ${WHERE}`,
        like,
      );
      total = Number(count);
    } else {
      rows = await this.prisma.$queryRawUnsafe<RawPermRow[]>(
        `${SELECT} WHERE p.deleted_at IS NULL ORDER BY ${sortCol} ${sortDir} LIMIT $1 OFFSET $2`,
        limit, offset,
      );
      const [{ count }] = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM md_item_permissions WHERE deleted_at IS NULL`,
      );
      total = Number(count);
    }

    return {
      success: true,
      data: rows.map(mapRaw),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
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
