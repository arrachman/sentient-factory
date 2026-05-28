import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { ErpAuditService } from '../erp-audit/erp-audit.service';
import { diffFields } from '../erp-common/utils/diff-fields.util';
import { BulkErpItemDto, BulkStatusErpItemDto } from './dto/bulk-erp-item.dto';
import { CreateErpItemDto } from './dto/create-erp-item.dto';
import { QueryErpItemDto } from './dto/query-erp-item.dto';
import { UpdateErpItemDto } from './dto/update-erp-item.dto';

const ITEM_INCLUDE = {
  category:         { select: { id: true, code: true, name: true } },
  baseUnit:         { select: { id: true, code: true, name: true } },
  kind:             { select: { id: true, code: true, name: true } },
  productClass:     { select: { id: true, code: true, name: true } },
  division:         { select: { id: true, code: true, name: true } },
  subdivision:      { select: { id: true, code: true, name: true } },
  department:       { select: { id: true, code: true, name: true } },
  subDepartment:    { select: { id: true, code: true, name: true } },
  branch:           { select: { id: true, code: true, name: true } },
  defaultLocation:  { select: { id: true, code: true, name: true } },
  defaultWarehouse: { select: { id: true, code: true, name: true } },
  project:          { select: { id: true, code: true, name: true } },
  costCenter:       { select: { id: true, code: true, name: true } },
  inventoryAccount: { select: { id: true, code: true, name: true } },
  salesAccount:     { select: { id: true, code: true, name: true } },
  cogsAccount:      { select: { id: true, code: true, name: true } },
  purchaseTax:      { select: { id: true, code: true, name: true } },
  saleTax:          { select: { id: true, code: true, name: true } },
  primarySupplier:  { select: { id: true, code: true, name: true } },
} as const;

// FK fields where empty string or null = clear the relation; non-empty = BigInt.
const FK_OPTIONAL_FIELDS = [
  'kindId', 'productClassId', 'brandId', 'materialId', 'itemModelId', 'sizeId',
  'colorId', 'sectionId', 'divisionId', 'subdivisionId', 'departmentId',
  'subDepartmentId', 'branchId', 'defaultLocationId', 'defaultWarehouseId',
  'projectId', 'costCenterId', 'inventoryAccountId', 'salesAccountId',
  'cogsAccountId', 'purchaseTaxId', 'saleTaxId', 'primarySupplierId',
] as const;

const DECIMAL_FIELDS = [
  'standardCost', 'purchasePrice', 'salePrice',
  'minStock', 'maxStock', 'reorderQty', 'minOrderQty', 'weight',
] as const;

function toFkOrNull(v: string | null | undefined): bigint | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  return BigInt(v);
}

function toDecimalOrUndefined(v: string | null | undefined): Prisma.Decimal | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  return new Prisma.Decimal(v);
}

function buildFkData(dto: Record<string, unknown>): Record<string, bigint | null | undefined> {
  const out: Record<string, bigint | null | undefined> = {};
  for (const f of FK_OPTIONAL_FIELDS) {
    const v = dto[f] as string | null | undefined;
    const conv = toFkOrNull(v);
    if (conv !== undefined) out[f] = conv;
  }
  return out;
}

function buildDecimalData(dto: Record<string, unknown>): Record<string, Prisma.Decimal | undefined> {
  const out: Record<string, Prisma.Decimal | undefined> = {};
  for (const f of DECIMAL_FIELDS) {
    const v = dto[f] as string | null | undefined;
    const conv = toDecimalOrUndefined(v);
    if (conv !== undefined) out[f] = conv;
  }
  return out;
}

// Maps Prisma field names to the frontend ErpItem interface shape
function mapItem(item: any) {
  const { type, baseUnit, baseUnitId, salePrice, ...rest } = item;
  return {
    ...rest,
    itemType: type,
    unitId: String(baseUnitId),
    unit: baseUnit ?? null,
    sellingPrice: salePrice != null ? String(salePrice) : null,
    salePrice: salePrice != null ? String(salePrice) : null,
  };
}

