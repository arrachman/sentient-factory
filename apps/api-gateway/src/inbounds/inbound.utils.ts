import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { parseIntStrict } from './inbound-transaction.utils';

// ─── ID parsing ───────────────────────────────────────────────────────────────

export function parseInboundId(value: string | number, fieldLabel: string): number {
  return parseIntStrict(String(value), fieldLabel);
}

// ─── Transaction-no helpers ───────────────────────────────────────────────────

export async function ensureTransactionNoAvailable(
  prisma: PrismaService,
  transactionNo: string,
  exceptId?: number,
): Promise<void> {
  const duplicate = await prisma.inbound.findFirst({
    where: { transactionNo, NOT: exceptId ? { id: exceptId } : undefined },
    select: { id: true, deletedAt: true },
  });

  if (duplicate) {
    throwDuplicate({
      fieldLabel: 'Inbound transaction number',
      value: transactionNo,
      isSoftDeleted: Boolean(duplicate.deletedAt),
    });
  }
}

export async function resolveTransactionNo(
  tx: Prisma.TransactionClient,
  prisma: PrismaService,
  transactionNo?: string,
): Promise<string> {
  const candidate = transactionNo?.trim();
  if (candidate) {
    await ensureTransactionNoAvailable(prisma, candidate);
    return candidate;
  }

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const prefix = `INB-${y}${m}${d}-`;

  const latestForDate = await tx.inbound.findFirst({
    where: { transactionNo: { startsWith: prefix } },
    select: { transactionNo: true },
    orderBy: { transactionNo: 'desc' },
  });

  const latestSuffix = Number.parseInt(
    latestForDate?.transactionNo?.slice(prefix.length) ?? '',
    10,
  );
  const nextSequence = Number.isInteger(latestSuffix) && latestSuffix > 0 ? latestSuffix + 1 : 1;
  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
}

// ─── Domain helpers ───────────────────────────────────────────────────────────

export async function ensureSupplierExists(
  prisma: PrismaService,
  supplierId: number,
): Promise<void> {
  const supplier = await prisma.masterDataContact.findFirst({
    where: { id: supplierId, type: 'supplier', deletedAt: null },
    select: { id: true },
  });
  if (!supplier) {
    throw new BadRequestException('Supplier not found');
  }
}

export async function ensureWarehouseExists(
  prisma: PrismaService,
  warehouseId: number,
): Promise<void> {
  const warehouse = await prisma.masterDataWarehouse.findFirst({
    where: { id: warehouseId, deletedAt: null },
    select: { id: true },
  });
  if (!warehouse) {
    throw new BadRequestException('Warehouse not found');
  }
}

export async function getActiveItems(
  prisma: PrismaService,
  itemIds: number[],
): Promise<Map<number, { id: number; code: string; name: string; uomId: number }>> {
  const uniqueItemIds = [...new Set(itemIds)];
  const items = await prisma.masterDataItem.findMany({
    where: { id: { in: uniqueItemIds }, isActive: true, deletedAt: null },
    select: { id: true, code: true, name: true, uom: { select: { id: true } } },
  });

  if (items.length !== uniqueItemIds.length) {
    throw new BadRequestException('One or more items are not found or inactive');
  }

  return new Map(
    items.map((item) => [
      item.id,
      { id: item.id, code: item.code, name: item.name, uomId: item.uom.id },
    ]),
  );
}