@Injectable()
export class ErpItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: ErpAuditService,
  ) {}

  async create(dto: CreateErpItemDto, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Item code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    let created;
    try {
      created = await this.prisma.erpItem.create({
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.itemType,
          costMethod: dto.costMethod ?? undefined,
          categoryId: BigInt(dto.categoryId),
          baseUnitId: BigInt(dto.unitId),
          barcode: dto.barcode ?? null,
          ...buildDecimalData(dto as unknown as Record<string, unknown>),
          tracksSerial: dto.tracksSerial ?? false,
          tracksBatch: dto.tracksBatch ?? false,
          tracksBin: dto.tracksBin ?? false,
          ageCategory: dto.ageCategory ?? null,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
          isVatable: dto.isVatable ?? true,
          isSpecial: dto.isSpecial ?? false,
          ...buildFkData(dto as unknown as Record<string, unknown>),
          isActive: dto.isActive ?? true,
          createdById: actorId ? BigInt(actorId) : null,
          updatedById: actorId ? BigInt(actorId) : null,
        },
        include: ITEM_INCLUDE,
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_items_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code });
      }
      throw error;
    }

    this.audit.log({
      action: 'CREATE',
      entityName: 'ErpItem',
      entityId: created.id,
      summary: `Item ${created.code} dibuat`,
      actorId: actorId ? BigInt(actorId) : undefined,
    });

    return { success: true, data: mapItem(created) };
  }

  async findAll(query: QueryErpItemDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpItemWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.itemType !== undefined) where.type = query.itemType;
    if (query.categoryId !== undefined) where.categoryId = BigInt(query.categoryId);
    if (query.unitId !== undefined) where.baseUnitId = BigInt(query.unitId);
    if (query.kindId !== undefined) where.kindId = BigInt(query.kindId);
    if (query.productClassId !== undefined) where.productClassId = BigInt(query.productClassId);
    if (query.branchId !== undefined) where.branchId = BigInt(query.branchId);
    if (query.defaultWarehouseId !== undefined) where.defaultWarehouseId = BigInt(query.defaultWarehouseId);
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortField = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpItem.findMany({
        where,
        include: ITEM_INCLUDE,
        orderBy: [{ [sortField]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.erpItem.count({ where }),
    ]);

    return {
      success: true,
      data: items.map(mapItem),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
      include: ITEM_INCLUDE,
    });
    if (!item) {
      throw new NotFoundException('ERP item not found');
    }
    return { success: true, data: mapItem(item) };
  }

  async update(id: bigint, dto: UpdateErpItemDto, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('ERP item not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.erpItem.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Item code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.erpItem.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.itemType,
          costMethod: dto.costMethod,
          categoryId: dto.categoryId ? BigInt(dto.categoryId) : undefined,
          baseUnitId: dto.unitId ? BigInt(dto.unitId) : undefined,
          barcode: dto.barcode,
          ...buildDecimalData(dto as unknown as Record<string, unknown>),
          tracksSerial: dto.tracksSerial,
          tracksBatch: dto.tracksBatch,
          tracksBin: dto.tracksBin,
          ageCategory: dto.ageCategory,
          validUntil: dto.validUntil === undefined
            ? undefined
            : dto.validUntil === null || dto.validUntil === ''
              ? null
              : new Date(dto.validUntil),
          isVatable: dto.isVatable,
          isSpecial: dto.isSpecial,
          ...buildFkData(dto as unknown as Record<string, unknown>),
          isActive: dto.isActive,
          updatedById: actorId ? BigInt(actorId) : null,
        },
        include: ITEM_INCLUDE,
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_items_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    const changes = diffFields(
      existing as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>,
    );
    this.audit.log({
      action: 'UPDATE',
      entityName: 'ErpItem',
      entityId: id,
      changes,
      summary: `Item ${updated.code} diperbarui`,
      actorId: actorId ? BigInt(actorId) : undefined,
    });

    return { success: true, data: mapItem(updated) };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('ERP item not found');
    }

    await this.prisma.erpItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });

    this.audit.log({
      action: 'DELETE',
      entityName: 'ErpItem',
      entityId: id,
      summary: `Item id=${id} dihapus`,
      actorId: actorId ? BigInt(actorId) : undefined,
    });

    return { success: true, message: 'ERP item deleted' };
  }

  async bulkUpdateStatus(dto: BulkStatusErpItemDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpItem.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { isActive: dto.isActive, updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async bulkDelete(dto: BulkErpItemDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpItem.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }
}
